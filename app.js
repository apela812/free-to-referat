const APP_STORAGE_KEY = "school-report-builder:project:v1";

const PAGE_HEIGHT_PX = 1123;
const PAGE_MARGIN_TOP_PX = 96;
const PAGE_MARGIN_BOTTOM_PX = 84;
const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - PAGE_MARGIN_TOP_PX - PAGE_MARGIN_BOTTOM_PX;

const EMPTY_META_DISPLAY = "Не указано";
const MISSING_SECTION_TITLE = "Название раздела отсутствует";
const MISSING_SECTION_CONTENT = "Нет данных для безопасного показа.";
const MISSING_REFERENCES_TEXT = "Список литературы отсутствует.";

const META_FIELDS = [
  "institution",
  "discipline",
  "topic",
  "author",
  "class_group",
  "city",
  "year",
];

const REPORT_SECTION_ORDER = ["1", "2.1", "2.2", "2.3", "3.1", "3.2", "3.3", "3.4", "4"];
const DOCUMENT_SECTION_ORDER = [...REPORT_SECTION_ORDER, "5"];

const DEFAULT_FORM_DATA = {
  institution: "",
  discipline: "",
  topic: "",
  author: "",
  class_group: "",
  city: "",
  year: "",
  source_text: "",
};

const FORM_FIELD_CONFIG = [
  {
    key: "institution",
    label: "Учебное учреждение",
    placeholder: "Например: МБОУ «Гимназия № 7»",
  },
  {
    key: "discipline",
    label: "Дисциплина",
    placeholder: "Например: История",
  },
  {
    key: "topic",
    label: "Тема",
    placeholder: "Например: Роль Петра I в истории России",
  },
  {
    key: "author",
    label: "Автор",
    placeholder: "Фамилия Имя Отчество",
  },
  {
    key: "class_group",
    label: "Класс / группа",
    placeholder: "Например: 9 «Б» класс",
  },
  {
    key: "city",
    label: "Город",
    placeholder: "Например: Новосибирск",
  },
  {
    key: "year",
    label: "Год",
    placeholder: "2026",
  },
];

const INTRO_WARNING_MARKERS = [
  { label: "актуальность", patterns: [/актуальн/i] },
  { label: "цель", patterns: [/\bцель\b/i, /целью работы/i] },
  { label: "задачи", patterns: [/\bзадач/i] },
  { label: "объект", patterns: [/\bобъект/i] },
  { label: "предмет", patterns: [/\bпредмет/i] },
];

const PLACEHOLDER_META_PATTERNS = [
  /^не указано$/i,
  /^неизвестно$/i,
  /^нет данных$/i,
  /^пример$/i,
  /^demo$/i,
  /^test$/i,
  /^\.*$/,
  /^-+$/,
];

const AVERAGE_CHARACTERS_PER_LINE = 82;
const APPROX_LINE_HEIGHT_PX = 29;
const SECTION_HEADING_HEIGHT_PX = 58;
const PARAGRAPH_GAP_PX = 14;
const REFERENCE_GAP_PX = 12;
const SECTION_TAIL_GAP_PX = 18;
const MIN_SPLIT_CHUNK_LENGTH = 140;
const DEFAULT_AUTHOR_BLOCK_TOP = 68;

const PROMPT_TEMPLATE = `Верни только валидный JSON. Не добавляй пояснений до JSON и после JSON. Не используй markdown. Не оборачивай ответ в \`\`\`json. Ответ должен успешно проходить JSON.parse().

Сгенерируй школьный реферат на русском языке строго по следующему JSON-контракту:

{
"schema_version": "ref_v1",
"document_type": "school_report_ru",
"meta": {
"institution": "",
"discipline": "",
"topic": "",
"author": "",
"class_group": "",
"city": "",
"year": ""
},
"sections": {
"1": {
"title": "Введение",
"content": ""
},
"2.1": {
"title": "",
"content": ""
},
"2.2": {
"title": "",
"content": ""
},
"2.3": {
"title": "",
"content": ""
},
"3.1": {
"title": "",
"content": ""
},
"3.2": {
"title": "",
"content": ""
},
"3.3": {
"title": "",
"content": ""
},
"3.4": {
"title": "",
"content": ""
},
"4": {
"title": "Заключение",
"content": ""
}
},
"references": [
""
]
}

Жёсткие требования:

1. Это должен быть именно школьный реферат в официальном учебном стиле на русском языке.
2. Верни строго только JSON по этой схеме.
3. Не добавляй дополнительные поля.
4. Не удаляй обязательные поля.
5. Все значения в meta должны быть строками.
6. Все поля title и content должны быть строками.
7. references должен быть массивом строк.
8. Раздел "1" всегда называется "Введение".
9. Раздел "4" всегда называется "Заключение".
10. Не добавляй содержание, номера страниц, титульный лист как отдельный текстовый блок или служебные пометки.
11. Внутри content не используй markdown, списки, подпункты, code blocks или нумерацию разделов.
12. Пиши связными абзацами.

Содержательные требования:

1. Во введении обязательно должны присутствовать:

* актуальность темы
* цель работы
* задачи работы
* объект исследования
* предмет исследования

2. Раздел "2.1" должен раскрывать понятие и значение темы.
3. Разделы "2.2" и "2.3" должны раскрывать два ключевых аспекта темы.
4. Раздел "3.1" должен содержать аналитическое сравнение или анализ по первому важному критерию.
5. Раздел "3.2" должен содержать аналитическое сравнение или анализ по второму важному критерию.
6. Раздел "3.3" должен раскрывать влияние внешнего фактора: технологий, цифровизации, среды, общества, культуры, экономики, законодательства или иного релевантного фактора.
7. Раздел "3.4" обязан содержать и проблемы, и перспективы развития темы.
8. Раздел "4" должен содержать итоговый вывод по всей работе.
9. references должен содержать от 6 до 8 правдоподобных источников на русском языке.

Требования к стилю:

* официальный учебный русский язык
* нейтральный академический тон
* без разговорной лексики
* без художественности
* без публицистики
* без списков внутри content
* без повторного написания номеров разделов внутри content

Если каких-то данных не хватает, всё равно сохрани структуру JSON и подставь нейтральные значения.

Заполни JSON по этим входным данным:

Учебное учреждение: [INSTITUTION]
Дисциплина: [DISCIPLINE]
Тема: [TOPIC]
Автор: [AUTHOR]
Класс / группа: [CLASS_GROUP]
Город: [CITY]
Год: [YEAR]

Исходный материал:
[SOURCE_TEXT]`;

const DEMO_FORM_DATA = {
  institution: "Муниципальное бюджетное общеобразовательное учреждение «Гимназия № 7»",
  discipline: "Обществознание",
  topic: "Влияние социальных сетей на современного подростка",
  author: "Иванов Артём Сергеевич",
  class_group: "9 «Б» класс",
  city: "Казань",
  year: "2026",
  source_text:
    "Социальные сети стали повседневной частью жизни подростков. Они используются для общения, получения новостей, обучения, развлечения и самопрезентации. Вместе с положительными возможностями возникают риски: снижение концентрации внимания, зависимость от цифрового одобрения, распространение недостоверной информации и изменение форм межличностного общения. Важно рассмотреть и преимущества, и ограничения социальных сетей, а также определить условия их более безопасного и осмысленного использования.",
};

