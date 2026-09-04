---
id: "logging"
title: "ЛОГИРОВАНИЕ"
category: "Инструменты"
icon: "📜"
summary:
  - "import logging"
  - "logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')"
  - "log = logging.getLogger(__name__)"
  - "log.debug(\"Отладочное сообщение\")"
  - "log.info(\"Информационное сообщение\")"
  - "log.warning(\"Предупреждение\")"
  - "log.error(\"Сообщение об ошибке\")"
---

## Теория

<h3>Модуль logging:</h3>
      <p>В продакшен-коде вызовы <code>print()</code> заменяются на <code>logging</code>, позволяющий фильтровать сообщения по уровням важности и форматировать временные метки.</p>

      <table class="theory-table">
        <thead><tr><th>Уровень</th><th>Числовой вес</th><th>Назначение</th></tr></thead>
        <tbody>
          <tr><td><code>DEBUG</code></td><td>10</td><td>Подробная отладочная информация.</td></tr>
          <tr><td><code>INFO</code></td><td>20</td><td>Подтверждение нормальной работы системы.</td></tr>
          <tr><td><code>WARNING</code></td><td>30</td><td>Предупреждение о нештатной ситуации, не блокирующей работу.</td></tr>
          <tr><td><code>ERROR</code></td><td>40</td><td>Серьёзная ошибка: операция не смогла выполниться.</td></tr>
          <tr><td><code>CRITICAL</code></td><td>50</td><td>Критический сбой, ведущий к остановке приложения.</td></tr>
        </tbody>
      </table>


## Примеры кода

### Настройка логгера и вывод уровней INFO, WARNING, ERROR

Использование StreamHandler, Formatter и уровней логирования.

```python
import logging
import sys

# Настройка именованного логгера для вывода в stdout
logger = logging.getLogger("app_logger")
logger.setLevel(logging.DEBUG)

# Очистка старых хэндлеров и добавление форматированного вывода
logger.handlers.clear()
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter('[%(levelname)s] %(asctime)s - %(message)s', datefmt='%H:%M:%S'))
logger.addHandler(handler)

logger.debug("Подробный отладочный лог: запрос кэша")
logger.info("Пользователь #42 успешно авторизован")
logger.warning("Время отклика базы данных превысило 200 мс")
logger.error("Ошибка сохранения данных в файл: Permission Denied")
```
