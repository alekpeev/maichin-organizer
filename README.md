# Майчин Органайзър

PWA приложение за организация на ежедневието на майки.

## Архитектура

Приложението се състои от две части, които работят заедно:

### 1. Frontend (GitHub Pages)
Хоства се на GitHub Pages от това repo. Това е PWA wrapper-ът, който потребителят инсталира на телефона си.

**Файлове в корена на repo-то:**
- `index.html` — главната страница
- `manifest.json` — PWA manifest (име, икони, тема)
- `service-worker.js` — за offline функционалност и кеширане
- `icons/` — папка с PWA иконите (192x192, 512x512 и т.н.)

**Live URL:** https://ТВОЕТО-GITHUB-USERNAME.github.io/maichin-organizer/

### 2. Backend (Google Apps Script)
Хоства се отделно на script.google.com — НЕ в това repo.

Папката `apps-script/` в repo-то е **САМО КОПИЕ за справка на Claude**. Истинският код, който се изпълнява, живее в Google Apps Script. Когато се правят промени в `apps-script/Code.gs` тук, те трябва ръчно да се копират обратно в Apps Script редактора.

**Файлове в `apps-script/` папката:**
- `Code.gs` — основната backend логика
- `Index.html` — HTML темплейт (ако се ползва HtmlService)
- `appsscript.json` — конфигурация на проекта

**Backend Web App URL:** https://script.google.com/macros/s/ТВОЯ-DEPLOYMENT-ID/exec

## Как работи комуникацията

```
Потребител отваря приложението
         ↓
GitHub Pages сервира index.html
         ↓
JavaScript прави fetch() заявки
         ↓
Google Apps Script Web App обработва
         ↓
Google Sheets / Drive връщат данни
         ↓
Frontend показва резултата
```

## Технологии

- **Frontend:** Vanilla JavaScript (без framework), HTML5, CSS3
- **Backend:** Google Apps Script (V8 runtime)
- **База данни:** Google Sheets
- **Хостинг frontend:** GitHub Pages
- **Хостинг backend:** Google (script.google.com)
- **PWA:** manifest.json + service-worker.js

## Известни проблеми (към момента)

1. **CSS overflow на iPhone Safari** — приложението може да се мести наляво-надясно с пръст и съдържанието излиза от екрана. Нужно е да се ограничи horizontal scrolling.

2. **Грешна икона при "Add to Home Screen"** — показва се иконата от Google Apps Script вместо иконата дефинирана в `manifest.json` от GitHub Pages. Manifest-ът трябва да се зарежда правилно.

## Важни бележки за разработка

- **Apps Script кодът използва специфични API-та:** `SpreadsheetApp`, `DriveApp`, `UrlFetchApp`, `HtmlService`, `PropertiesService`. Това НЕ е обикновен Node.js — синтаксисът е Apps Script V8.
- **Service Worker-ът кешира агресивно** — при промени в frontend кода може да трябва hard refresh (Ctrl+Shift+R) или промяна на cache version в `service-worker.js`.
- **CORS** — Apps Script Web App трябва да е deploy-нат с "Anyone" достъп, за да може frontend-ът да го извиква.
- **Manifest-ът трябва да се зарежда от същия domain** като index.html (GitHub Pages), не от Apps Script.

## Структура на repo-то

```
maichin-organizer/
├── index.html
├── manifest.json
├── service-worker.js
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
├── styles/           (ако CSS е отделно)
├── js/               (ако JS е отделно)
├── apps-script/      (КОПИЕ на backend кода)
│   ├── Code.gs
│   ├── Index.html
│   └── appsscript.json
└── README.md
```

## За Claude / AI асистенти, които работят по този проект

Преди да правите промени:
1. Прочетете този README цялостно
2. Разгледайте структурата на repo-то
3. Обяснете плана преди да пишете код
4. Помнете че `apps-script/` е КОПИЕ — реалният deploy е на Google
5. При промени в frontend, проверете дали service-worker не кешира старата версия
