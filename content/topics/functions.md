---
id: "functions"
title: "ФУНКЦИИ"
category: "Управление потоком"
icon: "⚙️"
summary:
  - "Определение: def func(a, b=0, *args, **kwargs):\n    \"\"\"Докстрока\"\"\"\n    return значение"
  - "Аргументы по умолчанию: b=0"
  - "Только именованные: def func(a, *, b):"
  - "Аннотации типов: def add(a: int, b: int) -> int:"
  - "Лямбды: sq = lambda x: x ** 2"
  - "map(fn, it)   filter(fn, it)   sorted(it, key=fn)"
---

## Теория

<h3>Функции в Python:</h3>
      <p>Функции являются объектами первого класса (First-Class Objects): их можно передавать в другие функции как аргументы, сохранять в переменные и возвращать из функций.</p>

      <h3>Параметры и аргументы:</h3>
      <ul>
        <li><code>*args</code> — собирает произвольное количество позиционных аргументов в <code>tuple</code>.</li>
        <li><code>**kwargs</code> — собирает произвольное количество именованных аргументов в <code>dict</code>.</li>
        <li><code>def fn(a, *, b):</code> — символ <code>*</code> требует передавать аргумент <code>b</code> строго по имени.</li>
        <li><code>lambda x: x * 2</code> — анонимные однострочные функции.</li>
      </ul>


## Примеры кода

### Позиционные, именованные аргументы, *args и **kwargs

Универсальные функции, принимающие произвольное число параметров.

```python
def build_profile(user_id, *roles, status="active", **details):
    print(f"Пользователь #{user_id} [Статус: {status}]")
    print(f"Роли (*args): {roles}")
    print(f"Доп. атрибуты (**kwargs): {details}")

build_profile(101, "admin", "developer", status="verified", city="Москва", exp_years=5)
```

### Только именованные аргументы и аннотации типов

Синтаксис def fn(a, *, b) и указание типов аргументов и результата.

```python
def calculate_tax(amount: float, *, tax_rate: float = 0.20) -> float:
    """Вычисляет сумму налога по фиксированной ставке."""
    return amount * tax_rate

# tax_rate ОБЯЗАТЕЛЬНО передавать по имени из-за символа *
result = calculate_tax(50000.0, tax_rate=0.13)
print(f"Сумма налога (13%): {result:.2f} руб.")
```

### Лямбда-функции, map(), filter() и sorted(key=fn)

Анонимные функции в сочетании с map, filter и кастомной сортировкой.

```python
people = [
    {"name": "Илья", "age": 28},
    {"name": "Ольга", "age": 22},
    {"name": "Сергей", "age": 35}
]

# Сортировка по возрасту с помощью lambda
sorted_people = sorted(people, key=lambda p: p["age"])
print("Сортировка по возрасту:", sorted_people)

# Фильтрация и отображение
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
squares = list(map(lambda x: x ** 2, evens))
print("Четные:", evens)
print("Квадраты четных (map):", squares)
```
