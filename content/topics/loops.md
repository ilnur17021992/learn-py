---
id: "loops"
title: "ЦИКЛЫ"
category: "Управление потоком"
icon: "🔁"
summary:
  - "Цикл for:\n    for item in iterable:\n        statement"
  - "for c range:\n    for i in range(start, stop, step):\n        statement"
  - "Цикл while:\n    while condition:\n        statement"
  - "break   continue   pass"
  - "enumerate(iterable)   zip(a, b)"
---

## Теория

<h3>Управление циклами:</h3>
      <ul>
        <li><code>range(start, stop, step)</code> — генерирует последовательность чисел с заданным шагом.</li>
        <li><code>enumerate(iterable, start=0)</code> — возвращает пары <code>(индекс, элемент)</code>.</li>
        <li><code>zip(iter1, iter2)</code> — объединяет элементы нескольких коллекций в кортежи.</li>
        <li><code>break</code> — немедленно прерывает цикл.</li>
        <li><code>continue</code> — досрочно переходит к следующей итерации.</li>
        <li><code>pass</code> — пустая инструкция-заглушка.</li>
      </ul>


## Примеры кода

### Цикл for, генератор range() и while

Использование диапазона чисел с шагом и цикла while со счетчиком.

```python
# Цикл for с range(start, stop, step)
print("range с шагом 2:")
for n in range(2, 10, 2):
    print(n, end=" ")
print()

# Цикл while
count = 3
while count > 0:
    print(f"Обратный отсчет: {count}")
    count -= 1
print("Старт!")
```

### Управляющие операторы: break, continue, pass

Пропуск шагов (continue), остановка цикла (break) и заглушка (pass).

```python
for num in range(1, 10):
    if num == 3:
        pass # Заглушка (ничего не делаем)
    if num % 2 == 0:
        continue # Пропустить четные числа
    if num > 7:
        print(f"\nПрерывание на числе {num} (break)")
        break
    print(f"Нечетное: {num}", end="; ")
```

### Вспомогательные функции: enumerate() и zip()

Индексация элементов через enumerate и параллельный обход списков через zip.

```python
names = ["Анна", "Борис", "Светлана"]
roles = ["Frontend", "Backend", "DevOps"]

print("Параллельный обход (zip):")
for name, role in zip(names, roles):
    print(f"Специалист: {name:<10} Роль: {role}")

print("\nНумерация с 1 (enumerate):")
for idx, name in enumerate(names, start=1):
    print(f"#{idx}: {name}")
```