const DEMO_REPORT = {
  schema_version: "ref_v1",
  document_type: "school_report_ru",
  meta: {
    institution: DEMO_FORM_DATA.institution,
    discipline: DEMO_FORM_DATA.discipline,
    topic: DEMO_FORM_DATA.topic,
    author: DEMO_FORM_DATA.author,
    class_group: DEMO_FORM_DATA.class_group,
    city: DEMO_FORM_DATA.city,
    year: DEMO_FORM_DATA.year,
  },
  sections: {
    "1": {
      title: "Введение",
      content:
        "Актуальность темы определяется тем, что социальные сети стали одной из ключевых сред общения, получения информации и самовыражения современных подростков. Цель работы заключается в анализе влияния социальных сетей на поведение, интересы и учебную активность подростков. Для достижения поставленной цели необходимо рассмотреть сущность социальных сетей, выявить их положительные и отрицательные стороны, проанализировать влияние цифровой среды и определить проблемы и перспективы дальнейшего развития данной сферы. Объект исследования представляет собой цифровую коммуникационную среду подростков. Предмет исследования составляет воздействие социальных сетей на общение, эмоциональное состояние и повседневную деятельность подростков.",
    },
    "2.1": {
      title: "Понятие социальных сетей и их значение в жизни подростков",
      content:
        "Социальные сети представляют собой цифровые платформы, которые обеспечивают обмен сообщениями, публикацию материалов и участие в сетевых сообществах. Для подростков они выступают не только каналом коммуникации, но и пространством социализации, где формируются представления о нормах поведения, успехе и принадлежности к группе. Значение социальных сетей связано с тем, что они объединяют информационную, коммуникативную и культурную функции, влияя на мировоззрение и повседневные привычки пользователей.",
    },
    "2.2": {
      title: "Положительные возможности социальных сетей",
      content:
        "Социальные сети создают для подростков дополнительные возможности общения, обучения и творческой самореализации. Через цифровые платформы школьники поддерживают контакт с одноклассниками, находят тематические сообщества, получают доступ к образовательным материалам и быстро обмениваются полезной информацией. Важным преимуществом является развитие цифровой грамотности, навыков самопрезентации и умения работать с различными форматами контента. При разумном использовании социальные сети становятся инструментом расширения кругозора и сотрудничества.",
    },
    "2.3": {
      title: "Негативные последствия чрезмерного использования",
      content:
        "Наряду с достоинствами социальные сети несут и ряд рисков. Чрезмерное пребывание в цифровой среде может снижать способность к длительной концентрации, усиливать зависимость от оценок и реакций аудитории, а также провоцировать тревожность. Подростки нередко сталкиваются с недостоверной информацией, агрессивными комментариями и навязчивыми образами успешности. Кроме того, избыточное время в сети способно вытеснять живое общение, спорт и другие формы полезной офлайн-активности, что отрицательно влияет на общее развитие личности.",
    },
    "3.1": {
      title: "Анализ влияния на учебную деятельность",
      content:
        "Влияние социальных сетей на учебную деятельность носит двойственный характер. С одной стороны, цифровые платформы позволяют быстро обмениваться учебными материалами, обсуждать задания и находить дополнительные источники информации. С другой стороны, постоянные уведомления, короткие форматы контента и привычка к быстрому переключению внимания затрудняют сосредоточенную работу. Сравнительный анализ показывает, что положительный эффект проявляется при целенаправленном использовании сетевых ресурсов для обучения, тогда как бесконтрольное потребление развлекательного контента чаще приводит к снижению продуктивности.",
    },
    "3.2": {
      title: "Анализ влияния на общение и эмоциональное состояние",
      content:
        "Социальные сети заметно изменяют формы общения подростков и отражаются на их эмоциональном состоянии. Онлайн-коммуникация расширяет круг контактов и помогает поддерживать связь, однако не всегда способна заменить личное взаимодействие. Зависимость от лайков, комментариев и визуального сравнения с другими пользователями может усиливать неуверенность и тревожность. Анализ показывает, что цифровое общение полезно как дополнительный канал взаимодействия, но при доминировании над реальными контактами оно увеличивает риск социальной изоляции и эмоционального напряжения.",
    },
    "3.3": {
      title: "Влияние цифровой среды и общественных факторов",
      content:
        "Воздействие социальных сетей усиливается особенностями современной цифровой среды. Развитие мобильных технологий делает интернет практически непрерывной частью повседневной жизни, а алгоритмы рекомендаций формируют индивидуальные информационные потоки, влияющие на интересы и взгляды подростков. Существенное значение имеют и общественные факторы: популяризация блогерской культуры, коммерциализация внимания, высокая скорость распространения информации и изменения норм общения. Поэтому проблема влияния социальных сетей связана не только с личным выбором пользователя, но и с устройством цифровой культуры в целом.",
    },
    "3.4": {
      title: "Проблемы и перспективы использования социальных сетей",
      content:
        "К основным проблемам использования социальных сетей подростками относятся снижение концентрации, зависимость от цифрового одобрения, риск столкновения с деструктивным контентом и недостаточный уровень медиаграмотности. Вместе с тем перспективы развития данной сферы связаны с расширением образовательных возможностей, совершенствованием инструментов защиты пользователей и формированием культуры ответственного поведения в интернете. Перспективным направлением является развитие программ цифровой грамотности, которые помогают подросткам критически оценивать информацию, соблюдать нормы общения и использовать социальные сети как ресурс для обучения и саморазвития.",
    },
    "4": {
      title: "Заключение",
      content:
        "В ходе работы было установлено, что социальные сети оказывают значительное и многогранное влияние на современного подростка. Они расширяют возможности коммуникации, обучения и самореализации, но одновременно создают риски для эмоционального состояния, учебной дисциплины и качества межличностного общения. Характер этого влияния зависит от целей использования, уровня цифровой грамотности и умения соблюдать баланс между виртуальной и реальной жизнью. Следовательно, важнейшая задача школы, семьи и самого подростка состоит не в полном отказе от цифровых платформ, а в формировании ответственного и осмысленного отношения к ним.",
    },
  },
  references: [
    "Андреев А. А. Социальные сети как фактор социализации подростков. Москва: Просвещение, 2022.",
    "Баранова Е. В. Цифровая среда и современное образование. Санкт-Петербург: Питер, 2021.",
    "Гордеева Т. О. Психология подросткового возраста. Москва: Юрайт, 2020.",
    "Иванова Н. С. Интернет-коммуникация и медиаграмотность школьников // Вопросы образования. 2023. № 2.",
    "Кузнецова Л. П. Информационная культура личности в цифровую эпоху. Казань: Университетское издательство, 2024.",
    "Смирнов Д. И. Влияние цифровых технологий на поведение молодежи // Социологические исследования. 2022. № 9.",
  ],
};

function getDemoReportJson() {
  return JSON.stringify(DEMO_REPORT, null, 2);
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coerceString(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  return "";
}

function deepTrim(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepTrim(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, deepTrim(nestedValue)]),
    );
  }

  return value;
}

function cloneDefaultFormData() {
  return { ...DEFAULT_FORM_DATA };
}

function createMessage(id, level, source, message, path) {
  return { id, level, source, message, path };
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function parseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Не удалось распарсить JSON.",
    };
  }
}

function findBalancedObjectEnd(text, startIndex) {
  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === "\"") {
        inString = false;
      }

      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }

      if (depth < 0) {
        return null;
      }
    }
  }

  return null;
}

function extractFirstValidObject(text) {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "{") {
      continue;
    }

    const endIndex = findBalancedObjectEnd(text, index);

    if (endIndex === null) {
      continue;
    }

    const candidate = text.slice(index, endIndex + 1);
    const parsed = parseJson(candidate);

    if (parsed.ok) {
      return candidate;
    }
  }

  return null;
}

function parseJsonWithRecovery(rawText) {
  const trimmed = String(rawText || "").trim();

  if (trimmed.length === 0) {
    return {
      ok: false,
      usedExtractor: false,
      errors: ["Поле JSON-ответа пустое."],
      notes: [],
    };
  }

  const directResult = parseJson(trimmed);

  if (directResult.ok) {
    return {
      ok: true,
      value: directResult.value,
      jsonText: trimmed,
      usedExtractor: false,
      errors: [],
      notes: ["JSON прочитан напрямую без дополнительного извлечения."],
    };
  }

  const extracted = extractFirstValidObject(trimmed);

  if (!extracted) {
    return {
      ok: false,
      usedExtractor: false,
      errors: [
        `JSON.parse() не смог обработать ответ: ${directResult.error}`,
        "Не удалось извлечь первый полноценный JSON-объект из ответа модели.",
      ],
      notes: [],
    };
  }

  const extractedResult = parseJson(extracted);

  if (!extractedResult.ok) {
    return {
      ok: false,
      usedExtractor: true,
      errors: [
        `Исходный ответ не прошёл JSON.parse(): ${directResult.error}`,
        `Извлечённый JSON-объект тоже не прошёл JSON.parse(): ${extractedResult.error}`,
      ],
      notes: [],
    };
  }

  return {
    ok: true,
    value: extractedResult.value,
    jsonText: extracted,
    usedExtractor: true,
    errors: [],
    notes: [
      "В ответе были лишние символы до или после JSON. Приложение извлекло первый полноценный объект автоматически.",
    ],
  };
}

function normalizeReportCandidate(input) {
  const normalized = deepTrim(input);

  if (!isPlainObject(normalized)) {
    return normalized;
  }

  const root = { ...normalized };

  if (isPlainObject(root.meta) && root.meta.year !== undefined && root.meta.year !== null) {
    root.meta = {
      ...root.meta,
      year: String(root.meta.year).trim(),
    };
  }

  if (isPlainObject(root.sections)) {
    const sections = { ...root.sections };

    if (isPlainObject(sections["1"])) {
      sections["1"] = {
        ...sections["1"],
        title: "Введение",
      };
    }

    if (isPlainObject(sections["4"])) {
      sections["4"] = {
        ...sections["4"],
        title: "Заключение",
      };
    }

    root.sections = sections;
  }

  if (Array.isArray(root.references)) {
    root.references = root.references.filter(
      (entry) => !(typeof entry === "string" && entry.trim() === ""),
    );
  }

  return root;
}

