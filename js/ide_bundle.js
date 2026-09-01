// js/ide_bundle.js - Standalone Universal IDE Engine (Works on file:// and http://)
(function (global) {
  const db = global.PythonIDE_DB;

  // --- 1. STATE MANAGER ---
  class AppState extends EventTarget {
    constructor() {
      super();
      this.currentProject = null;
      this.activeFile = null;
      this.openTabs = [];
      this.saveTimeout = null;
    }

    async loadProject(id) {
      let project = await db.getProject(id);
      if (!project) {
        const projects = await db.getProjects();
        if (projects.length > 0) {
          project = projects[0];
        } else {
          project = await db.createProject('Первый проект');
        }
      }

      this.currentProject = project;
      const fileKeys = Object.keys(project.files || {});
      this.openTabs = project.openTabs && project.openTabs.length > 0
        ? project.openTabs
        : (fileKeys.length > 0 ? [fileKeys[0]] : ['/main.py']);

      this.activeFile = project.activeFile && project.files[project.activeFile] !== undefined
        ? project.activeFile
        : this.openTabs[0];

      this.emitChange('project-loaded', { project: this.currentProject });
      return this.currentProject;
    }

    emitChange(type, detail = {}) {
      this.dispatchEvent(new CustomEvent(type, { detail }));
    }

    getActiveContent() {
      if (!this.currentProject || !this.activeFile) return '';
      return this.currentProject.files[this.activeFile] || '';
    }

    updateFileContent(path, content) {
      if (!this.currentProject) return;
      if (this.currentProject.files[path] === content) return;

      this.currentProject.files[path] = content;
      this.scheduleAutoSave();
      this.emitChange('file-content-changed', { path, content });
    }

    setActiveFile(path) {
      if (!this.currentProject || !this.currentProject.files.hasOwnProperty(path)) return;

      this.activeFile = path;
      if (!this.openTabs.includes(path)) {
        this.openTabs.push(path);
      }
      this.currentProject.activeFile = path;
      this.currentProject.openTabs = [...this.openTabs];

      this.scheduleAutoSave();
      this.emitChange('active-file-changed', { path, content: this.currentProject.files[path] });
    }

    openTab(path) {
      if (!this.openTabs.includes(path)) {
        this.openTabs.push(path);
      }
      this.setActiveFile(path);
      this.emitChange('tabs-changed', { tabs: this.openTabs });
    }

    closeTab(path) {
      const index = this.openTabs.indexOf(path);
      if (index === -1) return;

      this.openTabs.splice(index, 1);

      if (this.activeFile === path) {
        if (this.openTabs.length > 0) {
          const nextIndex = Math.min(index, this.openTabs.length - 1);
          this.setActiveFile(this.openTabs[nextIndex]);
        } else {
          this.activeFile = null;
          this.emitChange('active-file-changed', { path: null, content: '' });
        }
      }

      if (this.currentProject) {
        this.currentProject.openTabs = [...this.openTabs];
        this.scheduleAutoSave();
      }

      this.emitChange('tabs-changed', { tabs: this.openTabs });
    }

    createFile(path, initialContent = '') {
      if (!this.currentProject) return;
      if (!path.startsWith('/')) path = '/' + path;

      if (this.currentProject.files.hasOwnProperty(path)) {
        throw new Error('Файл уже существует');
      }

      this.currentProject.files[path] = initialContent;
      this.openTab(path);
      this.scheduleAutoSave();
      this.emitChange('file-created', { path });
    }

    deleteFile(path) {
      if (!this.currentProject) return;
      if (!this.currentProject.files.hasOwnProperty(path)) return;

      delete this.currentProject.files[path];
      this.closeTab(path);

      const remainingFiles = Object.keys(this.currentProject.files);
      if (remainingFiles.length === 0) {
        this.currentProject.files['/main.py'] = '# Новый файл\nprint("Hello World!")';
        this.openTab('/main.py');
      }

      this.scheduleAutoSave();
      this.emitChange('file-deleted', { path });
    }

    renameFile(oldPath, newPath) {
      if (!this.currentProject || !this.currentProject.files.hasOwnProperty(oldPath)) return;
      if (!newPath.startsWith('/')) newPath = '/' + newPath;
      if (oldPath === newPath) return;

      if (this.currentProject.files.hasOwnProperty(newPath)) {
        throw new Error('Файл с таким именем уже существует');
      }

      const content = this.currentProject.files[oldPath];
      delete this.currentProject.files[oldPath];
      this.currentProject.files[newPath] = content;

      const tabIndex = this.openTabs.indexOf(oldPath);
      if (tabIndex !== -1) {
        this.openTabs[tabIndex] = newPath;
      }

      if (this.activeFile === oldPath) {
        this.activeFile = newPath;
      }

      this.currentProject.activeFile = this.activeFile;
      this.currentProject.openTabs = [...this.openTabs];

      this.scheduleAutoSave();
      this.emitChange('file-renamed', { oldPath, newPath });
    }

    renameProject(newName) {
      if (!this.currentProject) return;
      this.currentProject.name = newName.trim() || 'Без названия';
      this.scheduleAutoSave();
      this.emitChange('project-renamed', { name: this.currentProject.name });
    }

    scheduleAutoSave() {
      clearTimeout(this.saveTimeout);
      this.emitChange('save-status', { status: 'saving' });

      this.saveTimeout = setTimeout(async () => {
        if (this.currentProject) {
          this.currentProject.openTabs = [...this.openTabs];
          this.currentProject.activeFile = this.activeFile;
          await db.saveProject(this.currentProject);
          this.emitChange('save-status', { status: 'saved' });
        }
      }, 350);
    }

    async forceSave() {
      clearTimeout(this.saveTimeout);
      if (this.currentProject) {
        this.currentProject.openTabs = [...this.openTabs];
        this.currentProject.activeFile = this.activeFile;
        await db.saveProject(this.currentProject);
        this.emitChange('save-status', { status: 'saved' });
      }
    }
  }

  const state = new AppState();

  // --- 2. EDITOR MANAGER ---
  class EditorManager {
    constructor(containerEl) {
      this.containerEl = containerEl;
      this.textarea = null;
    }

    init() {
      this.containerEl.innerHTML = '';
      this.textarea = document.createElement('textarea');
      this.textarea.className = 'ide-code-textarea';
      this.textarea.setAttribute('spellcheck', 'false');
      this.textarea.value = state.getActiveContent();

      this.textarea.addEventListener('input', () => {
        if (state.activeFile) {
          state.updateFileContent(state.activeFile, this.textarea.value);
        }
      });

      // Handle Tab key in textarea
      this.textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.textarea.selectionStart;
          const end = this.textarea.selectionEnd;
          this.textarea.value = this.textarea.value.substring(0, start) + '    ' + this.textarea.value.substring(end);
          this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
          if (state.activeFile) {
            state.updateFileContent(state.activeFile, this.textarea.value);
          }
        }
      });

      this.containerEl.appendChild(this.textarea);

      state.addEventListener('active-file-changed', (e) => {
        this.textarea.value = e.detail.content || '';
      });

      state.addEventListener('project-loaded', () => {
        this.textarea.value = state.getActiveContent();
      });
    }

    setContent(newContent) {
      if (this.textarea) {
        this.textarea.value = newContent;
      }
    }
  }

  // --- 3. TAB MANAGER ---
  class TabManager {
    constructor(tabsContainerEl) {
      this.tabsContainerEl = tabsContainerEl;
      this.init();
    }

    init() {
      state.addEventListener('tabs-changed', () => this.render());
      state.addEventListener('active-file-changed', () => this.render());
      state.addEventListener('project-loaded', () => this.render());
    }

    render() {
      if (!this.tabsContainerEl) return;
      this.tabsContainerEl.innerHTML = '';

      const tabs = state.openTabs || [];
      const activeFile = state.activeFile;

      tabs.forEach(filePath => {
        const fileName = filePath.split('/').filter(Boolean).pop() || filePath;
        const isActive = filePath === activeFile;

        const tabEl = document.createElement('div');
        tabEl.className = `editor-tab ${isActive ? 'active' : ''}`;
        tabEl.title = filePath;

        tabEl.innerHTML = `
          <span class="tab-icon">🐍</span>
          <span class="tab-title">${escapeHtml(fileName)}</span>
          <button class="tab-close-btn" title="Закрыть вкладку">✕</button>
        `;

        tabEl.addEventListener('click', (e) => {
          if (!e.target.classList.contains('tab-close-btn')) {
            state.setActiveFile(filePath);
          }
        });

        tabEl.querySelector('.tab-close-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          state.closeTab(filePath);
        });

        this.tabsContainerEl.appendChild(tabEl);
      });
    }
  }

  // --- 4. PROJECT EXPLORER ---
  class ProjectExplorer {
    constructor(containerEl) {
      this.containerEl = containerEl;
      this.init();
    }

    init() {
      state.addEventListener('project-loaded', () => this.render());
      state.addEventListener('file-created', () => this.render());
      state.addEventListener('file-deleted', () => this.render());
      state.addEventListener('file-renamed', () => this.render());
      state.addEventListener('active-file-changed', () => this.updateActiveHighlight());

      const newFileBtn = document.getElementById('newFileBtn');
      const newFolderBtn = document.getElementById('newFolderBtn');

      if (newFileBtn) {
        newFileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.promptNewFile();
        });
      }

      if (newFolderBtn) {
        newFolderBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.promptNewFolder();
        });
      }
    }

    render() {
      if (!this.containerEl || !state.currentProject) return;
      this.containerEl.innerHTML = '';

      const files = Object.keys(state.currentProject.files || {}).sort();

      files.forEach(filePath => {
        const fileName = filePath.split('/').filter(Boolean).pop() || filePath;
        const isActive = filePath === state.activeFile;

        const itemEl = document.createElement('div');
        itemEl.className = `tree-item ${isActive ? 'active' : ''}`;
        itemEl.dataset.path = filePath;

        itemEl.innerHTML = `
          <div class="tree-item-name">
            <span class="tree-item-icon">${this.getFileIcon(fileName)}</span>
            <span>${escapeHtml(fileName)}</span>
          </div>
          <div class="tree-item-actions">
            <button class="tree-action-btn rename-btn" title="Переименовать">✏️</button>
            <button class="tree-action-btn delete-file-btn" title="Удалить файл">🗑</button>
          </div>
        `;

        itemEl.addEventListener('click', (e) => {
          if (!e.target.closest('.tree-item-actions')) {
            state.openTab(filePath);
          }
        });

        const renameBtn = itemEl.querySelector('.rename-btn');
        if (renameBtn) {
          renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.promptRename(filePath);
          });
        }

        const deleteBtn = itemEl.querySelector('.delete-file-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Удалить файл "${fileName}"?`)) {
              state.deleteFile(filePath);
            }
          });
        }

        this.containerEl.appendChild(itemEl);
      });
    }

    updateActiveHighlight() {
      if (!this.containerEl) return;
      const items = this.containerEl.querySelectorAll('.tree-item');
      items.forEach(el => {
        if (el.dataset.path === state.activeFile) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    }

    promptNewFile() {
      const fileName = prompt('Введите имя нового файла (например: utils.py):');
      if (!fileName) return;

      let cleanName = fileName.trim();
      if (!cleanName.startsWith('/')) cleanName = '/' + cleanName;
      if (!cleanName.endsWith('.py') && !cleanName.includes('.')) {
        cleanName += '.py';
      }

      try {
        state.createFile(cleanName, '# ' + cleanName + '\n');
      } catch (err) {
        alert(err.message);
      }
    }

    promptNewFolder() {
      const folderName = prompt('Введите имя папки (будет создан пакет):');
      if (!folderName) return;

      let cleanName = folderName.trim().replace(/^\/+|\/+$/g, '');
      const initFilePath = `/${cleanName}/__init__.py`;

      try {
        state.createFile(initFilePath, '# Package ' + cleanName + '\n');
      } catch (err) {
        alert(err.message);
      }
    }

    promptRename(oldPath) {
      const currentName = oldPath.split('/').filter(Boolean).pop();
      const newName = prompt('Введите новое имя файла:', currentName);
      if (!newName || newName === currentName) return;

      const parts = oldPath.split('/').filter(Boolean);
      parts.pop();
      parts.push(newName.trim());
      const newPath = '/' + parts.join('/');

      try {
        state.renameFile(oldPath, newPath);
      } catch (err) {
        alert(err.message);
      }
    }

    getFileIcon(fileName) {
      if (fileName.endsWith('.py')) return '🐍';
      if (fileName.endsWith('.json')) return '📋';
      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) return '📝';
      return '📄';
    }
  }

  // --- 5. TERMINAL UI & RUNNER ---
  class TerminalUI {
    constructor(containerEl, outputEl) {
      this.containerEl = containerEl;
      this.outputEl = outputEl;
      this.statusBadge = document.getElementById('workerStatusBadge');
      this.statusLabel = document.getElementById('workerStatusLabel');
      this.clearBtn = document.getElementById('clearTerminalBtn');

      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => this.clear());
      }
    }

    appendLine(text, type = 'stdout') {
      if (!this.outputEl) return;
      const span = document.createElement('span');
      span.className = `term-line-${type}`;
      span.textContent = text;
      this.outputEl.appendChild(span);
      this.scrollToBottom();
    }

    clear() {
      if (this.outputEl) this.outputEl.innerHTML = '';
    }

    scrollToBottom() {
      if (this.containerEl) this.containerEl.scrollTop = this.containerEl.scrollHeight;
    }

    updateStatus(status, message) {
      if (!this.statusBadge || !this.statusLabel) return;
      this.statusBadge.className = `worker-status-badge status-${status}`;
      this.statusLabel.textContent = message || (status === 'ready' ? 'Готов к запуску' : status);
    }
  }

  // Helper escape HTML
  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  // --- 6. MAIN IDE APP ORCHESTRATOR ---
  class StandalonePythonIDE {
    constructor() {
      this.editor = null;
      this.tabManager = null;
      this.projectExplorer = null;
      this.terminal = null;
      this.pyodide = null;
      this.isRunning = false;
    }

    async init() {
      const urlParams = new URLSearchParams(window.location.search);
      let projectId = urlParams.get('project');

      if (!projectId) {
        const projects = await db.getProjects();
        if (projects.length > 0) {
          projectId = projects[0].id;
        } else {
          const starter = await db.createProject('Первый проект');
          projectId = starter.id;
        }
      }

      await state.loadProject(projectId);

      const editorRootEl = document.getElementById('codeMirrorRoot');
      const tabsBarEl = document.getElementById('editorTabsBar');
      const explorerEl = document.getElementById('fileExplorerContainer');
      const terminalBodyEl = document.getElementById('terminalBody');
      const terminalOutputEl = document.getElementById('terminalOutput');

      this.editor = new EditorManager(editorRootEl);
      this.editor.init();

      this.tabManager = new TabManager(tabsBarEl);
      this.projectExplorer = new ProjectExplorer(explorerEl);
      this.terminal = new TerminalUI(terminalBodyEl, terminalOutputEl);

      this.bindHeaderControls();
      this.bindResizers();
      this.bindHotkeys();
      this.updateHeaderProjectInfo();

      this.terminal.appendLine(`[Python Web IDE] Среда инициализирована.\n`, 'system');
      this.terminal.appendLine(`Проект: ${state.currentProject.name}\n`, 'system');
      this.terminal.appendLine(`Нажмите «Запустить» (Ctrl+Enter / F5) для выполнения /main.py\n\n`, 'system');
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
    }

    bindHeaderControls() {
      const runBtn = document.getElementById('runProjectBtn');
      const stopBtn = document.getElementById('stopProjectBtn');
      const openProjectsBtn = document.getElementById('openProjectModalBtn');

      if (runBtn) {
        runBtn.addEventListener('click', () => this.runCode());
      }

      if (stopBtn) {
        stopBtn.addEventListener('click', () => {
          this.isRunning = false;
          if (runBtn) runBtn.disabled = false;
          if (stopBtn) stopBtn.disabled = true;
          this.terminal.appendLine('\n[Выполнение остановлено]\n', 'system');
        });
      }

      if (openProjectsBtn && global.PythonIDE_Modal) {
        openProjectsBtn.addEventListener('click', () => {
          global.PythonIDE_Modal.open();
        });
      }
    }

    async runCode() {
      const runBtn = document.getElementById('runProjectBtn');
      const stopBtn = document.getElementById('stopProjectBtn');

      await state.forceSave();

      if (runBtn) runBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = false;
      this.isRunning = true;

      this.terminal.clear();
      this.terminal.appendLine(`[Запуск /main.py...]\n\n`, 'system');
      this.terminal.updateStatus('running', 'Выполнение...');

      try {
        if (!this.pyodide) {
          this.terminal.appendLine('Загрузка Pyodide (WASM)... Пожалуйста, подождите.\n', 'system');
          this.terminal.updateStatus('loading', 'Загрузка Pyodide...');

          if (typeof loadPyodide === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');
          }

          this.pyodide = await loadPyodide({
            stdout: (text) => this.terminal.appendLine(text + '\n', 'stdout'),
            stderr: (text) => this.terminal.appendLine(text + '\n', 'stderr')
          });
        }

        // Sync files into Emscripten virtual FS
        try {
          this.pyodide.FS.mkdir('/workspace');
        } catch (e) {}

        const files = state.currentProject.files || {};
        for (const [rawPath, content] of Object.entries(files)) {
          const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
          const fullPath = '/workspace' + cleanPath;
          const parts = fullPath.split('/').filter(Boolean);
          let currentDir = '';
          for (let i = 0; i < parts.length - 1; i++) {
            currentDir += '/' + parts[i];
            try { this.pyodide.FS.mkdir(currentDir); } catch (e) {}
          }
          this.pyodide.FS.writeFile(fullPath, content, { encoding: 'utf8' });
        }

        await this.pyodide.runPythonAsync(`
import sys
import os
if "/workspace" not in sys.path:
    sys.path.insert(0, "/workspace")
os.chdir('/workspace')
`);

        const mainCode = files['/main.py'] || Object.values(files)[0] || '';
        await this.pyodide.runPythonAsync(mainCode);

        this.terminal.appendLine('\n[Выполнение успешно завершено]\n', 'success');
        this.terminal.updateStatus('ready', 'Готов к запуску');
      } catch (err) {
        this.terminal.appendLine(`\nОшибка выполнения:\n${err.message}\n`, 'error');
        this.terminal.updateStatus('ready', 'Готов к запуску');
      } finally {
        this.isRunning = false;
        if (runBtn) runBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
      }
    }

    loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    bindResizers() {
      const sidebarResizer = document.getElementById('sidebarResizer');
      const sidebar = document.getElementById('ideSidebar');

      if (sidebarResizer && sidebar) {
        let isResizingX = false;
        sidebarResizer.addEventListener('mousedown', () => {
          isResizingX = true;
          sidebarResizer.classList.add('resizing');
          document.body.style.cursor = 'col-resize';
        });

        document.addEventListener('mousemove', (e) => {
          if (!isResizingX) return;
          const newWidth = Math.max(160, Math.min(e.clientX, 500));
          sidebar.style.width = `${newWidth}px`;
        });

        document.addEventListener('mouseup', () => {
          if (isResizingX) {
            isResizingX = false;
            sidebarResizer.classList.remove('resizing');
            document.body.style.cursor = '';
          }
        });
      }

      const terminalResizer = document.getElementById('terminalResizer');
      const terminalSection = document.getElementById('ideTerminalSection');

      if (terminalResizer && terminalSection) {
        let isResizingY = false;
        terminalResizer.addEventListener('mousedown', () => {
          isResizingY = true;
          terminalResizer.classList.add('resizing');
          document.body.style.cursor = 'row-resize';
        });

        document.addEventListener('mousemove', (e) => {
          if (!isResizingY) return;
          const newHeight = Math.max(80, Math.min(window.innerHeight - e.clientY, window.innerHeight * 0.7));
          terminalSection.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => {
          if (isResizingY) {
            isResizingY = false;
            terminalResizer.classList.remove('resizing');
            document.body.style.cursor = '';
          }
        });
      }
    }

    bindHotkeys() {
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
          e.preventDefault();
          this.runCode();
        }
        if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
          e.preventDefault();
          state.forceSave();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const ide = new StandalonePythonIDE();
    ide.init();
  });
})(typeof window !== 'undefined' ? window : this);
