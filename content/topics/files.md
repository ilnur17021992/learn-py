---
id: "files"
title: "РАБОТА С ФАЙЛАМИ"
category: "Ввод-вывод"
icon: "📁"
summary:
  - "Чтение: with open('file.txt', 'r', encoding='utf-8') as f:\n    data = f.read()"
  - "Запись: with open('file.txt', 'w', encoding='utf-8') as f:\n    f.write('текст')"
  - "Чтение строк: f.readlines()"
  - "Запись строк: f.writelines(lines)"
  - "Режимы: 'r' — чтение, 'w' — запись, 'a' — добавление, 'x' — создание"
  - "Добавьте 'b' для бинарного режима, 't' — для текстового (по умолчанию)"
---

## Теория

<h3>Режимы открытия файлов:</h3>
      <table class="theory-table">
        <thead><tr><th>Режим</th><th>Назначение</th><th>Поведение</th></tr></thead>
        <tbody>
          <tr><td><code>'r'</code></td><td>Чтение (по умолчанию)</td><td>Ошибка, если файл не существует.</td></tr>
          <tr><td><code>'w'</code></td><td>Перезапись</td><td>Создаёт новый или перезаписывает существующий файл.</td></tr>
          <tr><td><code>'a'</code></td><td>Дозапись (append)</td><td>Добавляет новые данные в конец файла.</td></tr>
          <tr><td><code>'x'</code></td><td>Эксклюзивное создание</td><td>Ошибка <code>FileExistsError</code>, если файл уже есть.</td></tr>
          <tr><td><code>'b' / 't'</code></td><td>Бинарный / Текстовый</td><td><code>'rb'</code>, <code>'wb'</code> для работы с байтами (изображения, zip).</td></tr>
        </tbody>
      </table>


## Примеры кода

### Запись и чтение файла через with open (read, write)

Запись текста и чтение содержимого файла с кодировкой UTF-8.

```python
# Запись в файл в виртуальной файловой системе Pyodide
with open("test_file.txt", "w", encoding="utf-8") as file:
    file.write("Первая строка: Python 3.12\n")
    file.write("Вторая строка: Файловые операции\n")

# Чтение файла целиком
with open("test_file.txt", "r", encoding="utf-8") as file:
    content = file.read()

print("Прочитано из файла:")
print(content)
```

### Построчное чтение и запись: readlines() и writelines()

Чтение файла в список строк и запись списка строк обратно.

```python
lines_to_write = [
    "Сервер запущен\n",
    "Подключение к БД успешно\n",
    "Готов к приему запросов\n"
]

with open("log.txt", "w", encoding="utf-8") as f:
    f.writelines(lines_to_write)

with open("log.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Всего прочитано строк: {len(lines)}")
for i, line in enumerate(lines, 1):
    print(f"Строка #{i}: {line.strip()}")
```

### Дозапись в файл (режим 'a') и бинарный режим 'wb' / 'rb'

Режим добавления 'a' и работа с байтами 'rb'/'wb'.

```python
# Дозапись в конец существующего файла
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Новое событие: клиент подключен\n")

# Бинарная запись байтов
with open("data.bin", "wb") as f:
    f.write(b"\x00\xFF\xFE\xFD\x01\x02")

with open("data.bin", "rb") as f:
    binary_data = f.read()

print("Прочитанные байты:", binary_data)
```
