// Application State
let pyodideInstance = null;
let isPyodideLoading = false;
let currentTopic = null;
let currentExampleCode = "";
let monacoEditor = null;
let debugDecorations = [];
let debugSteps = [];
let currentDebugIndex = 0;
let isDebugActive = false;
let autoSaveTimeout = null;

// LocalStorage Keys
const STORAGE_KEY_COMPLETED = "learn_py_completed_topics";
const STORAGE_KEY_TOPIC_CODE_PREFIX = "learn_py_code_topic_";
const STORAGE_KEY_LAST_TOPIC = "learn_py_last_topic";

// DOM Elements
const catalogView = document.getElementById("catalogView");
const workspaceView = document.getElementById("workspaceView");
const brandHomeLink = document.getElementById("brandHomeLink");
const searchInput = document.getElementById("searchInput");
const topicsGrid = document.getElementById("topicsGrid");
const catalogProgressFill = document.getElementById("catalogProgressFill");
const catalogProgressText = document.getElementById("catalogProgressText");
const sidebarTopicsList = document.getElementById("sidebarTopicsList");
const topicCategoryText = document.getElementById("topicCategoryText");
const topicTitleText = document.getElementById("topicTitleText");
const topicCompleteBtn = document.getElementById("topicCompleteBtn");
const topicCompleteIcon = document.getElementById("topicCompleteIcon");
const topicCompleteText = document.getElementById("topicCompleteText");
const ideSaveIndicator = document.getElementById("ideSaveIndicator");
const theoryBlock = document.getElementById("theoryBlock");
const snippetsList = document.getElementById("snippetsList");
const runIdeBtn = document.getElementById("runIdeBtn");
const stepDebugBtn = document.getElementById("stepDebugBtn");
const resetCodeBtn = document.getElementById("resetCodeBtn");
const formatCodeBtn = document.getElementById("formatCodeBtn");
const clearTermBtn = document.getElementById("clearTermBtn");
const terminalBody = document.getElementById("terminalBody");
const terminalTitleText = document.getElementById("terminalTitleText");
const debugControls = document.getElementById("debugControls");
const debugFirstBtn = document.getElementById("debugFirstBtn");
const debugPrevBtn = document.getElementById("debugPrevBtn");
const debugNextBtn = document.getElementById("debugNextBtn");
const debugLastBtn = document.getElementById("debugLastBtn");
const debugExitBtn = document.getElementById("debugExitBtn");
const debugStepInfo = document.getElementById("debugStepInfo");
const debugViewBody = document.getElementById("debugViewBody");
const debugEventIcon = document.getElementById("debugEventIcon");
const debugEventText = document.getElementById("debugEventText");
const debugScopeBadge = document.getElementById("debugScopeBadge");
const debugVarsContainer = document.getElementById("debugVarsContainer");
const debugOutputText = document.getElementById("debugOutputText");
const globalSearchBtn = document.getElementById("globalSearchBtn");
const searchPaletteModal = document.getElementById("searchPaletteModal");
const paletteSearchInput = document.getElementById("paletteSearchInput");
const paletteResultsList = document.getElementById("paletteResultsList");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const hotkeysModalBtn = document.getElementById("hotkeysModalBtn");
const hotkeysModal = document.getElementById("hotkeysModal");
const closeHotkeysModalBtn = document.getElementById("closeHotkeysModalBtn");

// Custom Input Modal Elements
const customInputModal = document.getElementById("customInputModal");
const inputModalPromptText = document.getElementById("inputModalPromptText");
const customInputForm = document.getElementById("customInputForm");
const customInputField = document.getElementById("customInputField");
const customInputCancelBtn = document.getElementById("customInputCancelBtn");

let activeInputResolver = null;
let activeInputRejecter = null;

window.showCustomInputModal = function (promptText) {
  return new Promise((resolve, reject) => {
    if (!customInputModal) {
      const val = window.prompt(promptText || "Введите значение:");
      if (val === null) reject(new Error("Ввод отменен пользователем"));
      else resolve(val);
      return;
    }

    activeInputResolver = resolve;
    activeInputRejecter = reject;

    if (inputModalPromptText) {
      inputModalPromptText.textContent = promptText || "Введите значение:";
    }
    if (customInputField) {
      customInputField.value = "";
    }
    customInputModal.style.display = "flex";
    setTimeout(() => {
      if (customInputField) customInputField.focus();
    }, 50);
  });
};

function closeCustomInputModal(isCancelled = false, value = "") {
  if (customInputModal) {
    customInputModal.style.display = "none";
  }
  if (isCancelled) {
    if (activeInputRejecter) activeInputRejecter(new Error("Ввод отменен пользователем"));
  } else {
    if (activeInputResolver) activeInputResolver(value);
  }
  activeInputResolver = null;
  activeInputRejecter = null;
}

let activePaletteIndex = 0;
let paletteResults = [];

// LocalStorage Helpers
function getCompletedTopics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading completed topics:", e);
    return [];
  }
}

function setCompletedTopics(list) {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving completed topics:", e);
  }
}

function isTopicCompleted(topicId) {
  return getCompletedTopics().includes(topicId);
}

function toggleTopicCompleted(topicId) {
  const completed = getCompletedTopics();
  const idx = completed.indexOf(topicId);
  if (idx >= 0) {
    completed.splice(idx, 1);
  } else {
    completed.push(topicId);
  }
  setCompletedTopics(completed);
  updateProgressUI();
  return completed.includes(topicId);
}

function getSavedTopicCode(topicId) {
  try {
    return localStorage.getItem(STORAGE_KEY_TOPIC_CODE_PREFIX + topicId);
  } catch (e) {
    return null;
  }
}

function saveTopicCode(topicId, code) {
  try {
    if (topicId) {
      localStorage.setItem(STORAGE_KEY_TOPIC_CODE_PREFIX + topicId, code);
      showSaveStatus();
    }
  } catch (e) {
    console.error("Error saving topic code:", e);
  }
}

function removeSavedTopicCode(topicId) {
  try {
    localStorage.removeItem(STORAGE_KEY_TOPIC_CODE_PREFIX + topicId);
  } catch (e) {
    console.error("Error clearing saved topic code:", e);
  }
}

function showSaveStatus() {
  if (!ideSaveIndicator) return;
  ideSaveIndicator.classList.remove("saving");
  ideSaveIndicator.classList.add("saved");
  ideSaveIndicator.innerHTML = `<span>✓</span> <span>Сохранено</span>`;
}

// SVG Checkmark icon for crisp vector rendering
const CHECK_SVG = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5"/></svg>`;

