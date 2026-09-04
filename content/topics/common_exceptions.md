---
id: "common_exceptions"
title: "ЧАСТЫЕ ИСКЛЮЧЕНИЯ"
category: "Ошибки"
icon: "⚠️"
summary:
  - "ValueError           → TypeError"
  - "IndexError           → KeyError"
  - "AttributeError       → NameError"
  - "FileNotFoundError    → ZeroDivisionError"
  - "ImportError          → ModuleNotFoundError"
  - "RuntimeError         → Exception (базовый класс)"
---

## Теория

<h3>Иерархия стандартных исключений:</h3>
      <ul>
        <li><code>TypeError</code> — операция к неподходящему типу (например, сложение <code>"5" + 5</code>).</li>
        <li><code>ValueError</code> — тип верный, но неподходящее значение (например, <code>int("abc")</code>).</li>
        <li><code>IndexError</code> — обращение по несуществующему индексу списка.</li>
        <li><code>KeyError</code> — обращение по отсутствующему ключу словаря.</li>
        <li><code>AttributeError</code> — обращение к несуществующему методу или полю объекта.</li>
        <li><code>NameError</code> — обращение к необъявленной переменной.</li>
        <li><code>FileNotFoundError</code> — файл не найден по указанному пути.</li>
        <li><code>ZeroDivisionError</code> — деление на 0.</li>
      </ul>


## Примеры кода

### Демонстрация TypeError, ValueError, KeyError, IndexError

Примеры возникновения и перехвата типичных ошибок.

```python
# 1. TypeError
try:
    res = "Сумма: " + 100
except TypeError as e:
    print(f"❌ Перехвачен TypeError: {e}")

# 2. ValueError
try:
    num = int("не число")
except ValueError as e:
    print(f"❌ Перехвачен ValueError: {e}")

# 3. KeyError
data = {"a": 1}
try:
    val = data["b"]
except KeyError as e:
    print(f"❌ Перехвачен KeyError (нет ключа): {e}")

# 4. IndexError
items = [1, 2, 3]
try:
    elem = items[10]
except IndexError as e:
    print(f"❌ Перехвачен IndexError: {e}")
```

### Демонстрация AttributeError, NameError, ZeroDivisionError

Перехват ошибок доступа к атрибутам, переменным и деления.

```python
# 1. AttributeError
number = 42
try:
    number.append(10) # У int нет метода append
except AttributeError as e:
    print(f"❌ Перехвачен AttributeError: {e}")

# 2. ZeroDivisionError
try:
    bad_math = 100 / 0
except ZeroDivisionError as e:
    print(f"❌ Перехвачен ZeroDivisionError: {e}")

# 3. NameError
try:
    print(undefined_variable)
except NameError as e:
    print(f"❌ Перехвачен NameError: {e}")
```
