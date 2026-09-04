---
id: "conditions"
title: "УСЛОВИЯ"
category: "Управление потоком"
icon: "🔀"
summary:
  - "if условие:\n    инструкция"
  - "elif условие:\n    инструкция"
  - "else:\n    инструкция"
  - "Тернарный оператор: x if условие else y"
  - "Используйте отступы для блоков"
---

## Теория

<h3>Условные конструкции if-elif-else:</h3>
      <p>В Python любое выражение в условии неявно приводится к <code>bool</code>.</p>

      <h3>Что считается ложным (Falsy values):</h3>
      <ul>
        <li><code>False</code> и <code>None</code></li>
        <li>Числовые нули: <code>0</code>, <code>0.0</code>, <code>0j</code></li>
        <li>Пустые последовательности и коллекции: <code>""</code>, <code>[]</code>, <code>()</code>, <code>{}</code>, <code>set()</code></li>
      </ul>


## Примеры кода

### Ветвление if - elif - else

Классическая многоуровневая проверка условий.

```python
score = 82

if score >= 90:
    grade = "Отлично (A)"
elif score >= 75:
    grade = "Хорошо (B)"
elif score >= 60:
    grade = "Удовлетворительно (C)"
else:
    grade = "Неудовлетворительно (F)"

print(f"Балл: {score}, Результат: {grade}")
```

### Тернарный условный оператор

Компактная однострочная форма: x if condition else y.

```python
user_role = "admin"
access = "Полный доступ разрешён" if user_role == "admin" else "Ограниченный доступ"
print("Статус доступа:", access)

age = 17
can_enter = "Вход разрешен" if age >= 18 else "Вход только с родителями"
print("Возрастной контроль:", can_enter)
```

### Проверка на Falsy-значения

Идиоматическая проверка непустых списков и строк.

```python
user_input = ""
notifications = []

# Идиоматично: if not items вместо len(items) == 0
if not user_input:
    print("Строка ввода пуста")

if not notifications:
    print("Новых уведомлений нет")
```