function updateProgressUI() {
  const completed = getCompletedTopics();
  const total = TOPICS.length;
  const count = completed.length;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  if (catalogProgressFill) {
    catalogProgressFill.style.width = `${percent}%`;
  }
  if (catalogProgressText) {
    catalogProgressText.textContent = `Прогресс: ${count} / ${total} (${percent}%)`;
  }

  // Update Catalog Cards
  document.querySelectorAll(".topic-card").forEach((card) => {
    const id = card.dataset.id;
    const isDone = completed.includes(id);
    card.classList.toggle("completed", isDone);

    const badge = card.querySelector(".topic-badge-completed");
    if (badge) {
      badge.style.display = isDone ? "inline-flex" : "none";
    }

    const toggleBtn = card.querySelector(".card-toggle-complete");
    if (toggleBtn) {
      toggleBtn.classList.toggle("completed", isDone);
      toggleBtn.innerHTML = isDone ? "✓ Пройдено" : "○ Отметить";
    }
  });

  // Update Sidebar
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    const id = item.dataset.id;
    const isDone = completed.includes(id);
    item.classList.toggle("completed", isDone);

    const btn = item.querySelector(".sidebar-checkbox-btn");
    if (btn) {
      btn.classList.toggle("checked", isDone);
      btn.innerHTML = isDone ? CHECK_SVG : "";
      btn.title = isDone ? "Пройдено (нажмите, чтобы снять)" : "Отметить как пройденное";
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initMonacoEditor();
  renderCatalog();
  renderSidebar();
  setupEventListeners();
  initSearchPalette();
  initTerminalResizer();
  updateProgressUI();
  initPyodide();
});

// Setup Monaco Editor (Right Pane IDE)
function initMonacoEditor() {
  const container = document.getElementById("monacoEditorContainer");
  if (!container) return;

  if (typeof require === "undefined") {
    console.error("Monaco loader is not available");
    return;
  }

  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
  });

  require(["vs/editor/editor.main"], function () {
    // Register Custom Python Autocompletion Provider
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: function (model, position) {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const keywords = [
          "and", "as", "assert", "async", "await", "break", "class", "continue", "def",
          "del", "elif", "else", "except", "finally", "for", "from", "global", "if",
          "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise",
          "return", "try", "while", "with", "yield", "True", "False", "None"
        ];

        const builtins = [
          "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes",
          "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir",
          "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset",
          "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int",
          "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max",
          "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print",
          "property", "range", "repr", "reversed", "round", "set", "setattr", "slice",
          "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"
        ];

        const methods = [
          "append", "extend", "insert", "remove", "pop", "clear", "index", "count", "sort",
          "reverse", "copy", "get", "keys", "values", "items", "update", "split", "join",
          "replace", "strip", "lstrip", "rstrip", "lower", "upper", "title", "capitalize",
          "startswith", "endswith", "find", "rfind", "isdigit", "isalpha", "isalnum", "add",
          "discard", "union", "intersection", "difference", "symmetric_difference", "read",
          "write", "readline", "readlines", "close", "format", "encode", "decode"
        ];

        const suggestions = [];

        keywords.forEach((k) => {
          suggestions.push({
            label: k,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: k,
            detail: "keyword",
            range: range
          });
        });

        builtins.forEach((b) => {
          suggestions.push({
            label: b,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: b,
            detail: "builtin function",
            range: range
          });
        });

        methods.forEach((m) => {
          suggestions.push({
            label: m,
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: m,
            detail: "method",
            range: range
          });
        });

        return { suggestions: suggestions };
      }
    });

    // Define GitHub Dark Theme
    monaco.editor.defineTheme("github-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8b949e", fontStyle: "italic" },
        { token: "keyword", foreground: "ff7b72" },
        { token: "string", foreground: "a5d6ff" },
        { token: "number", foreground: "79c0ff" },
        { token: "type", foreground: "ffa657" },
        { token: "type.identifier", foreground: "ffa657" },
        { token: "function", foreground: "d2a8ff" },
        { token: "identifier", foreground: "e6edf3" },
        { token: "delimiter", foreground: "79c0ff" },
        { token: "operator", foreground: "79c0ff" }
      ],
      colors: {
        "editor.background": "#0d1117",
        "editor.foreground": "#c9d1d9",
        "editorCursor.foreground": "#58a6ff",
        "editor.lineHighlightBackground": "#161b2280",
        "editorLineNumber.foreground": "#6e7681",
        "editorLineNumber.activeForeground": "#f0f6fc",
        "editor.selectionBackground": "#1f6feb40",
        "editor.inactiveSelectionBackground": "#1f6feb20",
        "editorGutter.background": "#0d1117",
        "editorIndentGuide.background": "#21262d",
        "editorIndentGuide.activeBackground": "#30363d",
        "minimap.background": "#0d1117"
      }
    });

    // Create Monaco Editor Instance
    monacoEditor = monaco.editor.create(container, {
      value: `# Добро пожаловать в Python Interactive Lab!
# Выберите тему слева или напишите любой свой код здесь:

def greet(name):
    return f"Привет, {name}! Готов изучать Python?"

print(greet("Разработчик"))
`,
      language: "python",
      theme: "github-dark",
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
      tabSize: 4,
      insertSpaces: true,
      automaticLayout: true,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: true
      },
      renderLineHighlight: "all",
      lineNumbers: "on",
      bracketPairColorization: {
        enabled: true
      },
      formatOnPaste: true,
      wordWrap: "on"
    });

    // Shortcuts inside Monaco
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
      runIdeCode();
    });

    monacoEditor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, function () {
      formatIdeCode();
    });

    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyL, function () {
      formatIdeCode();
    });

    // Auto-save user code on change (debounced 400ms)
    monacoEditor.onDidChangeModelContent(() => {
      if (ideSaveIndicator) {
        ideSaveIndicator.classList.remove("saved");
        ideSaveIndicator.classList.add("saving");
        ideSaveIndicator.innerHTML = `<span>⏳</span> <span>Сохранение...</span>`;
      }
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        if (currentTopic && monacoEditor) {
          saveTopicCode(currentTopic.id, monacoEditor.getValue());
        }
      }, 400);
    });
  });
}

