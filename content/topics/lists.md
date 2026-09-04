---
id: "lists"
title: "СПИСКИ"
category: "Коллекции"
icon: "📋"
summary:
  - "Создание: items = [1, 2, 3]"
  - "Доступ: items[0]   items[-1]   items[1:4]"
  - "Добавление: items.append(x)   items.extend([4, 5])"
  - "Вставка: items.insert(index, x)"
  - "Удалить по значению: items.remove(x)"
  - "Удалить по индексу: items.pop(index)"
  - "Удаление: del items[index]"
  - "items.clear()   items.index(x)   items.count(x)"
  - "items.sort()   items.reverse()"
  - "sorted(items)   reversed(items)"
  - "x in items"
---

## Теория

<h3>Методы списков (List):</h3>
      <p>Список — упорядоченная изменяемая коллекция. Поддерживает быстрый доступ по индексу <code>O(1)</code> и добавление элементов в конец <code>.append()</code> за <code>O(1)</code>.</p>

      <table class="theory-table">
        <thead><tr><th>Метод</th><th>Действие</th><th>Изменяет оригинал?</th></tr></thead>
        <tbody>
          <tr><td><code>.append(x)</code></td><td>Добавляет один элемент <code>x</code> в конец списка.</td><td>Да</td></tr>
          <tr><td><code>.extend(iterable)</code></td><td>Добавляет все элементы из переданной коллекции.</td><td>Да</td></tr>
          <tr><td><code>.insert(idx, x)</code></td><td>Вставляет элемент <code>x</code> по указанному индексу <code>idx</code>.</td><td>Да</td></tr>
          <tr><td><code>.remove(x)</code></td><td>Удаляет первое вхождение элемента со значением <code>x</code>.</td><td>Да</td></tr>
          <tr><td><code>.pop([idx])</code></td><td>Удаляет и возвращает элемент по индексу (по умолчанию последний).</td><td>Да</td></tr>
          <tr><td><code>.sort() vs sorted()</code></td><td><code>.sort()</code> сортирует на месте, <code>sorted()</code> возвращает новый список.</td><td>.sort() — да, sorted() — нет</td></tr>
          <tr><td><code>.reverse() vs reversed()</code></td><td><code>.reverse()</code> разворачивает на месте, <code>reversed()</code> даёт итератор.</td><td>.reverse() — да</td></tr>
          <tr><td><code>.clear()</code></td><td>Удаляет все элементы, делая список пустым <code>[]</code>.</td><td>Да</td></tr>
        </tbody>
      </table>


## Примеры кода

### Добавление элементов: append, extend и insert

Разница между добавлением одного элемента, расширением списка и вставкой по индексу.

```python
numbers = [1, 2, 3]

# 1. append — добавляет один элемент
numbers.append(4)
print("После append(4):", numbers)

# 2. extend — расширяет список элементами другой коллекции
numbers.extend([5, 6])
print("После extend([5, 6]):", numbers)

# 3. insert — вставка по индексу
numbers.insert(0, 0)
print("После insert(0, 0):", numbers)
```

### Удаление элементов: remove, pop, del и clear

Способы удаления по значению, по индексу и полная очистка.

```python
fruits = ["яблоко", "банан", "апельсин", "банан", "киви"]

# remove — удаляет первое вхождение по значению
fruits.remove("банан")
print("После remove('банан'):", fruits)

# pop — извлекает и удаляет элемент по индексу
removed_item = fruits.pop(1)
print(f"Извлечен элемент по индексу 1: {removed_item}")
print("Осталось в списке:", fruits)

# del — удаление по индексу
del fruits[0]
print("После del fruits[0]:", fruits)

# clear — очистить весь список
fruits.clear()
print("После clear():", fruits)
```

### Поиск и подсчет: index, count и оператор in

Поиск индекса элемента, подсчет количества вхождений и проверка наличия.

```python
scores = [10, 20, 30, 20, 40, 20, 50]

print("Количество вхождений 20 (count):", scores.count(20))
print("Индекс первого вхождения 30 (index):", scores.index(30))
print("Есть ли 40 в списке (in)?", 40 in scores)
print("Есть ли 99 в списке (in)?", 99 in scores)
```

### Сортировка и реверс: sort vs sorted, reverse vs reversed

Сортировка на месте и создание новых отсортированных копий.

```python
nums = [5, 2, 9, 1, 7]

# 1. sorted() — возвращает НОВЫЙ отсортированный список
sorted_copy = sorted(nums)
print("Исходный nums:", nums)
print("Новый отсортированный (sorted):", sorted_copy)

# 2. .sort() — сортирует исходный список НА МЕСТЕ
nums.sort(reverse=True)
print("После nums.sort(reverse=True):", nums)

# 3. .reverse() — разворачивает на месте
nums.reverse()
print("После nums.reverse():", nums)
```
