// js/app.js - Main IDE Application Entry Point
import { db } from './db.js';
import { state } from './state.js';
import { EditorManager } from './editor.js';
import { TabManager } from './ui/tabManager.js';
import { ProjectExplorer } from './ui/projectExplorer.js';
import { SearchBar } from './ui/searchBar.js';
import { TerminalUI } from './ui/terminal.js';
import { WorkerBridge } from './worker/workerBridge.js';
import { zipExporter } from './utils/zipExporter.js';
import { projectModal } from './projectModal.js';

class PythonWebIDEApp {
  constructor() {
    this.editor = null;
    this.tabManager = null;
    this.projectExplorer = null;
    this.terminal = null;
    this.workerBridge = null;
  }

  async init() {
    // 1. Get project ID from URL query string
    const urlParams = new URLSearchParams(window.location.search);
    let projectId = urlParams.get('project');

    if (!projectId) {
      // Look up existing projects or create a default starter project
      const projects = await db.getProjects();
      if (projects.length > 0) {
        projectId = projects[0].id;
      } else {
        const starter = await db.createProject('Первый проект');
        projectId = starter.id;
      }
      // Update URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('project', projectId);
      window.history.replaceState({}, '', newUrl);
    }

    try {
      await state.loadProject(projectId);
    } catch (err) {
      console.warn('Project not found, creating new one:', err);
      const newProj = await db.createProject('Мой проект');
      window.location.href = `ide.html?project=${encodeURIComponent(newProj.id)}`;
      return;
    }

    // 2. Initialize UI Components
    const editorRootEl = document.getElementById('codeMirrorRoot');
    const tabsBarEl = document.getElementById('editorTabsBar');
    const explorerEl = document.getElementById('fileExplorerContainer');
    const terminalBodyEl = document.getElementById('terminalBody');
    const terminalOutputEl = document.getElementById('terminalOutput');

    this.editor = new EditorManager(editorRootEl);
    await this.editor.init();

    this.tabManager = new TabManager(tabsBarEl);
    this.projectExplorer = new ProjectExplorer(explorerEl);
    this.searchBar = new SearchBar({ editor: this.editor, explorer: this.projectExplorer });
    this.terminal = new TerminalUI(terminalBodyEl, terminalOutputEl);
    this.workerBridge = new WorkerBridge();

    // Hook up real-time syntax linter to Monaco editor
    this.editor.setLinter((code, filename) => this.workerBridge.lint(code, filename));

    // 3. Setup Events and Bridge connections
    this.bindWorkerEvents();
    this.bindHeaderControls();
    this.bindResizers();
    this.bindHotkeys();

    // 4. Update Header UI
    this.updateHeaderProjectInfo();

    // Welcome message in terminal
    this.terminal.appendSystem(`[Python Web IDE v1.0] Инициализировано.\n`);
    this.terminal.appendSystem(`Активный проект: ${state.currentProject.name}\n`);
    this.terminal.appendSystem(`Нажмите «Запустить» (Ctrl+Enter / F5) для выполнения /main.py\n\n`);
  }