// Render Catalog Grid View
function renderCatalog(filter = "") {
  topicsGrid.innerHTML = "";
  const query = filter.toLowerCase().trim();
  const completed = getCompletedTopics();

  const filteredTopics = TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      t.summary.some((s) => s.toLowerCase().includes(query)) ||
      t.category.toLowerCase().includes(query)
  );

  if (filteredTopics.length === 0) {
    topicsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
        По запросу «${escapeHtml(filter)}» тем не найдено.
      </div>
    `;
    return;
  }

  filteredTopics.forEach((topic) => {
    const isDone = completed.includes(topic.id);
    const card = document.createElement("div");
    card.className = `topic-card ${isDone ? "completed" : ""}`;
    card.dataset.id = topic.id;

    const itemsHtml = topic.summary
      .map(
        (s) => `
        <div class="topic-card-item">
          <span class="arrow-icon">→</span>
          <div>${escapeHtml(s)}</div>
        </div>
      `
      )
      .join("");

    card.innerHTML = `
      <div class="topic-card-head">
        <div class="topic-card-title-wrap">
          <span>${topic.icon}</span>
          <div class="topic-title-text-wrap">
            <span class="topic-title-text">${escapeHtml(topic.title)}</span>
          </div>
        </div>
        <span class="topic-category-badge">${escapeHtml(topic.category)}</span>
      </div>
      <div class="topic-card-body">
        ${itemsHtml}
      </div>
      <div class="topic-card-foot">
        <button class="card-toggle-complete ${isDone ? "completed" : ""}" title="Переключить статус изучения">
          ${isDone ? "✓ Пройдено" : "○ Отметить"}
        </button>
        <span class="open-link">Открыть практику →</span>
      </div>
    `;

    // Dynamic marquee effect on hover for overflowing titles
    card.addEventListener("mouseenter", () => {
      const wrap = card.querySelector(".topic-title-text-wrap");
      const text = card.querySelector(".topic-title-text");
      if (wrap && text) {
        const overflow = text.scrollWidth - wrap.clientWidth;
        if (overflow > 4) {
          card.style.setProperty("--marquee-distance", `-${overflow + 8}px`);
          card.classList.add("marquee-active");
        }
      }
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("marquee-active");
      card.style.removeProperty("--marquee-distance");
    });

    const toggleBtn = card.querySelector(".card-toggle-complete");
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTopicCompleted(topic.id);
    });

    card.addEventListener("click", () => openTopicWorkspace(topic.id));
    topicsGrid.appendChild(card);
  });
}

// Render Left Sidebar Topics List in Workspace View
function renderSidebar() {
  sidebarTopicsList.innerHTML = "";
  const completed = getCompletedTopics();

  TOPICS.forEach((topic) => {
    const isDone = completed.includes(topic.id);
    const item = document.createElement("div");
    item.className = `sidebar-item ${isDone ? "completed" : ""}`;
    item.dataset.id = topic.id;
    item.innerHTML = `
      <span>${topic.icon}</span>
      <div class="sidebar-text-wrap">
        <span class="sidebar-text">${escapeHtml(topic.title)}</span>
      </div>
      <button class="sidebar-checkbox-btn ${isDone ? "checked" : ""}" title="${isDone ? "Пройдено (нажмите, чтобы снять)" : "Отметить как пройденное"}">
        ${isDone ? CHECK_SVG : ""}
      </button>
    `;

    const checkBtn = item.querySelector(".sidebar-checkbox-btn");
    checkBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTopicCompleted(topic.id);
    });

    // Dynamic marquee effect on hover for overflowing titles
    item.addEventListener("mouseenter", () => {
      const wrap = item.querySelector(".sidebar-text-wrap");
      const text = item.querySelector(".sidebar-text");
      if (wrap && text) {
        const overflow = text.scrollWidth - wrap.clientWidth;
        if (overflow > 4) {
          item.style.setProperty("--marquee-distance", `-${overflow + 8}px`);
          item.classList.add("marquee-active");
        }
      }
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("marquee-active");
      item.style.removeProperty("--marquee-distance");
    });

    item.addEventListener("click", () => openTopicWorkspace(topic.id));
    sidebarTopicsList.appendChild(item);
  });
}

// Open Topic in Workspace View
function openTopicWorkspace(topicId) {
  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) return;

  currentTopic = topic;

  // Switch Views
  catalogView.style.display = "none";
  workspaceView.classList.add("active");

  // Update Sidebar active state
  document.querySelectorAll(".sidebar-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === topicId);
  });

  // Fill Header & Theory
  topicCategoryText.textContent = topic.category;
  topicTitleText.textContent = `${topic.icon} ${topic.title}`;
  theoryBlock.innerHTML = topic.theory;

  // Update completion status button in header
  updateProgressUI();

  // Render Inline Snippet Runners with Prism.js Syntax Highlighting
  snippetsList.innerHTML = "";
  topic.examples.forEach((ex, idx) => {
    const card = document.createElement("div");
    card.className = "snippet-runner-card";

    // Highlight code using Prism
    let highlightedCode = escapeHtml(ex.code);
    if (window.Prism && Prism.languages.python) {
      highlightedCode = Prism.highlight(ex.code, Prism.languages.python, 'python');
    }

    card.innerHTML = `
      <div class="snippet-top-bar">
        <span class="snippet-name">Пример ${idx + 1}: ${escapeHtml(ex.title)}</span>
        <div class="snippet-btn-group">
          <button class="snippet-action-btn load-ide-btn" title="Загрузить в правую IDE">
            📝 В редактор
          </button>
          <button class="snippet-action-btn primary run-inline-btn" title="Выполнить прямо здесь">
            ▶ Запустить здесь
          </button>
        </div>
      </div>
      ${ex.desc ? `<div class="snippet-description">${escapeHtml(ex.desc)}</div>` : ""}
      <pre class="snippet-code-area language-python"><code class="language-python">${highlightedCode}</code></pre>
      <div class="inline-output-box" id="inlineOut_${topic.id}_${idx}"></div>
    `;

    const runInlineBtn = card.querySelector(".run-inline-btn");
    const loadIdeBtn = card.querySelector(".load-ide-btn");
    const outputBox = card.querySelector(".inline-output-box");

    // Run snippet directly on the spot (Jupyter-style)
    runInlineBtn.addEventListener("click", async () => {
      outputBox.classList.add("visible");
      outputBox.classList.remove("error");
      outputBox.textContent = "⏳ Выполнение...";
      runInlineBtn.disabled = true;

      const res = await executePythonCode(ex.code);
      if (res.success) {
        outputBox.textContent = res.output || "(Выполнено без вывода в консоль)";
      } else {
        outputBox.classList.add("error");
        let errText = "";
        if (res.output && res.output.trim()) {
          errText += `Вывод:\n${res.output}\n\n`;
        }
        errText += `❌ Ошибка:\n${res.error}`;
        outputBox.textContent = errText;
      }
      runInlineBtn.disabled = false;
    });

    // Load snippet into right CodeMirror IDE
    loadIdeBtn.addEventListener("click", () => {
      loadCodeIntoIde(ex.code);
    });

    snippetsList.appendChild(card);
  });

  // Preload saved user code or first example into CodeMirror IDE
  const savedCode = getSavedTopicCode(topic.id);
  if (savedCode !== null && savedCode !== undefined) {
    currentExampleCode = topic.examples.length > 0 ? topic.examples[0].code : "";
    loadCodeIntoIde(savedCode, false);
  } else if (topic.examples.length > 0) {
    currentExampleCode = topic.examples[0].code;
    loadCodeIntoIde(currentExampleCode, true);
  }

  // Refresh Monaco layout
  setTimeout(() => {
    if (monacoEditor) {
      monacoEditor.layout();
    }
  }, 50);
}

// Load code into right IDE pane
function loadCodeIntoIde(code, saveToStorage = true) {
  if (monacoEditor) {
    monacoEditor.setValue(code);
    monacoEditor.focus();
  }
  if (saveToStorage && currentTopic) {
    saveTopicCode(currentTopic.id, code);
  } else {
    showSaveStatus();
  }
}

// Switch back to Catalog
function showCatalogView() {
  workspaceView.classList.remove("active");
  catalogView.style.display = "block";
}

// Execute Python Code via Pyodide
async function executePythonCode(code) {
  if (!pyodideInstance) {
    await initPyodide();
    if (!pyodideInstance) {
      return { success: false, error: "Pyodide еще не загрузился, повторите через секунду." };
    }
  }

  try {
    pyodideInstance.globals.set("__user_code__", code);

    const runnerScript = `
import sys
import io
import traceback
import builtins
import js
import ast

sys.stdout = io.StringIO()
sys.stderr = sys.stdout

__execution_success__ = True
__execution_error__ = ""

async def __custom_async_input__(prompt=""):
    prompt_str = str(prompt) if prompt is not None else ""
    if prompt_str:
        sys.stdout.write(prompt_str)
    try:
        val = await js.showCustomInputModal(prompt_str)
        val_str = str(val)
        sys.stdout.write(val_str + "\\n")
        return val_str
    except Exception:
        raise EOFError("Ввод отменен пользователем")

builtins.input = __custom_async_input__
builtins.__custom_async_input__ = __custom_async_input__

class __InputTransformer__(ast.NodeTransformer):
    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, ast.Name) and node.func.id == "input":
            return ast.Await(
                value=ast.Call(
                    func=ast.Name(id="__custom_async_input__", ctx=ast.Load()),
                    args=node.args,
                    keywords=node.keywords
                )
            )
        return node

