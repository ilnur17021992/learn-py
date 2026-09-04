---
id: "venv"
title: "ВИРТУАЛЬНОЕ ОКРУЖЕНИЕ И ПАКЕТЫ"
category: "Инструменты"
icon: "🌐"
summary:
  - "Создать venv: python -m venv .venv"
  - "Активация (Windows): .venv\\Scripts\\activate"
  - "Активация (macOS/Linux): source .venv/bin/activate"
  - "Деактивация: deactivate"
  - "Установка: python -m pip install package"
  - "Обновление: python -m pip install --upgrade package"
  - "Удаление: python -m pip uninstall package"
  - "Зафиксировать зависимости: pip freeze > requirements.txt"
---

## Теория

<h3>Виртуальное окружение venv и менеджер pip:</h3>
      <p>Виртуальное окружение изолирует библиотеки конкретного проекта от глобальной системы и предотвращает конфликты версий.</p>

      <h3>Основные команды терминала:</h3>
      <ul>
        <li><code>python -m venv .venv</code> — создание окружения в папке <code>.venv</code>.</li>
        <li><code>source .venv/bin/activate</code> (Linux/macOS) или <code>.venv\Scripts\activate</code> (Windows) — активация окружения.</li>
        <li><code>python -m pip install package_name</code> — установка пакета.</li>
        <li><code>pip freeze > requirements.txt</code> — сохранение точного списка всех зависимостей проекта.</li>
      </ul>


## Примеры кода

### Исследование путей и окружения sys.executable / sys.path

Проверка активного интерпретатора и путей импорта модулей.

```python
import sys

print("Версия Python:", sys.version.split()[0])
print("Исполняемый файл интерпретатора:", sys.executable)
print("\nПервые 3 пути поиска модулей (sys.path):")
for path in sys.path[:3]:
    print(" •", path)
```

### Парсинг и генерация requirements.txt

Программная обработка формата зависимостей requirements.txt.

```python
raw_requirements = """
requests==2.31.0
fastapi>=0.110.0
pytest>=8.0.0
"""

# Парсинг зависимостей
packages = {}
for line in raw_requirements.strip().splitlines():
    if "==" in line:
        pkg, ver = line.split("==")
        packages[pkg] = ("==", ver)
    elif ">=" in line:
        pkg, ver = line.split(">=")
        packages[pkg] = (">=", ver)

print("Распарсенные пакеты из requirements.txt:")
for pkg, (op, ver) in packages.items():
    print(f"📦 Пакет: {pkg:<10} Требование: {op} {ver}")
```