  updateHeaderProjectInfo() {
    const nameEl = document.getElementById('headerProjectName');
    const statusEl = document.getElementById('saveStatusIndicator');

    if (nameEl && state.currentProject) {
      nameEl.textContent = state.currentProject.name;

      nameEl.addEventListener('blur', () => {
        const newName = nameEl.textContent.trim();
        if (newName) {
          state.renameProject(newName);
        } else {
          nameEl.textContent = state.currentProject.name;
        }
      });

      nameEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          nameEl.blur();
        }
      });
    }

    state.addEventListener('save-status', (e) => {
      if (!statusEl) return;
      if (e.detail.status === 'saving') {
        statusEl.textContent = 'Сохранение...';
        statusEl.className = 'save-status-badge saving';
      } else {
        statusEl.textContent = 'Сохранено';
        statusEl.className = 'save-status-badge';
      }
    });

    state.addEventListener('project-renamed', (e) => {
      if (nameEl) nameEl.textContent = e.detail.name;
    });
  }

  bindWorkerEvents() {
    const runBtn = document.getElementById('runProjectBtn');
    const stopBtn = document.getElementById('stopProjectBtn');

    this.workerBridge.addEventListener('stdout', (e) => {
      this.terminal.appendStdout(e.detail);
    });

    this.workerBridge.addEventListener('stderr', (e) => {
      this.terminal.appendStderr(e.detail);
    });

    this.workerBridge.addEventListener('status', (e) => {
      const { status, message } = e.detail;
      this.terminal.updateStatus(status, message);
    });

    this.workerBridge.addEventListener('finished', (e) => {
      if (runBtn) runBtn.disabled = false;
      if (stopBtn) stopBtn.disabled = true;

      if (e.detail.success) {
        this.terminal.appendLine('\n[Выполнение успешно завершено]\n', 'success');
      } else if (e.detail.terminated) {
        this.terminal.appendLine('\n[Выполнение прервано пользователем]\n', 'system');
      }
    });

    // Handle interactive Python input() modal dialog
    this.workerBridge.addEventListener('request-input', (e) => {
      const { id, prompt } = e.detail;
      const modal = document.getElementById('customInputModal');
      const form = document.getElementById('customInputForm');
      const inputField = document.getElementById('customInputField');
      const promptText = document.getElementById('inputModalPromptText');
      const cancelBtn = document.getElementById('customInputCancelBtn');

      if (!modal) {
        const val = window.prompt(prompt || 'Введите значение:');
        if (val === null) {
          this.workerBridge.sendInputResponse(id, '', true);
        } else {
          this.workerBridge.sendInputResponse(id, val, false);
        }
        return;
      }

      if (promptText) {
        promptText.textContent = prompt || 'Введите значение:';
      }
      if (inputField) {
        inputField.value = '';
      }

      modal.style.display = 'flex';
      setTimeout(() => {
        if (inputField) inputField.focus();
      }, 50);

      const cleanupAndClose = (cancelled, value = '') => {
        modal.style.display = 'none';
        form.removeEventListener('submit', onSubmit);
        cancelBtn.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onEsc);
        this.workerBridge.sendInputResponse(id, value, cancelled);
      };

      const onSubmit = (evt) => {
        evt.preventDefault();
        const value = inputField ? inputField.value : '';
        cleanupAndClose(false, value);
      };

      const onCancel = () => {
        cleanupAndClose(true);
      };

      const onEsc = (evt) => {
        if (evt.key === 'Escape') {
          cleanupAndClose(true);
        }
      };

      form.addEventListener('submit', onSubmit);
      cancelBtn.addEventListener('click', onCancel);
      document.addEventListener('keydown', onEsc);
    });
  }

  bindHeaderControls() {
    const backBtn = document.getElementById('navBackBtn') || document.querySelector('.nav-back-link');
    const runBtn = document.getElementById('runProjectBtn');
    const stopBtn = document.getElementById('stopProjectBtn');
    const formatBtn = document.getElementById('formatProjectBtn');
    const stepBtn = document.getElementById('stepProjectBtn');
    const openProjectsBtn = document.getElementById('openProjectModalBtn');
    const exportBtn = document.getElementById('exportZipBtn');
    const importInput = document.getElementById('importFileInput');

    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const returnUrl = sessionStorage.getItem('learn_py_return_url');
        if (returnUrl) {
          sessionStorage.removeItem('learn_py_return_url');
          window.location.href = returnUrl;
        } else if (document.referrer && document.referrer.startsWith(window.location.origin) && !document.referrer.includes('ide.html')) {
          window.location.href = document.referrer;
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = 'index.html';
        }
      });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => this.runProject());
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        this.workerBridge.terminate();
      });
    }

    if (formatBtn) {
      formatBtn.addEventListener('click', () => this.formatActiveCode());
    }

    if (stepBtn) {
      stepBtn.addEventListener('click', () => this.stepActiveCode());
    }

    if (openProjectsBtn) {
      openProjectsBtn.addEventListener('click', () => {
        projectModal.open();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        zipExporter.exportCurrentProject();
      });
    }

    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          zipExporter.importFile(file);
        }
      });
    }
  }

  async runProject() {
    const runBtn = document.getElementById('runProjectBtn');
    const stopBtn = document.getElementById('stopProjectBtn');

    // Force save all files before execution
    await state.forceSave();

    if (runBtn) runBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;

    this.terminal.clear();
    this.terminal.appendSystem(`[Запуск /main.py...]\n\n`);

    this.workerBridge.run(state.currentProject.files, '/main.py');
  }

  async formatActiveCode() {
    if (!this.editor) return;
    const code = this.editor.getContent();
    if (!code || !code.trim()) return;

    const formatBtn = document.getElementById('formatProjectBtn');
    const origHtml = formatBtn ? formatBtn.innerHTML : '';
    if (formatBtn) {
      formatBtn.innerHTML = '<span>⏳</span><span>Форматирование...</span>';
      formatBtn.disabled = true;
    }

    try {
      const result = await this.workerBridge.format(code);
      if (result && result.success && result.formatted) {
        this.editor.setContent(result.formatted);
        if (state.activeFile) {
          state.updateFileContent(state.activeFile, result.formatted);
        }
      } else if (result && result.error) {
        this.terminal.appendStderr(`Ошибка форматирования: ${result.error}\n`);
      }
    } catch (err) {
      console.error('Format error:', err);
    } finally {
      if (formatBtn) {
        formatBtn.innerHTML = origHtml;
        formatBtn.disabled = false;
      }
    }
  }

  async stepActiveCode() {
    if (!this.editor) return;
    const code = this.editor.getContent();
    if (!code || !code.trim()) return;

    const stepBtn = document.getElementById('stepProjectBtn');
    const origHtml = stepBtn ? stepBtn.innerHTML : '';
    if (stepBtn) {
      stepBtn.innerHTML = '<span>⏳</span><span>Анализ шагов...</span>';
      stepBtn.disabled = true;
    }

    try {
      const res = await this.workerBridge.trace(code, state.activeFile || 'main.py');
      if (res && res.success && Array.isArray(res.steps) && res.steps.length > 0) {
        this.renderStepDebugger(res.steps);
      } else {
        this.terminal.clear();
        this.terminal.appendStderr(`Не удалось выполнить пошаговую трассировку: ${res?.error || 'нет шагов'}\n`);
      }
    } catch (err) {
      console.error('Debug trace error:', err);
    } finally {
      if (stepBtn) {
        stepBtn.innerHTML = origHtml;
        stepBtn.disabled = false;
      }
    }
  }

  renderStepDebugger(steps) {
    let currentIdx = 0;
    const totalSteps = steps.length;

    const termBody = document.getElementById('terminalBody');
    const debugViewBody = document.getElementById('debugViewBody');
    const debugControls = document.getElementById('ideDebugControls');
    const workerStatusBadge = document.getElementById('workerStatusBadge');
    const clearTerminalBtn = document.getElementById('clearTerminalBtn');
    const termTabTitle = document.getElementById('termTabTitle');
    const termTabIcon = document.getElementById('termTabIcon');

    const debugEventText = document.getElementById('debugEventText');
    const debugVarsContainer = document.getElementById('debugVarsContainer');
    const debugOutputText = document.getElementById('debugOutputText');
    const debugStepInfo = document.getElementById('debugStepInfo');
    const debugFirstBtn = document.getElementById('debugFirstBtn');
    const debugPrevBtn = document.getElementById('debugPrevBtn');
    const debugNextBtn = document.getElementById('debugNextBtn');
    const debugLastBtn = document.getElementById('debugLastBtn');
    const debugExitBtn = document.getElementById('debugExitBtn');

    // Switch to Debug Mode UI
    if (termBody) termBody.style.display = 'none';
    if (debugViewBody) debugViewBody.style.display = 'flex';
    if (debugControls) debugControls.style.display = 'flex';
    if (workerStatusBadge) workerStatusBadge.style.display = 'none';
    if (clearTerminalBtn) clearTerminalBtn.style.display = 'none';
    if (termTabTitle) termTabTitle.textContent = 'Дебаггер (Пошаговое выполнение)';
    if (termTabIcon) termTabIcon.textContent = '🪲';

    const exitDebugMode = () => {
      this.editor.clearDebugLine();
      if (termBody) termBody.style.display = 'block';
      if (debugViewBody) debugViewBody.style.display = 'none';
      if (debugControls) debugControls.style.display = 'none';
      if (workerStatusBadge) workerStatusBadge.style.display = 'flex';
      if (clearTerminalBtn) clearTerminalBtn.style.display = 'flex';
      if (termTabTitle) termTabTitle.textContent = 'Терминал (Python 3.12)';
      if (termTabIcon) termTabIcon.textContent = '🖥️';
      this.terminal.clear();
      this.terminal.appendSystem('[Отладка завершена]\n');
    };

    const renderCurrentStep = () => {
      const step = steps[currentIdx];

      // Highlight active executing line in Monaco
      if (step.line) {
        this.editor.highlightDebugLine(step.line);
      }

      // Update Header Controls
      if (debugStepInfo) {
        debugStepInfo.textContent = `Шаг ${currentIdx + 1} из ${totalSteps}`;
      }
      if (debugFirstBtn) debugFirstBtn.disabled = currentIdx === 0;
      if (debugPrevBtn) debugPrevBtn.disabled = currentIdx === 0;
      if (debugNextBtn) debugNextBtn.disabled = currentIdx === totalSteps - 1;
      if (debugLastBtn) debugLastBtn.disabled = currentIdx === totalSteps - 1;

      // Update Event Banner
      if (debugEventText) {
        debugEventText.textContent = `Строка ${step.line || 1} (${step.func === '<module>' ? 'Основной код' : `Функция ${step.func}`})`;
      }

      // Render Variables Inspector
      if (debugVarsContainer) {
        debugVarsContainer.innerHTML = '';
        const allVars = { ...(step.globals || {}), ...(step.locals || {}) };
        const keys = Object.keys(allVars);

        if (keys.length === 0) {
          debugVarsContainer.innerHTML = '<div class="debug-empty-hint">(Переменные пока не созданы)</div>';
        } else {
          keys.forEach(varName => {
            const varInfo = allVars[varName];
            const row = document.createElement('div');
            row.className = 'debug-var-row';
            row.innerHTML = `
              <div class="debug-var-name-type">
                <span class="debug-var-name">${varName}</span>
                <span class="debug-var-type">: ${varInfo.type || 'var'}</span>
              </div>
              <span class="debug-var-value" title="${varInfo.value}">${varInfo.value}</span>
            `;
            debugVarsContainer.appendChild(row);
          });
        }
      }

      // Render stdout up to this step
      if (debugOutputText) {
        debugOutputText.textContent = step.stdout || '';
        if (step.exception) {
          debugOutputText.textContent += `\n⚠️ Исключение: ${step.exception}`;
        }
      }
    };

    // Bind Header Debug Controls
    debugFirstBtn.onclick = () => {
      currentIdx = 0;
      renderCurrentStep();
    };
    debugPrevBtn.onclick = () => {
      if (currentIdx > 0) {
        currentIdx--;
        renderCurrentStep();
      }
    };
    debugNextBtn.onclick = () => {
      if (currentIdx < totalSteps - 1) {
        currentIdx++;
        renderCurrentStep();
      }
    };
    debugLastBtn.onclick = () => {
      currentIdx = totalSteps - 1;
      renderCurrentStep();
    };
    debugExitBtn.onclick = () => {
      exitDebugMode();
    };

    renderCurrentStep();
  }

  bindResizers() {
    const STORAGE_KEY_SIDEBAR_WIDTH = 'learn_py_ide_sidebar_width';
    const STORAGE_KEY_TERMINAL_HEIGHT = 'learn_py_ide_terminal_height';

    // 1. Sidebar Resizer
    const sidebarResizer = document.getElementById('sidebarResizer');
    const sidebar = document.getElementById('ideSidebar');

    if (sidebarResizer && sidebar) {
      // Restore saved sidebar width
      try {
        const savedWidth = localStorage.getItem(STORAGE_KEY_SIDEBAR_WIDTH);
        if (savedWidth) {
          const widthVal = Math.max(160, Math.min(parseFloat(savedWidth), window.innerWidth * 0.6));
          sidebar.style.width = `${widthVal}px`;
        }
      } catch (e) {
        console.error('Error loading saved sidebar width:', e);
      }

      let isResizingX = false;

      sidebarResizer.addEventListener('mousedown', (e) => {
        isResizingX = true;
        sidebarResizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizingX) return;
        const newWidth = Math.max(160, Math.min(e.clientX, Math.min(600, window.innerWidth * 0.6)));
        sidebar.style.width = `${newWidth}px`;
        if (this.editor && this.editor.editorInstance) {
          this.editor.editorInstance.layout();
        }
      });

      document.addEventListener('mouseup', () => {
        if (isResizingX) {
          isResizingX = false;
          sidebarResizer.classList.remove('resizing');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          try {
            localStorage.setItem(STORAGE_KEY_SIDEBAR_WIDTH, String(sidebar.getBoundingClientRect().width));
          } catch (e) {}
          if (this.editor && this.editor.editorInstance) {
            this.editor.editorInstance.layout();
          }
        }
      });
    }

    // 2. Terminal Resizer
    const terminalResizer = document.getElementById('terminalResizer');
    const terminalSection = document.getElementById('ideTerminalSection');

    if (terminalResizer && terminalSection) {
      // Restore saved terminal height
      try {
        const savedHeight = localStorage.getItem(STORAGE_KEY_TERMINAL_HEIGHT);
        if (savedHeight) {
          const heightVal = Math.max(80, Math.min(parseFloat(savedHeight), window.innerHeight * 0.75));
          terminalSection.style.height = `${heightVal}px`;
        }
      } catch (e) {
        console.error('Error loading saved terminal height:', e);
      }

      let isResizingY = false;

      terminalResizer.addEventListener('mousedown', () => {
        isResizingY = true;
        terminalResizer.classList.add('resizing');
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isResizingY) return;
        const newHeight = Math.max(80, Math.min(window.innerHeight - e.clientY, window.innerHeight * 0.75));
        terminalSection.style.height = `${newHeight}px`;
        if (this.editor && this.editor.editorInstance) {
          this.editor.editorInstance.layout();
        }
      });

      document.addEventListener('mouseup', () => {
        if (isResizingY) {
          isResizingY = false;
          terminalResizer.classList.remove('resizing');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          try {
            localStorage.setItem(STORAGE_KEY_TERMINAL_HEIGHT, String(terminalSection.getBoundingClientRect().height));
          } catch (e) {}
          if (this.editor && this.editor.editorInstance) {
            this.editor.editorInstance.layout();
          }
        }
      });
    }
  }

  bindHotkeys() {
    document.addEventListener('keydown', (e) => {
      // Run: Ctrl+Enter or F5
      if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        this.runProject();
      }

      // Save: Ctrl+S
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        state.forceSave();
      }

      // Close Tab: Ctrl+W
      if (e.ctrlKey && (e.key === 'w' || e.key === 'W')) {
        if (state.activeFile) {
          e.preventDefault();
          state.closeTab(state.activeFile);
        }
      }
    });
  }
}

// Bootstrap IDE
const ideApp = new PythonWebIDEApp();
document.addEventListener('DOMContentLoaded', () => {
  ideApp.init();
});