try:
    __parsed_tree__ = ast.parse(__user_code__, "main.py")
    __has_input__ = False
    for node in ast.walk(__parsed_tree__):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "input":
            __has_input__ = True
            break

    if __has_input__:
        __transformer__ = __InputTransformer__()
        __transformed_tree__ = __transformer__.visit(__parsed_tree__)
        ast.fix_missing_locations(__transformed_tree__)

        __wrapper_func__ = ast.AsyncFunctionDef(
            name="__async_user_main__",
            args=ast.arguments(posonlyargs=[], args=[], vararg=None, kwonlyargs=[], kw_defaults=[], kwarg=None, defaults=[]),
            body=__transformed_tree__.body,
            decorator_list=[]
        )
        __transformed_tree__.body = [__wrapper_func__]
        ast.fix_missing_locations(__transformed_tree__)

        __compiled__ = compile(__transformed_tree__, "main.py", "exec")
        __user_globals__ = {"__name__": "__main__"}
        exec(__compiled__, __user_globals__)
        await __user_globals__["__async_user_main__"]()
    else:
        __compiled_code__ = compile(__user_code__, "main.py", "exec")
        __user_globals__ = {"__name__": "__main__"}
        exec(__compiled_code__, __user_globals__)
except SystemExit:
    pass
except BaseException:
    __execution_success__ = False
    __execution_error__ = traceback.format_exc()

