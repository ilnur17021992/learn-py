---
id: "datetime"
title: "DATETIME"
category: "Стандартная библиотека"
icon: "⏰"
summary:
  - "from datetime import datetime, timedelta, timezone, date, time"
  - "Сейчас: datetime.now()"
  - "UTC: datetime.now(timezone.utc)"
  - "Дата: date(2024, 5, 20)   Время: time(12, 30)"
  - "Добавить/вычесть: timedelta(days=1)"
  - "Формат: now.strftime('%Y-%m-%d %H:%M:%S')"
  - "Разбор: datetime.strptime(text, '%Y-%m-%d')"
---

## Теория

<h3>Работа с датой и временем:</h3>
      <ul>
        <li><code>datetime.now()</code> — текущее локальное время.</li>
        <li><code>datetime.now(timezone.utc)</code> — время в формате UTC с таймзоной.</li>
        <li><code>strftime(fmt)</code> (String Format Time) — форматирование объекта даты в строку.</li>
        <li><code>strptime(str, fmt)</code> (String Parse Time) — парсинг строки в объект <code>datetime</code>.</li>
        <li><code>timedelta(days, hours, minutes)</code> — смещение во времени для арифметических расчетов.</li>
      </ul>


## Примеры кода

### Текущее время, таймзона UTC и объекты date/time

Получение текущего времени и создание отдельных объектов date и time.

```python
from datetime import datetime, timezone, date, time

now_local = datetime.now()
now_utc = datetime.now(timezone.utc)

print(f"Локальное время: {now_local}")
print(f"UTC время: {now_utc}")

d = date(2026, 8, 27)
t = time(14, 30, 0)
print(f"Объект date: {d}, Объект time: {t}")
```

### Форматирование (strftime) и парсинг строк (strptime)

Преобразование даты в строку нужного формата и обратно.

```python
from datetime import datetime

now = datetime.now()

# 1. strftime: объект -> красивая строка
formatted = now.strftime("%d.%m.%Y %H:%M:%S")
print("Отформатированная дата (strftime):", formatted)

# 2. strptime: строка -> объект datetime
date_str = "2026-12-31 23:59:00"
parsed_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
print("Распарсенная дата (strptime):", parsed_date)
print(f"Извлечен год: {parsed_date.year}, месяц: {parsed_date.month}")
```

### Арифметика дат: интервалы timedelta

Вычисление будущих дедлайнов и разницы между датами.

```python
from datetime import datetime, timedelta

start_date = datetime.now()
deadline = start_date + timedelta(days=14, hours=6)

print(f"Старт: {start_date.strftime('%d.%m.%Y')}")
print(f"Дедлайн (+14 дней 6 ч): {deadline.strftime('%d.%m.%Y %H:%M')}")

# Разница между двумя датами
diff = deadline - start_date
print(f"Разница в днях: {diff.days}, всего секунд: {diff.total_seconds():.0f}")
```
