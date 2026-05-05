# ВАЖНО: ПРАВИЛА ЗА РАБОТА С НЕ-ПРОГРАМИСТ (NON-DEV BUILDER)
Създателят на проекта е мъж, нетехнически. Твоята роля е негов личен Старши софтуерен инженер. Задължително спазвай тези правила:
1. Никога не одобрявай промени по подразбиране. Винаги обяснявай какво правиш на прост български, ПРЕДИ да го направиш.
2. Изисквай изрично съгласие преди мащабни пренаписвания, изтриване на файлове или архитектурни промени.
3. Обяснявай решенията просто — без излишен технически жаргон.
4. Всички commit съобщения и коментари в кода — на български.

---

# 1. ПРОЕКТ — ОБЩА ИНФОРМАЦИЯ

- **Име:** Майчин Органайзър
- **Цел:** Мобилно уеб приложение за майки — проследяване на бебешки данни (ваксини, прегледи, растеж, спомени, хранене, зъби, болести, бележки, лекари)
- **Целева аудитория:** Майки с бебета и малки деца, ползват предимно iPhone
- **Бизнес модел:** Еднократно плащане през Stripe — купуваш линка, ползваш завинаги
- **Tech Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3 — БЕЗ npm, БЕЗ React/Vue
- **Дизайн:** Меки розови/ментови цветове, Mobile-First, PWA (добавяне на начален екран)

---

# 2. ТЕКУЩА АРХИТЕКТУРА (решена и финална)

## Как работи приложението:

```
Потребителката отваря GitHub Pages
        ↓
Влиза с Google (само email + профил — БЕЗ чувствителни разрешения)
        ↓
GitHub Pages изпраща JSONP заявка към GAS
        ↓
GAS верифицира токена, създава таблица в Drive на потребителката
        ↓
Всички данни се пазят в Google Sheets/Drive НА ПОТРЕБИТЕЛКАТА
```

## Компоненти:

| Компонент | Технология | URL |
|-----------|-----------|-----|
| Frontend (UI) | GitHub Pages | `https://alekpeev.github.io/maichin-organizer` |
| Backend (данни) | Google Apps Script | вижте по-долу |
| Данни | Google Sheets + Drive | В акаунта на всяка потребителка |
| Аналитика | Google Sheets (наш) | Admin Sheet |
| Плащане | Stripe | предстои |

## Защо тази архитектура:
- Данните са в Google акаунта на майката — не в наши сървъри ✅
- Нямаме месечни разходи за хостинг/сървъри ✅
- GitHub Pages е безплатен ✅
- Приложението се инсталира на телефона като PWA ✅
- Без viewport проблеми (старата GAS версия ги имаше) ✅

---

# 3. ВАЖНИ КОНФИГУРАЦИОННИ ДАННИ

## Google Cloud:
- **Проект:** `maichin-organizer`
- **OAuth Client ID:** `488308267310-ibfdaokrhpcq0mh8q2gf3jjnjrhii3fe.apps.googleusercontent.com`
- **Authorized JS origins:** `https://alekpeev.github.io`
- **Authorized redirect URIs:** `https://alekpeev.github.io/maichin-organizer` и `https://alekpeev.github.io/maichin-organizer/`
- **Publishing status:** In production (unverified — верификацията предстои)

## Google Apps Script:
- **Текущ deploy URL:** `https://script.google.com/macros/s/AKfycbwL8kqfvDvuty5vsPnzvxF0l0v-ggmvWLeNH3w45O_BDnTS7HZxGnx1u8R-TOC0UKL96A/exec`
- **Execute as:** Me (разработчикът)
- **Who has access:** Anyone (без Google акаунт)
- **ВАЖНО:** При всяка промяна в code.gs трябва нов deploy (New deployment) — URL-ът се сменя и трябва да се обнови в index.html

## Admin Sheet (аналитика):
- **Sheet ID:** `1YtNB77H3DZ76Rlmo0TuPA9_j8qaW_QxTFGOitZ4tEXo`
- **Колони:** Email | Първо влизане | Последно влизане | Брой влизания | Държава

## GitHub:
- **Repo:** `alekpeev/maichin-organizer`
- **Работен branch:** `claude/read-claude-docs-gHaua`
- **GitHub Pages:** сервира от branch `claude/read-claude-docs-gHaua`
- **НИКОГА не пушваме директно в `main` без съгласие**

---

# 4. ФАЙЛОВА СТРУКТУРА

```
maichin-organizer/
├── index.html          ← GitHub Pages входна точка (логин страница засега)
├── code.gs             ← GAS backend — API + всички data функции
├── stayles.html        ← CSS стилове (внимание: typo в името — "stayles" не "styles")
├── scripts.html        ← JavaScript логика на приложението
├── Helpers.html        ← Празен helper файл
└── CLAUDE.md           ← Този файл
```