__execution_output__ = sys.stdout.getvalue()
`;

    const startTime = performance.now();
    await pyodideInstance.runPythonAsync(runnerScript);
    const duration = (performance.now() - startTime).toFixed(1);

    const success = pyodideInstance.globals.get("__execution_success__");
    const output = pyodideInstance.globals.get("__execution_output__");
    const errorText = pyodideInstance.globals.get("__execution_error__");

    if (!success) {
      return {
        success: false,
        output: output || "",
        error: errorText,
        duration
      };
    }

    return { success: true, output: output, duration };
  } catch (err) {
    let errorMsg = err.message || String(err);
    if (err.stack && !errorMsg.includes("Traceback")) {
      errorMsg = `${errorMsg}\n${err.stack}`;
    }
    return { success: false, error: errorMsg };
  }
}

// Run code from right IDE
async function runIdeCode() {
  if (!monacoEditor) return;
  const code = monacoEditor.getValue().trim();
  if (!code) return;

  terminalBody.classList.remove("empty");
  terminalBody.textContent = "⏳ Выполняется...\n";
  runIdeBtn.disabled = true;

  const res = await executePythonCode(code);

  if (res.success) {
    const text = res.output || "(Программа выполнена успешно без вывода в консоль)";
    terminalBody.innerHTML = `<span class="term-info">▶ Выполнено за ${res.duration} мс:</span>\n${escapeHtml(text)}`;
  } else {
    let html = "";
    if (res.output && res.output.trim()) {
      html += `<span class="term-info">▶ Вывод до возникновения ошибки:</span>\n${escapeHtml(res.output)}\n\n`;
    }
    html += `<span class="term-error">❌ Ошибка выполнения:\n${escapeHtml(res.error || "Неизвестная ошибка")}</span>`;
    terminalBody.innerHTML = html;
  }

  terminalBody.scrollTop = terminalBody.scrollHeight;
  runIdeBtn.disabled = false;
}

// Initialize Pyodide WebAssembly
async function initPyodide() {
  if (pyodideInstance || isPyodideLoading) return;
  isPyodideLoading = true;
  updateStatus(false, "Загрузка Python 3.12 (Pyodide)...");

  try {
    if (typeof loadPyodide === "undefined") {
      throw new Error("Pyodide CDN недоступен");
    }

    pyodideInstance = await loadPyodide();
    pyodideInstance.setStdin({
      stdin: () => {
        const input = window.prompt("Введите значение (input):");
        return input !== null ? input + "\n" : null;
      }
    });
    updateStatus(false, "Загрузка micropip и autopep8...");
    await pyodideInstance.loadPackage("micropip");
    const micropip = pyodideInstance.pyimport("micropip");
    await micropip.install("autopep8");

    updateStatus(true, "Python 3.12 (Pyodide) готов");
    runIdeBtn.disabled = false;
    stepDebugBtn.disabled = false;
  } catch (err) {
    console.error("Ошибка загрузки Pyodide:", err);
    updateStatus(false, "Ошибка загрузки Pyodide");
  } finally {
    isPyodideLoading = false;
  }
}

function updateStatus(isReady, message) {
  statusText.textContent = message;
  statusDot.className = `status-dot ${isReady ? "ready" : ""}`;
}

// Event Listeners
function setupEventListeners() {
  if (brandHomeLink) {
    brandHomeLink.addEventListener("click", (e) => {
      e.preventDefault();
      showCatalogView();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCatalog(e.target.value);
    });
  }

  runIdeBtn.addEventListener("click", () => {
    if (isDebugActive) exitDebugMode();
    runIdeCode();
  });

  if (stepDebugBtn) {
    stepDebugBtn.addEventListener("click", runStepByStepDebug);
  }

  if (debugFirstBtn) {
    debugFirstBtn.addEventListener("click", () => goToDebugStep(0));
  }
  if (debugPrevBtn) {
    debugPrevBtn.addEventListener("click", () => goToDebugStep(currentDebugIndex - 1));
  }
  if (debugNextBtn) {
    debugNextBtn.addEventListener("click", () => goToDebugStep(currentDebugIndex + 1));
  }
  if (debugLastBtn) {
    debugLastBtn.addEventListener("click", () => goToDebugStep(debugSteps.length - 1));
  }
  if (debugExitBtn) {
    debugExitBtn.addEventListener("click", exitDebugMode);
  }

  if (topicCompleteBtn) {
    topicCompleteBtn.addEventListener("click", () => {
      if (currentTopic) {
        toggleTopicCompleted(currentTopic.id);
      }
    });
  }

  resetCodeBtn.addEventListener("click", () => {
    if (isDebugActive) exitDebugMode();
    if (currentExampleCode && currentTopic) {
      removeSavedTopicCode(currentTopic.id);
      loadCodeIntoIde(currentExampleCode, false);
      showSaveStatus();
    }
  });

  if (formatCodeBtn) {
    formatCodeBtn.addEventListener("click", formatIdeCode);
  }

  clearTermBtn.addEventListener("click", () => {
    terminalBody.textContent = "Консоль очищена.";
    terminalBody.classList.add("empty");
  });

  // Hotkeys Modal
  if (hotkeysModalBtn && hotkeysModal) {
    hotkeysModalBtn.addEventListener("click", () => {
      hotkeysModal.style.display = "flex";
    });
  }

  if (closeHotkeysModalBtn && hotkeysModal) {
    closeHotkeysModalBtn.addEventListener("click", () => {
      hotkeysModal.style.display = "none";
    });
  }

  if (hotkeysModal) {
    hotkeysModal.addEventListener("click", (e) => {
      if (e.target === hotkeysModal) {
        hotkeysModal.style.display = "none";
      }
    });
  }

  // Custom Input Modal Handlers
  if (customInputForm) {
    customInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      closeCustomInputModal(false, customInputField.value);
    });
  }

  if (customInputCancelBtn) {
    customInputCancelBtn.addEventListener("click", () => {
      closeCustomInputModal(true);
    });
  }

  if (customInputModal) {
    customInputModal.addEventListener("click", (e) => {
      if (e.target === customInputModal) {
        closeCustomInputModal(true);
      }
    });
  }

  // Global hotkeys
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (customInputModal && customInputModal.style.display === "flex") {
        e.preventDefault();
        closeCustomInputModal(true);
        return;
      }
      if (hotkeysModal && hotkeysModal.style.display === "flex") {
        e.preventDefault();
        hotkeysModal.style.display = "none";
        return;
      }
      if (isDebugActive) {
        e.preventDefault();
        exitDebugMode();
        return;
      }
      if (workspaceView.classList.contains("active")) {
        showCatalogView();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (workspaceView.classList.contains("active")) {
        e.preventDefault();
        if (isDebugActive) exitDebugMode();
        runIdeCode();
      }
    }
    // F10 or Shift+F10 for Debugging
    if (e.key === "F10" && workspaceView.classList.contains("active")) {
      e.preventDefault();
      if (!isDebugActive) {
        runStepByStepDebug();
      } else {
        if (e.shiftKey) {
          goToDebugStep(currentDebugIndex - 1);
        } else {
          goToDebugStep(currentDebugIndex + 1);
        }
      }
    }
    // Left/Right Arrow Navigation during active debug
    if (isDebugActive && (e.target === document.body || e.target.closest("#workspaceView"))) {
      if (e.key === "ArrowRight" && !e.target.closest(".monaco-editor")) {
        goToDebugStep(currentDebugIndex + 1);
      } else if (e.key === "ArrowLeft" && !e.target.closest(".monaco-editor")) {
        goToDebugStep(currentDebugIndex - 1);
      }
    }
    // Shift+Alt+F or Ctrl+Alt+L
    if ((e.shiftKey && e.altKey && e.code === "KeyF") || (e.ctrlKey && e.altKey && e.code === "KeyL")) {
      if (workspaceView.classList.contains("active")) {
        e.preventDefault();
        formatIdeCode();
      }
    }
  });
}

// Format Python Code in IDE
async function formatIdeCode() {
  if (!monacoEditor) return;
  const code = monacoEditor.getValue();
  if (!code.trim()) return;

  if (!pyodideInstance) {
    await initPyodide();
    if (!pyodideInstance) {
      alert("Pyodide еще загружается, подождите секунду.");
      return;
    }
  }

  const origBtnText = formatCodeBtn ? formatCodeBtn.innerHTML : "";
  if (formatCodeBtn) {
    formatCodeBtn.innerHTML = "<span>⏳</span> Форматирование...";
    formatCodeBtn.disabled = true;
  }

  try {
    pyodideInstance.globals.set("__raw_code__", code);

    const formatScript = `
import autopep8

__formatted_result__ = ""
__format_error__ = ""

try:
    __formatted_result__ = autopep8.fix_code(__raw_code__)
except Exception as e:
    __format_error__ = str(e)
