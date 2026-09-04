---
id: "comprehensions"
title: "ГЕНЕРАТОРЫ ВКЛЮЧЕНИЙ"
category: "Синтаксис"
icon: "⚡"
summary:
  - "Список: [x * 2 for x in nums]"
  - "Список с условием: [x for x in nums if x > 0]"
  - "Множество: {x * 2 for x in nums}"
  - "Словарь: {x: x * 2 for x in nums}"
  - "Генератор: (x * 2 for x in nums)"
---

## Теория

<h3>Comprehensions (Генераторы коллекций):</h3>
      <p>Декларативный синтаксис для создания коллекций. Работает на уровне языка быстрее стандартных циклов <code>for</code> с <code>.append()</code>.</p>

      <table class="theory-table">
        <thead><tr><th>Тип</th><th>Синтаксис</th><th>Результат</th></tr></thead>
        <tbody>
          <tr><td>List Comprehension</td><td><code>[x**2 for x in nums]</code></td><td>Список <code>list</code></td></tr>
          <tr><td>Set Comprehension</td><td><code>{x**2 for x in nums}</code></td><td>Множество <code>set</code> (уникальные)</td></tr>
          <tr><td>Dict Comprehension</td><td><code>{x: x**2 for x in nums}</code></td><td>Словарь <code>dict</code> (ключ-значение)</td></tr>
          <tr><td>Generator Expression</td><td><code>(x**2 for x in nums)</code></td><td>Генератор (ленивое вычисление)</td></tr>
        </tbody>
      </table>


## Примеры кода

### List и Set Comprehensions

Создание списков и множеств с фильтрацией if.

```python
numbers = [-4, -2, 0, 1, 2, 3, 2, 4]

# List Comprehension с условием фильтрации
pos_doubles = [n * 2 for n in numbers if n > 0]
print("Удвоенные положительные (List):", pos_doubles)

# Set Comprehension (автоматически убирает дубликаты)
unique_squares = {abs(n) for n in numbers}
print("Уникальные абсолютные значения (Set):", unique_squares)
```

### Dict Comprehension и Generator Expression

Генерация словарей и экономичные генераторы в круглых скобках.

```python
users = ["alex", "elena", "maxim"]

# Dict Comprehension
user_lengths = {u.title(): len(u) for u in users}
print("Словарь длин имен (Dict):", user_lengths)

# Generator Expression (вычисляется лениво, не занимает память)
gen = (x ** 2 for x in range(1, 6))
print("Объект-генератор:", gen)
print("Сумма значений генератора:", sum(gen))
```