**ВАЖНО за GAS файловете:** `stayles.html`, `scripts.html`, `Helpers.html` се използват само от старата GAS версия. В новата GitHub Pages версия всичко ще е в `index.html` (или отделни файлове без .html разширение).

---

# 5. КОМУНИКАЦИЯ GitHub Pages ↔ GAS

Използваме **JSONP** (не fetch/POST) заради CORS ограничения.

## Как работи JSONP:
- Фронтендът добавя `<script src="GAS_URL?action=X&token=Y&callback=Z">` в DOM
- GAS връща `Z({ success: true, result: {...} })`
- Фронтендът изпълнява callback функцията

## Пример за API заявка:
```javascript
callApi('getProfile', {}, idToken).then(function(profile) { ... });
```

## Всички API actions в GAS (code.gs → _routeAction):
`init`, `getProfile`, `saveProfile`, `getDashboard`, `getMilestones`, `addMilestone`,
`getHealth`, `markVaccineDone`, `getAllergies`, `addAllergy`, `deleteAllergy`,
`getCheckups`, `markCheckupDone`, `addManualCheckup`, `getIllnesses`, `addIllness`,
`updateIllness`, `deleteIllness`, `getTeeth`, `saveTooth`, `getGrowth`, `addGrowthEntry`,
`getMemories`, `addMemory`, `getFeeding`, `addFeedingEntry`, `getDoctors`, `addDoctor`,
`getNotes`, `addNote`, `toggleNoteDone`, `deleteNote`, `uploadPhoto`,
`getSpreadsheetUrl`, `deleteEntry`

---

# 6. GOOGLE ВЕРИФИКАЦИЯ — СТАТУС И ПЛАН

## Защо е нужна:
Без верификация потребителките виждат "This app is not verified" предупреждение от Google при първо влизане. Непрофесионално за продаване.

## Какво изисква Google:
1. **Privacy Policy URL** — публична страница с политика за поверителност
2. **Видео демо** (1-3 мин) — показва как приложението използва Sheets и Drive
3. **Описание** на защо са нужни разрешенията

## Кога кандидатстваме:
**След като приложението е готово** — с всички функции, с Privacy Policy страница. Google трябва да вижда завършен продукт.

## Очаквано време: 1-4 седмици (реалистично ~1 седмица за тези скопове)

## Скопове за верификация:
- `https://www.googleapis.com/auth/spreadsheets` — за запис на данни
- `https://www.googleapis.com/auth/drive.file` — за снимки

---

# 7. ПЛАН ЗА РАЗРАБОТКА — СТАТУС

| # | Стъпка | Статус |
|---|--------|--------|
| 1 | Google Cloud проект + OAuth + Admin Sheet | ✅ Готово |
| 2 | GitHub Pages логин страница | ✅ Готово |
| 3 | GAS API слой + JSONP комуникация | ✅ Готово |
| 4 | Мигриране на Dashboard екрана | ⬜ Следващо |
| 5 | Мигриране на всички секции (Здраве, Растеж и т.н.) | ⬜ Предстои |
| 6 | Аналитика + географски данни | ⬜ Предстои |
| 7 | PWA манифест + икони + "Добави на начален екран" | ⬜ Предстои |
| 8 | UI полиране + финален тест на iPhone | ⬜ Предстои |
| 9 | Privacy Policy страница | ⬜ Предстои |
| 10 | Google верификация (кандидатстване) | ⬜ Предстои |
| 11 | Stripe интеграция | ⬜ Предстои |

---

# 8. КОДОВИ КОНВЕНЦИИ

- **Именуване:** `camelCase` за JS променливи и функции
- **CSS класове:** описателни имена (`btn-primary`, `task-container`)
- **Грешки:** Приятелски съобщения на български, не технически кодове
- **Коментари:** JSDoc на български над всяка функция
- **Mobile-First:** Всичко трябва да работи перфектно на iPhone

---

# 9. ИЗВЕСТНИ ПРОБЛЕМИ / ИСТОРИЯ

- Старата GAS-only версия имаше хоризонтален overflow на iOS Safari — решен с CSS в `stayles.html` (fixed wrapper архитектура) но не напълно
- GIS (Google Identity Services) библиотеката причиняваше redirect loops след revoke на permissions — затова ползваме само простия `g_id_signin` бутон с `auto_prompt=false`
- `response_type=id_token` implicit flow е deprecated от Google — не го ползваме
- CORS блокира fetch/POST от GitHub Pages към GAS — затова ползваме JSONP
- При промяна на code.gs ЗАДЪЛЖИТЕЛНО нов GAS deploy + обновяване на URL в index.html
