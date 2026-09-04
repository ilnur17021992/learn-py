---
id: "regex"
title: "РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ"
category: "Работа с текстом"
icon: "🔍"
summary:
  - "Поиск: re.search(r'\\d+', text)"
  - "Совпадение: re.match(r'Hello', text)"
  - "Найти все: re.findall(r'\\w+', text)"
  - "Замена: re.sub(r'\\d+', 'x', text)"
  - "Шаблоны: \\d цифра   \\w слово   \\s пробел"
  - ". любой символ   ^ начало   $ конец"
---

## Теория

<h3>Модуль re:</h3>
      <table class="theory-table">
        <thead><tr><th>Функция</th><th>Назначение</th></tr></thead>
        <tbody>
          <tr><td><code>re.search(pattern, text)</code></td><td>Ищет первое совпадение в любом месте строки.</td></tr>
          <tr><td><code>re.match(pattern, text)</code></td><td>Проверяет совпадение строго с <strong>начала</strong> строки.</td></tr>
          <tr><td><code>re.findall(pattern, text)</code></td><td>Возвращает список всех найденных непересекающихся совпадений.</td></tr>
          <tr><td><code>re.sub(pattern, repl, text)</code></td><td>Заменяет найденные совпадения на строку <code>repl</code>.</td></tr>
        </tbody>
      </table>


## Примеры кода

### Поиск и извлечение данных: re.findall() и re.search()

Поиск всех email-адресов и телефонов в тексте.

```python
import re

log_entry = "Пользователь user_test@mail.ru оформил заказ №8942 на сумму 15400 руб. Телефон: +7-999-123-45-67."

# re.findall: список всех совпадений
emails = re.findall(r'[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}', log_entry)
numbers = re.findall(r'\d+', log_entry)

print("Найденные email (findall):", emails)
print("Найденные числа (findall):", numbers)

# re.search: первое совпадение с объектом Match
match = re.search(r'№(\d+)', log_entry)
if match:
    print(f"Номер заказа (search group): {match.group(1)}")
```

### Проверка начала строки (re.match) и замена (re.sub)

Проверка формата строки с начала и замена конфиденциальных данных.

```python
import re

# 1. re.match — строго с начала строки
url1 = "https://example.com"
url2 = "www.example.com"

print("url1 начинается с https://?", bool(re.match(r'^https://', url1)))
print("url2 начинается с https://?", bool(re.match(r'^https://', url2)))

# 2. re.sub — замена по регулярному выражению
card_info = "Карта клиента: 4276-5500-1234-5678"
masked_card = re.sub(r'\d{4}-\d{4}-\d{4}-(\d{4})', r'****-****-****-\1', card_info)
print("Маскированная карта (re.sub):", masked_card)
```