`;

    await pyodideInstance.runPythonAsync(formatScript);
    const formatError = pyodideInstance.globals.get("__format_error__");
    const formattedResult = pyodideInstance.globals.get("__formatted_result__");

    if (formatError) {
      terminalBody.classList.remove("empty");
      terminalBody.innerHTML = `<span class="term-error">⚠️ Ошибка форматирования:\n${escapeHtml(formatError)}</span>`;
      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else if (formattedResult) {
      const position = monacoEditor.getPosition();
      const scrollTop = monacoEditor.getScrollTop();
      monacoEditor.setValue(formattedResult);
      if (position) monacoEditor.setPosition(position);
      monacoEditor.setScrollTop(scrollTop);
    }
  } catch (err) {
    console.error("Format error:", err);
  } finally {
    if (formatCodeBtn) {
      formatCodeBtn.innerHTML = origBtnText;
      formatCodeBtn.disabled = false;
    }
  }
}

// Vertical Resizer for Output Terminal
function initTerminalResizer() {
  const terminalPane = document.getElementById("ideTerminalPane") || document.querySelector(".ide-terminal-pane");
  const resizer = document.getElementById("terminalResizer") || document.querySelector(".terminal-top");
  const idePane = document.querySelector(".workspace-ide-pane");
  if (!terminalPane || !resizer || !idePane) return;

  let isDragging = false;
  let startY = 0;
  let startHeight = 0;

  const onDragStart = (clientY) => {
    isDragging = true;
    startY = clientY;
    startHeight = terminalPane.getBoundingClientRect().height;

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    terminalPane.classList.add("resizing");
  };

  const onDragMove = (clientY) => {
    if (!isDragging) return;

    const deltaY = startY - clientY;
    const ideHeight = idePane.getBoundingClientRect().height;
    const minHeight = 34; // Allow collapsing down to header
    const maxHeight = Math.max(ideHeight - 80, minHeight);

    const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight);
    terminalPane.style.height = `${newHeight}px`;

    if (monacoEditor) {
      monacoEditor.layout();
    }
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    terminalPane.classList.remove("resizing");

    if (monacoEditor) {
      monacoEditor.layout();
    }
  };

  // Mouse events
  resizer.addEventListener("mousedown", (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    onDragStart(e.clientY);
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      onDragMove(e.clientY);
    }
  });

  document.addEventListener("mouseup", onDragEnd);

  // Touch events (for mobile/tablet support)
  resizer.addEventListener("touchstart", (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    if (e.touches.length === 1) {
      onDragStart(e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
      onDragMove(e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener("touchend", onDragEnd);
}

// Step-by-Step Python Visualizer & Debugger
async function runStepByStepDebug() {
  if (!monacoEditor) return;
  const code = monacoEditor.getValue().trim();
  if (!code) return;

  if (!pyodideInstance) {
    await initPyodide();
    if (!pyodideInstance) {
      alert("Pyodide еще загружается, подождите секунду.");
      return;
    }
  }

  stepDebugBtn.disabled = true;
  stepDebugBtn.innerHTML = "<span>⏳</span> Анализ...";

  try {
    pyodideInstance.globals.set("__debug_code__", code);

    const traceScript = `
import sys
import io
import json
import types

def __trace_exec__(code_str, max_steps=500):
    steps = []
    stdout_buf = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = stdout_buf

    def safe_repr(val):
        try:
            r = repr(val)
            if len(r) > 100:
                r = r[:97] + "..."
            return r
        except:
            return "<non-repr>"

    def capture_vars(frame_dict):
        res = {}
        for k, v in frame_dict.items():
            if k.startswith("__") and k.endswith("__"):
                continue
            if isinstance(v, (types.ModuleType, types.FunctionType, types.BuiltinFunctionType)):
                continue
            t_name = type(v).__name__
            val_str = safe_repr(v)
            val_category = "other"
            if isinstance(v, (int, float)):
                val_category = "number"
            elif isinstance(v, str):
                val_category = "string"
            elif isinstance(v, bool):
                val_category = "bool"

            res[k] = {
                "type": t_name,
                "value": val_str,
                "category": val_category
            }
        return res

    def tracer(frame, event, arg):
        if len(steps) >= max_steps:
            return None
        if frame.f_code.co_filename != "main.py":
            return tracer

        step_data = {
            "line": frame.f_lineno,
            "event": event,
            "func": frame.f_code.co_name,
            "locals": capture_vars(frame.f_locals),
            "globals": capture_vars(frame.f_globals),
            "stdout": stdout_buf.getvalue(),
            "exception": None,
            "return_value": None
        }

        if event == "exception" and arg:
            exc_type, exc_val, _ = arg
            step_data["exception"] = f"{exc_type.__name__}: {exc_val}"
        elif event == "return":
            step_data["return_value"] = safe_repr(arg)

        steps.append(step_data)
        return tracer

    try:
        compiled = compile(code_str, "main.py", "exec")
        sys.settrace(tracer)
        exec_globals = {"__name__": "__main__"}
        exec(compiled, exec_globals)
    except Exception as e:
        steps.append({
            "line": getattr(e, "lineno", (steps[-1]["line"] if steps else 1)),
            "event": "exception",
            "func": "<module>",
            "locals": {},
            "globals": {},
            "stdout": stdout_buf.getvalue(),
            "exception": f"{type(e).__name__}: {e}",
            "return_value": None
        })
    finally:
        sys.settrace(None)
        sys.stdout = old_stdout

    return json.dumps(steps)