function splitIntoParagraphs(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

function buildPreviewData(input, isComplete) {
  if (!isPlainObject(input)) {
    return null;
  }

  const metaSource = isPlainObject(input.meta) ? input.meta : {};
  const meta = {};
  const metaMissing = {};

  for (const field of META_FIELDS) {
    const value = coerceString(metaSource[field]);
    meta[field] = value;
    metaMissing[field] = value.length === 0;
  }

  const sectionsSource = isPlainObject(input.sections) ? input.sections : {};
  const sections = {};

  for (const sectionId of REPORT_SECTION_ORDER) {
    const rawSection = isPlainObject(sectionsSource[sectionId]) ? sectionsSource[sectionId] : {};
    const rawTitle = coerceString(rawSection.title);
    const rawContent = coerceString(rawSection.content);
    const title =
      sectionId === "1"
        ? "Введение"
        : sectionId === "4"
          ? "Заключение"
          : rawTitle || MISSING_SECTION_TITLE;

    sections[sectionId] = {
      id: sectionId,
      title,
      content: rawContent,
      missingTitle: sectionId === "1" || sectionId === "4" ? false : rawTitle.length === 0,
      missingContent: rawContent.length === 0,
    };
  }

  const references = Array.isArray(input.references)
    ? input.references.map((entry) => coerceString(entry)).filter((entry) => entry.length > 0)
    : [];

  return {
    meta,
    metaMissing,
    sections,
    references,
    referencesMissing: references.length === 0,
    isComplete,
  };
}

function pushSchemaError(errors, path, message) {
  errors.push(createMessage(`schema-${errors.length}`, "error", "schema", message, path));
}

function assertPlainObject(value, path, label, errors) {
  if (!isPlainObject(value)) {
    pushSchemaError(errors, path || undefined, `${label} должен быть JSON-объектом.`);
    return null;
  }

  return value;
}

function validateExactKeys(objectValue, allowedKeys, pathPrefix, errors) {
  for (const requiredKey of allowedKeys) {
    if (!Object.prototype.hasOwnProperty.call(objectValue, requiredKey)) {
      const path = pathPrefix ? `${pathPrefix}.${requiredKey}` : requiredKey;
      pushSchemaError(errors, path, `Обязательное поле ${path} отсутствует.`);
    }
  }

  for (const key of Object.keys(objectValue)) {
    if (!allowedKeys.includes(key)) {
      const path = pathPrefix ? `${pathPrefix}.${key}` : key;
      pushSchemaError(errors, path, `Неизвестное поле ${path} не поддерживается JSON-контрактом.`);
    }
  }
}

function validateRequiredStringField(objectValue, key, pathPrefix, errors, options = {}) {
  const path = pathPrefix ? `${pathPrefix}.${key}` : key;
  const rawValue = objectValue[key];

  if (typeof rawValue !== "string") {
    pushSchemaError(errors, path, `Поле ${path} обязательно и должно быть строкой.`);
    return "";
  }

  const trimmed = rawValue.trim();

  if (trimmed.length === 0) {
    pushSchemaError(errors, path, `Поле ${path} обязательно и не может быть пустым.`);
    return "";
  }

  if (options.literal && trimmed !== options.literal) {
    pushSchemaError(errors, path, `Поле ${path} должно быть строго "${options.literal}".`);
  }

  return trimmed;
}

function validateReportDocument(candidate) {
  const errors = [];
  const root = assertPlainObject(candidate, "", "Корневой документ", errors);

  if (!root) {
    return { success: false, errors };
  }

  validateExactKeys(root, ["schema_version", "document_type", "meta", "sections", "references"], "", errors);

  const schemaVersion =
    typeof root.schema_version === "string" ? root.schema_version.trim() : "";
  const documentType =
    typeof root.document_type === "string" ? root.document_type.trim() : "";

  if (schemaVersion !== "ref_v1") {
    pushSchemaError(errors, "schema_version", 'Поле schema_version должно быть строго "ref_v1".');
  }

  if (documentType !== "school_report_ru") {
    pushSchemaError(errors, "document_type", 'Поле document_type должно быть строго "school_report_ru".');
  }

  const metaSource = assertPlainObject(root.meta, "meta", "meta", errors);
  const sectionsSource = assertPlainObject(root.sections, "sections", "sections", errors);
  const referencesSource = root.references;

  const meta = {};
  if (metaSource) {
    validateExactKeys(metaSource, META_FIELDS, "meta", errors);
    for (const field of META_FIELDS) {
      meta[field] = validateRequiredStringField(metaSource, field, "meta", errors);
    }
  } else {
    for (const field of META_FIELDS) {
      meta[field] = "";
    }
  }

  const sections = {};
  if (sectionsSource) {
    validateExactKeys(sectionsSource, REPORT_SECTION_ORDER, "sections", errors);

    for (const sectionId of REPORT_SECTION_ORDER) {
      const sectionValue = assertPlainObject(
        sectionsSource[sectionId],
        `sections.${sectionId}`,
        `Раздел sections.${sectionId}`,
        errors,
      );

      if (!sectionValue) {
        sections[sectionId] = { title: "", content: "" };
        continue;
      }

      validateExactKeys(sectionValue, ["title", "content"], `sections.${sectionId}`, errors);

      sections[sectionId] = {
        title:
          sectionId === "1"
            ? validateRequiredStringField(sectionValue, "title", `sections.${sectionId}`, errors, {
                literal: "Введение",
              })
            : sectionId === "4"
              ? validateRequiredStringField(sectionValue, "title", `sections.${sectionId}`, errors, {
                  literal: "Заключение",
                })
              : validateRequiredStringField(sectionValue, "title", `sections.${sectionId}`, errors),
        content: validateRequiredStringField(sectionValue, "content", `sections.${sectionId}`, errors),
      };
    }
  } else {
    for (const sectionId of REPORT_SECTION_ORDER) {
      sections[sectionId] = { title: "", content: "" };
    }
  }

  const references = [];
  if (!Array.isArray(referencesSource)) {
    pushSchemaError(errors, "references", "Поле references обязательно и должно быть массивом строк.");
  } else {
    referencesSource.forEach((entry, index) => {
      if (typeof entry !== "string") {
        pushSchemaError(errors, `references[${index}]`, "Каждый элемент references должен быть строкой.");
        return;
      }

      const trimmed = entry.trim();
      if (trimmed.length === 0) {
        pushSchemaError(errors, `references[${index}]`, "Пустые строки в references не допускаются.");
        return;
      }

      references.push(trimmed);
    });
  }

  if (references.length === 0) {
    pushSchemaError(errors, "references", "Нужен хотя бы один источник в references.");
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      schema_version: "ref_v1",
      document_type: "school_report_ru",
      meta,
      sections,
      references,
    },
  };
}

function looksLikePlaceholder(value) {
  const normalized = String(value || "").trim();

  if (normalized.length === 0) {
    return true;
  }

  return PLACEHOLDER_META_PATTERNS.some((pattern) => pattern.test(normalized));
}

function buildWarningMessages(previewData) {
  const warnings = [];

  for (const field of META_FIELDS) {
    const value = previewData.meta[field];

    if (looksLikePlaceholder(value)) {
      warnings.push(
        createMessage(
          `warning-meta-${field}`,
          "warning",
          "warning",
          `Поле meta.${field} выглядит пустым или шаблонным.`,
          `meta.${field}`,
        ),
      );
    }
  }

  const introduction = String(previewData.sections["1"].content || "").toLowerCase();

  for (const marker of INTRO_WARNING_MARKERS) {
    const found = marker.patterns.some((pattern) => pattern.test(introduction));

    if (!found) {
      warnings.push(
        createMessage(
          `warning-intro-${marker.label}`,
          "warning",
          "warning",
          `Во введении не найден явный признак блока "${marker.label}".`,
          "sections.1.content",
        ),
      );
    }
  }

  if (previewData.sections["1"].content.trim().length < 700) {
    warnings.push(
      createMessage(
        "warning-intro-short",
        "warning",
        "warning",
        "Введение выглядит слишком коротким для полноценного школьного реферата.",
        "sections.1.content",
      ),
    );
  }

  for (const sectionId of REPORT_SECTION_ORDER) {
    const section = previewData.sections[sectionId];
    if (section.content.trim().length < 260) {
      warnings.push(
        createMessage(
          `warning-section-short-${sectionId}`,
          "warning",
          "warning",
          `Раздел ${sectionId} выглядит подозрительно коротким.`,
          `sections.${sectionId}.content`,
        ),
      );
    }
  }

  if (previewData.references.length < 6) {
    warnings.push(
      createMessage(
        "warning-references-short",
        "warning",
        "warning",
        "Список литературы содержит меньше 6 источников.",
        "references",
      ),
    );
  }

  if (previewData.references.length > 8) {
    warnings.push(
      createMessage(
        "warning-references-long",
        "warning",
        "warning",
        "Список литературы содержит больше 8 источников.",
        "references",
      ),
    );
  }

  return warnings;
}

function emptyProcessResult() {
  return {
    rawText: "",
    extractedJson: null,
    usedExtractor: false,
    validReport: null,
    previewData: null,
    errors: [],
    warnings: [],
    infos: [],
  };
}

function processLlmResponse(rawText) {
  const recovery = parseJsonWithRecovery(rawText);

  if (!recovery.ok || recovery.value === undefined) {
    const errors = recovery.errors.map((message, index) =>
      createMessage(
        `recovery-error-${index}`,
        "error",
        index === 0 ? "json" : "extractor",
        message,
      ),
    );

    return {
      rawText,
      extractedJson: recovery.jsonText || null,
      usedExtractor: recovery.usedExtractor,
      validReport: null,
      previewData: null,
      errors,
      warnings: [],
      infos: [],
    };
  }

  const normalized = normalizeReportCandidate(recovery.value);
  const previewData = buildPreviewData(normalized, false);
  const infos = recovery.notes.map((message, index) =>
    createMessage(`recovery-info-${index}`, "info", "extractor", message),
  );

  const validation = validateReportDocument(normalized);

  if (validation.success) {
    const completePreview = buildPreviewData(validation.data, true);
    const warnings = completePreview ? buildWarningMessages(completePreview) : [];

    return {
      rawText,
      extractedJson: recovery.jsonText || null,
      usedExtractor: recovery.usedExtractor,
      validReport: validation.data,
      previewData: completePreview,
      errors: [],
      warnings,
      infos,
    };
  }

  const warnings = previewData ? buildWarningMessages(previewData) : [];

  return {
    rawText,
    extractedJson: recovery.jsonText || null,
    usedExtractor: recovery.usedExtractor,
    validReport: null,
    previewData,
    errors: validation.errors,
    warnings,
    infos,
  };
}

function getSectionTitle(sectionId, previewData) {
  if (sectionId === "1") {
    return "Введение";
  }

  if (sectionId === "4") {
    return "Заключение";
  }

  if (sectionId === "5") {
    return "Список литературы";
  }

  return previewData.sections[sectionId].title;
}

function getSectionLabel(sectionId, previewData) {
  return `${sectionId}. ${getSectionTitle(sectionId, previewData)}`;
}

function buildTocEntries(previewData, sectionPageMap) {
  return DOCUMENT_SECTION_ORDER.map((sectionId) => ({
    id: sectionId,
    label: getSectionLabel(sectionId, previewData),
    page: sectionPageMap[sectionId] || 3,
  }));
}

function estimateTextHeight(text) {
  const lines = Math.max(1, Math.ceil(String(text).length / AVERAGE_CHARACTERS_PER_LINE));
  return lines * APPROX_LINE_HEIGHT_PX;
}

function estimateBlockHeight(block) {
  if (block.kind === "heading") {
    return SECTION_HEADING_HEIGHT_PX + Math.ceil(block.text.length / 90) * 12;
  }

  const baseHeight = estimateTextHeight(block.text);

  if (block.kind === "reference") {
    return baseHeight + REFERENCE_GAP_PX + (block.endsSection ? SECTION_TAIL_GAP_PX : 0);
  }

  return baseHeight + PARAGRAPH_GAP_PX + (block.endsSection ? SECTION_TAIL_GAP_PX : 0);
}

