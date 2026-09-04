---
id: "testing"
title: "ТЕСТИРОВАНИЕ (PYTEST)"
category: "Инструменты"
icon: "🧪"
summary:
  - "Установка: python -m pip install pytest"
  - "Запуск: pytest"
  - "Тестовый файл: test_*.py"
  - "Тестовая функция: def test_...():"
  - "Используйте assert для проверок"
  - "Фикстуры: @pytest.fixture"
  - "Мокайте внешние зависимости"
---

## Теория

<h3>Тестирование кода (Pytest и assert):</h3>
      <p>В Python для тестов используется простой оператор <code>assert выражение, сообщение_об_ошибке</code>. Pytest автоматически находит все файлы <code>test_*.py</code> и функции <code>def test_*():</code>.</p>

      <h3>Преимущества Pytest:</h3>
      <ul>
        <li>Чистый синтаксис <code>assert</code> без шаблонных классов <code>unittest</code>.</li>
        <li><strong>Фикстуры (Fixtures):</strong> подготовка тестовых данных через декоратор <code>@pytest.fixture</code>.</li>
      </ul>


## Примеры кода

### Тестирование функций с помощью проверок assert

Написание модульных тестов с проверкой корректных результатов и исключений.

```python
def calculate_discount(price, discount):
    if not (0 <= discount <= 1):
        raise ValueError("Скидка должна быть от 0.0 до 1.0")
    return price * (1 - discount)

# Тест 1: Стандартный расчет
assert calculate_discount(1000, 0.20) == 800.0, "Скидка 20% от 1000 должна быть 800"

# Тест 2: Нулевая скидка
assert calculate_discount(500, 0.0) == 500.0, "Скидка 0% не должна менять цену"

# Тест 3: Проверка выброса исключения
try:
    calculate_discount(1000, 1.5)
    assert False, "Должно было возникнуть исключение ValueError"
except ValueError:
    pass # Тест успешно пройден

print("✅ Все 3 модульных теста успешно пройдены!")
```

### Имитация фикстур данных (Fixtures)

Паттерн подготовки тестовых данных для изоляции тестов.

```python
def get_test_user_fixture():
    """Имитация фикстуры pytest: возвращает тестового пользователя."""
    return {"id": 1, "username": "tester", "balance": 1500}

def test_withdraw_success():
    user = get_test_user_fixture()
    amount = 500
    user["balance"] -= amount
    assert user["balance"] == 1000, "Баланс должен уменьшиться на 500"
    print("✅ test_withdraw_success пройден")

test_withdraw_success()
```
