const TOPICS = [
  // 1. ОСНОВЫ PYTHON
  {
    id: "basics",
    title: "ОСНОВЫ PYTHON",
    category: "Основы",
    icon: "🐍",
    summary: [
      "Python — высокоуровневый, интерпретируемый язык общего назначения",
      "Проверить версию: python --version",
      "Интерпретатор: python или python3",
      "Однострочный комментарий: # комментарий",
      "Многострочная строка: \"\"\"текст\"\"\"",
      "Отступы определяют блоки кода (4 пробела)",
      "print(\"Привет, мир!\")",
      "input(\"Введите значение: \")",
      "type(value)   id(value)   help()   dir(obj)"
    ],
    theory: `
      <h3>Что такое Python?</h3>
      <p>Python — высокоуровневый интерпретируемый язык с динамической типизацией и автоматическим управлением памятью. Философия языка ориентирована на максимальную читаемость кода.</p>

      <h3>Ключевые правила синтаксиса:</h3>
      <ul>
        <li><strong>Отступы (Indentation):</strong> вместо фигурных скобок <code>{}</code> блоки кода в функциях, условиях и циклах выделяются 4 пробелами.</li>
        <li><strong>Комментарии:</strong> однострочные начинаются с символа <code>#</code>, многострочные оформляются тройными кавычками <code>"""..."""</code>.</li>
        <li><strong>Интроспекция:</strong> встроенные инструменты <code>type()</code>, <code>id()</code>, <code>dir()</code> и <code>help()</code> позволяют исследовать тип, уникальный адрес в памяти и доступные методы любого объекта.</li>
      </ul>
    `,
    examples: [
      {
        title: "Параметры print(..., sep, end)",
        desc: "Использование разделителей sep и символа окончания строки end.",
        code: `print("Python", "3.12", "WebAssembly", sep=" -> ")
print("Загрузка: ", end="")
print("100% [Успешно]")
print("Счёт:", 10, 20, 30, sep=" | ")`
      },
      {
        title: "Интроспекция: type, id и dir",
        desc: "Проверка типа, уникального адреса в памяти и доступных методов объекта.",
        code: `message = "Привет, мир!"

print("Значение:", message)
print("Тип объекта (type):", type(message).__name__)
print("ID объекта в памяти (id):", id(message))

# Список методов строки без служебных dunder-методов
string_methods = [m for m in dir(message) if not m.startswith("_")][:6]
print("Первые 6 методов объекта:", string_methods)`
      },
      {
        title: "Многострочные строки и комментарии",
        desc: "Оформление документации (docstrings) и блоков комментариев.",
        code: `# Однострочный комментарий: вычисление площади
width = 20
height = 10

area_doc = """
Расчёт площади прямоугольника:
- Ширина: 20
- Высота: 10
"""
print(area_doc.strip())
print(f"Площадь: {width * height} кв. ед.")`
      }
    ]
  },

  // 2. ТИПЫ ДАННЫХ
  {
    id: "types",
    title: "ТИПЫ ДАННЫХ",
    category: "Основы",
    icon: "📦",
    summary: [
      "int  →  целые числа",
      "float  →  числа с плавающей точкой",
      "complex  →  комплексные числа",
      "bool  →  True или False",
      "str  →  текст / строка",
      "list  →  упорядоченный, изменяемый",
      "tuple  →  упорядоченный, неизменяемый",
      "set  →  неупорядоченный, уникальные элементы",
      "dict  →  пары ключ-значение",
      "None  →  нет значения",
      "type(value)   isinstance(value, type)"
    ],
    theory: `
      <h3>Классификация типов данных:</h3>
      <table class="theory-table">
        <thead><tr><th>Категория</th><th>Типы данных</th><th>Особенности</th></tr></thead>
        <tbody>
          <tr><td><strong>Числовые</strong></td><td><code>int</code>, <code>float</code>, <code>complex</code></td><td>Целые числа произвольной длины, вещественные и комплексные числа (<code>1+2j</code>).</td></tr>
          <tr><td><strong>Логические</strong></td><td><code>bool</code></td><td>Значения <code>True</code> и <code>False</code>. Наследуется от <code>int</code> (1 и 0).</td></tr>
          <tr><td><strong>Неизменяемые коллекции</strong></td><td><code>str</code>, <code>tuple</code>, <code>frozenset</code></td><td>После создания объект нельзя изменить в памяти.</td></tr>
          <tr><td><strong>Изменяемые коллекции</strong></td><td><code>list</code>, <code>dict</code>, <code>set</code></td><td>Элементы можно добавлять, удалять и перезаписывать на месте.</td></tr>
          <tr><td><strong>Пустой тип</strong></td><td><code>NoneType</code> (значение <code>None</code>)</td><td>Обозначает отсутствие значения или результат функции без return.</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Числовые и логические типы (int, float, complex, bool)",
        desc: "Демонстрация целых, вещественных, комплексных и булевых чисел.",
        code: `age = 25              # int
price = 199.99        # float
z = 3 + 4j            # complex
is_active = True      # bool

print(f"int: {age}, тип: {type(age).__name__}")
print(f"float: {price}, тип: {type(price).__name__}")
print(f"complex: {z}, действительная часть: {z.real}, мнимая: {z.imag}")
print(f"bool: {is_active}, числовой эквивалент: {int(is_active)}")`
      },
      {
        title: "Коллекции и объект None",
        desc: "Сравнение list, tuple, set, dict и NoneType.",
        code: `my_list = [1, 2, 3]                 # list (изменяемый)
my_tuple = (1, 2, 3)                # tuple (неизменяемый)
my_set = {1, 2, 3, 2}               # set (уникальные значения)
my_dict = {"name": "Alex", "id": 1} # dict (ключ-значение)
empty_val = None                    # NoneType

print("list:", my_list, type(my_list).__name__)
print("tuple:", my_tuple, type(my_tuple).__name__)
print("set (без дубликатов):", my_set, type(my_set).__name__)
print("dict:", my_dict, type(my_dict).__name__)
print("None:", empty_val, type(empty_val).__name__)`
      },
      {
        title: "Проверка типов: isinstance() vs type()",
        desc: "Использование isinstance с поддержкой кортежей типов и наследования.",
        code: `value = 42

# isinstance поддерживает проверку нескольких типов сразу
print("Целое число или float?", isinstance(value, (int, float)))
print("Является ли строкой?", isinstance(value, str))

# Разница между type и isinstance (bool является подклассом int)
flag = True
print("type(flag) == int:", type(flag) is int)          # False
print("isinstance(flag, int):", isinstance(flag, int))  # True`
      }
    ]
  },

  // 3. ОПЕРАТОРЫ
  {
    id: "operators",
    title: "ОПЕРАТОРЫ",
    category: "Основы",
    icon: "⚡",
    summary: [
      "Арифметические: +   -   *   /   //   %   **",
      "Сравнения: ==   !=   >   <   >=   <=",
      "Логические: and   or   not",
      "Идентичности: is   is not",
      "Принадлежности: in   not in",
      "Побитовые: &   |   ^   ~   <<   >>",
      "Присваивания: =   +=   -=   *=   /=   //=   %=   **=   &=   |=   ^=   <<=   >>="
    ],
    theory: `
      <h3>Группы операторов:</h3>
      <ul>
        <li><strong>Арифметические:</strong> <code>/</code> всегда даёт <code>float</code>, <code>//</code> делит нацело с округлением вниз, <code>%</code> — остаток от деления, <code>**</code> — возведение в степень.</li>
        <li><strong>Сравнение и идентичность:</strong> <code>==</code> сравнивает <em>значения</em> объектов, а <code>is</code> — <em>адреса объектов в памяти</em>.</li>
        <li><strong>Логические:</strong> <code>and</code>, <code>or</code>, <code>not</code> работают с «ленивым» вычислением (short-circuit evaluation).</li>
        <li><strong>Принадлежность:</strong> <code>in</code> и <code>not in</code> проверяют вхождение элемента в последовательность или наличие ключа в словаре.</li>
      </ul>
    `,
    examples: [
      {
        title: "Арифметика: деление, остаток, степень",
        desc: "Разница между обычным / и целочисленным // делением.",
        code: `a, b = 17, 5

print(f"{a} + {b} = {a + b}")
print(f"{a} / {b} = {a / b} (обычное деление -> float)")
print(f"{a} // {b} = {a // b} (целочисленное деление)")
print(f"{a} % {b} = {a % b} (остаток от деления)")
print(f"2 ** 8 = {2 ** 8} (возведение в степень)")`
      },
      {
        title: "Операторы идентичности (is) и принадлежности (in)",
        desc: "Разница между == и is, а также проверка in / not in.",
        code: `list1 = [1, 2, 3]
list2 = [1, 2, 3]
list3 = list1

print("list1 == list2 (равны по значениям):", list1 == list2) # True
print("list1 is list2 (разные адреса в памяти):", list1 is list2) # False
print("list1 is list3 (один и тот же объект):", list1 is list3) # True

# Проверка принадлежности
print("2 in list1:", 2 in list1)
print("5 not in list1:", 5 not in list1)`
      },
      {
        title: "Побитовые операторы и присваивание",
        desc: "Операторы &, |, ^, ~, <<, >> и составное присваивание.",
        code: `x = 5  # 0b0101
y = 3  # 0b0011

print(f"Побитовое И (5 & 3): {x & y}")   # 0b0001 = 1
print(f"Побитовое ИЛИ (5 | 3): {x | y}") # 0b0111 = 7
print(f"Сдвиг влево (5 << 1): {x << 1}") # 10

# Составные операторы присваивания
val = 10
val += 5
val *= 2
print("Итог присваиваний val (10 + 5) * 2:", val)`
      }
    ]
  },

  // 4. ПЕРЕМЕННЫЕ
  {
    id: "variables",
    title: "ПЕРЕМЕННЫЕ",
    category: "Основы",
    icon: "🏷️",
    summary: [
      "name = value",
      "a, b = 10, 20      множественное присваивание",
      "a, b = b, a      обмен значений",
      "x = y = 0      одно значение",
      "del variable      удалить переменную",
      "Используйте snake_case для имён",
      "Используйте UPPER_CASE для констант"
    ],
    theory: `
      <h3>Переменные как ссылки на объекты:</h3>
      <p>В Python переменные не хранят сами значения, а являются именованными ссылками на объекты в памяти. Одному объекту может соответствовать несколько имён.</p>

      <h3>Правила именования (PEP 8):</h3>
      <ul>
        <li><code>snake_case</code> — для переменных, аргументов и функций (например, <code>user_total_count</code>).</li>
        <li><code>UPPER_CASE</code> — для констант (например, <code>MAX_CONNECTIONS = 100</code>).</li>
        <li><code>del var_name</code> — удаляет ссылку на объект из текущей области видимости.</li>
      </ul>
    `,
    examples: [
      {
        title: "Множественное присваивание и быстрый обмен",
        desc: "Обмен переменными в одну строку и цепочки присваиваний.",
        code: `x, y = 100, 200
print(f"До обмена: x={x}, y={y}")

# Быстрый обмен без вспомогательной переменной
x, y = y, x
print(f"После обмена: x={x}, y={y}")

# Каскадное присваивание
a = b = c = 0
print(f"a={a}, b={b}, c={c}")`
      },
      {
        title: "Константы и удаление переменных (del)",
        desc: "Именование констант по стандарту PEP 8 и вызов del.",
        code: `API_TIMEOUT_SECONDS = 30
MAX_RETRY_COUNT = 3

temp_cache = "Временные данные сессии"
print("Кэш до удаления:", temp_cache)

# Удаление переменной из области видимости
del temp_cache

try:
    print(temp_cache)
except NameError as e:
    print(f"✅ Переменная удалена: {e}")`
      }
    ]
  },

  // 5. СТРОКИ
  {
    id: "strings",
    title: "СТРОКИ",
    category: "Синтаксис",
    icon: "🔤",
    summary: [
      "'одинарные' или \"двойные\" кавычки",
      "Многострочная: \"\"\"текст\"\"\"",
      "len(text)   text[0]   text[-1]",
      "text[start:stop:step]   text[::-1] обратный порядок",
      "text.upper()   text.lower()   text.title()",
      "text.strip()   text.replace(a, b)",
      "text.split(sep)   sep.join(items)",
      "text.startswith(x)   text.endswith(x)",
      "f\"Привет, {name}\"   f\"{price:.2f}\"",
      "'Python' in text   text.find('Py')",
      "text.count('a')"
    ],
    theory: `
      <h3>Методы строк:</h3>
      <p>Строки (<code>str</code>) в Python <strong>неизменяемы</strong>. Любой строковый метод возвращает новую строку, оставляя исходную без изменений.</p>

      <table class="theory-table">
        <thead><tr><th>Метод / Операция</th><th>Описание</th><th>Пример</th></tr></thead>
        <tbody>
          <tr><td><code>.upper() / .lower() / .title()</code></td><td>Изменение регистра символов.</td><td><code>"py".upper() -> "PY"</code></td></tr>
          <tr><td><code>.strip() / .lstrip() / .rstrip()</code></td><td>Удаление пробельных символов с краев.</td><td><code>" hi ".strip() -> "hi"</code></td></tr>
          <tr><td><code>.split(sep) / sep.join(list)</code></td><td>Разбиение строки на список и сборка обратно.</td><td><code>",".join(["a","b"])</code></td></tr>
          <tr><td><code>.startswith() / .endswith()</code></td><td>Проверка префикса или суффикса строки.</td><td><code>"file.py".endswith(".py")</code></td></tr>
          <tr><td><code>.find() / .count() / in</code></td><td>Поиск индекса подстроки, подсчёт вхождений.</td><td><code>"banana".count("a") -> 3</code></td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Срезы, индексация и реверс строк",
        desc: "Срезы [start:stop:step], отрицательные индексы и реверс [::-1].",
        code: `text = "Python Language"

print("Первый символ:", text[0])
print("Последний символ:", text[-1])
print("Срез [0:6]:", text[0:6])
print("Каждый 2-й символ:", text[::2])
print("Реверс строки [::-1]:", text[::-1])`
      },
      {
        title: "Преобразование регистра и очистка (strip, replace, upper)",
        desc: "Методы upper(), lower(), title(), strip() и replace().",
        code: `raw_email = "   User.Name@Example.COM   \\n"

clean_email = raw_email.strip().lower()
print(f"Исходная строка: {repr(raw_email)}")
print(f"Очищенный email: {clean_email}")

header = "python interactive lab"
print("Title Case:", header.title())
print("Замена символов (replace):", header.replace("python", "Python 3.12"))`
      },
      {
        title: "Разбиение и объединение: split() и join()",
        desc: "Преобразование строки в список слов и сборка обратно через разделитель.",
        code: `tags_str = "python, webassembly, coding, tutorial"

# Разбиение по запятой с пробелом
tags_list = tags_str.split(", ")
print("Список тегов (split):", tags_list)

# Сборка через разделитель
joined = " #".join([""] + tags_list)
print("Хэштеги (join):", joined.strip())`
      },
      {
        title: "Поиск, проверка префиксов и подсчёт (startswith, find, count)",
        desc: "Методы startswith(), endswith(), find(), count() и оператор in.",
        code: `filename = "report_2026_final.pdf"

print("Начинается с 'report_'?", filename.startswith("report_"))
print("Заканчивается на '.pdf'?", filename.endswith(".pdf"))
print("Индекс вхождения '2026' (find):", filename.find("2026"))
print("Количество букв 'a' (count):", filename.count("a"))
print("Есть ли 'final' в названии?", "final" in filename)`
      },
      {
        title: "Форматирование: f-строки и спецификаторы чисел",
        desc: "Форматирование денежных сумм, процентов и выравнивание текста.",
        code: `item = "Ноутбук"
price = 84990.5
discount = 0.15
final_price = price * (1 - discount)

print(f"Товар: {item:<15} | Цена: {price:>10.2f} руб.")
print(f"Скидка: {discount:.0%} | К оплате: {final_price:.2f} руб.")`
      }
    ]
  },

  // 6. СПИСКИ
  {
    id: "lists",
    title: "СПИСКИ",
    category: "Коллекции",
    icon: "📋",
    summary: [
      "Создание: items = [1, 2, 3]",
      "Доступ: items[0]   items[-1]   items[1:4]",
      "Добавление: items.append(x)   items.extend([4, 5])",
      "Вставка: items.insert(index, x)",
      "Удалить по значению: items.remove(x)",
      "Удалить по индексу: items.pop(index)",
      "Удаление: del items[index]",
      "items.clear()   items.index(x)   items.count(x)",
      "items.sort()   items.reverse()",
      "sorted(items)   reversed(items)",
      "x in items"
    ],
    theory: `
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
    `,
    examples: [
      {
        title: "Добавление элементов: append, extend и insert",
        desc: "Разница между добавлением одного элемента, расширением списка и вставкой по индексу.",
        code: `numbers = [1, 2, 3]

# 1. append — добавляет один элемент
numbers.append(4)
print("После append(4):", numbers)

# 2. extend — расширяет список элементами другой коллекции
numbers.extend([5, 6])
print("После extend([5, 6]):", numbers)

# 3. insert — вставка по индексу
numbers.insert(0, 0)
print("После insert(0, 0):", numbers)`
      },
      {
        title: "Удаление элементов: remove, pop, del и clear",
        desc: "Способы удаления по значению, по индексу и полная очистка.",
        code: `fruits = ["яблоко", "банан", "апельсин", "банан", "киви"]

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
print("После clear():", fruits)`
      },
      {
        title: "Поиск и подсчет: index, count и оператор in",
        desc: "Поиск индекса элемента, подсчет количества вхождений и проверка наличия.",
        code: `scores = [10, 20, 30, 20, 40, 20, 50]

print("Количество вхождений 20 (count):", scores.count(20))
print("Индекс первого вхождения 30 (index):", scores.index(30))
print("Есть ли 40 в списке (in)?", 40 in scores)
print("Есть ли 99 в списке (in)?", 99 in scores)`
      },
      {
        title: "Сортировка и реверс: sort vs sorted, reverse vs reversed",
        desc: "Сортировка на месте и создание новых отсортированных копий.",
        code: `nums = [5, 2, 9, 1, 7]

# 1. sorted() — возвращает НОВЫЙ отсортированный список
sorted_copy = sorted(nums)
print("Исходный nums:", nums)
print("Новый отсортированный (sorted):", sorted_copy)

# 2. .sort() — сортирует исходный список НА МЕСТЕ
nums.sort(reverse=True)
print("После nums.sort(reverse=True):", nums)

# 3. .reverse() — разворачивает на месте
nums.reverse()
print("После nums.reverse():", nums)`
      }
    ]
  },

  // 7. КОРТЕЖИ
  {
    id: "tuples",
    title: "КОРТЕЖИ",
    category: "Коллекции",
    icon: "🔒",
    summary: [
      "Создание: t = (1, 2, 3)",
      "Один элемент: t = (1,)",
      "Доступ: t[0]   t[-1]   t[1:3]",
      "Распаковка: a, b = t",
      "Расширенная распаковка: a, *rest = (1, 2, 3, 4)",
      "Количество: t.count(x)   Индекс: t.index(x)",
      "Неизменяемый (нельзя изменить)"
    ],
    theory: `
      <h3>Кортежи (Tuple):</h3>
      <p>Кортеж — неизменяемая упорядоченная последовательность. Занимает меньше памяти, чем список, и защищает данные от случайного изменения.</p>

      <h3>Особенности кортежей:</h3>
      <ul>
        <li><strong>Синтаксис одного элемента:</strong> для создания кортежа из одного элемента обязательна запятая: <code>(42,)</code>, иначе Python воспримет это как число в скобках.</li>
        <li><strong>Ключи словарей:</strong> благодаря неизменяемости кортежи могут использоваться в качестве ключей словарей и элементов множеств.</li>
        <li><strong>Распаковка:</strong> синтаксис <code>a, *rest = tuple</code> позволяет удобно извлекать первые элементы и сохранять остаток в список.</li>
      </ul>
    `,
    examples: [
      {
        title: "Создание, доступ по индексу и методы count/index",
        desc: "Создание кортежей, кортеж из одного элемента и методы count(), index().",
        code: `# Кортеж из одного элемента требует запятую
single_item_tuple = (42,)
not_a_tuple = (42)

print("single_item_tuple тип:", type(single_item_tuple).__name__)
print("not_a_tuple тип:", type(not_a_tuple).__name__)

colors = ("red", "green", "blue", "green", "yellow")
print("Первый цвет:", colors[0])
print("Последний цвет:", colors[-1])
print("Количество 'green' (count):", colors.count("green"))
print("Индекс 'blue' (index):", colors.index("blue"))`
      },
      {
        title: "Распаковка кортежей и расширенная распаковка (*rest)",
        desc: "Распаковка значений в переменные с использованием оператора *.",
        code: `server_info = ("api.example.com", 443, "https", "v2", "production")

host, port, protocol, *metadata = server_info

print(f"Хост: {host}")
print(f"Порт: {port}")
print(f"Протокол: {protocol}")
print(f"Дополнительные метаданные (*metadata): {metadata}")`
      }
    ]
  },

  // 8. МНОЖЕСТВА
  {
    id: "sets",
    title: "МНОЖЕСТВА",
    category: "Коллекции",
    icon: "⭕",
    summary: [
      "Создание: s = {1, 2, 3}      Пустое: set()",
      "Добавление: s.add(x)   Обновление: s.update([4, 5])",
      "Удаление: s.remove(x)   Удалить без ошибки: s.discard(x)",
      "Извлечь: s.pop()   Очистить: s.clear()",
      "Объединение: s1 | s2   Пересечение: s1 & s2",
      "Разность: s1 - s2   Симметрическая разность: s1 ^ s2",
      "Подмножество: s1 <= s2   Надмножество: s1 >= s2",
      "x in s"
    ],
    theory: `
      <h3>Множества (Set):</h3>
      <p>Неупорядоченная коллекция уникальных хэшируемых элементов. Проверка наличия <code>x in set</code> выполняется за мгновенное время <strong>O(1)</strong>.</p>

      <table class="theory-table">
        <thead><tr><th>Операция</th><th>Оператор</th><th>Метод</th><th>Смысл</th></tr></thead>
        <tbody>
          <tr><td>Объединение</td><td><code>s1 | s2</code></td><td><code>s1.union(s2)</code></td><td>Все элементы из обоих множеств.</td></tr>
          <tr><td>Пересечение</td><td><code>s1 & s2</code></td><td><code>s1.intersection(s2)</code></td><td>Элементы, присутствующие в обоих множествах.</td></tr>
          <tr><td>Разность</td><td><code>s1 - s2</code></td><td><code>s1.difference(s2)</code></td><td>Элементы из s1, которых нет в s2.</td></tr>
          <tr><td>Симм. разность</td><td><code>s1 ^ s2</code></td><td><code>s1.symmetric_difference(s2)</code></td><td>Элементы, входящие только в одно из множеств.</td></tr>
          <tr><td>Подмножество</td><td><code>s1 <= s2</code></td><td><code>s1.issubset(s2)</code></td><td>Все элементы s1 есть в s2.</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Добавление и удаление: add, update, remove, discard, pop, clear",
        desc: "Разница между remove (вызывает ошибку) и discard (безопасное удаление).",
        code: `tech = {"Python", "JavaScript"}

# add — добавить один элемент
tech.add("TypeScript")
# update — добавить коллекцию
tech.update(["HTML", "CSS"])
print("После add и update:", tech)

# discard — удаляет элемент безопасно (не вызывает ошибки, если элемента нет)
tech.discard("Go") # нет ошибки!
tech.discard("HTML")

# remove — удаляет, но бросит KeyError, если элемента нет
tech.remove("CSS")
print("После discard и remove:", tech)

# pop — извлекает произвольный элемент
item = tech.pop()
print(f"Извлечен элемент (pop): {item}")

# clear — очистить множество
tech.clear()
print("После clear():", tech)`
      },
      {
        title: "Теоретико-множественные операции (|, &, -, ^, <=, >=)",
        desc: "Объединение, пересечение, разность, симметрическая разность и проверка подмножеств.",
        code: `group_a = {"Python", "SQL", "Git", "Docker"}
group_b = {"Python", "JavaScript", "HTML", "Docker"}

print("Объединение (|):", group_a | group_b)
print("Пересечение (&):", group_a & group_b)
print("Разность (A - B):", group_a - group_b)
print("Симметрическая разность (A ^ B):", group_a ^ group_b)

# Проверка подмножеств
subset = {"Python", "Git"}
print("Является ли subset подмножеством group_a (<=)?", subset <= group_a)
print("Является ли group_a надмножеством subset (>=)?", group_a >= subset)`
      }
    ]
  },

  // 9. СЛОВАРИ
  {
    id: "dicts",
    title: "СЛОВАРИ",
    category: "Коллекции",
    icon: "📖",
    summary: [
      "Создание: d = {'name': 'Alex', 'age': 25}",
      "Доступ: d['name']      Безопасно: d.get('name')",
      "По умолчанию: d.get('email', 'N/A')",
      "Добавить/обновить: d['age'] = 26",
      "Удалить: del d['age']   d.popitem()",
      "Ключи: d.keys()      Значения: d.values()",
      "Пары: d.items()      Проверка: 'name' in d",
      "Объединение: d1 | d2   Обновить: d1.update(d2)",
      "Очистить: d.clear()"
    ],
    theory: `
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
    `,
    examples: [
      {
        title: "Чтение и безопасный доступ: d[key] vs d.get()",
        desc: "Предотвращение KeyError с помощью метода .get() со значением по умолчанию.",
        code: `profile = {"username": "ilnur_dev", "role": "admin", "theme": "dark"}

# Прямой доступ по ключу
print("Имя:", profile["username"])

# Безопасный доступ через .get()
print("Роль:", profile.get("role"))
print("Email (не существует):", profile.get("email", "email_not_set@example.com"))

# Проверка наличия ключа
print("Есть ли ключ 'theme'?", "theme" in profile)`
      },
      {
        title: "Итерация: keys(), values(), items()",
        desc: "Обход словаря по ключам, значениям и парам.",
        code: `inventory = {"яблоки": 50, "бананы": 30, "груши": 20}

print("Ключи (keys):", list(inventory.keys()))
print("Значения (values):", list(inventory.values()))

print("\\nИтерация по парам (items):")
for fruit, count in inventory.items():
    print(f" • {fruit:<8}: {count} шт.")`
      },
      {
        title: "Обновление, объединение и удаление: update, |, pop, popitem, del, clear",
        desc: "Объединение оператором |, методы popitem, pop, update и clear.",
        code: `base_config = {"env": "prod", "port": 8080, "debug": False}
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
print("После clear():", merged_config)`
      }
    ]
  },

  // 10. УСЛОВИЯ
  {
    id: "conditions",
    title: "УСЛОВИЯ",
    category: "Управление потоком",
    icon: "🔀",
    summary: [
      "if условие:\n    инструкция",
      "elif условие:\n    инструкция",
      "else:\n    инструкция",
      "Тернарный оператор: x if условие else y",
      "Используйте отступы для блоков"
    ],
    theory: `
      <h3>Условные конструкции if-elif-else:</h3>
      <p>В Python любое выражение в условии неявно приводится к <code>bool</code>.</p>

      <h3>Что считается ложным (Falsy values):</h3>
      <ul>
        <li><code>False</code> и <code>None</code></li>
        <li>Числовые нули: <code>0</code>, <code>0.0</code>, <code>0j</code></li>
        <li>Пустые последовательности и коллекции: <code>""</code>, <code>[]</code>, <code>()</code>, <code>{}</code>, <code>set()</code></li>
      </ul>
    `,
    examples: [
      {
        title: "Ветвление if - elif - else",
        desc: "Классическая многоуровневая проверка условий.",
        code: `score = 82

if score >= 90:
    grade = "Отлично (A)"
elif score >= 75:
    grade = "Хорошо (B)"
elif score >= 60:
    grade = "Удовлетворительно (C)"
else:
    grade = "Неудовлетворительно (F)"

print(f"Балл: {score}, Результат: {grade}")`
      },
      {
        title: "Тернарный условный оператор",
        desc: "Компактная однострочная форма: x if condition else y.",
        code: `user_role = "admin"
access = "Полный доступ разрешён" if user_role == "admin" else "Ограниченный доступ"
print("Статус доступа:", access)

age = 17
can_enter = "Вход разрешен" if age >= 18 else "Вход только с родителями"
print("Возрастной контроль:", can_enter)`
      },
      {
        title: "Проверка на Falsy-значения",
        desc: "Идиоматическая проверка непустых списков и строк.",
        code: `user_input = ""
notifications = []

# Идиоматично: if not items вместо len(items) == 0
if not user_input:
    print("Строка ввода пуста")

if not notifications:
    print("Новых уведомлений нет")`
      }
    ]
  },

  // 11. ЦИКЛЫ
  {
    id: "loops",
    title: "ЦИКЛЫ",
    category: "Управление потоком",
    icon: "🔁",
    summary: [
      "Цикл for:\n    for item in iterable:\n        statement",
      "for c range:\n    for i in range(start, stop, step):\n        statement",
      "Цикл while:\n    while condition:\n        statement",
      "break   continue   pass",
      "enumerate(iterable)   zip(a, b)"
    ],
    theory: `
      <h3>Управление циклами:</h3>
      <ul>
        <li><code>range(start, stop, step)</code> — генерирует последовательность чисел с заданным шагом.</li>
        <li><code>enumerate(iterable, start=0)</code> — возвращает пары <code>(индекс, элемент)</code>.</li>
        <li><code>zip(iter1, iter2)</code> — объединяет элементы нескольких коллекций в кортежи.</li>
        <li><code>break</code> — немедленно прерывает цикл.</li>
        <li><code>continue</code> — досрочно переходит к следующей итерации.</li>
        <li><code>pass</code> — пустая инструкция-заглушка.</li>
      </ul>
    `,
    examples: [
      {
        title: "Цикл for, генератор range() и while",
        desc: "Использование диапазона чисел с шагом и цикла while со счетчиком.",
        code: `# Цикл for с range(start, stop, step)
print("range с шагом 2:")
for n in range(2, 10, 2):
    print(n, end=" ")
print()

# Цикл while
count = 3
while count > 0:
    print(f"Обратный отсчет: {count}")
    count -= 1
print("Старт!")`
      },
      {
        title: "Управляющие операторы: break, continue, pass",
        desc: "Пропуск шагов (continue), остановка цикла (break) и заглушка (pass).",
        code: `for num in range(1, 10):
    if num == 3:
        pass # Заглушка (ничего не делаем)
    if num % 2 == 0:
        continue # Пропустить четные числа
    if num > 7:
        print(f"\\nПрерывание на числе {num} (break)")
        break
    print(f"Нечетное: {num}", end="; ")`
      },
      {
        title: "Вспомогательные функции: enumerate() и zip()",
        desc: "Индексация элементов через enumerate и параллельный обход списков через zip.",
        code: `names = ["Анна", "Борис", "Светлана"]
roles = ["Frontend", "Backend", "DevOps"]

print("Параллельный обход (zip):")
for name, role in zip(names, roles):
    print(f"Специалист: {name:<10} Роль: {role}")

print("\\nНумерация с 1 (enumerate):")
for idx, name in enumerate(names, start=1):
    print(f"#{idx}: {name}")`
      }
    ]
  },

  // 12. ФУНКЦИИ
  {
    id: "functions",
    title: "ФУНКЦИИ",
    category: "Управление потоком",
    icon: "⚙️",
    summary: [
      "Определение: def func(a, b=0, *args, **kwargs):\n    \"\"\"Докстрока\"\"\"\n    return значение",
      "Аргументы по умолчанию: b=0",
      "Только именованные: def func(a, *, b):",
      "Аннотации типов: def add(a: int, b: int) -> int:",
      "Лямбды: sq = lambda x: x ** 2",
      "map(fn, it)   filter(fn, it)   sorted(it, key=fn)"
    ],
    theory: `
      <h3>Функции в Python:</h3>
      <p>Функции являются объектами первого класса (First-Class Objects): их можно передавать в другие функции как аргументы, сохранять в переменные и возвращать из функций.</p>

      <h3>Параметры и аргументы:</h3>
      <ul>
        <li><code>*args</code> — собирает произвольное количество позиционных аргументов в <code>tuple</code>.</li>
        <li><code>**kwargs</code> — собирает произвольное количество именованных аргументов в <code>dict</code>.</li>
        <li><code>def fn(a, *, b):</code> — символ <code>*</code> требует передавать аргумент <code>b</code> строго по имени.</li>
        <li><code>lambda x: x * 2</code> — анонимные однострочные функции.</li>
      </ul>
    `,
    examples: [
      {
        title: "Позиционные, именованные аргументы, *args и **kwargs",
        desc: "Универсальные функции, принимающие произвольное число параметров.",
        code: `def build_profile(user_id, *roles, status="active", **details):
    print(f"Пользователь #{user_id} [Статус: {status}]")
    print(f"Роли (*args): {roles}")
    print(f"Доп. атрибуты (**kwargs): {details}")

build_profile(101, "admin", "developer", status="verified", city="Москва", exp_years=5)`
      },
      {
        title: "Только именованные аргументы и аннотации типов",
        desc: "Синтаксис def fn(a, *, b) и указание типов аргументов и результата.",
        code: `def calculate_tax(amount: float, *, tax_rate: float = 0.20) -> float:
    """Вычисляет сумму налога по фиксированной ставке."""
    return amount * tax_rate

# tax_rate ОБЯЗАТЕЛЬНО передавать по имени из-за символа *
result = calculate_tax(50000.0, tax_rate=0.13)
print(f"Сумма налога (13%): {result:.2f} руб.")`
      },
      {
        title: "Лямбда-функции, map(), filter() и sorted(key=fn)",
        desc: "Анонимные функции в сочетании с map, filter и кастомной сортировкой.",
        code: `people = [
    {"name": "Илья", "age": 28},
    {"name": "Ольга", "age": 22},
    {"name": "Сергей", "age": 35}
]

# Сортировка по возрасту с помощью lambda
sorted_people = sorted(people, key=lambda p: p["age"])
print("Сортировка по возрасту:", sorted_people)

# Фильтрация и отображение
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
squares = list(map(lambda x: x ** 2, evens))
print("Четные:", evens)
print("Квадраты четных (map):", squares)`
      }
    ]
  },

  // 13. ГЕНЕРАТОРЫ ВКЛЮЧЕНИЙ
  {
    id: "comprehensions",
    title: "ГЕНЕРАТОРЫ ВКЛЮЧЕНИЙ",
    category: "Синтаксис",
    icon: "⚡",
    summary: [
      "Список: [x * 2 for x in nums]",
      "Список с условием: [x for x in nums if x > 0]",
      "Множество: {x * 2 for x in nums}",
      "Словарь: {x: x * 2 for x in nums}",
      "Генератор: (x * 2 for x in nums)"
    ],
    theory: `
      <h3>Comprehensions (Генераторы коллекций):</h3>
      <p>Декларативный синтаксис для создания коллекций. Работает на уровне языка быстрее стандартных циклов <code>for</code> с <code>.append()</code>.</p>

      <table class="theory-table">
        <thead><tr><th>Тип</th><th>Синтаксис</th><th>Результат</th></tr></thead>
        <tbody>
          <tr><td>List Comprehension</td><td><code>[x**2 for x in nums]</code></td><td>Список <code>list</code></td></tr>
          <tr><td>Set Comprehension</td><td><code>{x**2 for x in nums}</code></td><td>Множество <code>set</code> (уникальные)</td></tr>
          <tr><td>Dict Comprehension</td><td><code>{x: x**2 for x in nums}</code></td><td>Словарь <code>dict</code> (ключ-значение)</td></tr>
          <tr><td>Generator Expression</td><td><code>(x**2 for x in nums)</code></td><td>Генератор (ленивое вычисление)</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "List и Set Comprehensions",
        desc: "Создание списков и множеств с фильтрацией if.",
        code: `numbers = [-4, -2, 0, 1, 2, 3, 2, 4]

# List Comprehension с условием фильтрации
pos_doubles = [n * 2 for n in numbers if n > 0]
print("Удвоенные положительные (List):", pos_doubles)

# Set Comprehension (автоматически убирает дубликаты)
unique_squares = {abs(n) for n in numbers}
print("Уникальные абсолютные значения (Set):", unique_squares)`
      },
      {
        title: "Dict Comprehension и Generator Expression",
        desc: "Генерация словарей и экономичные генераторы в круглых скобках.",
        code: `users = ["alex", "elena", "maxim"]

# Dict Comprehension
user_lengths = {u.title(): len(u) for u in users}
print("Словарь длин имен (Dict):", user_lengths)

# Generator Expression (вычисляется лениво, не занимает память)
gen = (x ** 2 for x in range(1, 6))
print("Объект-генератор:", gen)
print("Сумма значений генератора:", sum(gen))`
      }
    ]
  },

  // 14. ОБРАБОТКА ОШИБОК
  {
    id: "exceptions",
    title: "ОБРАБОТКА ОШИБОК",
    category: "Продвинутый Python",
    icon: "🛡️",
    summary: [
      "try:\n    рискованный_код",
      "except SpecificError as e:\n    обработать_ошибку",
      "else:\n    код_без_ошибки",
      "finally:\n    очистка_ресурсов",
      "raise ValueError(\"сообщение\")"
    ],
    theory: `
      <h3>Блоки обработки исключений:</h3>
      <ul>
        <li><code>try</code> — блок с кодом, в котором может возникнуть ошибка.</li>
        <li><code>except ExceptionType as e</code> — перехватывает конкретный тип ошибки.</li>
        <li><code>else</code> — выполняется <strong>только если</strong> в блоке <code>try</code> не произошло ошибок.</li>
        <li><code>finally</code> — выполняется <strong>всегда</strong>, даже при возникновении исключения или вызове <code>return</code>.</li>
        <li><code>raise</code> — принудительный выброс исключения.</li>
      </ul>
    `,
    examples: [
      {
        title: "Полная цепочка: try - except - else - finally",
        desc: "Корректная обработка деления на ноль с блоками else и finally.",
        code: `def safe_divide(a, b):
    try:
        print(f"Попытка деления {a} / {b}:")
        result = a / b
    except ZeroDivisionError as err:
        print(f"❌ Перехвачена ошибка: {err}")
    else:
        print(f"✅ Успешно! Результат = {result}")
    finally:
        print("🔒 [Блок finally: операция завершена]\\n")

safe_divide(10, 2)
safe_divide(10, 0)`
      },
      {
        title: "Выброс исключений оператором raise",
        desc: "Валидация входных данных и генерация собственного ValueError.",
        code: `def set_user_age(age):
    if not isinstance(age, int):
        raise TypeError(f"Возраст должен быть числом, получено: {type(age).__name__}")
    if age < 0 or age > 120:
        raise ValueError(f"Некорректный возраст: {age} (допустимо от 0 до 120)")
    return f"Возраст {age} успешно сохранён."

try:
    print(set_user_age(25))
    print(set_user_age(-5))
except ValueError as e:
    print(f"❌ Ошибка валидации: {e}")`
      }
    ]
  },

  // 15. РАБОТА С ФАЙЛАМИ
  {
    id: "files",
    title: "РАБОТА С ФАЙЛАМИ",
    category: "Ввод-вывод",
    icon: "📁",
    summary: [
      "Чтение: with open('file.txt', 'r', encoding='utf-8') as f:\n    data = f.read()",
      "Запись: with open('file.txt', 'w', encoding='utf-8') as f:\n    f.write('текст')",
      "Чтение строк: f.readlines()",
      "Запись строк: f.writelines(lines)",
      "Режимы: 'r' — чтение, 'w' — запись, 'a' — добавление, 'x' — создание",
      "Добавьте 'b' для бинарного режима, 't' — для текстового (по умолчанию)"
    ],
    theory: `
      <h3>Режимы открытия файлов:</h3>
      <table class="theory-table">
        <thead><tr><th>Режим</th><th>Назначение</th><th>Поведение</th></tr></thead>
        <tbody>
          <tr><td><code>'r'</code></td><td>Чтение (по умолчанию)</td><td>Ошибка, если файл не существует.</td></tr>
          <tr><td><code>'w'</code></td><td>Перезапись</td><td>Создаёт новый или перезаписывает существующий файл.</td></tr>
          <tr><td><code>'a'</code></td><td>Дозапись (append)</td><td>Добавляет новые данные в конец файла.</td></tr>
          <tr><td><code>'x'</code></td><td>Эксклюзивное создание</td><td>Ошибка <code>FileExistsError</code>, если файл уже есть.</td></tr>
          <tr><td><code>'b' / 't'</code></td><td>Бинарный / Текстовый</td><td><code>'rb'</code>, <code>'wb'</code> для работы с байтами (изображения, zip).</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Запись и чтение файла через with open (read, write)",
        desc: "Запись текста и чтение содержимого файла с кодировкой UTF-8.",
        code: `# Запись в файл в виртуальной файловой системе Pyodide
with open("test_file.txt", "w", encoding="utf-8") as file:
    file.write("Первая строка: Python 3.12\\n")
    file.write("Вторая строка: Файловые операции\\n")

# Чтение файла целиком
with open("test_file.txt", "r", encoding="utf-8") as file:
    content = file.read()

print("Прочитано из файла:")
print(content)`
      },
      {
        title: "Построчное чтение и запись: readlines() и writelines()",
        desc: "Чтение файла в список строк и запись списка строк обратно.",
        code: `lines_to_write = [
    "Сервер запущен\\n",
    "Подключение к БД успешно\\n",
    "Готов к приему запросов\\n"
]

with open("log.txt", "w", encoding="utf-8") as f:
    f.writelines(lines_to_write)

with open("log.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Всего прочитано строк: {len(lines)}")
for i, line in enumerate(lines, 1):
    print(f"Строка #{i}: {line.strip()}")`
      },
      {
        title: "Дозапись в файл (режим 'a') и бинарный режим 'wb' / 'rb'",
        desc: "Режим добавления 'a' и работа с байтами 'rb'/'wb'.",
        code: `# Дозапись в конец существующего файла
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Новое событие: клиент подключен\\n")

# Бинарная запись байтов
with open("data.bin", "wb") as f:
    f.write(b"\\x00\\xFF\\xFE\\xFD\\x01\\x02")

with open("data.bin", "rb") as f:
    binary_data = f.read()

print("Прочитанные байты:", binary_data)`
      }
    ]
  },

  // 16. МОДУЛИ И ИМПОРТЫ
  {
    id: "modules",
    title: "МОДУЛИ И ИМПОРТЫ",
    category: "Архитектура",
    icon: "📦",
    summary: [
      "import math",
      "from math import sqrt",
      "import numpy as np",
      "from module import name as alias",
      "from module import *   (избегайте)",
      "if __name__ == '__main__':\n    main()"
    ],
    theory: `
      <h3>Импорты в Python:</h3>
      <ul>
        <li><code>import math</code> — импортирует весь модуль, доступ через точку: <code>math.sqrt(16)</code>.</li>
        <li><code>from math import sqrt, pi</code> — импортирует конкретные функции или переменные напрямую.</li>
        <li><code>import module as alias</code> — задаёт удобный псевдоним (алиас).</li>
        <li><code>if __name__ == '__main__':</code> — блок кода, который выполняется только при прямом запуске скрипта, а не при импорте.</li>
      </ul>
    `,
    examples: [
      {
        title: "Варианты импортов: модуль, функция и псевдонимы (as)",
        desc: "Использование import, from ... import и псевдонимов alias.",
        code: `import math
from math import pi, pow as power_fn

print(f"Квадратный корень math.sqrt(25): {math.sqrt(25)}")
print(f"Константа pi: {pi:.4f}")
print(f"Функция power_fn(2, 4): {power_fn(2, 4)}")`
      },
      {
        title: "Конструкция if __name__ == '__main__'",
        desc: "Защита кода от выполнения при импорте в другие файлы.",
        code: `def calculate_vat(price):
    return price * 0.20

def main():
    price = 10000
    vat = calculate_vat(price)
    print(f"Прямой запуск скрипта (__name__ == '{__name__}'):")
    print(f"Цена: {price}, НДС (20%): {vat}")

if __name__ == "__main__":
    main()`
      }
    ]
  },

  // 17. ЧАСТО ИСПОЛЬЗУЕМЫЕ МОДУЛИ
  {
    id: "common_modules",
    title: "ЧАСТО ИСПОЛЬЗУЕМЫЕ МОДУЛИ",
    category: "Стандартная библиотека",
    icon: "🧰",
    summary: [
      "math          → statistics",
      "random        → datetime",
      "os            → sys",
      "pathlib       → re",
      "json          → csv",
      "collections   → itertools",
      "functools     → decimal",
      "sqlite3       → subprocess",
      "logging       → argparse"
    ],
    theory: `
      <h3>Стандартная библиотека Python:</h3>
      <p>Python поставляется с обширным набором встроенных библиотек («Batteries Included»).</p>

      <table class="theory-table">
        <thead><tr><th>Модуль</th><th>Назначение</th></tr></thead>
        <tbody>
          <tr><td><code>json</code> / <code>csv</code></td><td>Сериализация и парсинг JSON-данных и CSV-таблиц.</td></tr>
          <tr><td><code>collections</code> / <code>itertools</code></td><td>Специализированные структуры (Counter, defaultdict) и комбинаторика.</td></tr>
          <tr><td><code>math</code> / <code>statistics</code></td><td>Математические формулы, медианы, дисперсии.</td></tr>
          <tr><td><code>functools</code> / <code>random</code></td><td>Кэширование lru_cache, генерация случайных чисел.</td></tr>
          <tr><td><code>pathlib</code> / <code>os</code></td><td>Кроссплатформенная работа с путями и файловой системой.</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Модуль json: dumps() и loads()",
        desc: "Преобразование Python-словарей в строку JSON и парсинг обратно.",
        code: `import json

data = {
    "user": "Ильнур",
    "skills": ["Python", "Algorithms", "Wasm"],
    "is_active": True,
    "rating": 4.95
}

# 1. Сериализация в JSON-строку (dumps)
json_string = json.dumps(data, ensure_ascii=False, indent=2)
print("JSON-строка:\\n" + json_string)

# 2. Десериализация обратно в Python dict (loads)
parsed_data = json.loads(json_string)
print(f"\\nПрочитано: {parsed_data['user']}, навыков: {len(parsed_data['skills'])}")`
      },
      {
        title: "Модули collections (Counter) и statistics (mean, median)",
        desc: "Подсчет элементов с Counter и статистические функции.",
        code: `from collections import Counter
import statistics

words = ["python", "code", "dev", "python", "ai", "python", "dev"]
counter = Counter(words)
print("Частота слов (Counter):", dict(counter))
print("Самое частое слово (most_common):", counter.most_common(1))

grades = [85, 90, 78, 92, 88, 95]
print(f"Среднее (mean): {statistics.mean(grades):.1f}")
print(f"Медиана (median): {statistics.median(grades)}")`
      },
      {
        title: "Модули random и functools (lru_cache)",
        desc: "Случайный выбор элементов и ускорение функций кэшированием.",
        code: `import random
from functools import lru_cache

# random выбор
items = ["Яблоко", "Банан", "Апельсин", "Манго"]
print("Случайный выбор (choice):", random.choice(items))
print("Случайное число 1..100:", random.randint(1, 100))

# lru_cache для оптимизации рекурсии
@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print("Фибоначчи(30) с кэшированием lru_cache:", fib(30))`
      }
    ]
  },

  // 18. DATETIME
  {
    id: "datetime",
    title: "DATETIME",
    category: "Стандартная библиотека",
    icon: "⏰",
    summary: [
      "from datetime import datetime, timedelta, timezone, date, time",
      "Сейчас: datetime.now()",
      "UTC: datetime.now(timezone.utc)",
      "Дата: date(2024, 5, 20)   Время: time(12, 30)",
      "Добавить/вычесть: timedelta(days=1)",
      "Формат: now.strftime('%Y-%m-%d %H:%M:%S')",
      "Разбор: datetime.strptime(text, '%Y-%m-%d')"
    ],
    theory: `
      <h3>Работа с датой и временем:</h3>
      <ul>
        <li><code>datetime.now()</code> — текущее локальное время.</li>
        <li><code>datetime.now(timezone.utc)</code> — время в формате UTC с таймзоной.</li>
        <li><code>strftime(fmt)</code> (String Format Time) — форматирование объекта даты в строку.</li>
        <li><code>strptime(str, fmt)</code> (String Parse Time) — парсинг строки в объект <code>datetime</code>.</li>
        <li><code>timedelta(days, hours, minutes)</code> — смещение во времени для арифметических расчетов.</li>
      </ul>
    `,
    examples: [
      {
        title: "Текущее время, таймзона UTC и объекты date/time",
        desc: "Получение текущего времени и создание отдельных объектов date и time.",
        code: `from datetime import datetime, timezone, date, time

now_local = datetime.now()
now_utc = datetime.now(timezone.utc)

print(f"Локальное время: {now_local}")
print(f"UTC время: {now_utc}")

d = date(2026, 8, 27)
t = time(14, 30, 0)
print(f"Объект date: {d}, Объект time: {t}")`
      },
      {
        title: "Форматирование (strftime) и парсинг строк (strptime)",
        desc: "Преобразование даты в строку нужного формата и обратно.",
        code: `from datetime import datetime

now = datetime.now()

# 1. strftime: объект -> красивая строка
formatted = now.strftime("%d.%m.%Y %H:%M:%S")
print("Отформатированная дата (strftime):", formatted)

# 2. strptime: строка -> объект datetime
date_str = "2026-12-31 23:59:00"
parsed_date = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
print("Распарсенная дата (strptime):", parsed_date)
print(f"Извлечен год: {parsed_date.year}, месяц: {parsed_date.month}")`
      },
      {
        title: "Арифметика дат: интервалы timedelta",
        desc: "Вычисление будущих дедлайнов и разницы между датами.",
        code: `from datetime import datetime, timedelta

start_date = datetime.now()
deadline = start_date + timedelta(days=14, hours=6)

print(f"Старт: {start_date.strftime('%d.%m.%Y')}")
print(f"Дедлайн (+14 дней 6 ч): {deadline.strftime('%d.%m.%Y %H:%M')}")

# Разница между двумя датами
diff = deadline - start_date
print(f"Разница в днях: {diff.days}, всего секунд: {diff.total_seconds():.0f}")`
      }
    ]
  },

  // 19. РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ
  {
    id: "regex",
    title: "РЕГУЛЯРНЫЕ ВЫРАЖЕНИЯ",
    category: "Работа с текстом",
    icon: "🔍",
    summary: [
      "Поиск: re.search(r'\\d+', text)",
      "Совпадение: re.match(r'Hello', text)",
      "Найти все: re.findall(r'\\w+', text)",
      "Замена: re.sub(r'\\d+', 'x', text)",
      "Шаблоны: \\d цифра   \\w слово   \\s пробел",
      ". любой символ   ^ начало   $ конец"
    ],
    theory: `
      <h3>Модуль re:</h3>
      <table class="theory-table">
        <thead><tr><th>Функция</th><th>Назначение</th></tr></thead>
        <tbody>
          <tr><td><code>re.search(pattern, text)</code></td><td>Ищет первое совпадение в любом месте строки.</td></tr>
          <tr><td><code>re.match(pattern, text)</code></td><td>Проверяет совпадение строго с <strong>начала</strong> строки.</td></tr>
          <tr><td><code>re.findall(pattern, text)</code></td><td>Возвращает список всех найденных непересекающихся совпадений.</td></tr>
          <tr><td><code>re.sub(pattern, repl, text)</code></td><td>Заменяет найденные совпадения на строку <code>repl</code>.</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Поиск и извлечение данных: re.findall() и re.search()",
        desc: "Поиск всех email-адресов и телефонов в тексте.",
        code: `import re

log_entry = "Пользователь user_test@mail.ru оформил заказ №8942 на сумму 15400 руб. Телефон: +7-999-123-45-67."

# re.findall: список всех совпадений
emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}', log_entry)
numbers = re.findall(r'\\d+', log_entry)

print("Найденные email (findall):", emails)
print("Найденные числа (findall):", numbers)

# re.search: первое совпадение с объектом Match
match = re.search(r'№(\\d+)', log_entry)
if match:
    print(f"Номер заказа (search group): {match.group(1)}")`
      },
      {
        title: "Проверка начала строки (re.match) и замена (re.sub)",
        desc: "Проверка формата строки с начала и замена конфиденциальных данных.",
        code: `import re

# 1. re.match — строго с начала строки
url1 = "https://example.com"
url2 = "www.example.com"

print("url1 начинается с https://?", bool(re.match(r'^https://', url1)))
print("url2 начинается с https://?", bool(re.match(r'^https://', url2)))

# 2. re.sub — замена по регулярному выражению
card_info = "Карта клиента: 4276-5500-1234-5678"
masked_card = re.sub(r'\\d{4}-\\d{4}-\\d{4}-(\\d{4})', r'****-****-****-\\1', card_info)
print("Маскированная карта (re.sub):", masked_card)`
      }
    ]
  },

  // 20. ПОЛЕЗНЫЕ ВСТРОЕННЫЕ ФУНКЦИИ
  {
    id: "builtins",
    title: "ПОЛЕЗНЫЕ ВСТРОЕННЫЕ ФУНКЦИИ",
    category: "Стандартная библиотека",
    icon: "🛠️",
    summary: [
      "print()   len()   type()   isinstance()",
      "str()   int()   float()   bool()",
      "list()   tuple()   set()   dict()",
      "range()   enumerate()   zip()",
      "map()   filter()   sorted()   reversed()",
      "sum()   min()   max()   any()   all()",
      "abs()   round()   open()   input()"
    ],
    theory: `
      <h3>Встроенные функции (Built-ins):</h3>
      <p>Встроены в глобальное пространство имён Python и всегда доступны без импорта.</p>

      <table class="theory-table">
        <thead><tr><th>Группа</th><th>Функции</th><th>Описание</th></tr></thead>
        <tbody>
          <tr><td>Преобразование типов</td><td><code>int, float, str, bool, list, tuple, set, dict</code></td><td>Приведение значений к нужным типам.</td></tr>
          <tr><td>Итерация и коллекции</td><td><code>range, enumerate, zip, sorted, reversed, map, filter</code></td><td>Создание последовательностей, сортировка, фильтрация.</td></tr>
          <tr><td>Агрегация</td><td><code>sum, min, max, any, all, len</code></td><td>Подсчет суммы, минимума, максимума, логическая проверка всех/хотя бы одного.</td></tr>
          <tr><td>Числовые функции</td><td><code>abs, round, divmod, pow</code></td><td>Модуль числа, математическое округление.</td></tr>
        </tbody>
      </table>
    `,
    examples: [
      {
        title: "Агрегация: sum, min, max, len, any, all",
        desc: "Вычисление статистик и проверка условий для коллекций.",
        code: `scores = [85, 92, 78, 99, 64]

print(f"Длина коллекции (len): {len(scores)}")
print(f"Сумма (sum): {sum(scores)}")
print(f"Минимум (min): {min(scores)}, Максимум (max): {max(scores)}")

# any — хотя бы один элемент удовлетворяет условию
print("Есть ли отличники (>90)? (any):", any(s >= 90 for s in scores))
# all — ВСЕ элементы удовлетворяют условию
print("Все ли сдали (>60)? (all):", all(s >= 60 for s in scores))`
      },
      {
        title: "Преобразование коллекций: map(), filter(), sorted(), reversed()",
        desc: "Использование map, filter, sorted и reversed со списками.",
        code: `nums = [3, -1, 4, -5, 2, 0]

# 1. filter — оставить только положительные
positives = list(filter(lambda x: x > 0, nums))
print("Положительные (filter):", positives)

# 2. map — удвоить каждый элемент
doubled = list(map(lambda x: x * 2, positives))
print("Удвоенные (map):", doubled)

# 3. sorted — сортировка по возрастанию и убыванию
print("Сортировка (sorted):", sorted(nums))
print("Сортировка по убыванию:", sorted(nums, reverse=True))

# 4. reversed — обратный порядок
print("Разворот (reversed):", list(reversed(sorted(nums))))`
      },
      {
        title: "Числовые функции и приведение типов: abs, round, int, float, str, bool",
        desc: "Использование abs, round и конструкторов типов.",
        code: `print("Модуль числа abs(-42):", abs(-42))
print("Округление round(3.14159, 2):", round(3.14159, 2))

# Конструкторы типов
num_from_str = int("150")
float_from_int = float(42)
bool_check = bool("не пустая строка")
str_num = str(12345)

print(f"int: {num_from_str}, float: {float_from_int}, bool: {bool_check}, str: {repr(str_num)}")`
      }
    ]
  },

  // 21. ВИРТУАЛЬНОЕ ОКРУЖЕНИЕ И ПАКЕТЫ
  {
    id: "venv",
    title: "ВИРТУАЛЬНОЕ ОКРУЖЕНИЕ И ПАКЕТЫ",
    category: "Инструменты",
    icon: "🌐",
    summary: [
      "Создать venv: python -m venv .venv",
      "Активация (Windows): .venv\\Scripts\\activate",
      "Активация (macOS/Linux): source .venv/bin/activate",
      "Деактивация: deactivate",
      "Установка: python -m pip install package",
      "Обновление: python -m pip install --upgrade package",
      "Удаление: python -m pip uninstall package",
      "Зафиксировать зависимости: pip freeze > requirements.txt"
    ],
    theory: `
      <h3>Виртуальное окружение venv и менеджер pip:</h3>
      <p>Виртуальное окружение изолирует библиотеки конкретного проекта от глобальной системы и предотвращает конфликты версий.</p>

      <h3>Основные команды терминала:</h3>
      <ul>
        <li><code>python -m venv .venv</code> — создание окружения в папке <code>.venv</code>.</li>
        <li><code>source .venv/bin/activate</code> (Linux/macOS) или <code>.venv\\Scripts\\activate</code> (Windows) — активация окружения.</li>
        <li><code>python -m pip install package_name</code> — установка пакета.</li>
        <li><code>pip freeze > requirements.txt</code> — сохранение точного списка всех зависимостей проекта.</li>
      </ul>
    `,
    examples: [
      {
        title: "Исследование путей и окружения sys.executable / sys.path",
        desc: "Проверка активного интерпретатора и путей импорта модулей.",
        code: `import sys

print("Версия Python:", sys.version.split()[0])
print("Исполняемый файл интерпретатора:", sys.executable)
print("\\nПервые 3 пути поиска модулей (sys.path):")
for path in sys.path[:3]:
    print(" •", path)`
      },
      {
        title: "Парсинг и генерация requirements.txt",
        desc: "Программная обработка формата зависимостей requirements.txt.",
        code: `raw_requirements = """
requests==2.31.0
fastapi>=0.110.0
pytest>=8.0.0
"""

# Парсинг зависимостей
packages = {}
for line in raw_requirements.strip().splitlines():
    if "==" in line:
        pkg, ver = line.split("==")
        packages[pkg] = ("==", ver)
    elif ">=" in line:
        pkg, ver = line.split(">=")
        packages[pkg] = (">=", ver)

print("Распарсенные пакеты из requirements.txt:")
for pkg, (op, ver) in packages.items():
    print(f"📦 Пакет: {pkg:<10} Требование: {op} {ver}")`
      }
    ]
  },

  // 22. ТЕСТИРОВАНИЕ (PYTEST)
  {
    id: "testing",
    title: "ТЕСТИРОВАНИЕ (PYTEST)",
    category: "Инструменты",
    icon: "🧪",
    summary: [
      "Установка: python -m pip install pytest",
      "Запуск: pytest",
      "Тестовый файл: test_*.py",
      "Тестовая функция: def test_...():",
      "Используйте assert для проверок",
      "Фикстуры: @pytest.fixture",
      "Мокайте внешние зависимости"
    ],
    theory: `
      <h3>Тестирование кода (Pytest и assert):</h3>
      <p>В Python для тестов используется простой оператор <code>assert выражение, сообщение_об_ошибке</code>. Pytest автоматически находит все файлы <code>test_*.py</code> и функции <code>def test_*():</code>.</p>

      <h3>Преимущества Pytest:</h3>
      <ul>
        <li>Чистый синтаксис <code>assert</code> без шаблонных классов <code>unittest</code>.</li>
        <li><strong>Фикстуры (Fixtures):</strong> подготовка тестовых данных через декоратор <code>@pytest.fixture</code>.</li>
      </ul>
    `,
    examples: [
      {
        title: "Тестирование функций с помощью проверок assert",
        desc: "Написание модульных тестов с проверкой корректных результатов и исключений.",
        code: `def calculate_discount(price, discount):
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

print("✅ Все 3 модульных теста успешно пройдены!")`
      },
      {
        title: "Имитация фикстур данных (Fixtures)",
        desc: "Паттерн подготовки тестовых данных для изоляции тестов.",
        code: `def get_test_user_fixture():
    """Имитация фикстуры pytest: возвращает тестового пользователя."""
    return {"id": 1, "username": "tester", "balance": 1500}

def test_withdraw_success():
    user = get_test_user_fixture()
    amount = 500
    user["balance"] -= amount
    assert user["balance"] == 1000, "Баланс должен уменьшиться на 500"
    print("✅ test_withdraw_success пройден")

test_withdraw_success()`
      }
    ]
  },

  // 23. ЛОГИРОВАНИЕ
  {
    id: "logging",
    title: "ЛОГИРОВАНИЕ",
    category: "Инструменты",
    icon: "📜",
    summary: [
      "import logging",
      "logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')",
      "log = logging.getLogger(__name__)",
      "log.debug(\"Отладочное сообщение\")",
      "log.info(\"Информационное сообщение\")",
      "log.warning(\"Предупреждение\")",
      "log.error(\"Сообщение об ошибке\")"
    ],
    theory: `
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
    `,
    examples: [
      {
        title: "Настройка логгера и вывод уровней INFO, WARNING, ERROR",
        desc: "Использование StreamHandler, Formatter и уровней логирования.",
        code: `import logging
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
logger.error("Ошибка сохранения данных в файл: Permission Denied")`
      }
    ]
  },

  // 24. ЧАСТЫЕ ИСКЛЮЧЕНИЯ
  {
    id: "common_exceptions",
    title: "ЧАСТЫЕ ИСКЛЮЧЕНИЯ",
    category: "Ошибки",
    icon: "⚠️",
    summary: [
      "ValueError           → TypeError",
      "IndexError           → KeyError",
      "AttributeError       → NameError",
      "FileNotFoundError    → ZeroDivisionError",
      "ImportError          → ModuleNotFoundError",
      "RuntimeError         → Exception (базовый класс)"
    ],
    theory: `
      <h3>Иерархия стандартных исключений:</h3>
      <ul>
        <li><code>TypeError</code> — операция к неподходящему типу (например, сложение <code>"5" + 5</code>).</li>
        <li><code>ValueError</code> — тип верный, но неподходящее значение (например, <code>int("abc")</code>).</li>
        <li><code>IndexError</code> — обращение по несуществующему индексу списка.</li>
        <li><code>KeyError</code> — обращение по отсутствующему ключу словаря.</li>
        <li><code>AttributeError</code> — обращение к несуществующему методу или полю объекта.</li>
        <li><code>NameError</code> — обращение к необъявленной переменной.</li>
        <li><code>FileNotFoundError</code> — файл не найден по указанному пути.</li>
        <li><code>ZeroDivisionError</code> — деление на 0.</li>
      </ul>
    `,
    examples: [
      {
        title: "Демонстрация TypeError, ValueError, KeyError, IndexError",
        desc: "Примеры возникновения и перехвата типичных ошибок.",
        code: `# 1. TypeError
try:
    res = "Сумма: " + 100
except TypeError as e:
    print(f"❌ Перехвачен TypeError: {e}")

# 2. ValueError
try:
    num = int("не число")
except ValueError as e:
    print(f"❌ Перехвачен ValueError: {e}")

# 3. KeyError
data = {"a": 1}
try:
    val = data["b"]
except KeyError as e:
    print(f"❌ Перехвачен KeyError (нет ключа): {e}")

# 4. IndexError
items = [1, 2, 3]
try:
    elem = items[10]
except IndexError as e:
    print(f"❌ Перехвачен IndexError: {e}")`
      },
      {
        title: "Демонстрация AttributeError, NameError, ZeroDivisionError",
        desc: "Перехват ошибок доступа к атрибутам, переменным и деления.",
        code: `# 1. AttributeError
number = 42
try:
    number.append(10) # У int нет метода append
except AttributeError as e:
    print(f"❌ Перехвачен AttributeError: {e}")

# 2. ZeroDivisionError
try:
    bad_math = 100 / 0
except ZeroDivisionError as e:
    print(f"❌ Перехвачен ZeroDivisionError: {e}")

# 3. NameError
try:
    print(undefined_variable)
except NameError as e:
    print(f"❌ Перехвачен NameError: {e}")`
      }
    ]
  },

  // 25. ЛУЧШИЕ ПРАКТИКИ
  {
    id: "best_practices",
    title: "ЛУЧШИЕ ПРАКТИКИ",
    category: "Мастерство",
    icon: "✨",
    summary: [
      "Пишите читаемый и поддерживаемый код",
      "Следуйте рекомендациям PEP 8",
      "Используйте понятные имена",
      "Делайте функции небольшими и сфокусированными",
      "Пишите докстроки и аннотации типов",
      "Избегайте глобального состояния",
      "Обрабатывайте конкретные исключения",
      "Проверяйте пользовательский ввод",
      "Используйте виртуальные окружения",
      "Пишите тесты",
      "Обновляйте зависимости"
    ],
    theory: `
      <h3>Принципы чистого кода (PEP 8 и Zen of Python):</h3>
      <ul>
        <li><strong>Явное лучше неявного:</strong> пишите прозрачные алгоритмы и осмысленные имена переменных.</li>
        <li><strong>Аннотации типов (Type Hints):</strong> повышают надёжность и упрощают рефакторинг.</li>
        <li><strong>Документирование:</strong> качественные docstrings объясняют контракт функции (параметры и возвращаемое значение).</li>
        <li><strong>Принцип единой ответственности:</strong> одна функция решает ровно одну задачу.</li>
      </ul>
    `,
    examples: [
      {
        title: "Оформление функции по стандартам PEP 8 и PEP 484",
        desc: "Использование Type Hints, docstrings, валидации и понятных имён.",
        code: `from typing import List, Optional

def filter_active_users(
    users: List[dict],
    min_rating: float = 4.0
) -> List[str]:
    """Фильтрует список пользователей по статусу активности и рейтингу.

    Args:
        users: Список словарей с данными пользователей.
        min_rating: Минимальный порог рейтинга (по умолчанию 4.0).

    Returns:
        Список имён прошедших проверку пользователей.
    """
    result: List[str] = []
    for user in users:
        if user.get("is_active") and user.get("rating", 0) >= min_rating:
            result.append(user["name"])
    return result

sample_data = [
    {"name": "Иван", "is_active": True, "rating": 4.8},
    {"name": "Анна", "is_active": False, "rating": 5.0},
    {"name": "Петр", "is_active": True, "rating": 3.9}
]

print("Активные топ-пользователи:", filter_active_users(sample_data))`
      }
    ]
  },

  // 26. ЧАСТЫЕ ОШИБКИ
  {
    id: "common_mistakes",
    title: "ЧАСТЫЕ ОШИБКИ",
    category: "Ошибки",
    icon: "🚫",
    summary: [
      "Изменяемые аргументы по умолчанию: def f(x=[]): (избегайте)",
      "Неправильное использование == и is",
      "Изменение списка во время итерации",
      "Не закрывать файлы",
      "Слишком общий except: (избегайте bare except)",
      "Захардкоженные секреты",
      "Игнорирование граничных случаев",
      "Преждевременная оптимизация до профилирования"
    ],
    theory: `
      <h3>Опасные ловушки в Python:</h3>
      <ul>
        <li><strong>Изменяемый аргумент по умолчанию:</strong> значение по умолчанию инициализируется <em>один раз</em> при объявлении функции, а не при каждом её вызове. Если указать <code>def fn(lst=[])</code>, список станет общим для всех вызовов.</li>
        <li><strong>Модификация коллекции при итерации:</strong> удаление элементов из списка прямо внутри цикла <code>for x in items:</code> приводит к пропуску элементов из-за сдвига индексов.</li>
        <li><strong>Пустой except (bare except):</strong> перехватывает служебные сигналы <code>KeyboardInterrupt</code> и <code>SystemExit</code>. Всегда указывайте конкретный класс ошибки.</li>
      </ul>
    `,
    examples: [
      {
        title: "Ловушка: Изменяемый аргумент по умолчанию (Mutable Default)",
        desc: "Почему нельзя писать lst=[] в параметрах и как правильно использовать lst=None.",
        code: `# ❌ НЕПРАВИЛЬНО:
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
print("Второй вызов:", call2) # Изолирован, не содержит 'A'!`
      },
      {
        title: "Ловушка: Удаление элементов списка во время итерации",
        desc: "Как правильно фильтровать список без пропуска элементов.",
        code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]

# ❌ Ошибка: удаление numbers.remove(n) внутри for n in numbers

# ✅ Способ 1: Итерация по копии списка numbers[:]
for n in numbers[:]:
    if n % 2 == 0:
        numbers.remove(n)
print("Остались нечетные (через срез [:]):", numbers)

# ✅ Способ 2 (Лучший): List Comprehension
data = [10, 25, 30, 45, 50]
filtered = [x for x in data if x > 30]
print("Отфильтрованный список (comprehension):", filtered)`
      }
    ]
  },

  // 27. ПУТЬ К МАСТЕРСТВУ В PYTHON
  {
    id: "roadmap",
    title: "ПУТЬ К МАСТЕРСТВУ В PYTHON",
    category: "Мастерство",
    icon: "🏆",
    summary: [
      "Основы → Типы данных → Коллекции → Функции",
      "ООП → Модули → Исключения → Файлы → Итераторы",
      "Генераторы → Декораторы → Контекстные менеджеры",
      "Аннотации типов → Тестирование → Asyncio → Параллелизм",
      "API → Базы данных → Пакетирование → Git → Логирование",
      "Безопасность → Производительность → Продакшн → AI-разработка",
      "Мастерство Python"
    ],
    theory: `
      <h3>Ступени развития Python-разработчика:</h3>
      <ol>
        <li><strong>Базовый синтаксис:</strong> переменные, типы данных, циклы, функции, коллекции.</li>
        <li><strong>Продвинутый Python:</strong> ООП, генераторы (<code>yield</code>), декораторы (<code>@decorator</code>), менеджеры контекста (<code>__enter__/__exit__</code>).</li>
        <li><strong>Асинхронность и параллелизм:</strong> <code>asyncio</code>, <code>threading</code>, <code>multiprocessing</code>.</li>
        <li><strong>Бэкенд и экосистема:</strong> FastAPI / Django, PostgreSQL, Docker, Pytest, Git.</li>
      </ol>
    `,
    examples: [
      {
        title: "Паттерн: Декоратор замера времени выполнения",
        desc: "Создание пользовательского декоратора с использованием functools.wraps.",
        code: `import time
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

print("Результат:", compute_heavy_task(100_000))`
      },
      {
        title: "Паттерн: Генератор с инструкцией yield",
        desc: "Потоковая генерация последовательностей без расхода оперативной памяти.",
        code: `def fibonacci_stream(max_count):
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
print("конец")`
      }
    ]
  }
];