function splitIntoSentenceSegments(text) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();

  if (normalized.length === 0) {
    return [];
  }

  const sentenceParts = normalized
    .split(/(?<=[.!?…])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (sentenceParts.length >= 2) {
    return sentenceParts;
  }

  const words = normalized.split(/\s+/);
  const segments = [];
  let currentSegment = "";

  for (const word of words) {
    const nextValue = currentSegment.length > 0 ? `${currentSegment} ${word}` : word;

    if (nextValue.length >= 180 && currentSegment.length > 0) {
      segments.push(currentSegment);
      currentSegment = word;
      continue;
    }

    currentSegment = nextValue;
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

function cloneBlock(block, text, suffix, options = {}) {
  return {
    ...block,
    ...options,
    id: `${block.id}:${suffix}`,
    text,
  };
}

function trySplitParagraphBlock(block, availableHeight) {
  if (block.kind !== "paragraph" || block.isPlaceholder) {
    return null;
  }

  const segments = splitIntoSentenceSegments(block.text);

  if (segments.length < 2) {
    return null;
  }

  let headText = "";
  let tailText = "";

  for (let index = 1; index < segments.length; index += 1) {
    const candidateHead = segments.slice(0, index).join(" ").trim();
    const candidateTail = segments.slice(index).join(" ").trim();

    if (
      candidateHead.length < MIN_SPLIT_CHUNK_LENGTH ||
      candidateTail.length < MIN_SPLIT_CHUNK_LENGTH
    ) {
      continue;
    }

    const candidateBlock = cloneBlock(block, candidateHead, `head-${index}`, {
      endsSection: false,
    });

    if (estimateBlockHeight(candidateBlock) <= availableHeight) {
      headText = candidateHead;
      tailText = candidateTail;
      continue;
    }

    break;
  }

  if (headText.length === 0 || tailText.length === 0) {
    return null;
  }

  return {
    head: cloneBlock(block, headText, "split-head", {
      endsSection: false,
    }),
    tail: cloneBlock(block, tailText, "split-tail", {
      continuation: true,
      endsSection: block.endsSection,
    }),
  };
}

function buildPreviewBlocks(previewData) {
  const blocks = [];

  for (const sectionId of DOCUMENT_SECTION_ORDER) {
    blocks.push({
      id: `${sectionId}:heading`,
      sectionId,
      kind: "heading",
      text: sectionId === "5" ? "5. Список литературы" : getSectionLabel(sectionId, previewData),
    });

    if (sectionId === "5") {
      if (previewData.references.length === 0) {
        blocks.push({
          id: `${sectionId}:placeholder`,
          sectionId,
          kind: "paragraph",
          text: MISSING_REFERENCES_TEXT,
          isPlaceholder: true,
          endsSection: true,
        });
        continue;
      }

      previewData.references.forEach((reference, index) => {
        blocks.push({
          id: `${sectionId}:reference:${index}`,
          sectionId,
          kind: "reference",
          text: reference,
          referenceIndex: index + 1,
          endsSection: index === previewData.references.length - 1,
        });
      });
      continue;
    }

    const paragraphs = splitIntoParagraphs(previewData.sections[sectionId].content);

    if (paragraphs.length === 0) {
      blocks.push({
        id: `${sectionId}:placeholder`,
        sectionId,
        kind: "paragraph",
        text: MISSING_SECTION_CONTENT,
        isPlaceholder: true,
        endsSection: true,
      });
      continue;
    }

    paragraphs.forEach((paragraph, index) => {
      blocks.push({
        id: `${sectionId}:paragraph:${index}`,
        sectionId,
        kind: "paragraph",
        text: paragraph,
        endsSection: index === paragraphs.length - 1,
      });
    });
  }

  return blocks;
}

function buildPaginatedPreview(blocks, blockHeights) {
  const pages = [];
  const sectionPageMap = {};
  let currentPageBlocks = [];
  let currentPageHeight = 0;
  const queue = [...blocks];

  const pushPage = () => {
    pages.push(currentPageBlocks);
    currentPageBlocks = [];
    currentPageHeight = 0;
  };

  while (queue.length > 0) {
    const block = queue.shift();
    const height = blockHeights[block.id] || estimateBlockHeight(block);
    const nextBlock = queue[0];

    if (block.kind === "heading" && nextBlock) {
      const minimumSectionStartHeight =
        height + (blockHeights[nextBlock.id] || estimateBlockHeight(nextBlock));

      if (
        currentPageBlocks.length > 0 &&
        currentPageHeight + minimumSectionStartHeight > CONTENT_HEIGHT_PX
      ) {
        pushPage();
      }
    }

    if (currentPageBlocks.length > 0 && currentPageHeight + height > CONTENT_HEIGHT_PX) {
      const split = trySplitParagraphBlock(block, CONTENT_HEIGHT_PX - currentPageHeight);

      if (split) {
        queue.unshift(split.tail);
        const splitHeadHeight = blockHeights[split.head.id] || estimateBlockHeight(split.head);

        if (sectionPageMap[split.head.sectionId] === undefined) {
          sectionPageMap[split.head.sectionId] = pages.length + 3;
        }

        currentPageBlocks.push(split.head);
        currentPageHeight += splitHeadHeight;
        pushPage();
        continue;
      }

      pushPage();
      queue.unshift(block);
      continue;
    }

    if (currentPageBlocks.length === 0 && height > CONTENT_HEIGHT_PX) {
      const split = trySplitParagraphBlock(block, CONTENT_HEIGHT_PX);

      if (split) {
        queue.unshift(split.tail);

        if (sectionPageMap[split.head.sectionId] === undefined) {
          sectionPageMap[split.head.sectionId] = pages.length + 3;
        }

        currentPageBlocks.push(split.head);
        currentPageHeight += blockHeights[split.head.id] || estimateBlockHeight(split.head);
        pushPage();
        continue;
      }
    }

    if (sectionPageMap[block.sectionId] === undefined) {
      sectionPageMap[block.sectionId] = pages.length + 3;
    }

    currentPageBlocks.push(block);
    currentPageHeight += height;
  }

  if (currentPageBlocks.length > 0) {
    pushPage();
  }

  if (pages.length === 0) {
    pages.push([]);
  }

  return {
    pages: pages.map((pageBlocks, index) => ({
      index,
      pageNumber: index + 3,
      blocks: pageBlocks,
    })),
    metrics: {
      contentPageCount: pages.length,
      totalPageCount: pages.length + 2,
      sectionPageMap,
    },
  };
}

function buildEstimatedPaginatedPreview(previewData) {
  const blocks = buildPreviewBlocks(previewData);
  const heights = Object.fromEntries(
    blocks.map((block) => [block.id, estimateBlockHeight(block)]),
  );

  return buildPaginatedPreview(blocks, heights);
}

function buildMeasuredPaginatedPreview(previewData, blockHeights) {
  return buildPaginatedPreview(buildPreviewBlocks(previewData), blockHeights);
}

function buildPlainTextReport(previewData, tocEntries) {
  const titlePage = [
    previewData.meta.institution,
    "",
    "РЕФЕРАТ",
    `По дисциплине: ${previewData.meta.discipline}`,
    `На тему: «${previewData.meta.topic}»`,
    "",
    "Работу выполнил:",
    previewData.meta.class_group,
    previewData.meta.author,
    "",
    previewData.meta.city,
    previewData.meta.year,
  ].join("\n");

  const tocText = [
    "СОДЕРЖАНИЕ",
    ...tocEntries.map((entry) => `${entry.label} ....... ${entry.page}`),
  ].join("\n");

  const sectionsText = REPORT_SECTION_ORDER.map((sectionId) => {
    const section = previewData.sections[sectionId];
    return `${getSectionLabel(sectionId, previewData)}\n\n${section.content}`;
  }).join("\n\n");

  const referencesText = [
    "5. Список литературы",
    "",
    ...previewData.references.map((entry, index) => `${index + 1}. ${entry}`),
  ].join("\n");

  return [titlePage, tocText, sectionsText, referencesText].join("\n\n");
}

function sanitizeFilenamePart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

async function exportDocx(report, tocEntries) {
  const api = window.docx;

  if (!api) {
    throw new Error("Локальная библиотека DOCX не загружена.");
  }

  const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    PageBreak,
    Paragraph,
    TabStopType,
    TextRun,
  } = api;

  const FONT_FAMILY = "Times New Roman";
  const FONT_SIZE = 28;
  const TOC_TAB_STOP = 9000;

  function createNormalParagraph(text) {
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: {
        line: 360,
        after: 180,
      },
      indent: {
        firstLine: 709,
      },
      children: [
        new TextRun({
          text,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    });
  }

  function createSectionHeading(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 200,
        after: 220,
      },
      children: [
        new TextRun({
          text,
          bold: true,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    });
  }

  const titlePageChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: report.meta.institution,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({ spacing: { after: 700 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "РЕФЕРАТ",
          bold: true,
          font: FONT_FAMILY,
          size: 36,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: `По дисциплине: ${report.meta.discipline}`,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 260 },
      children: [
        new TextRun({
          text: `На тему: «${report.meta.topic}»`,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 420, after: 120 },
      children: [
        new TextRun({
          text: "Работу выполнил:",
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: report.meta.class_group,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 820 },
      children: [
        new TextRun({
          text: report.meta.author,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 90 },
      children: [
        new TextRun({
          text: report.meta.city,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: report.meta.year,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  const tocChildren = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: "СОДЕРЖАНИЕ",
          bold: true,
          font: FONT_FAMILY,
          size: FONT_SIZE,
        }),
      ],
    }),
    ...tocEntries.map(
      (entry) =>
        new Paragraph({
          spacing: { after: 120 },
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TOC_TAB_STOP,
            },
          ],
          children: [
            new TextRun({
              text: entry.label,
              font: FONT_FAMILY,
              size: FONT_SIZE,
            }),
            new TextRun({
              text: "\t",
              font: FONT_FAMILY,
              size: FONT_SIZE,
            }),
            new TextRun({
              text: String(entry.page),
              font: FONT_FAMILY,
              size: FONT_SIZE,
            }),
          ],
        }),
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  const bodyChildren = [];

  for (const sectionId of REPORT_SECTION_ORDER) {
    const section = report.sections[sectionId];
    const headingTitle =
      sectionId === "1"
        ? "1. Введение"
        : sectionId === "4"
          ? "4. Заключение"
          : `${sectionId}. ${section.title}`;

    bodyChildren.push(createSectionHeading(headingTitle));

    for (const paragraph of splitIntoParagraphs(section.content)) {
      bodyChildren.push(createNormalParagraph(paragraph));
    }
  }

  bodyChildren.push(createSectionHeading("5. Список литературы"));

  report.references.forEach((entry, index) => {
    bodyChildren.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: {
          line: 360,
          after: 120,
        },
        children: [
          new TextRun({
            text: `${index + 1}. ${entry}`,
            font: FONT_FAMILY,
            size: FONT_SIZE,
          }),
        ],
      }),
    );
  });

  const documentFile = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: FONT_SIZE,
          },
          paragraph: {
            spacing: {
              line: 360,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1700,
            },
          },
        },
        children: [...titlePageChildren, ...tocChildren, ...bodyChildren],
      },
    ],
  });

  const blob = await Packer.toBlob(documentFile);
  const filename = `${sanitizeFilenamePart(report.meta.topic || "report") || "report"}.docx`;
  saveBlob(blob, filename);
}