__debug_steps_json__ = __trace_exec__(__debug_code__)
`;

    await pyodideInstance.runPythonAsync(traceScript);
    const stepsJson = pyodideInstance.globals.get("__debug_steps_json__");
    debugSteps = JSON.parse(stepsJson);

    if (!debugSteps || debugSteps.length === 0) {
      alert("Не удалось записать шаги выполнения.");
      return;
    }

    // Activate Debug UI
    isDebugActive = true;
    terminalBody.style.display = "none";
    debugViewBody.style.display = "flex";
    debugControls.style.display = "flex";
    terminalTitleText.textContent = "ДЕБАГГЕР (ПОШАГОВОЕ ВЫПОЛНЕНИЕ)";
    clearTermBtn.style.display = "none";

    goToDebugStep(0);
  } catch (err) {
    console.error("Debug trace error:", err);
    alert(`Ошибка запуска дебаггера: ${err.message || err}`);
  } finally {
    stepDebugBtn.disabled = false;
    stepDebugBtn.innerHTML = "<span>👣</span> По шагам";
  }
}

function goToDebugStep(index) {
  if (!debugSteps || debugSteps.length === 0) return;
  currentDebugIndex = Math.max(0, Math.min(index, debugSteps.length - 1));

  const step = debugSteps[currentDebugIndex];
  const total = debugSteps.length;

  // Update navigation buttons
  debugStepInfo.textContent = `Шаг ${currentDebugIndex + 1} из ${total}`;
  debugFirstBtn.disabled = currentDebugIndex === 0;
  debugPrevBtn.disabled = currentDebugIndex === 0;
  debugNextBtn.disabled = currentDebugIndex === total - 1;
  debugLastBtn.disabled = currentDebugIndex === total - 1;

  // Highlight active line in Monaco Editor
  if (monacoEditor) {
    debugDecorations = monacoEditor.deltaDecorations(debugDecorations, [
      {
        range: new monaco.Range(step.line, 1, step.line, 1),
        options: {
          isWholeLine: true,
          className: "monaco-debug-active-line",
          glyphMarginClassName: "monaco-debug-active-glyph"
        }
      }
    ]);
    monacoEditor.revealLineInCenter(step.line);
  }

  // Update Event Banner
  if (step.exception) {
    debugEventIcon.textContent = "❌";
    debugEventText.innerHTML = `<span style="color: #f87171;">Ошибка на строке ${step.line}: ${escapeHtml(step.exception)}</span>`;
  } else if (step.event === "call") {
    debugEventIcon.textContent = "📞";
    debugEventText.textContent = `Вызов функции ${step.func}() (строка ${step.line})`;
  } else if (step.event === "return") {
    debugEventIcon.textContent = "↩️";
    debugEventText.textContent = `Возврат из функции ${step.func} -> ${step.return_value} (строка ${step.line})`;
  } else {
    debugEventIcon.textContent = "📍";
    debugEventText.textContent = `Строка ${step.line} (${step.func === "<module>" ? "Основной код" : "Функция " + step.func})`;
  }

  // Update Scope and Variables
  const isFunctionScope = step.func && step.func !== "<module>";
  debugScopeBadge.textContent = isFunctionScope ? `Функция: ${step.func}()` : "Глобальная область";

  const varsToShow = isFunctionScope && Object.keys(step.locals).length > 0 ? step.locals : step.globals;
  renderDebugVariables(varsToShow);

  // Update stdout output
  debugOutputText.textContent = step.stdout || "(Вывода пока нет)";
}

function renderDebugVariables(varsObj) {
  debugVarsContainer.innerHTML = "";
  const keys = Object.keys(varsObj || {});

  if (keys.length === 0) {
    debugVarsContainer.innerHTML = `<div class="empty-vars-hint">На этом шаге пользовательских переменных нет</div>`;
    return;
  }

  keys.forEach((key) => {
    const item = varsObj[key];
    const card = document.createElement("div");
    card.className = "var-card";
    card.innerHTML = `
      <div class="var-left">
        <span class="var-name">${escapeHtml(key)}</span>
        <span class="var-type">: ${escapeHtml(item.type)}</span>
      </div>
      <div class="var-val ${escapeHtml(item.category)}">${escapeHtml(item.value)}</div>
    `;
    debugVarsContainer.appendChild(card);
  });
}

function exitDebugMode() {
  isDebugActive = false;
  debugSteps = [];
  currentDebugIndex = 0;

  if (monacoEditor && debugDecorations.length) {
    debugDecorations = monacoEditor.deltaDecorations(debugDecorations, []);
  }

  debugViewBody.style.display = "none";
  debugControls.style.display = "none";
  terminalBody.style.display = "block";
  terminalTitleText.textContent = "ТЕРМИНАЛ ВЫВОДА (STDOUT / STDERR)";
  clearTermBtn.style.display = "inline-block";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ===================================================
// COMMAND PALETTE / SMART METHOD & CODE SEARCH ENGINE
// ===================================================
let searchIndex = [];

function extractMethodTokens(text) {
  // Extract identifiers like .sort, append, re.findall, strftime, etc.
  const tokens = [];
  const matches = text.match(/\b([a-zA-Z_][a-zA-Z0-9_.]*)\b/g) || [];
  const stopWords = new Set([
    "a", "b", "c", "d", "e", "f", "x", "y", "z", "n", "t", "s", "k", "v",
    "the", "in", "is", "not", "and", "or", "to", "for", "of", "items", "obj",
    "value", "values", "val", "key", "keys", "func", "statement", "iterable",
    "start", "stop", "step", "index", "data"
  ]);

  matches.forEach(m => {
    const clean = m.replace(/^\.+|\.+$/g, "");
    if (clean.length >= 3 && !stopWords.has(clean.toLowerCase())) {
      tokens.push(clean);
      // If token is obj.method (e.g. items.sort), also add the method name alone (sort)
      if (clean.includes(".")) {
        const parts = clean.split(".");
        const methodName = parts[parts.length - 1];
        if (methodName.length >= 3 && !stopWords.has(methodName.toLowerCase())) {
          tokens.push(methodName);
        }
      }
    }
  });

  return Array.from(new Set(tokens));
}

function findBestExampleForTokens(topic, tokens) {
  if (!topic.examples || topic.examples.length === 0) return 0;
  if (!tokens || tokens.length === 0) return 0;

  let bestIndex = 0;
  let highestScore = -1;

  topic.examples.forEach((ex, idx) => {
    let score = 0;
    const codeLower = ex.code.toLowerCase();
    const titleLower = ex.title.toLowerCase();
    const descLower = (ex.desc || "").toLowerCase();

    tokens.forEach(tok => {
      const t = tok.toLowerCase();
      // Match in code
      if (codeLower.includes(t)) score += 10;
      // Match in title
      if (titleLower.includes(t)) score += 15;
      // Match in description
      if (descLower.includes(t)) score += 5;
    });

    if (score > highestScore) {
      highestScore = score;
      bestIndex = idx;
    }
  });

  return bestIndex;
}

function buildSearchIndex() {
  searchIndex = [];

  TOPICS.forEach((topic) => {
    // 1. Topic entry (points to its first example by default, or best matching)
    searchIndex.push({
      type: "topic",
      badge: topic.category,
      badgeType: "category",
      title: `${topic.icon} ${topic.title}`,
      desc: topic.summary.slice(0, 3).join(" • "),
      topicId: topic.id,
      code: topic.examples.length > 0 ? topic.examples[0].code : "",
      exampleIndex: 0,
      keywords: `${topic.title} ${topic.category} ${topic.summary.join(" ")}`.toLowerCase()
    });

    // 2. Summary items (individual methods and syntax rules)
    topic.summary.forEach((sumItem) => {
      const tokens = extractMethodTokens(sumItem);
      const matchedExIdx = findBestExampleForTokens(topic, tokens);
      const targetEx = topic.examples[matchedExIdx] || topic.examples[0] || { code: "" };
      const keywords = `${topic.title} ${topic.category} ${sumItem} ${tokens.join(" ")}`.toLowerCase();

      searchIndex.push({
        type: "method",
        badge: "Метод / Синтаксис",
        badgeType: "method",
        title: sumItem,
        desc: `Раздел: ${topic.title} (Пример #${matchedExIdx + 1}: ${targetEx.title || ""})`,
        topicId: topic.id,
        code: targetEx.code,
        exampleIndex: matchedExIdx,
        keywords: keywords
      });
    });

    // 3. Code examples (direct snippet search)
    topic.examples.forEach((ex, exIdx) => {
      searchIndex.push({
        type: "example",
        badge: `Пример #${exIdx + 1}`,
        badgeType: "code",
        title: ex.title,
        desc: ex.desc || `Тема: «${topic.title}»`,
        codePreview: ex.code.split("\n").slice(0, 2).join(" | "),
        code: ex.code,
        topicId: topic.id,
        exampleIndex: exIdx,
        keywords: `${topic.title} ${ex.title} ${ex.desc || ""} ${ex.code}`.toLowerCase()
      });
    });
  });
}

