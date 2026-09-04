---
id: "dicts"
title: "СЛОВАРИ"
category: "Коллекции"
icon: "📖"
summary:
  - "Создание: d = {'name': 'Alex', 'age': 25}"
  - "Доступ: d['name']      Безопасно: d.get('name')"
  - "По умолчанию: d.get('email', 'N/A')"
  - "Добавить/обновить: d['age'] = 26"
  - "Удалить: del d['age']   d.popitem()"
  - "Ключи: d.keys()      Значения: d.values()"
  - "Пары: d.items()      Проверка: 'name' in d"
  - "Объединение: d1 | d2   Обновить: d1.update(d2)"
  - "Очистить: d.clear()"
---

## Теория

<h3>Словари (Dict):</h3>
      <p>Хэш-таблицы пар «ключ: значение». В Python 3.7+ гарантируют сохранение порядка вставки элементов.</p>

      <table class="theory-table">
        <thead><tr><th>Метод / Оператор</th><th>Описание</th><th>Пример</th></tr></thead>
        <tbody>
          <tr><td><code>.get(key, default)</code></td><td>Возвращает значение или default, если ключ отсутствует (без KeyError).</td><td><code>d.get("city", "N/A")</code></td></tr>
          <tr><td><code>.keys() / .values() / .items()</code></td><td>Итераторы ключей, значений и кортежей (ключ, значение).</td><td><code>for k, v in d.items():</code></td></tr>
          <tr><td><code>d1 | d2 / .update()</code></td><td>Объединение двух словарей (значения правого перезаписывают левый).</td><td><code>merged = d1 | d2</code></td></tr>
          <tr><td><code>.pop(key) / .popitem()</code></td><td>Удаление по ключу или извлечение последней пары (key, value).</td><td><code>k, v = d.popitem()</code></td></tr>
        </tbody>
      </table>


## Примеры кода

### Чтение и безопасный доступ: d[key] vs d.get()

Предотвращение KeyError с помощью метода .get() со значением по умолчанию.

```python
profile = {"username": "ilnur_dev", "role": "admin", "theme": "dark"}

# Прямой доступ по ключу
print("Имя:", profile["username"])

# Безопасный доступ через .get()
print("Роль:", profile.get("role"))
print("Email (не существует):", profile.get("email", "email_not_set@example.com"))

# Проверка наличия ключа
print("Есть ли ключ 'theme'?", "theme" in profile)
```

### Итерация: keys(), values(), items()

Обход словаря по ключам, значениям и парам.

```python
inventory = {"яблоки": 50, "бананы": 30, "груши": 20}

print("Ключи (keys):", list(inventory.keys()))
print("Значения (values):", list(inventory.values()))

print("\nИтерация по парам (items):")
for fruit, count in inventory.items():
    print(f" • {fruit:<8}: {count} шт.")
```

### Обновление, объединение и удаление: update, |, pop, popitem, del, clear

Объединение оператором |, методы popitem, pop, update и clear.

```python
base_config = {"env": "prod", "port": 8080, "debug": False}
override_config = {"port": 9000, "workers": 4}

# 1. Объединение через оператор |
merged_config = base_config | override_config
print("Объединенный конфиг (|):", merged_config)

# 2. pop — удаление по ключу
port_val = merged_config.pop("port")
print(f"Извлечен порт: {port_val}")

# 3. popitem — извлечение последней пары
last_pair = merged_config.popitem()
print(f"Извлечена последняя пара (popitem): {last_pair}")

# 4. clear — очистка
merged_config.clear()
print("После clear():", merged_config)
```
