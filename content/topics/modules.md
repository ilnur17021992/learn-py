---
id: "modules"
title: "МОДУЛИ И ИМПОРТЫ"
category: "Архитектура"
icon: "📦"
summary:
  - "import math"
  - "from math import sqrt"
  - "import numpy as np"
  - "from module import name as alias"
  - "from module import *   (избегайте)"
  - "if __name__ == '__main__':\n    main()"
---

## Теория

<h3>Импорты в Python:</h3>
      <ul>
        <li><code>import math</code> — импортирует весь модуль, доступ через точку: <code>math.sqrt(16)</code>.</li>
        <li><code>from math import sqrt, pi</code> — импортирует конкретные функции или переменные напрямую.</li>
        <li><code>import module as alias</code> — задаёт удобный псевдоним (алиас).</li>
        <li><code>if __name__ == '__main__':</code> — блок кода, который выполняется только при прямом запуске скрипта, а не при импорте.</li>
      </ul>


## Примеры кода

### Варианты импортов: модуль, функция и псевдонимы (as)

Использование import, from ... import и псевдонимов alias.

```python
import math
from math import pi, pow as power_fn

print(f"Квадратный корень math.sqrt(25): {math.sqrt(25)}")
print(f"Константа pi: {pi:.4f}")
print(f"Функция power_fn(2, 4): {power_fn(2, 4)}")
```

### Конструкция if __name__ == '__main__'

Защита кода от выполнения при импорте в другие файлы.

```python
def calculate_vat(price):
    return price * 0.20

def main():
    price = 10000
    vat = calculate_vat(price)
    print(f"Прямой запуск скрипта (__name__ == '{__name__}'):")
    print(f"Цена: {price}, НДС (20%): {vat}")

if __name__ == "__main__":
    main()
```