function initSearchPalette() {
  buildSearchIndex();

  if (globalSearchBtn) {
    globalSearchBtn.addEventListener("click", openSearchPalette);
  }

  if (paletteSearchInput) {
    paletteSearchInput.addEventListener("input", (e) => {
      performPaletteSearch(e.target.value);
    });

    paletteSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigatePaletteResults(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigatePaletteResults(-1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        selectPaletteResult(activePaletteIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSearchPalette();
      }
    });
  }

  if (searchPaletteModal) {
    searchPaletteModal.addEventListener("click", (e) => {
      if (e.target === searchPaletteModal) {
        closeSearchPalette();
      }
    });
  }

  // Global hotkey: Ctrl+K or / (when not typing in an input/textarea/editor)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (searchPaletteModal.style.display === "flex") {
        closeSearchPalette();
      } else {
        openSearchPalette();
      }
    } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && !document.activeElement.closest(".monaco-editor")) {
      e.preventDefault();
      openSearchPalette();
    }
  });
}

function openSearchPalette() {
  if (!searchPaletteModal || !paletteSearchInput) return;
  searchPaletteModal.style.display = "flex";
  paletteSearchInput.value = "";
  performPaletteSearch("");
  setTimeout(() => paletteSearchInput.focus(), 50);
}

function closeSearchPalette() {
  if (!searchPaletteModal) return;
  searchPaletteModal.style.display = "none";
  paletteResults = [];
  activePaletteIndex = 0;
}

function performPaletteSearch(query) {
  const q = query.toLowerCase().trim();

  if (!q) {
    // Show top curated topics & methods by default
    paletteResults = searchIndex.slice(0, 15);
  } else {
    // Search with priority scoring
    const scoredResults = [];

    searchIndex.forEach((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const codeLower = (item.code || "").toLowerCase();
      const keywordsLower = item.keywords || "";

      // 1. Direct match in title
      if (titleLower.startsWith(q)) {
        score += 120;
      } else if (titleLower.includes(q)) {
        score += 80;
      }

      // 2. Direct match in code
      if (codeLower.includes(q)) {
        score += 50;
      }

      // 3. Match in keywords/summary
      if (keywordsLower.includes(q)) {
        score += 25;
      }

      // Give extra boost to direct code examples and exact method lines
      if (item.type === "example" && (titleLower.includes(q) || codeLower.includes(q))) {
        score += 30;
      }

      if (score > 0) {
        scoredResults.push({ ...item, score });
      }
    });

    // Sort by score descending
    scoredResults.sort((a, b) => b.score - a.score);
    paletteResults = scoredResults.slice(0, 25);
  }

  activePaletteIndex = 0;
  renderPaletteResults(q);
}

function highlightQuery(text, query) {
  if (!query || !text) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return escaped.replace(regex, '<span class="search-match-highlight">$1</span>');
}

function renderPaletteResults(query = "") {
  if (!paletteResultsList) return;
  paletteResultsList.innerHTML = "";

  if (paletteResults.length === 0) {
    paletteResultsList.innerHTML = `
      <div class="search-palette-empty">
        По запросу «<strong>${escapeHtml(query)}</strong>» ничего не найдено.<br>
        Попробуйте ввести <code>.append</code>, <code>sort</code>, <code>f-string</code>, <code>try-except</code>...
      </div>
    `;
    return;
  }

  paletteResults.forEach((res, idx) => {
    const itemEl = document.createElement("div");
    itemEl.className = `palette-result-item ${idx === activePaletteIndex ? "active" : ""}`;
    itemEl.dataset.index = idx;

    const badgeClass = res.badgeType === "method" ? "palette-result-badge method" : "palette-result-badge";

    let codePreviewHtml = "";
    if (res.codePreview) {
      codePreviewHtml = `<div class="palette-result-code">${highlightQuery(res.codePreview, query)}</div>`;
    }

    itemEl.innerHTML = `
      <div class="palette-result-head">
        <div class="palette-result-title">
          <span>${highlightQuery(res.title, query)}</span>
        </div>
        <span class="${badgeClass}">${escapeHtml(res.badge)}</span>
      </div>
      <div class="palette-result-desc">${highlightQuery(res.desc, query)}</div>
      ${codePreviewHtml}
    `;

    itemEl.addEventListener("mouseenter", () => {
      activePaletteIndex = idx;
      updateActivePaletteItem();
    });

    itemEl.addEventListener("click", () => {
      selectPaletteResult(idx);
    });

    paletteResultsList.appendChild(itemEl);
  });
}

function navigatePaletteResults(direction) {
  if (paletteResults.length === 0) return;
  activePaletteIndex = (activePaletteIndex + direction + paletteResults.length) % paletteResults.length;
  updateActivePaletteItem();

  // Scroll active item into view
  const activeEl = paletteResultsList.querySelector(`.palette-result-item[data-index="${activePaletteIndex}"]`);
  if (activeEl) {
    activeEl.scrollIntoView({ block: "nearest" });
  }
}

function updateActivePaletteItem() {
  const items = paletteResultsList.querySelectorAll(".palette-result-item");
  items.forEach((el, idx) => {
    el.classList.toggle("active", idx === activePaletteIndex);
  });
}

function selectPaletteResult(index) {
  const result = paletteResults[index];
  if (!result) return;

  const currentQuery = paletteSearchInput ? paletteSearchInput.value.trim().toLowerCase() : "";
  const topic = TOPICS.find(t => t.id === result.topicId);

  let targetExampleIndex = result.exampleIndex;
  let targetCode = result.code;

  // If a topic card was clicked, dynamically find the best example matching the current query
  if (result.type === "topic" && topic && currentQuery) {
    const bestIdx = findBestExampleForTokens(topic, [currentQuery]);
    if (bestIdx >= 0 && topic.examples[bestIdx]) {
      targetExampleIndex = bestIdx;
      targetCode = topic.examples[bestIdx].code;
    }
  }

  closeSearchPalette();

  // 1. Open Workspace Topic
  openTopicWorkspace(result.topicId);

  // 2. Load the exact matching code into CodeMirror IDE
  if (targetCode) {
    loadCodeIntoIde(targetCode);
  }

  // 3. Smoothly scroll to the target snippet card and trigger pulse highlight
  setTimeout(() => {
    const snippetCards = document.querySelectorAll(".snippet-runner-card");
    const targetCard = snippetCards[targetExampleIndex] || snippetCards[0];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      targetCard.classList.remove("snippet-jump-pulse");
      // Trigger reflow to restart CSS animation
      void targetCard.offsetWidth;
      targetCard.classList.add("snippet-jump-pulse");
    }
  }, 120);
}

