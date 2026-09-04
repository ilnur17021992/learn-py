---
id: "roadmap"
title: "ПУТЬ К МАСТЕРСТВУ В PYTHON"
category: "Мастерство"
icon: "🏆"
summary:
  - "Основы → Типы данных → Коллекции → Функции"
  - "ООП → Модули → Исключения → Файлы → Итераторы"
  - "Генераторы → Декораторы → Контекстные менеджеры"
  - "Аннотации типов → Тестирование → Asyncio → Параллелизм"
  - "API → Базы данных → Пакетирование → Git → Логирование"
  - "Безопасность → Производительность → Продакшн → AI-разработка"
  - "Мастерство Python"
---

## Теория

<h3>Ступени развития Python-разработчика:</h3>
      <ol>
        <li><strong>Базовый синтаксис:</strong> переменные, типы данных, циклы, функции, коллекции.</li>
        <li><strong>Продвинутый Python:</strong> ООП, генераторы (<code>yield</code>), декораторы (<code>@decorator</code>), менеджеры контекста (<code>__enter__/__exit__</code>).</li>
        <li><strong>Асинхронность и параллелизм:</strong> <code>asyncio</code>, <code>threading</code>, <code>multiprocessing</code>.</li>
        <li><strong>Бэкенд и экосистема:</strong> FastAPI / Django, PostgreSQL, Docker, Pytest, Git.</li>
      </ol>


## Примеры кода

### Паттерн: Декоратор замера времени выполнения

Создание пользовательского декоратора с использованием functools.wraps.

```python
import time
from functools import wraps

def time_it(func):
    """Декоратор, измеряющий время выполнения функции."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = (time.perf_counter() - start) * 1000
        print(f"⏱️ Функция '{func.__name__}' выполнена за {elapsed:.3f} мс")
        return result
    return wrapper

@time_it
def compute_heavy_task(n):
    return sum(i ** 2 for i in range(n))

print("Результат:", compute_heavy_task(100_000))
```

### Паттерн: Генератор с инструкцией yield

Потоковая генерация последовательностей без расхода оперативной памяти.

```python
def fibonacci_stream(max_count):
    """Генератор чисел Фибоначчи через yield."""
    a, b = 0, 1
    count = 0
    while count < max_count:
        yield a
        a, b = b, a + b
        count += 1

print("Первые 8 чисел Фибоначчи (генератор):")
for num in fibonacci_stream(8):
    print(num, end=" -> ")
print("конец")
```
