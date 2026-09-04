---
id: "common_mistakes"
title: "ЧАСТЫЕ ОШИБКИ"
category: "Ошибки"
icon: "🚫"
summary:
  - "Изменяемые аргументы по умолчанию: def f(x=[]): (избегайте)"
  - "Неправильное использование == и is"
  - "Изменение списка во время итерации"
  - "Не закрывать файлы"
  - "Слишком общий except: (избегайте bare except)"
  - "Захардкоженные секреты"
  - "Игнорирование граничных случаев"
  - "Преждевременная оптимизация до профилирования"
---

## Теория

<h3>Опасные ловушки в Python:</h3>
      <ul>
        <li><strong>Изменяемый аргумент по умолчанию:</strong> значение по умолчанию инициализируется <em>один раз</em> при объявлении функции, а не при каждом её вызове. Если указать <code>def fn(lst=[])</code>, список станет общим для всех вызовов.</li>
        <li><strong>Модификация коллекции при итерации:</strong> удаление элементов из списка прямо внутри цикла <code>for x in items:</code> приводит к пропуску элементов из-за сдвига индексов.</li>
        <li><strong>Пустой except (bare except):</strong> перехватывает служебные сигналы <code>KeyboardInterrupt</code> и <code>SystemExit</code>. Всегда указывайте конкретный класс ошибки.</li>
      </ul>


## Примеры кода

### Ловушка: Изменяемый аргумент по умолчанию (Mutable Default)

Почему нельзя писать lst=[] в параметрах и как правильно использовать lst=None.

```python
# ❌ НЕПРАВИЛЬНО:
# def bad_append(val, items=[]):
#     items.append(val)
#     return items

# ✅ ПРАВИЛЬНО:
def good_append(val, items=None):
    if items is None:
        items = []
    items.append(val)
    return items

call1 = good_append("A")
call2 = good_append("B")

print("Первый вызов:", call1)
print("Второй вызов:", call2) # Изолирован, не содержит 'A'!
```

### Ловушка: Удаление элементов списка во время итерации

Как правильно фильтровать список без пропуска элементов.

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8]

# ❌ Ошибка: удаление numbers.remove(n) внутри for n in numbers

# ✅ Способ 1: Итерация по копии списка numbers[:]
for n in numbers[:]:
    if n % 2 == 0:
        numbers.remove(n)
print("Остались нечетные (через срез [:]):", numbers)

# ✅ Способ 2 (Лучший): List Comprehension
data = [10, 25, 30, 45, 50]
filtered = [x for x in data if x > 30]
print("Отфильтрованный список (comprehension):", filtered)
```
