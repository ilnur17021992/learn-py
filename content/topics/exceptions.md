---
id: "exceptions"
title: "ОБРАБОТКА ОШИБОК"
category: "Продвинутый Python"
icon: "🛡️"
summary:
  - "try:\n    рискованный_код"
  - "except SpecificError as e:\n    обработать_ошибку"
  - "else:\n    код_без_ошибки"
  - "finally:\n    очистка_ресурсов"
  - "raise ValueError(\"сообщение\")"
---

## Теория

<h3>Блоки обработки исключений:</h3>
      <ul>
        <li><code>try</code> — блок с кодом, в котором может возникнуть ошибка.</li>
        <li><code>except ExceptionType as e</code> — перехватывает конкретный тип ошибки.</li>
        <li><code>else</code> — выполняется <strong>только если</strong> в блоке <code>try</code> не произошло ошибок.</li>
        <li><code>finally</code> — выполняется <strong>всегда</strong>, даже при возникновении исключения или вызове <code>return</code>.</li>
        <li><code>raise</code> — принудительный выброс исключения.</li>
      </ul>


## Примеры кода

### Полная цепочка: try - except - else - finally

Корректная обработка деления на ноль с блоками else и finally.

```python
def safe_divide(a, b):
    try:
        print(f"Попытка деления {a} / {b}:")
        result = a / b
    except ZeroDivisionError as err:
        print(f"❌ Перехвачена ошибка: {err}")
    else:
        print(f"✅ Успешно! Результат = {result}")
    finally:
        print("🔒 [Блок finally: операция завершена]\n")

safe_divide(10, 2)
safe_divide(10, 0)
```

### Выброс исключений оператором raise

Валидация входных данных и генерация собственного ValueError.

```python
def set_user_age(age):
    if not isinstance(age, int):
        raise TypeError(f"Возраст должен быть числом, получено: {type(age).__name__}")
    if age < 0 or age > 120:
        raise ValueError(f"Некорректный возраст: {age} (допустимо от 0 до 120)")
    return f"Возраст {age} успешно сохранён."

try:
    print(set_user_age(25))
    print(set_user_age(-5))
except ValueError as e:
    print(f"❌ Ошибка валидации: {e}")
```
