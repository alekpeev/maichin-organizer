# ВАЖНО: ПРАВИЛА ЗА РАБОТА С НЕ-ПРОГРАМИСТ (NON-DEV BUILDER)
Създателят на проекта е мъж, нетехнически. Твоята роля е негов личен Старши софтуерен инженер. Задължително спазвай тези правила:
1. Никога не одобрявай промени по подразбиране. Винаги обяснявай какво правиш на прост български, ПРЕДИ да го направиш.
2. Изисквай изрично съгласие преди мащабни пренаписвания, изтриване на файлове или архитектурни промени.
3. Обяснявай решенията просто — без излишен технически жаргон.
4. Всички commit съобщения и коментари в кода — на български.

---

# 🚨 ПРОЧЕТИ ПЪРВО — ЗАДЪЛЖИТЕЛНО ПРИ ВСЯКА НОВА СЕСИЯ

**Стъпка 1 — Провери на кой branch си:**
```
git branch --show-current
```

**Стъпка 2 — Ако НЕ си на `claude/read-claude-docs-gHaua`, превключи:**
```
git fetch origin claude/read-claude-docs-gHaua
git checkout claude/read-claude-docs-gHaua
```

**Стъпка 3 — Изтрий auto-created branch-а (ако е създаден):**
```
git branch -D <новият branch>
git push origin --delete <новият branch>
```

**Стъпка 4 — Потвърди на потребителя:**
"Готов. Работя на `claude/read-claude-docs-gHaua`. Последен commit: `91d9215`. Приложението работи. Следващата задача е: данните на майките да отиват в ТЕХНИЯ Google Drive."

---

# ⚠️ РАБОТЕЩА ВЕРСИЯ — НИКОГА НЕ ТРИЙ БЕЗ СЪГЛАСИЕ

**Последен работещ Commit:** `91d9215` (9 май 2026)
**Branch:** `claude/read-claude-docs-gHaua`
**GAS URL:** `https://script.google.com/macros/s/AKfycbz5NkiH4UIOa_pMIzSnMc_z3ll1VHHyoDmLLcK38b1ERkROQ2I-pHiQjGA8NHr1sfWl/exec`
**GAS Deployment:** Име "n" | Версия 89 | Деплойнато на 6.05.2026 в 13:25
**GAS Deployment ID:** `AKfycbz5NkiH4UIOa_pMIzSnMc_z3ll1VHHyoDmLLcK38b1ERkROQ2I-pHiQjGA8NHr1sfWl`
**GAS Script URL:** `https://script.google.com/home/projects/1HNzzNl4UnUR_IKtEvzzq2DTbe0-lNnaSWJNJELCyY9P_O1r6BnPoHXkM/edit`

**Какво работи:** Логин, dashboard, всички секции (ваксини, спомени, растеж и т.н.), качване на снимки в Google Drive, показване на снимки в картите на спомените, автоматичен вход при повторно отваряне на PWA (без нужда от логин всеки път).

**Ако нещо се счупи — как да върнем:**
```
git checkout claude/read-claude-docs-gHaua
git checkout 91d9215 -- index.html
git commit -m "Връща работещата версия"
git push -u origin claude/read-claude-docs-gHaua
```

**⚠️ ВАЖНО — Само един branch!**
Работим САМО в `claude/read-claude-docs-gHaua`. GitHub Pages сервира от този branch.
НИКОГА не се създават нови branch-ове без изрично съгласие.
Предишен проблем: объркване между branch-ове накара GitHub Pages да сервира стара версия — приложението беше счупено 10 дни.

**Известен архитектурен проблем (предстои оправяне):**
В момента таблицата с данни на всяка майка се създава в Drive-а на РАЗРАБОТЧИКА, не в нейния.
Предстои промяна: таблицата и снимките да се създават в акаунта на майката (нужно и за Google верификация).

---


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
- **Текущ deploy URL:** `https://script.google.com/macros/s/AKfycbz5NkiH4UIOa_pMIzSnMc_z3ll1VHHyoDmLLcK38b1ERkROQ2I-pHiQjGA8NHr1sfWl/exec`
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
| 4 | Автоматичен вход при повторно отваряне (PWA сесия) | ✅ Готово |
| 5 | Данните на майките да са в ТЕХНИЯ Drive (не в нашия) | 🔜 Следващо — нужно за Google верификация |
| 6 | Мигриране на всички секции (Здраве, Растеж и т.н.) | ⬜ Предстои |
| 7 | Аналитика + географски данни | ⬜ Предстои |
| 8 | PWA манифест + икони + "Добави на начален екран" | ⬜ Предстои |
| 9 | UI полиране + финален тест на iPhone | ⬜ Предстои |
| 10 | Privacy Policy страница | ⬜ Предстои |
| 11 | Google верификация (кандидатстване) | ⬜ Предстои |
| 12 | Stripe интеграция | ⬜ Предстои |

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
- Гласовите бележки (микрофон) са премахнати — Web Speech API не работи в PWA режим на iPhone
- Токенът на сесията се пази в localStorage — автоматичен вход при повторно отваряне на приложението
- ⚠️ Таблиците на майките се създават в Drive-а на РАЗРАБОТЧИКА (не в техния) — предстои оправяне, нужно за Google верификация

---

# 10. АРХИТЕКТУРЕН ПРОБЛЕМ — ДАННИТЕ В НАШИЯ DRIVE (ПРЕДСТОИ)

**Проблем:** `SpreadsheetApp.create()` в GAS създава таблицата в Drive-а на разработчика. Майките са добавени като редактори, но данните физически стоят при нас.

**Защо трябва да се оправи:**
- Чувствителна информация за деца не трябва да е в нашия акаунт
- Google изисква данните да са в акаунта на потребителя за верификация
- При много потребителки Drive-ът на разработчика се напълва

**Правилното решение:**
При логин да се поискат `drive.file` + `spreadsheets` scopes → майката дава разрешение веднъж → таблицата и снимките се създават в НЕЙНИЯ Drive.

**⚠️ ВНИМАНИЕ:** Предишен опит да се добавят scopes счупи логина за 10 дни. Трябва да се планира и тества много внимателно.