function normalizePromptValue(value, fallback) {
  const trimmed = String(value || "").trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function buildPrompt(formData) {
  return PROMPT_TEMPLATE.replace("[INSTITUTION]", normalizePromptValue(formData.institution, "Не указано"))
    .replace("[DISCIPLINE]", normalizePromptValue(formData.discipline, "Не указано"))
    .replace("[TOPIC]", normalizePromptValue(formData.topic, "Не указано"))
    .replace("[AUTHOR]", normalizePromptValue(formData.author, "Не указано"))
    .replace("[CLASS_GROUP]", normalizePromptValue(formData.class_group, "Не указано"))
    .replace("[CITY]", normalizePromptValue(formData.city, "Не указано"))
    .replace("[YEAR]", normalizePromptValue(formData.year, "Не указано"))
    .replace(
      "[SOURCE_TEXT]",
      normalizePromptValue(formData.source_text, "Исходный материал не предоставлен."),
    );
}

function clampAuthorBlockTop(value) {
  const numeric = Number.parseInt(String(value), 10);

  if (Number.isNaN(numeric)) {
    return DEFAULT_AUTHOR_BLOCK_TOP;
  }

  return Math.min(80, Math.max(52, numeric));
}

function buildStoredProject(formData, prompt, rawLlmResponse, validReport, authorBlockTop) {
  return {
    version: "project_v1",
    formData: { ...formData },
    prompt,
    rawLlmResponse,
    normalizedParsedData: validReport,
    ui: {
      authorBlockTop: clampAuthorBlockTop(authorBlockTop),
    },
    updatedAt: new Date().toISOString(),
  };
}

function normalizeProjectDraftCandidate(candidate) {
  if (!isPlainObject(candidate)) {
    return null;
  }

  const formDataSource = isPlainObject(candidate.formData) ? candidate.formData : {};
  const formData = cloneDefaultFormData();

  for (const field of [...META_FIELDS, "source_text"]) {
    formData[field] = coerceString(formDataSource[field]);
  }

  let normalizedParsedData = null;
  if (candidate.normalizedParsedData !== null && candidate.normalizedParsedData !== undefined) {
    const normalized = normalizeReportCandidate(candidate.normalizedParsedData);
    const validated = validateReportDocument(normalized);
    if (validated.success) {
      normalizedParsedData = validated.data;
    }
  }

  return {
    version: candidate.version === "project_v1" ? "project_v1" : "project_v1",
    formData,
    prompt:
      typeof candidate.prompt === "string" && candidate.prompt.trim().length > 0
        ? candidate.prompt
        : buildPrompt(formData),
    rawLlmResponse: typeof candidate.rawLlmResponse === "string" ? candidate.rawLlmResponse : "",
    normalizedParsedData,
    ui: {
      authorBlockTop: clampAuthorBlockTop(
        isPlainObject(candidate.ui) ? candidate.ui.authorBlockTop : DEFAULT_AUTHOR_BLOCK_TOP,
      ),
    },
    updatedAt:
      typeof candidate.updatedAt === "string" && candidate.updatedAt.trim().length > 0
        ? candidate.updatedAt
        : new Date().toISOString(),
  };
}

function loadStoredProject() {
  try {
    const rawValue = window.localStorage.getItem(APP_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    return normalizeProjectDraftCandidate(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

function saveStoredProject(project) {
  try {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(project));
  } catch {
    // Ignore storage failures to keep the app usable in strict/private browser modes.
  }
}

function clearStoredProject() {
  try {
    window.localStorage.removeItem(APP_STORAGE_KEY);
  } catch {
    // Ignore storage failures to keep reset functional even when storage is blocked.
  }
}

function downloadProjectJson(project) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  saveBlob(blob, "school-report-project.json");
}

async function parseImportedProject(file) {
  const text = await file.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Некорректный JSON.");
  }

  const project = normalizeProjectDraftCandidate(parsed);

  if (!project) {
    throw new Error("Файл не похож на project JSON этого приложения.");
  }

  return project;
}

function buildRestoredProcessResult(project) {
  if (project.normalizedParsedData) {
    const previewData = buildPreviewData(project.normalizedParsedData, true);
    const warnings = previewData ? buildWarningMessages(previewData) : [];

    return {
      rawText: project.rawLlmResponse,
      extractedJson: JSON.stringify(project.normalizedParsedData, null, 2),
      usedExtractor: false,
      validReport: project.normalizedParsedData,
      previewData,
      errors: [],
      warnings,
      infos: [],
    };
  }

  if (project.rawLlmResponse.trim().length > 0) {
    return processLlmResponse(project.rawLlmResponse);
  }

  return emptyProcessResult();
}

function panelMarkup({ title, description, body, actions = "", className = "" }) {
  const classes = ["panel", className].filter(Boolean).join(" ");

  return `
    <section class="${classes}">
      <header class="panel__header">
        <div>
          <h2 class="panel__title">${escapeHtml(title)}</h2>
          ${description ? `<p class="panel__description">${escapeHtml(description)}</p>` : ""}
        </div>
        ${actions ? `<div class="panel__actions">${actions}</div>` : ""}
      </header>
      <div class="panel__body">
        ${body}
      </div>
    </section>
  `;
}

function renderSourcePanel() {
  const workFieldsMarkup = FORM_FIELD_CONFIG.filter((field) =>
    ["institution", "discipline", "topic"].includes(field.key),
  )
    .map(
      (field) => `
        <label class="field ${field.key === "topic" ? "field--full" : ""}">
          <span class="field__label">${escapeHtml(field.label)}</span>
          <input
            class="field__control"
            type="text"
            data-form-field="${field.key}"
            placeholder="${escapeHtml(field.placeholder)}"
          />
        </label>
      `,
    )
    .join("");

  const authorFieldsMarkup = FORM_FIELD_CONFIG.filter((field) =>
    ["author", "class_group", "city", "year"].includes(field.key),
  )
    .map(
      (field) => `
        <label class="field ${field.key === "author" ? "field--full" : ""}">
          <span class="field__label">${escapeHtml(field.label)}</span>
          <input
            class="field__control"
            type="text"
            data-form-field="${field.key}"
            placeholder="${escapeHtml(field.placeholder)}"
          />
        </label>
      `,
    )
    .join("");

  return panelMarkup({
    title: "Параметры",
    description:
      "Метаданные работы и исходный материал, из которых собирается единый prompt для внешней модели.",
    actions: `
      <div class="button-row">
        <button type="button" class="button button--secondary" data-action="fill-demo">Демо</button>
        <button type="button" class="button button--ghost" data-action="clear-form">Очистить</button>
        <button type="button" class="button button--primary" data-action="generate-prompt">Обновить prompt</button>
        <button type="button" class="button button--secondary" data-action="copy-prompt">Скопировать</button>
      </div>
    `,
    body: `
      <div class="form-stack">
        <section class="form-section">
          <div class="form-section__header">
            <h3 class="form-section__title">Данные работы</h3>
            <p class="form-section__text">Базовые поля, которые попадут на титульный лист и в prompt.</p>
          </div>
          <div class="form-grid">${workFieldsMarkup}</div>
        </section>

        <section class="form-section">
          <div class="form-section__header">
            <h3 class="form-section__title">Автор и реквизиты</h3>
            <p class="form-section__text">Эти поля нужны для подписи работы и финального оформления.</p>
          </div>
          <div class="form-grid">${authorFieldsMarkup}</div>
        </section>

        <section class="form-section form-section--source">
          <div class="form-section__header">
            <h3 class="form-section__title">Исходный материал</h3>
            <p class="form-section__text">Сюда удобно вставлять тезисы, черновик, выдержки или контекст для внешней LLM.</p>
          </div>
          <label class="field">
            <span class="field__label">Текст для модели</span>
            <textarea
              class="field__control field__control--textarea field__control--large"
              data-form-field="source_text"
              placeholder="Например: краткий план, учебные тезисы, выдержки из источников или уже готовый черновой материал."
            ></textarea>
          </label>
        </section>
      </div>
    `,
  });
}

function renderPromptPanel() {
  return panelMarkup({
    title: "Prompt",
    description:
      "Этот prompt нужно целиком отправить во внешнюю LLM. На выходе ожидается только JSON по жёсткому контракту.",
    actions:
      '<button type="button" class="button button--primary" data-action="copy-prompt">Скопировать</button>',
    body: `
      <textarea class="field__control field__control--textarea prompt-box" data-role="prompt-output" readonly></textarea>
      <div class="panel-note" data-role="prompt-note"></div>
    `,
  });
}

function renderJsonPanel() {
  return panelMarkup({
    title: "Ответ модели",
    description:
      "Поддерживается как чистый JSON, так и ответ модели с мусором до или после него. Сначала идёт прямой parse, затем безопасное извлечение объекта.",
    actions: `
      <div class="button-row">
        <button type="button" class="button button--secondary" data-action="validate-json">Проверить</button>
        <button type="button" class="button button--primary" data-action="build-report">Собрать</button>
        <button type="button" class="button button--ghost" data-action="insert-demo-json">Demo JSON</button>
        <button type="button" class="button button--ghost" data-action="format-json">Форматировать</button>
      </div>
    `,
    body: `
      <textarea
        class="field__control field__control--textarea field__control--xlarge"
        data-role="raw-json"
        placeholder="Вставьте сюда ответ внешней модели. Приложение не поддерживает свободный текст вместо JSON."
      ></textarea>
    `,
  });
}

function renderMessageGroup(title, emptyText, messages, tone) {
  const listMarkup =
    messages.length === 0
      ? `<p class="message-group__empty">${escapeHtml(emptyText)}</p>`
      : `
          <ul class="message-list">
            ${messages
              .map(
                (message) => `
                  <li class="message-list__item">
                    <span class="message-list__text">${escapeHtml(message.message)}</span>
                    ${message.path ? `<code class="message-list__path">${escapeHtml(message.path)}</code>` : ""}
                  </li>
                `,
              )
              .join("")}
          </ul>
        `;

  return `
    <div class="message-group message-group--${tone}">
      <h3 class="message-group__title">${escapeHtml(title)}</h3>
      ${listMarkup}
    </div>
  `;
}

function renderValidationPanel(processResult) {
  const extractedLength = processResult.extractedJson ? processResult.extractedJson.length : 0;

  return panelMarkup({
    title: "Проверка",
    description:
      "Ошибки блокируют строгую сборку и DOCX-экспорт. Предупреждения не мешают рендеру, но помогают увидеть слабые места.",
    className: "panel--validation",
    body: `
      <div class="validation-summary">
        <div class="validation-chip validation-chip--error">Ошибки: <strong>${processResult.errors.length}</strong></div>
        <div class="validation-chip validation-chip--warning">Warnings: <strong>${processResult.warnings.length}</strong></div>
        <div class="validation-chip validation-chip--info">Extractor: <strong>${processResult.usedExtractor ? "срабатывал" : "не требовался"}</strong></div>
        <div class="validation-chip validation-chip--neutral">JSON-полезная нагрузка: <strong>${extractedLength}</strong> символов</div>
      </div>
      <div class="message-layout">
        ${renderMessageGroup("Ошибки", "Критичных ошибок не найдено.", processResult.errors, "error")}
        ${renderMessageGroup("Warnings", "Предупреждений не найдено.", processResult.warnings, "warning")}
        ${renderMessageGroup("Информация", "Системных заметок пока нет.", processResult.infos, "info")}
      </div>
    `,
  });
}

function renderMetaValue(value, missing) {
  return `<span class="${missing ? "report-placeholder" : ""}">${escapeHtml(
    missing ? EMPTY_META_DISPLAY : value,
  )}</span>`;
}

function renderTitlePage(previewData, authorBlockTop) {
  const { meta, metaMissing } = previewData;

  return `
    <article class="report-sheet report-sheet--title">
      <div class="title-page">
        <div class="title-page__top">
          <p class="title-page__institution">${renderMetaValue(meta.institution, metaMissing.institution)}</p>
        </div>
        <div class="title-page__center">
          <h1 class="title-page__headline">РЕФЕРАТ</h1>
          <p class="title-page__line">По дисциплине: ${renderMetaValue(meta.discipline, metaMissing.discipline)}</p>
          <p class="title-page__line">На тему: «${renderMetaValue(meta.topic, metaMissing.topic)}»</p>
        </div>
        <div class="title-page__author-block" style="top: ${clampAuthorBlockTop(authorBlockTop)}%;">
          <p>Работу выполнил:</p>
          <p>${renderMetaValue(meta.class_group, metaMissing.class_group)}</p>
          <p>${renderMetaValue(meta.author, metaMissing.author)}</p>
        </div>
        <div class="title-page__bottom">
          <p>${renderMetaValue(meta.city, metaMissing.city)}</p>
          <p>${renderMetaValue(meta.year, metaMissing.year)}</p>
        </div>
      </div>
    </article>
  `;
}

function renderTocPage(entries) {
  return `
    <article class="report-sheet">
      <div class="report-sheet__content">
        <div class="toc-page">
          <h2 class="toc-page__title">СОДЕРЖАНИЕ</h2>
          <div class="toc-page__list">
            ${entries
              .map(
                (entry) => `
                  <div class="toc-page__row">
                    <span class="toc-page__label">${escapeHtml(entry.label)}</span>
                    <span class="toc-page__dots" aria-hidden="true"></span>
                    <span class="toc-page__page">${entry.page}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <footer class="report-sheet__footer">2</footer>
    </article>
  `;
}

function renderBlocks(blocks, extraClass = "") {
  return `
    <div class="report-flow ${escapeHtml(extraClass)}">
      ${blocks
        .map((block) => {
          if (block.kind === "heading") {
            return `
              <h2
                class="report-section__title report-block report-block--heading"
                data-block-id="${escapeHtml(block.id)}"
                data-doc-section="${escapeHtml(block.sectionId)}"
              >${escapeHtml(block.text)}</h2>
            `;
          }

          if (block.kind === "reference") {
            return `
              <p
                class="report-reference report-block ${block.endsSection ? "report-block--section-end" : ""}"
                data-block-id="${escapeHtml(block.id)}"
                data-doc-section="${escapeHtml(block.sectionId)}"
              >
                <span class="report-reference__index">${block.referenceIndex}. </span>${escapeHtml(block.text)}
              </p>
            `;
          }

          return `
            <p
              class="report-paragraph report-block ${block.continuation ? "report-paragraph--continuation" : ""} ${block.isPlaceholder ? "report-paragraph--placeholder" : ""} ${block.endsSection ? "report-block--section-end" : ""}"
              data-block-id="${escapeHtml(block.id)}"
              data-doc-section="${escapeHtml(block.sectionId)}"
            >${escapeHtml(block.text)}</p>
          `;
        })
        .join("")}
    </div>
  `;
}

function buildOutputModeActions(outputMode, processResult) {
  const modes = [
    {
      id: "preview",
      label: "Документ",
      disabled: !processResult.previewData,
    },
    {
      id: "text",
      label: "Текст",
      disabled: !processResult.previewData,
    },
    {
      id: "json",
      label: "JSON",
      disabled: !processResult.extractedJson && !processResult.validReport,
    },
  ];

  return `
    <div class="mode-switch" role="tablist" aria-label="Режим вывода">
      ${modes
        .map(
          (mode) => `
            <button
              type="button"
              class="mode-switch__button ${outputMode === mode.id ? "mode-switch__button--active" : ""}"
              data-action="set-output-mode"
              data-output-mode="${mode.id}"
              ${mode.disabled ? "disabled" : ""}
            >${mode.label}</button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderOutputEmpty(title, hint) {
  return `
    <div class="preview-empty">
      <p>${escapeHtml(title)}</p>
      <p class="preview-empty__hint">${hint}</p>
    </div>
  `;
}

function renderTextOutput(processResult, paginatedPreview) {
  if (!processResult.previewData || !paginatedPreview) {
    return renderOutputEmpty(
      "Текстовая сборка пока недоступна.",
      "Сначала проверьте или соберите документ из JSON-ответа модели.",
    );
  }

  const tocEntries = buildTocEntries(
    processResult.previewData,
    paginatedPreview.metrics.sectionPageMap,
  );
  const text = buildPlainTextReport(processResult.previewData, tocEntries);

  return `
    <div class="text-output">
      <pre class="text-output__content">${escapeHtml(text)}</pre>
    </div>
  `;
}

function renderJsonOutput(processResult) {
  const jsonText = processResult.validReport
    ? JSON.stringify(processResult.validReport, null, 2)
    : processResult.extractedJson;

  if (!jsonText) {
    return renderOutputEmpty(
      "Нормализованный JSON пока недоступен.",
      "После разбора ответа модели здесь появится извлечённый или строго валидный JSON.",
    );
  }

  return `
    <div class="json-output">
      <pre class="json-output__content">${escapeHtml(jsonText)}</pre>
    </div>
  `;
}

function renderAuthorBlockControl(authorBlockTop) {
  const safeValue = clampAuthorBlockTop(authorBlockTop);

  return `
    <div class="preview-adjustment">
      <label class="preview-adjustment__label" for="author-block-top">Положение блока автора</label>
      <div class="preview-adjustment__controls">
        <input
          id="author-block-top"
          class="preview-adjustment__range"
          type="range"
          min="52"
          max="80"
          step="1"
          value="${safeValue}"
          data-role="author-block-top"
        />
        <output class="preview-adjustment__value">${safeValue}%</output>
      </div>
    </div>
  `;
}

function renderPreviewPanel(processResult, paginatedPreview, outputMode, authorBlockTop) {
  const actions = buildOutputModeActions(outputMode, processResult);

  if (outputMode === "text") {
    return panelMarkup({
      title: "Выходной документ",
      description:
        "Плоская текстовая сборка для быстрого чтения, сверки и копирования результата.",
      actions,
      className: "panel--preview",
      body: renderTextOutput(processResult, paginatedPreview),
    });
  }

  if (outputMode === "json") {
    return panelMarkup({
      title: "Выходной документ",
      description:
        "Нормализованный JSON после извлечения и строгой проверки. Удобен для контроля структуры.",
      actions,
      className: "panel--preview",
      body: renderJsonOutput(processResult),
    });
  }

  if (!processResult.previewData || !paginatedPreview) {
    return panelMarkup({
      title: "Выходной документ",
      description:
        "Правая колонка показывает собранный документ, plain text или нормализованный JSON в зависимости от выбранного режима.",
      actions,
      className: "panel--preview",
      body: renderOutputEmpty(
        "Документ пока не собран.",
        "Вставьте JSON, запустите проверку или сборку, и приложение отрисует безопасный результат.",
      ),
    });
  }

  const tocEntries = buildTocEntries(
    processResult.previewData,
    paginatedPreview.metrics.sectionPageMap,
  );
  const previewBlocks = buildPreviewBlocks(processResult.previewData);

  return panelMarkup({
    title: "Выходной документ",
    description:
      "Основной режим просмотра. Пагинация держится на фиксированном шаблоне и уточняется через измерение блоков в браузере.",
    actions,
    className: "panel--preview",
    body: `
      <div class="preview-metrics">
        <span class="validation-chip validation-chip--neutral">Страниц: <strong>${paginatedPreview.metrics.totalPageCount}</strong></span>
        <span class="validation-chip ${processResult.previewData.isComplete ? "validation-chip--success" : "validation-chip--warning"}">
          Режим: <strong>${processResult.previewData.isComplete ? "строгий" : "fallback"}</strong>
        </span>
      </div>
      ${renderAuthorBlockControl(authorBlockTop)}

      <div class="preview-stage">
        <div class="preview-stack">
          ${renderTitlePage(processResult.previewData, authorBlockTop)}
          ${renderTocPage(tocEntries)}
          ${paginatedPreview.pages
            .map(
              (page) => `
                <article class="report-sheet">
                  <div class="report-sheet__content">
                    ${renderBlocks(page.blocks, "report-flow--page")}
                  </div>
                  <footer class="report-sheet__footer">${page.pageNumber}</footer>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>

      <div class="report-measurement" data-measure-root="true" aria-hidden="true">
        ${renderBlocks(previewBlocks, "report-flow--measurement")}
      </div>
    `,
  });
}

function renderActionsPanel() {
  return panelMarkup({
    title: "Экспорт и операции",
    description:
      "Печать и PDF работают через print stylesheet. DOCX и project JSON формируются полностью на клиенте.",
    className: "panel--actions",
    body: `
      <div class="actions-grid">
        <button type="button" class="button button--primary" data-action="print">Печать / PDF</button>
        <button type="button" class="button button--secondary" data-action="export-docx">DOCX</button>
        <button type="button" class="button button--secondary" data-action="copy-final-text">Скопировать текст</button>
        <button type="button" class="button button--ghost" data-action="export-project">Экспорт проекта</button>
        <button type="button" class="button button--ghost" data-action="import-project">Импорт проекта</button>
        <button type="button" class="button button--danger" data-action="reset-project">Сброс</button>
      </div>
      <div class="panel-note panel-note--status" data-role="status-note"></div>
      <input class="visually-hidden" type="file" data-role="import-input" accept="application/json" />
    `,
  });
}

function renderShell() {
  return `
    <div class="app-shell">
      <header class="tool-header no-print">
        <div class="tool-header__identity">
          <p class="tool-header__label">School report builder</p>
          <h1 class="tool-header__title">Конструктор школьного реферата</h1>
        </div>
        <div class="tool-header__meta">
          <p class="tool-header__line">Статический рабочий экран для подготовки prompt, проверки JSON и сборки итогового документа.</p>
          <p class="tool-header__line tool-header__line--quiet">Локально в браузере • без API • autosave через localStorage</p>
        </div>
      </header>

      <main class="app-layout">
        <aside class="app-layout__sidebar no-print">
          <div class="sidebar-stack">
            <div id="source-panel"></div>
            <div id="prompt-panel"></div>
            <div id="json-panel"></div>
            <div id="validation-panel"></div>
            <div id="actions-panel"></div>
          </div>
        </aside>
        <section class="app-layout__preview">
          <div id="preview-panel"></div>
        </section>
      </main>

      <footer class="tool-footnote no-print">
        <p class="tool-footnote__text">Поток работы: заполнить параметры → скопировать prompt → получить JSON от внешней модели → проверить структуру → собрать и экспортировать документ.</p>
      </footer>
    </div>
  `;
}

function previewSignature(preview) {
  if (!preview) {
    return "null";
  }

  return JSON.stringify({
    metrics: preview.metrics,
    pages: preview.pages.map((page) => ({
      number: page.pageNumber,
      blocks: page.blocks.map((block) => block.id),
    })),
  });
}

function initApp(root) {
  root.innerHTML = renderShell();

  const sourcePanel = root.querySelector("#source-panel");
  const promptPanel = root.querySelector("#prompt-panel");
  const jsonPanel = root.querySelector("#json-panel");
  const validationPanel = root.querySelector("#validation-panel");
  const previewPanel = root.querySelector("#preview-panel");
  const actionsPanel = root.querySelector("#actions-panel");

  if (!sourcePanel || !promptPanel || !jsonPanel || !validationPanel || !previewPanel || !actionsPanel) {
    throw new Error("Не удалось инициализировать контейнеры приложения.");
  }

  sourcePanel.innerHTML = renderSourcePanel();
  promptPanel.innerHTML = renderPromptPanel();
  jsonPanel.innerHTML = renderJsonPanel();
  validationPanel.innerHTML = renderValidationPanel(emptyProcessResult());
  previewPanel.innerHTML = renderPreviewPanel(
    emptyProcessResult(),
    null,
    "preview",
    DEFAULT_AUTHOR_BLOCK_TOP,
  );
  actionsPanel.innerHTML = renderActionsPanel();

  const formFields = {};

  for (const config of FORM_FIELD_CONFIG) {
    const field = sourcePanel.querySelector(`[data-form-field="${config.key}"]`);

    if (!field) {
      throw new Error(`Не найдено поле формы ${config.key}.`);
    }

    formFields[config.key] = field;
  }

  const sourceTextField = sourcePanel.querySelector('[data-form-field="source_text"]');
  if (!sourceTextField) {
    throw new Error("Не найдено поле source_text.");
  }

  formFields.source_text = sourceTextField;

  const promptTextarea = promptPanel.querySelector('[data-role="prompt-output"]');
  const promptNote = promptPanel.querySelector('[data-role="prompt-note"]');
  const rawTextarea = jsonPanel.querySelector('[data-role="raw-json"]');
  const statusNote = actionsPanel.querySelector('[data-role="status-note"]');
  const printButton = actionsPanel.querySelector('[data-action="print"]');
  const exportDocxButton = actionsPanel.querySelector('[data-action="export-docx"]');
  const copyFinalTextButton = actionsPanel.querySelector('[data-action="copy-final-text"]');
  const exportProjectButton = actionsPanel.querySelector('[data-action="export-project"]');
  const importProjectButton = actionsPanel.querySelector('[data-action="import-project"]');
  const resetProjectButton = actionsPanel.querySelector('[data-action="reset-project"]');
  const importInput = actionsPanel.querySelector('[data-role="import-input"]');

  if (
    !promptTextarea ||
    !promptNote ||
    !rawTextarea ||
    !statusNote ||
    !printButton ||
    !exportDocxButton ||
    !copyFinalTextButton ||
    !exportProjectButton ||
    !importProjectButton ||
    !resetProjectButton ||
    !importInput
  ) {
    throw new Error("Не удалось инициализировать элементы управления.");
  }

  const refs = {
    sourcePanel,
    promptPanel,
    jsonPanel,
    validationPanel,
    previewPanel,
    actionsPanel,
    promptTextarea,
    promptNote,
    rawTextarea,
    statusNote,
    printButton,
    exportDocxButton,
    copyFinalTextButton,
    exportProjectButton,
    importProjectButton,
    resetProjectButton,
    importInput,
    formFields,
  };

  const state = {
    formData: cloneDefaultFormData(),
    rawLlmResponse: "",
    processResult: emptyProcessResult(),
    paginatedPreview: null,
    outputMode: "preview",
    authorBlockTop: DEFAULT_AUTHOR_BLOCK_TOP,
    statusMessage: "Черновик сохраняется локально в браузере автоматически.",
    hydrated: false,
  };

  let measureFrame = 0;

  const promptText = () => buildPrompt(state.formData);

  const tocEntries = () => {
    if (!state.processResult.previewData || !state.paginatedPreview) {
      return [];
    }

    return buildTocEntries(
      state.processResult.previewData,
      state.paginatedPreview.metrics.sectionPageMap,
    );
  };

  const persistProject = () => {
    if (!state.hydrated) {
      return;
    }

    saveStoredProject(
      buildStoredProject(
        state.formData,
        promptText(),
        state.rawLlmResponse,
        state.processResult.validReport,
        state.authorBlockTop,
      ),
    );
  };

  const syncFormFields = () => {
    for (const [key, element] of Object.entries(refs.formFields)) {
      element.value = state.formData[key];
    }
  };

  const syncPromptPanel = () => {
    const prompt = promptText();
    refs.promptTextarea.value = prompt;
    refs.promptNote.innerHTML = `<strong>${prompt.length}</strong> символов. Prompt генерируется локально и не отправляется ни на какие серверы.`;
  };

  const syncJsonTextarea = () => {
    refs.rawTextarea.value = state.rawLlmResponse;
  };

  const syncValidationPanel = () => {
    refs.validationPanel.innerHTML = renderValidationPanel(state.processResult);
  };

  const syncActionsPanel = () => {
    const canPrint = Boolean(state.processResult.previewData);
    const canExportDocx = Boolean(state.processResult.validReport && tocEntries().length > 0);
    const canCopyFinalText = Boolean(state.processResult.previewData && tocEntries().length > 0);

    refs.printButton.disabled = !canPrint;
    refs.exportDocxButton.disabled = !canExportDocx;
    refs.copyFinalTextButton.disabled = !canCopyFinalText;
    refs.statusNote.textContent = state.statusMessage;
  };

  const measurePreview = () => {
    if (!state.processResult.previewData) {
      return;
    }

    const measurementRoot = refs.previewPanel.querySelector('[data-measure-root="true"]');
    if (!measurementRoot) {
      return;
    }

    const heights = {};
    measurementRoot.querySelectorAll("[data-block-id]").forEach((blockElement) => {
      const blockId = blockElement.dataset.blockId;

      if (!blockId) {
        return;
      }

      const styles = window.getComputedStyle(blockElement);
      const marginTop = Number.parseFloat(styles.marginTop) || 0;
      const marginBottom = Number.parseFloat(styles.marginBottom) || 0;

      heights[blockId] = Math.ceil(
        blockElement.getBoundingClientRect().height + marginTop + marginBottom,
      );
    });

    const measured = buildMeasuredPaginatedPreview(state.processResult.previewData, heights);

    if (previewSignature(measured) === previewSignature(state.paginatedPreview)) {
      return;
    }

    state.paginatedPreview = measured;
    refs.previewPanel.innerHTML = renderPreviewPanel(
      state.processResult,
      state.paginatedPreview,
      state.outputMode,
      state.authorBlockTop,
    );
    syncActionsPanel();
  };

  const schedulePreviewMeasurement = () => {
    if (measureFrame) {
      window.cancelAnimationFrame(measureFrame);
    }

    if (!state.processResult.previewData || !state.paginatedPreview) {
      return;
    }

    measureFrame = window.requestAnimationFrame(() => {
      measureFrame = 0;
      measurePreview();
    });
  };

  const syncPreviewPanel = () => {
    refs.previewPanel.innerHTML = renderPreviewPanel(
      state.processResult,
      state.paginatedPreview,
      state.outputMode,
      state.authorBlockTop,
    );
    schedulePreviewMeasurement();
  };

  const applyProcessResult = (result) => {
    state.processResult = result;
    state.paginatedPreview = result.previewData
      ? buildEstimatedPaginatedPreview(result.previewData)
      : null;
    syncValidationPanel();
    syncPreviewPanel();
    syncActionsPanel();
    persistProject();
  };

  const setStatus = (message) => {
    state.statusMessage = message;
    syncActionsPanel();
  };

  const runProcessing = (mode) => {
    const nextResult = processLlmResponse(state.rawLlmResponse);
    applyProcessResult(nextResult);

    if (nextResult.validReport) {
      setStatus(
        mode === "build"
          ? "Реферат успешно собран. Preview, печать и DOCX готовы."
          : "JSON валиден и проходит строгую схему.",
      );
      return;
    }

    if (nextResult.previewData) {
      setStatus(
        mode === "build"
          ? "Построен частичный fallback-preview. Исправьте ошибки для полного экспорта."
          : "JSON разобран частично, но строгая схема не пройдена.",
      );
      return;
    }

    setStatus("JSON не удалось безопасно разобрать.");
  };

  sourcePanel.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    const field = target.dataset.formField;
    if (!field) {
      return;
    }

    state.formData = {
      ...state.formData,
      [field]: target.value,
    };

    syncPromptPanel();
    persistProject();
  });

  sourcePanel.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "fill-demo") {
      state.formData = { ...DEMO_FORM_DATA };
      syncFormFields();
      syncPromptPanel();
      persistProject();
      setStatus("Демо-данные подставлены в форму.");
      return;
    }

    if (action === "clear-form") {
      state.formData = cloneDefaultFormData();
      syncFormFields();
      syncPromptPanel();
      persistProject();
      setStatus("Форма очищена. Черновик preview не удалён.");
      return;
    }

    if (action === "generate-prompt") {
      syncPromptPanel();
      setStatus("Prompt обновлён по текущим данным формы.");
      return;
    }

    if (action === "copy-prompt") {
      await copyText(promptText());
      setStatus("Prompt скопирован в буфер обмена.");
    }
  });

  promptPanel.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-action='copy-prompt']");
    if (!button) {
      return;
    }

    await copyText(promptText());
    setStatus("Prompt скопирован в буфер обмена.");
  });

  refs.rawTextarea.addEventListener("input", () => {
    state.rawLlmResponse = refs.rawTextarea.value;
    persistProject();
  });

  jsonPanel.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "validate-json") {
      runProcessing("validate");
      return;
    }

    if (action === "build-report") {
      runProcessing("build");
      return;
    }

    if (action === "insert-demo-json") {
      state.rawLlmResponse = getDemoReportJson();
      syncJsonTextarea();
      persistProject();
      setStatus("Вставлен demo JSON. Можно сразу запускать валидацию или сборку.");
      return;
    }

    if (action === "format-json") {
      const parsed = parseJsonWithRecovery(state.rawLlmResponse);

      if (!parsed.ok || parsed.value === undefined) {
        setStatus("Не удалось форматировать JSON: сначала исправьте ошибки извлечения.");
        return;
      }

      const normalized = normalizeReportCandidate(parsed.value);
      state.rawLlmResponse = JSON.stringify(normalized, null, 2);
      syncJsonTextarea();
      persistProject();
      setStatus("JSON отформатирован и выровнен.");
    }
  });

  previewPanel.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest("[data-action='set-output-mode']");
    if (!button) {
      return;
    }

    const nextMode = button.dataset.outputMode;

    if (!nextMode || state.outputMode === nextMode) {
      return;
    }

    state.outputMode = nextMode;
    syncPreviewPanel();
    setStatus(
      nextMode === "preview"
        ? "Открыт режим пагинированного документа."
        : nextMode === "text"
          ? "Открыт режим плоского текстового результата."
          : "Открыт режим нормализованного JSON.",
    );
  });

  previewPanel.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.dataset.role !== "author-block-top") {
      return;
    }

    state.authorBlockTop = clampAuthorBlockTop(target.value);
    syncPreviewPanel();
    persistProject();
    setStatus(`Положение блока автора: ${state.authorBlockTop}%.`);
  });

  refs.printButton.addEventListener("click", () => {
    if (!state.processResult.previewData) {
      setStatus("Сначала соберите preview документа.");
      return;
    }

    window.print();
  });

  refs.exportDocxButton.addEventListener("click", async () => {
    if (!state.processResult.validReport || tocEntries().length === 0) {
      setStatus("DOCX доступен только после успешной строгой валидации.");
      return;
    }

    try {
      await exportDocx(state.processResult.validReport, tocEntries());
      setStatus("DOCX-файл сформирован локально.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Не удалось сформировать DOCX.";
      setStatus(`Ошибка DOCX: ${message}`);
    }
  });

  refs.copyFinalTextButton.addEventListener("click", async () => {
    if (!state.processResult.previewData || tocEntries().length === 0) {
      setStatus("Копирование текста доступно после сборки выходного документа.");
      return;
    }

    await copyText(buildPlainTextReport(state.processResult.previewData, tocEntries()));
    setStatus("Финальный текст реферата скопирован.");
  });

  refs.exportProjectButton.addEventListener("click", () => {
    downloadProjectJson(
      buildStoredProject(
        state.formData,
        promptText(),
        state.rawLlmResponse,
        state.processResult.validReport,
        state.authorBlockTop,
      ),
    );
    setStatus("Project JSON экспортирован.");
  });

  refs.importProjectButton.addEventListener("click", () => {
    refs.importInput.click();
  });

  refs.importInput.addEventListener("change", async () => {
    const file = refs.importInput.files && refs.importInput.files[0];
    if (!file) {
      return;
    }

    try {
      const imported = await parseImportedProject(file);
      state.formData = imported.formData;
      state.rawLlmResponse = imported.rawLlmResponse;
      state.authorBlockTop = clampAuthorBlockTop(
        imported.ui ? imported.ui.authorBlockTop : DEFAULT_AUTHOR_BLOCK_TOP,
      );
      syncFormFields();
      syncPromptPanel();
      syncJsonTextarea();
      applyProcessResult(buildRestoredProcessResult(imported));
      setStatus("Project JSON импортирован.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось импортировать project JSON.";
      setStatus(`Ошибка импорта: ${message}`);
    } finally {
      refs.importInput.value = "";
    }
  });

  refs.resetProjectButton.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Сбросить форму, raw JSON, preview и локальный черновик? Это действие нельзя отменить.",
    );

    if (!confirmed) {
      return;
    }

    state.formData = cloneDefaultFormData();
    state.rawLlmResponse = "";
    state.processResult = emptyProcessResult();
    state.paginatedPreview = null;
    state.outputMode = "preview";
    state.authorBlockTop = DEFAULT_AUTHOR_BLOCK_TOP;
    state.statusMessage = "Проект сброшен и localStorage очищен.";
    clearStoredProject();
    syncFormFields();
    syncPromptPanel();
    syncJsonTextarea();
    syncValidationPanel();
    syncPreviewPanel();
    syncActionsPanel();
  });

  window.addEventListener("resize", () => {
    schedulePreviewMeasurement();
  });

  const storedProject = loadStoredProject();

  if (storedProject) {
    state.formData = storedProject.formData;
    state.rawLlmResponse = storedProject.rawLlmResponse;
    state.processResult = buildRestoredProcessResult(storedProject);
    state.paginatedPreview = state.processResult.previewData
      ? buildEstimatedPaginatedPreview(state.processResult.previewData)
      : null;
    state.authorBlockTop = clampAuthorBlockTop(
      storedProject.ui ? storedProject.ui.authorBlockTop : DEFAULT_AUTHOR_BLOCK_TOP,
    );
    state.statusMessage = "Черновик восстановлен из localStorage.";
  }

  state.hydrated = true;

  syncFormFields();
  syncPromptPanel();
  syncJsonTextarea();
  syncValidationPanel();
  syncPreviewPanel();
  syncActionsPanel();

  try {
    if (!window.localStorage.getItem(APP_STORAGE_KEY)) {
      persistProject();
    }
  } catch {
    // Ignore storage availability issues.
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  if (!root) {
    throw new Error("Root container #root not found.");
  }

  initApp(root);
});
