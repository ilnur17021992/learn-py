---
id: "strings"
title: "СТРОКИ"
category: "Синтаксис"
icon: "🔤"
summary:
  - "'одинарные' или \"двойные\" кавычки"
  - "Многострочная: \"\"\"текст\"\"\""
  - "len(text)   text[0]   text[-1]"
  - "text[start:stop:step]   text[::-1] обратный порядок"
  - "text.upper()   text.lower()   text.title()"
  - "text.strip()   text.replace(a, b)"
  - "text.split(sep)   sep.join(items)"
  - "text.startswith(x)   text.endswith(x)"
  - "f\"Привет, {name}\"   f\"{price:.2f}\""
  - "'Python' in text   text.find('Py')"
  - "text.count('a')"
---

## Теория

<h3>Методы строк:</h3>
      <p>Строки (<code>str</code>) в Python <strong>неизменяемы</strong>. Любой строковый метод возвращает новую строку, оставляя исходную без изменений.</p>

      <table class="theory-table">
        <thead><tr><th>Метод / Операция</th><th>Описание</th><th>Пример</th></tr></thead>
        <tbody>
          <tr><td><code>.upper() / .lower() / .title()</code></td><td>Изменение регистра символов.</td><td><code>"py".upper() -> "PY"</code></td></tr>
          <tr><td><code>.strip() / .lstrip() / .rstrip()</code></td><td>Удаление пробельных символов с краев.</td><td><code>" hi ".strip() -> "hi"</code></td></tr>
          <tr><td><code>.split(sep) / sep.join(list)</code></td><td>Разбиение строки на список и сборка обратно.</td><td><code>",".join(["a","b"])</code></td></tr>
          <tr><td><code>.startswith() / .endswith()</code></td><td>Проверка префикса или суффикса строки.</td><td><code>"file.py".endswith(".py")</code></td></tr>
          <tr><td><code>.find() / .count() / in</code></td><td>Поиск индекса подстроки, подсчёт вхождений.</td><td><code>"banana".count("a") -> 3</code></td></tr>
        </tbody>
      </table>


## Примеры кода

### Срезы, индексация и реверс строк

Срезы [start:stop:step], отрицательные индексы и реверс [::-1].

```python
text = "Python Language"

print("Первый символ:", text[0])
print("Последний символ:", text[-1])
print("Срез [0:6]:", text[0:6])
print("Каждый 2-й символ:", text[::2])
print("Реверс строки [::-1]:", text[::-1])
```

### Преобразование регистра и очистка (strip, replace, upper)

Методы upper(), lower(), title(), strip() и replace().

```python
raw_email = "   User.Name@Example.COM   \n"

clean_email = raw_email.strip().lower()
print(f"Исходная строка: {repr(raw_email)}")
print(f"Очищенный email: {clean_email}")

header = "python interactive lab"
print("Title Case:", header.title())
print("Замена символов (replace):", header.replace("python", "Python 3.12"))
```

### Разбиение и объединение: split() и join()

Преобразование строки в список слов и сборка обратно через разделитель.

```python
tags_str = "python, webassembly, coding, tutorial"

# Разбиение по запятой с пробелом
tags_list = tags_str.split(", ")
print("Список тегов (split):", tags_list)

# Сборка через разделитель
joined = " #".join([""] + tags_list)
print("Хэштеги (join):", joined.strip())
```

### Поиск, проверка префиксов и подсчёт (startswith, find, count)

Методы startswith(), endswith(), find(), count() и оператор in.

```python
filename = "report_2026_final.pdf"

print("Начинается с 'report_'?", filename.startswith("report_"))
print("Заканчивается на '.pdf'?", filename.endswith(".pdf"))
print("Индекс вхождения '2026' (find):", filename.find("2026"))
print("Количество букв 'a' (count):", filename.count("a"))
print("Есть ли 'final' в названии?", "final" in filename)
```

### Форматирование: f-строки и спецификаторы чисел

Форматирование денежных сумм, процентов и выравнивание текста.

```python
item = "Ноутбук"
price = 84990.5
discount = 0.15
final_price = price * (1 - discount)

print(f"Товар: {item:<15} | Цена: {price:>10.2f} руб.")
print(f"Скидка: {discount:.0%} | К оплате: {final_price:.2f} руб.")
```
