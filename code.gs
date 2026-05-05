// ============================================================
// МАЙЧИН ОРГАНАЙЗЪР - Apps Script Web App
// ВЕРСИЯ v13 - ПРАВИЛЕН VIEWPORT
// v12 фиксна местенето но направи приложението малко.
// v13 връща viewport (за пълна ширина) но БЕЗ дублиране -
// единственият viewport tag сега е в doGet(), не в Index.html
// ============================================================

const SHEET_NAMES = {
  PROFILE: 'Профил', MILESTONES: 'Постижения', HEALTH: 'Здраве',
  GROWTH: 'Растеж', MEMORIES: 'Спомени', FEEDING: 'Хранене',
  DOCTORS: 'Лекари', NOTES: 'Бележки', ALLERGIES: 'Алергии',
  CHECKUPS: 'Прегледи', ILLNESSES: 'Боледуване', TEETH: 'Зъби'
};

const VACCINE_SCHEDULE = [
  { month: 0,  name: 'Хепатит Б (1-ва доза)',                    short: 'Хеп Б 1' },
  { month: 1,  name: 'Хепатит Б (2-ра доза)',                    short: 'Хеп Б 2' },
  { month: 2,  name: 'Хексаваксин (1-ва) + Пневмококова (1-ва)', short: 'Хекса 1 + Пневмо 1' },
  { month: 3,  name: 'Хексаваксин (2-ра доза)',                  short: 'Хекса 2' },
  { month: 4,  name: 'Хексаваксин (3-та) + Пневмококова (2-ра)', short: 'Хекса 3 + Пневмо 2' },
  { month: 7,  name: 'Хепатит Б (3-та доза)',                    short: 'Хеп Б 3' },
  { month: 11, name: 'Пневмококова (бустер) + МПР (1-ва)',       short: 'Пневмо бустер + МПР 1' },
  { month: 12, name: 'Варицела (1-ва доза)',                     short: 'Варицела 1' },
  { month: 18, name: 'Хексаваксин (бустер)',                     short: 'Хекса бустер' },
  { month: 24, name: 'Хепатит А (1-ва доза)',                    short: 'Хеп А 1' },
  { month: 30, name: 'Хепатит А (2-ра доза)',                    short: 'Хеп А 2' },
  { month: 72, name: 'МПР (2-ра) + Варицела (2-ра)',             short: 'МПР 2 + Варицела 2' },
  { month: 84, name: 'Тетанус/Дифтерия/Коклюш (бустер)',        short: 'ТДК бустер' }
];

const CHECKUP_SCHEDULE = [
  {month:1,name:'Преглед на 1 месец'},{month:2,name:'Преглед на 2 месеца'},{month:3,name:'Преглед на 3 месеца'},{month:4,name:'Преглед на 4 месеца'},{month:5,name:'Преглед на 5 месеца'},{month:6,name:'Преглед на 6 месеца'},{month:7,name:'Преглед на 7 месеца'},{month:8,name:'Преглед на 8 месеца'},{month:9,name:'Преглед на 9 месеца'},{month:10,name:'Преглед на 10 месеца'},{month:11,name:'Преглед на 11 месеца'},{month:12,name:'Преглед на 12 месеца (1 година)'},{month:15,name:'Преглед на 15 месеца'},{month:18,name:'Преглед на 18 месеца (1.5 години)'},{month:24,name:'Преглед на 24 месеца (2 години)'},{month:36,name:'Преглед на 3 години'},{month:48,name:'Преглед на 4 години'},{month:60,name:'Преглед на 5 години'},{month:72,name:'Преглед на 6 години'},{month:84,name:'Преглед на 7 години'},{month:96,name:'Преглед на 8 години'},{month:108,name:'Преглед на 9 години'},{month:120,name:'Преглед на 10 години'}
];

const TEETH_SCHEDULE = [
  {id:'upper_right_1',name:'Горен десен централен резец',type:'central',monthMin:8,monthMax:12},{id:'upper_right_2',name:'Горен десен страничен резец',type:'lateral',monthMin:9,monthMax:13},{id:'upper_right_3',name:'Горен десен кучешки',type:'canine',monthMin:16,monthMax:22},{id:'upper_right_4',name:'Горен десен първи кътник',type:'molar1',monthMin:13,monthMax:19},{id:'upper_right_5',name:'Горен десен втори кътник',type:'molar2',monthMin:25,monthMax:33},{id:'upper_left_1',name:'Горен ляв централен резец',type:'central',monthMin:8,monthMax:12},{id:'upper_left_2',name:'Горен ляв страничен резец',type:'lateral',monthMin:9,monthMax:13},{id:'upper_left_3',name:'Горен ляв кучешки',type:'canine',monthMin:16,monthMax:22},{id:'upper_left_4',name:'Горен ляв първи кътник',type:'molar1',monthMin:13,monthMax:19},{id:'upper_left_5',name:'Горен ляв втори кътник',type:'molar2',monthMin:25,monthMax:33},{id:'lower_left_1',name:'Долен ляв централен резец',type:'central',monthMin:6,monthMax:10},{id:'lower_left_2',name:'Долен ляв страничен резец',type:'lateral',monthMin:10,monthMax:16},{id:'lower_left_3',name:'Долен ляв кучешки',type:'canine',monthMin:17,monthMax:23},{id:'lower_left_4',name:'Долен ляв първи кътник',type:'molar1',monthMin:14,monthMax:18},{id:'lower_left_5',name:'Долен ляв втори кътник',type:'molar2',monthMin:23,monthMax:31},{id:'lower_right_1',name:'Долен десен централен резец',type:'central',monthMin:6,monthMax:10},{id:'lower_right_2',name:'Долен десен страничен резец',type:'lateral',monthMin:10,monthMax:16},{id:'lower_right_3',name:'Долен десен кучешки',type:'canine',monthMin:17,monthMax:23},{id:'lower_right_4',name:'Долен десен първи кътник',type:'molar1',monthMin:14,monthMax:18},{id:'lower_right_5',name:'Долен десен втори кътник',type:'molar2',monthMin:23,monthMax:31}
];

// ============================================================
// API КОНФИГУРАЦИЯ (за GitHub Pages версията)
// ============================================================
const API_CLIENT_ID = '488308267310-ibfdaokrhpcq0mh8q2gf3jjnjrhii3fe.apps.googleusercontent.com';
const ADMIN_SHEET_ID = '1YtNB77H3DZ76Rlmo0TuPA9_j8qaW_QxTFGOitZ4tEXo';

// ============================================================
// WEB APP ENTRY POINTS
// ============================================================

/** GET — обработва JSONP заявки от GitHub Pages + ping */
function doGet(e) {
  // JSONP API заявка (заобикаля CORS)
  if (e && e.parameter && e.parameter.callback) {
    var cbName = e.parameter.callback;
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cbName)) {
      return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    try {
      var token  = e.parameter.token  || '';
      var action = e.parameter.action || '';
      var data   = JSON.parse(e.parameter.data || '{}');
      if (!token)  throw new Error('Липсва токен.');
      if (!action) throw new Error('Липсва action.');
      var email  = _verifyIdToken(token);
      var result = _routeAction(action, data, email);
      if (action === 'init') _logAnalytics(email, data.country || '');
      var json = JSON.stringify({ success: true, result: result });
      return ContentService.createTextOutput(cbName + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } catch (err) {
      var json = JSON.stringify({ success: false, error: err.message });
      return ContentService.createTextOutput(cbName + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }

  // Ping проверка
  if (e && e.parameter && e.parameter.ping) {
    return _jsonResponse({ ok: true, v: 'v14-api' });
  }

  // Стара HTML версия (обратна съвместимост)
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Майчин Органайзър')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, shrink-to-fit=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** POST — главен API endpoint за GitHub Pages приложението */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var token = body.token;
    var action = body.action;
    var data = body.data || {};

    if (!token) throw new Error('Липсва токен за автентикация.');
    if (!action) throw new Error('Липсва action параметър.');

    var email = _verifyIdToken(token);
    var result = _routeAction(action, data, email);

    if (action === 'init') {
      _logAnalytics(email, data.country || '');
    }

    return _jsonResponse({ success: true, result: result });
  } catch (err) {
    return _jsonResponse({ success: false, error: err.message });
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================================
// API ПОМОЩНИ ФУНКЦИИ
// ============================================================

/** Връща JSON отговор */
function _jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Верифицира Google id_token и връща email на потребителя */
function _verifyIdToken(token) {
  try {
    var url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token);
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var info = JSON.parse(response.getContentText());
    if (response.getResponseCode() !== 200) throw new Error('Невалиден токен.');
    if (!info.email) throw new Error('Токенът не съдържа email.');
    if (info.aud !== API_CLIENT_ID) throw new Error('Токенът не е за това приложение.');
    return info.email;
  } catch (err) {
    throw new Error('Грешка при верификация: ' + err.message);
  }
}

/**
 * Взима или създава таблицата на потребителя.
 * Таблицата се създава в акаунта на разработчика и
 * веднага се прехвърля в собственост на потребителя.
 */
function _getUserSpreadsheet(email) {
  var props = PropertiesService.getScriptProperties();
  var key = 'ss_' + email.replace(/[@.+]/g, '_');
  var ssId = props.getProperty(key);

  if (ssId) {
    try {
      return SpreadsheetApp.openById(ssId);
    } catch (e) {
      // Таблицата е изтрита или достъпът е премахнат — правим нова
      props.deleteProperty(key);
    }
  }

  // Нова потребителка — създаваме главна папка + таблица вътре в нея
  var folderKey = 'folder_' + email.replace(/[@.+]/g, '_');
  var folder;
  try {
    folder = DriveApp.createFolder('Майчин Органайзър');
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  var ss = SpreadsheetApp.create('Майчин Органайзър — данни');
  ssId = ss.getId();

  // Местим таблицата в папката (преди прехвърляне на собствеността)
  try {
    DriveApp.getFileById(ssId).moveTo(folder);
  } catch (e) {
    Logger.log('Move to folder failed: ' + e.message);
  }

  // Прехвърляме собствеността на папката и таблицата на потребителката
  try {
    folder.setOwner(email);
    DriveApp.getFileById(ssId).setOwner(email);
  } catch (e) {
    Logger.log('Ownership transfer failed for ' + email + ': ' + e.message);
  }

  _setupSheets(ss);
  props.setProperty(key, ssId);
  props.setProperty(folderKey, folder.getId());

  return ss;
}

/** Връща ID на главната Drive папка за потребителя (ако е запазено) */
function _getUserFolderId(email) {
  var props = PropertiesService.getScriptProperties();
  var folderKey = 'folder_' + email.replace(/[@.+]/g, '_');
  return props.getProperty(folderKey) || null;
}

/** Рутира API заявката към правилната функция */
function _routeAction(action, data, email) {
  // Задаваме таблицата на потребителя като активна за тази заявка
  _ssCache = _getUserSpreadsheet(email);

  switch (action) {
    case 'init':           return { spreadsheetId: _ssCache.getId(), email: email, folderId: _getUserFolderId(email) };
    case 'getProfile':     return getProfile();
    case 'saveProfile':    return saveProfile(data);
    case 'getDashboard':   return getDashboardData();
    case 'getMilestones':  return getMilestones();
    case 'addMilestone':   return addMilestone(data);
    case 'getHealth':      return getHealth();
    case 'markVaccineDone': return markVaccineDone(data);
    case 'getAllergies':   return getAllergies();
    case 'addAllergy':     return addAllergy(data);
    case 'deleteAllergy':  return deleteAllergy(data.id);
    case 'getCheckups':    return getCheckups();
    case 'markCheckupDone': return markCheckupDone(data);
    case 'addManualCheckup': return addManualCheckup(data);
    case 'getIllnesses':   return getIllnesses();
    case 'addIllness':     return addIllness(data);
    case 'updateIllness':  return updateIllness(data.id, data);
    case 'deleteIllness':  return deleteIllness(data.id);
    case 'getTeeth':       return getTeeth();
    case 'saveTooth':      return saveTooth(data);
    case 'getGrowth':      return getGrowth();
    case 'addGrowthEntry': return addGrowthEntry(data);
    case 'getMemories':    return getMemories();
    case 'addMemory':      return addMemory(data);
    case 'getFeeding':     return getFeeding();
    case 'addFeedingEntry': return addFeedingEntry(data);
    case 'getDoctors':     return getDoctors();
    case 'addDoctor':      return addDoctor(data);
    case 'getNotes':       return getNotes();
    case 'addNote':        return addNote(data);
    case 'toggleNoteDone': return toggleNoteDone(data.id);
    case 'deleteNote':     return deleteNote(data.id);
    case 'uploadPhoto':    return uploadPhoto(data.base64, data.fileName, data.mimeType);
    case 'getSpreadsheetUrl': return getSpreadsheetUrl();
    case 'deleteEntry':    return deleteEntry(data.sheetName, data.rowIndex);
    case 'updateVaccineRecord': return updateVaccineRecord(data.name, data);
    case 'deleteVaccineByName': return deleteVaccineByName(data.name);
    case 'updateCheckupRecord': return updateCheckupRecord(data.name, data);
    case 'deleteCheckupByName': return deleteCheckupByName(data.name);
    case 'bulkMarkVaccinesDone': return bulkMarkVaccinesDone(data.items);
    case 'bulkMarkCheckupsDone': return bulkMarkCheckupsDone(data.items);
    default:
      throw new Error('Непозната операция: ' + action);
  }
}

/** Записва активността на потребителя в Admin Sheet за аналитика */
function _logAnalytics(email, country) {
  try {
    var ss = SpreadsheetApp.openById(ADMIN_SHEET_ID);
    var sheet = ss.getSheets()[0];
    var now = new Date();

    if (sheet.getLastRow() < 2) {
      var data = [];
    } else {
      var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    }

    var userRow = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === email) { userRow = i + 2; break; }
    }

    if (userRow === -1) {
      // Нова потребителка
      sheet.appendRow([email, now, now, 1, country || 'Неизвестна']);
    } else {
      // Съществуваща — обновяваме последно влизане и брой
      sheet.getRange(userRow, 3).setValue(now);
      sheet.getRange(userRow, 4).setValue((data[userRow - 2][3] || 0) + 1);
    }
  } catch (e) {
    // Аналитиката не трябва да спира нормалната работа
    Logger.log('Analytics error: ' + e.message);
  }
}

// ============================================================
// ПОМОЩНИ ФУНКЦИИ
// ============================================================
var _ssCache = null;
function _getOrCreateSpreadsheet() {
  if (_ssCache) return _ssCache;
  const props = PropertiesService.getUserProperties();
  let ssId = props.getProperty('SPREADSHEET_ID');
  if (ssId) {
    try { _ssCache = SpreadsheetApp.openById(ssId); return _ssCache; } catch (e) { /* изтрит */ }
  }
  const ss = SpreadsheetApp.create('Майчин Органайзър - Данни');
  ssId = ss.getId();
  props.setProperty('SPREADSHEET_ID', ssId);
  _setupSheets(ss);
  _ssCache = ss;
  return ss;
}

function _setupSheets(ss) {
  const headers = {
    [SHEET_NAMES.PROFILE]: null,
    [SHEET_NAMES.MILESTONES]: ['Дата','Категория','Събитие','Описание','Снимка (URL)'],
    [SHEET_NAMES.HEALTH]: ['Ваксина','Планирана дата','Направена на','Лекар','Реакция','Следващ преглед','Бележки'],
    [SHEET_NAMES.GROWTH]: ['Дата','Тегло (кг)','Ръст (см)','Обиколка глава (см)','Бележки'],
    [SHEET_NAMES.MEMORIES]: ['Дата','Заглавие','Описание','Категория','Снимка (URL)'],
    [SHEET_NAMES.FEEDING]: ['Дата','Храна','Реакция','Алергия?','Бележки'],
    [SHEET_NAMES.DOCTORS]: ['Специалност','Д-р Име','Телефон','Адрес','Бележки'],
    [SHEET_NAMES.NOTES]: ['ID','Дата','Текст','Приоритет','Снимка (URL)','Готово','Дата готово'],
    [SHEET_NAMES.ALLERGIES]: ['ID','Дата','Какво','Тип','Реакция','Степен','Лечение','Бележки','Източник'],
    [SHEET_NAMES.CHECKUPS]: ['Име','Планирана дата','Направен на','Лекар','Бележки','Тип'],
    [SHEET_NAMES.ILLNESSES]: ['ID','Заболяване','Дата разболяване','Симптоми','Макс температура','Лечение','Лекар','Карантина до','Контролен преглед','Дата оздравяване','Бележки'],
    [SHEET_NAMES.TEETH]: ['ID зъб','Статус','Дата поникване','Дата събитие','Лекар','Бележки']
  };
  const profileSheet = ss.insertSheet(SHEET_NAMES.PROFILE);
  profileSheet.getRange('A1:B1').setValues([['Поле','Стойност']]);
  const profileFields = ['Име на бебето','Дата на раждане','Час на раждане','Пол','Кръвна група','Тегло при раждане (кг)','Ръст при раждане (см)','Болница','Доктор при раждане','Педиатър име','Педиатър телефон','Педиатър кабинет','Педиатър работно време','Педиатър поликлиника','Педиатър втори телефон','Име на майката','Име на таткото','Снимка','Бележки'];
  profileFields.forEach(function(f, i) { profileSheet.getRange(i + 2, 1).setValue(f); });
  Object.keys(headers).forEach(function(name) {
    if (name === SHEET_NAMES.PROFILE) return;
    var sheet;
    try { sheet = ss.insertSheet(name); } catch (e) { sheet = ss.getSheetByName(name); }
    if (sheet && headers[name]) sheet.getRange(1, 1, 1, headers[name].length).setValues([headers[name]]);
  });
  try { const def = ss.getSheetByName('Sheet1'); if (def) ss.deleteSheet(def); } catch (e) {}
}

function _ensureNewSheets() {
  var ss = _getOrCreateSpreadsheet();
  var newSheets = {
    [SHEET_NAMES.ALLERGIES]: ['ID','Дата','Какво','Тип','Реакция','Степен','Лечение','Бележки','Източник'],
    [SHEET_NAMES.CHECKUPS]: ['Име','Планирана дата','Направен на','Лекар','Бележки','Тип'],
    [SHEET_NAMES.ILLNESSES]: ['ID','Заболяване','Дата разболяване','Симптоми','Макс температура','Лечение','Лекар','Карантина до','Контролен преглед','Дата оздравяване','Бележки'],
    [SHEET_NAMES.TEETH]: ['ID зъб','Статус','Дата поникване','Дата събитие','Лекар','Бележки']
  };
  Object.keys(newSheets).forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) { sheet = ss.insertSheet(name); sheet.getRange(1, 1, 1, newSheets[name].length).setValues([newSheets[name]]); }
  });
  var profileSheet = ss.getSheetByName(SHEET_NAMES.PROFILE);
  if (profileSheet) {
    var lastRow = profileSheet.getLastRow();
    var existing = lastRow >= 2 ? profileSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(function(f) { return f; }) : [];
    var newFields = ['Час на раждане','Доктор при раждане','Педиатър име','Педиатър телефон','Педиатър кабинет','Педиатър работно време','Педиатър поликлиника','Педиатър втори телефон'];
    var missing = newFields.filter(function(f) { return existing.indexOf(f) === -1; });
    if (missing.length > 0) {
      var startRow = profileSheet.getLastRow() + 1;
      var data = missing.map(function(f) { return [f, '']; });
      profileSheet.getRange(startRow, 1, missing.length, 2).setValues(data);
    }
    var oldPedIdx = existing.indexOf('Лекуващ педиатър');
    if (oldPedIdx !== -1 && existing.indexOf('Педиатър име') !== -1) {
      var allData = profileSheet.getRange(2, 1, profileSheet.getLastRow() - 1, 2).getValues();
      var oldVal = ''; var newPedRow = -1;
      allData.forEach(function(row, i) { if (row[0] === 'Лекуващ педиатър') oldVal = row[1]; if (row[0] === 'Педиатър име') newPedRow = i; });
      if (oldVal && newPedRow >= 0 && !allData[newPedRow][1]) profileSheet.getRange(newPedRow + 2, 2).setValue(oldVal);
    }
  }
}

function _getSheet(name) { const ss = _getOrCreateSpreadsheet(); return ss.getSheetByName(name); }

function _readSheet(sheetName, columns) {
  const sheet = _getSheet(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, columns.length).getValues();
  return data.map(function(row, idx) {
    if (!row[0] && !row[1]) return null;
    const obj = { _rowIndex: idx };
    columns.forEach(function(col, i) {
      if (col.type === 'date') {
        try { obj[col.key] = row[i] ? Utilities.formatDate(new Date(row[i]), 'Europe/Sofia', 'dd.MM.yyyy') : ''; }
        catch (e) { obj[col.key] = row[i] ? row[i].toString() : ''; }
      } else { obj[col.key] = row[i] !== null && row[i] !== undefined ? row[i].toString() : ''; }
    });
    return obj;
  }).filter(function(obj) { return obj !== null; });
}

function _appendRow(sheetName, values) { const sheet = _getSheet(sheetName); if (!sheet) throw new Error('Листът "' + sheetName + '" не е намерен.'); sheet.appendRow(values); }
function _toDate(str) { if (!str) return ''; try { return new Date(str); } catch (e) { return ''; } }

function deleteEntry(sheetName, rowIndex) {
  try {
    var sheet = _getSheet(sheetName);
    if (!sheet) return { success: false, error: 'Листът не е намерен.' };
    var actualRow = rowIndex + 2;
    if (actualRow < 2 || actualRow > sheet.getLastRow()) return { success: false, error: 'Невалиден ред.' };
    sheet.deleteRow(actualRow);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

function initializeApp() {
  try {
    const ss = _getOrCreateSpreadsheet();
    _ensureNewSheets();
    return { success: true, spreadsheetId: ss.getId() };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// PROFILE
// ============================================================
function getProfile() {
  try {
    const sheet = _getSheet(SHEET_NAMES.PROFILE);
    if (!sheet) return {};
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return {};
    const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    const profile = {};
    data.forEach(function(row) { if (row[0]) profile[row[0]] = row[1] ? row[1].toString() : ''; });
    return profile;
  } catch (e) { return {}; }
}

function saveProfile(data) {
  try {
    const sheet = _getSheet(SHEET_NAMES.PROFILE);
    if (!sheet) return { success: false, error: 'Листът Профил не е намерен.' };
    const allFields = ['Име на бебето','Дата на раждане','Час на раждане','Пол','Кръвна група','Тегло при раждане (кг)','Ръст при раждане (см)','Болница','Доктор при раждане','Педиатър име','Педиатър телефон','Педиатър кабинет','Педиатър работно време','Педиатър поликлиника','Педиатър втори телефон','Име на майката','Име на таткото','Снимка','Бележки'];
    const lastRow = sheet.getLastRow();
    const existingFields = lastRow >= 2 ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat().filter(function(f) { return f; }) : [];
    var missingFields = allFields.filter(function(f) { return existingFields.indexOf(f) === -1; });
    if (missingFields.length > 0) {
      var startRow = sheet.getLastRow() + 1;
      var missingData = missingFields.map(function(f) { return [f, '']; });
      sheet.getRange(startRow, 1, missingFields.length, 2).setValues(missingData);
    }
    var totalRows = sheet.getLastRow() - 1;
    var range = sheet.getRange(2, 1, totalRows, 2);
    var values = range.getValues();
    values.forEach(function(row, i) { if (row[0] && data[row[0]] !== undefined) values[i][1] = data[row[0]]; });
    range.setValues(values);
    SpreadsheetApp.flush();
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// MILESTONES
// ============================================================
const MILESTONE_COLS = [{key:'date',type:'date'},{key:'category',type:'text'},{key:'event',type:'text'},{key:'description',type:'text'},{key:'photo',type:'text'}];
function getMilestones() { return _readSheet(SHEET_NAMES.MILESTONES, MILESTONE_COLS); }
function addMilestone(data) { try { _appendRow(SHEET_NAMES.MILESTONES, [_toDate(data.date), data.category || '', data.event || '', data.description || '', data.photo || '']); return { success: true }; } catch (e) { return { success: false, error: e.message }; } }

// ============================================================
// HEALTH / VACCINES
// ============================================================
const HEALTH_COLS = [{key:'name',type:'text'},{key:'planned',type:'date'},{key:'done',type:'date'},{key:'doctor',type:'text'},{key:'reaction',type:'text'},{key:'nextCheckup',type:'date'},{key:'notes',type:'text'}];
function getHealth() {
  try {
    const profile = getProfile();
    const birthDateStr = profile['Дата на раждане'];
    let schedule = [];
    if (birthDateStr) {
      const birthDate = new Date(birthDateStr);
      const now = new Date();
      schedule = VACCINE_SCHEDULE.map(function(v) {
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + v.month);
        const diffDays = Math.round((dueDate - now) / (1000 * 60 * 60 * 24));
        let status = 'future';
        if (diffDays < 0) status = 'overdue';
        else if (diffDays <= 30) status = 'upcoming';
        return { month: v.month, name: v.name, short: v.short, dueDate: Utilities.formatDate(dueDate, 'Europe/Sofia', 'dd.MM.yyyy'), dueDateISO: Utilities.formatDate(dueDate, 'Europe/Sofia', 'yyyy-MM-dd'), dueDateMs: dueDate.getTime(), status: status, diffDays: diffDays };
      });
    }
    const vaccines = _readSheet(SHEET_NAMES.HEALTH, HEALTH_COLS);
    const doneNames = {};
    vaccines.forEach(function(v) { if (v.done) doneNames[v.name] = v; });
    schedule.forEach(function(s) {
      if (doneNames[s.name]) { s.status = 'done'; s.doneDate = doneNames[s.name].done; s.doneDoctor = doneNames[s.name].doctor; s.doneReaction = doneNames[s.name].reaction; }
    });
    var statusOrder = {'overdue': 0, 'upcoming': 1, 'future': 2, 'done': 3};
    schedule.sort(function(a, b) { var oa = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 2; var ob = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 2; if (oa !== ob) return oa - ob; return a.dueDateMs - b.dueDateMs; });
    return { vaccines: vaccines, schedule: schedule };
  } catch (e) { return { vaccines: [], schedule: [], error: e.message }; }
}

function markVaccineDone(data) {
  try {
    const existing = _readSheet(SHEET_NAMES.HEALTH, HEALTH_COLS);
    const alreadyDone = existing.some(function(v) { return v.name === data.name && v.done; });
    if (alreadyDone) return { success: false, error: 'Тази ваксина вече е отбелязана като поставена.' };
    _appendRow(SHEET_NAMES.HEALTH, [data.name || '', _toDate(data.planned), _toDate(data.done || new Date()), data.doctor || '', data.reaction || '', _toDate(data.nextCheckup), data.notes || '']);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// ALLERGIES
// ============================================================
const ALLERGY_COLS = [{key:'id',type:'text'},{key:'date',type:'date'},{key:'what',type:'text'},{key:'type',type:'text'},{key:'reaction',type:'text'},{key:'severity',type:'text'},{key:'treatment',type:'text'},{key:'notes',type:'text'},{key:'source',type:'text'}];
function getAllergies() {
  try {
    _ensureNewSheets();
    var allergies = _readSheet(SHEET_NAMES.ALLERGIES, ALLERGY_COLS);
    var feeding = _readSheet(SHEET_NAMES.FEEDING, [{key:'date',type:'date'},{key:'food',type:'text'},{key:'reaction',type:'text'},{key:'allergy',type:'text'},{key:'notes',type:'text'}]);
    var feedingAllergies = feeding.filter(function(f) { return f.allergy === 'Да'; });
    var existingFoodNames = {};
    allergies.forEach(function(a) { if (a.source === 'Хранене') existingFoodNames[a.what] = true; });
    feedingAllergies.forEach(function(f) {
      if (!existingFoodNames[f.food]) allergies.push({ id: 'auto_' + f.food, date: f.date, what: f.food, type: 'Хранителна', reaction: f.reaction || '', severity: '', treatment: '', notes: f.notes || '', source: 'Хранене', _auto: true });
    });
    return allergies;
  } catch (e) { return []; }
}

function addAllergy(data) {
  try {
    _ensureNewSheets();
    var id = 'al_' + Date.now();
    _appendRow(SHEET_NAMES.ALLERGIES, [id, _toDate(data.date || new Date()), data.what || '', data.type || 'Друго', data.reaction || '', data.severity || '', data.treatment || '', data.notes || '', 'Ръчно']);
    return { success: true, id: id };
  } catch (e) { return { success: false, error: e.message }; }
}

function deleteAllergy(allergyId) {
  try {
    var sheet = _getSheet(SHEET_NAMES.ALLERGIES);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма алергии.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) { if (data[i][0].toString() === allergyId) { sheet.deleteRow(i + 2); return { success: true }; } }
    return { success: false, error: 'Алергията не е намерена.' };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// CHECKUPS
// ============================================================
const CHECKUP_COLS = [{key:'name',type:'text'},{key:'planned',type:'date'},{key:'done',type:'date'},{key:'doctor',type:'text'},{key:'notes',type:'text'},{key:'type',type:'text'}];
function getCheckups() {
  try {
    _ensureNewSheets();
    const profile = getProfile();
    const birthDateStr = profile['Дата на раждане'];
    let schedule = [];
    if (birthDateStr) {
      const birthDate = new Date(birthDateStr);
      const now = new Date();
      schedule = CHECKUP_SCHEDULE.map(function(c) {
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + c.month);
        const diffDays = Math.round((dueDate - now) / (1000 * 60 * 60 * 24));
        let status = 'future';
        if (diffDays < 0) status = 'overdue';
        else if (diffDays <= 30) status = 'upcoming';
        return { month: c.month, name: c.name, dueDate: Utilities.formatDate(dueDate, 'Europe/Sofia', 'dd.MM.yyyy'), dueDateISO: Utilities.formatDate(dueDate, 'Europe/Sofia', 'yyyy-MM-dd'), dueDateMs: dueDate.getTime(), status: status, diffDays: diffDays, type: 'auto' };
      });
    }
    var checkups = _readSheet(SHEET_NAMES.CHECKUPS, CHECKUP_COLS);
    var doneNames = {};
    checkups.forEach(function(c) { if (c.done) doneNames[c.name] = c; });
    schedule.forEach(function(s) { if (doneNames[s.name]) { s.status = 'done'; s.doneDate = doneNames[s.name].done; s.doneDoctor = doneNames[s.name].doctor; s.doneNotes = doneNames[s.name].notes; } });
    var manualCheckups = checkups.filter(function(c) { return c.type === 'Ръчен'; });
    manualCheckups.forEach(function(c) { schedule.push({ name: c.name, dueDate: c.planned || '', dueDateMs: c.planned ? new Date(c.planned.split('.').reverse().join('-')).getTime() : 0, status: c.done ? 'done' : 'upcoming', doneDate: c.done, doneDoctor: c.doctor, doneNotes: c.notes, type: 'manual' }); });
    var statusOrder = {'overdue': 0, 'upcoming': 1, 'future': 2, 'done': 3};
    schedule.sort(function(a, b) { var oa = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 2; var ob = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 2; if (oa !== ob) return oa - ob; return (a.dueDateMs || 0) - (b.dueDateMs || 0); });
    return schedule;
  } catch (e) { return []; }
}

function markCheckupDone(data) {
  try {
    _ensureNewSheets();
    var existing = _readSheet(SHEET_NAMES.CHECKUPS, CHECKUP_COLS);
    var already = existing.some(function(c) { return c.name === data.name && c.done; });
    if (already) return { success: false, error: 'Този преглед вече е отбелязан.' };
    _appendRow(SHEET_NAMES.CHECKUPS, [data.name || '', _toDate(data.planned || ''), _toDate(data.done || new Date()), data.doctor || '', data.notes || '', 'Автоматичен']);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

function addManualCheckup(data) {
  try {
    _ensureNewSheets();
    _appendRow(SHEET_NAMES.CHECKUPS, [data.name || '', _toDate(data.planned || ''), data.done ? _toDate(data.done) : '', data.doctor || '', data.notes || '', 'Ръчен']);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// ILLNESSES
// ============================================================
const ILLNESS_COLS = [{key:'id',type:'text'},{key:'illness',type:'text'},{key:'dateStart',type:'date'},{key:'symptoms',type:'text'},{key:'maxTemp',type:'text'},{key:'treatment',type:'text'},{key:'doctor',type:'text'},{key:'quarantineUntil',type:'date'},{key:'controlCheckup',type:'date'},{key:'dateEnd',type:'date'},{key:'notes',type:'text'}];
function getIllnesses() {
  try {
    _ensureNewSheets();
    var all = _readSheet(SHEET_NAMES.ILLNESSES, ILLNESS_COLS);
    var active = all.filter(function(i) { return !i.dateEnd; });
    var past = all.filter(function(i) { return i.dateEnd; });
    return { active: active, past: past.reverse() };
  } catch (e) { return { active: [], past: [] }; }
}

function addIllness(data) {
  try {
    _ensureNewSheets();
    var id = 'ill_' + Date.now();
    _appendRow(SHEET_NAMES.ILLNESSES, [id, data.illness || '', _toDate(data.dateStart || new Date()), data.symptoms || '', data.maxTemp || '', data.treatment || '', data.doctor || '', _toDate(data.quarantineUntil), _toDate(data.controlCheckup), _toDate(data.dateEnd), data.notes || '']);
    return { success: true, id: id };
  } catch (e) { return { success: false, error: e.message }; }
}

function updateIllness(illnessId, data) {
  try {
    var sheet = _getSheet(SHEET_NAMES.ILLNESSES);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).getValues();
    for (var i = 0; i < allData.length; i++) {
      if (allData[i][0].toString() === illnessId) {
        var row = i + 2;
        if (data.dateEnd !== undefined) sheet.getRange(row, 10).setValue(_toDate(data.dateEnd));
        if (data.symptoms !== undefined) sheet.getRange(row, 4).setValue(data.symptoms);
        if (data.treatment !== undefined) sheet.getRange(row, 6).setValue(data.treatment);
        if (data.notes !== undefined) sheet.getRange(row, 11).setValue(data.notes);
        if (data.quarantineUntil !== undefined) sheet.getRange(row, 8).setValue(_toDate(data.quarantineUntil));
        if (data.controlCheckup !== undefined) sheet.getRange(row, 9).setValue(_toDate(data.controlCheckup));
        return { success: true };
      }
    }
    return { success: false, error: 'Записът не е намерен.' };
  } catch (e) { return { success: false, error: e.message }; }
}

function deleteIllness(illnessId) {
  try {
    var sheet = _getSheet(SHEET_NAMES.ILLNESSES);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) { if (data[i][0].toString() === illnessId) { sheet.deleteRow(i + 2); return { success: true }; } }
    return { success: false, error: 'Записът не е намерен.' };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// TEETH
// ============================================================
const TEETH_COLS = [{key:'toothId',type:'text'},{key:'status',type:'text'},{key:'dateErupted',type:'date'},{key:'dateEvent',type:'date'},{key:'doctor',type:'text'},{key:'notes',type:'text'}];
function getTeeth() {
  try {
    _ensureNewSheets();
    var profile = getProfile();
    var birthDateStr = profile['Дата на раждане'];
    var teethData = _readSheet(SHEET_NAMES.TEETH, TEETH_COLS);
    var teethMap = {};
    teethData.forEach(function(t) { teethMap[t.toothId] = t; });
    var now = new Date();
    var ageMonths = 0;
    if (birthDateStr) { var birth = new Date(birthDateStr); ageMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth()); }
    var result = TEETH_SCHEDULE.map(function(tooth) {
      var saved = teethMap[tooth.id];
      var expectedStatus = 'not_erupted';
      if (ageMonths >= tooth.monthMin && ageMonths <= tooth.monthMax) expectedStatus = 'expected_soon';
      else if (ageMonths > tooth.monthMax) expectedStatus = 'expected_overdue';
      return { id: tooth.id, name: tooth.name, type: tooth.type, monthMin: tooth.monthMin, monthMax: tooth.monthMax, expectedStatus: expectedStatus, status: saved ? saved.status : 'not_erupted', dateErupted: saved ? saved.dateErupted : '', dateEvent: saved ? saved.dateEvent : '', doctor: saved ? saved.doctor : '', notes: saved ? saved.notes : '' };
    });
    return result;
  } catch (e) { return []; }
}

function saveTooth(data) {
  try {
    _ensureNewSheets();
    var sheet = _getSheet(SHEET_NAMES.TEETH);
    if (!sheet) return { success: false, error: 'Листът не е намерен.' };
    if (sheet.getLastRow() >= 2) {
      var allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
      for (var i = 0; i < allData.length; i++) {
        if (allData[i][0].toString() === data.toothId) {
          var row = i + 2;
          sheet.getRange(row, 2).setValue(data.status || '');
          sheet.getRange(row, 3).setValue(_toDate(data.dateErupted));
          sheet.getRange(row, 4).setValue(_toDate(data.dateEvent));
          sheet.getRange(row, 5).setValue(data.doctor || '');
          sheet.getRange(row, 6).setValue(data.notes || '');
          return { success: true };
        }
      }
    }
    _appendRow(SHEET_NAMES.TEETH, [data.toothId, data.status || 'erupted', _toDate(data.dateErupted), _toDate(data.dateEvent), data.doctor || '', data.notes || '']);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// GROWTH
// ============================================================
const GROWTH_COLS = [{key:'date',type:'date'},{key:'weight',type:'text'},{key:'height',type:'text'},{key:'head',type:'text'},{key:'notes',type:'text'}];
function getGrowth() { const data = _readSheet(SHEET_NAMES.GROWTH, GROWTH_COLS); return data.reverse(); }
function addGrowthEntry(data) { try { _appendRow(SHEET_NAMES.GROWTH, [_toDate(data.date), data.weight || '', data.height || '', data.head || '', data.notes || '']); return { success: true }; } catch (e) { return { success: false, error: e.message }; } }

// ============================================================
// MEMORIES
// ============================================================
const MEMORIES_COLS = [{key:'date',type:'date'},{key:'title',type:'text'},{key:'description',type:'text'},{key:'category',type:'text'},{key:'photo',type:'text'}];
function getMemories() { const data = _readSheet(SHEET_NAMES.MEMORIES, MEMORIES_COLS); return data.reverse(); }
function addMemory(data) { try { _appendRow(SHEET_NAMES.MEMORIES, [_toDate(data.date), data.title || '', data.description || '', data.category || '', data.photo || '']); return { success: true }; } catch (e) { return { success: false, error: e.message }; } }

// ============================================================
// FEEDING
// ============================================================
const FEEDING_COLS = [{key:'date',type:'date'},{key:'food',type:'text'},{key:'reaction',type:'text'},{key:'allergy',type:'text'},{key:'notes',type:'text'}];
function getFeeding() { return _readSheet(SHEET_NAMES.FEEDING, FEEDING_COLS); }
function addFeedingEntry(data) { try { _appendRow(SHEET_NAMES.FEEDING, [_toDate(data.date), data.food || '', data.reaction || '', data.allergy || 'Не', data.notes || '']); return { success: true }; } catch (e) { return { success: false, error: e.message }; } }

// ============================================================
// DOCTORS
// ============================================================
const DOCTORS_COLS = [{key:'specialty',type:'text'},{key:'name',type:'text'},{key:'phone',type:'text'},{key:'address',type:'text'},{key:'notes',type:'text'}];
function getDoctors() { return _readSheet(SHEET_NAMES.DOCTORS, DOCTORS_COLS); }
function addDoctor(data) { try { _appendRow(SHEET_NAMES.DOCTORS, [data.specialty || '', data.name || '', data.phone || '', data.address || '', data.notes || '']); return { success: true }; } catch (e) { return { success: false, error: e.message }; } }

// ============================================================
// NOTES
// ============================================================
const NOTES_COLS = [{key:'id',type:'text'},{key:'date',type:'date'},{key:'text',type:'text'},{key:'priority',type:'text'},{key:'photo',type:'text'},{key:'done',type:'text'},{key:'doneDate',type:'date'}];
function getNotes() {
  try {
    var sheet = _getSheet(SHEET_NAMES.NOTES);
    if (!sheet) {
      var ss = _getOrCreateSpreadsheet();
      sheet = ss.insertSheet(SHEET_NAMES.NOTES);
      sheet.getRange(1, 1, 1, 7).setValues([['ID','Дата','Текст','Приоритет','Снимка (URL)','Готово','Дата готово']]);
      return { active: [], done: [] };
    }
    var all = _readSheet(SHEET_NAMES.NOTES, NOTES_COLS);
    var active = all.filter(function(n) { return n.done !== 'Да'; });
    var done = all.filter(function(n) { return n.done === 'Да'; });
    var prioOrder = {'Високо': 0, 'Средно': 1, 'Ниско': 2, '': 3};
    active.sort(function(a, b) { var pa = prioOrder[a.priority] !== undefined ? prioOrder[a.priority] : 3; var pb = prioOrder[b.priority] !== undefined ? prioOrder[b.priority] : 3; return pa - pb; });
    return { active: active, done: done };
  } catch (e) { return { active: [], done: [], error: e.message }; }
}

function addNote(data) { try { var id = 'n_' + Date.now(); _appendRow(SHEET_NAMES.NOTES, [id, _toDate(data.date || new Date()), data.text || '', data.priority || 'Средно', data.photo || '', '', '']); return { success: true, id: id }; } catch (e) { return { success: false, error: e.message }; } }

function toggleNoteDone(noteId) {
  try {
    var sheet = _getSheet(SHEET_NAMES.NOTES);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма бележки.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0].toString() === noteId) {
        var row = i + 2;
        var currentlyDone = data[i][5].toString() === 'Да';
        if (currentlyDone) { sheet.getRange(row, 6).setValue(''); sheet.getRange(row, 7).setValue(''); }
        else { sheet.getRange(row, 6).setValue('Да'); sheet.getRange(row, 7).setValue(new Date()); }
        return { success: true };
      }
    }
    return { success: false, error: 'Бележката не е намерена.' };
  } catch (e) { return { success: false, error: e.message }; }
}

function deleteNote(noteId) {
  try {
    var sheet = _getSheet(SHEET_NAMES.NOTES);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма бележки.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) { if (data[i][0].toString() === noteId) { sheet.deleteRow(i + 2); return { success: true }; } }
    return { success: false, error: 'Бележката не е намерена.' };
  } catch (e) { return { success: false, error: e.message }; }
}

// ============================================================
// DASHBOARD
// ============================================================
function getDashboardData() {
  try {
    const profile = getProfile();
    const birthDateStr = profile['Дата на раждане'];
    let age = null;
    if (birthDateStr) {
      const birth = new Date(birthDateStr);
      const now = new Date();
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
      age = { years: years, months: months, days: days, totalDays: totalDays, totalMonths: years * 12 + months };
    }
    const milestones = getMilestones();
    const health = getHealth();
    const memories = getMemories();
    const growth = getGrowth();
    let nextVaccine = null;
    const now = Date.now();
    if (health.schedule && health.schedule.length) {
      const upcoming = health.schedule.filter(function(v) { return v.status !== 'done' && v.dueDateMs > now; });
      if (upcoming.length > 0) { upcoming.sort(function(a, b) { return a.dueDateMs - b.dueDateMs; }); nextVaccine = { name: upcoming[0].short, fullName: upcoming[0].name, dueDate: upcoming[0].dueDate, status: upcoming[0].status }; }
    }
    const overdueVaccines = health.schedule ? health.schedule.filter(function(v) { return v.status === 'overdue'; }).length : 0;
    var notes = { active: [], done: [] };
    try { notes = getNotes(); } catch (e) {}
    var upcomingEvents = [];
    if (health.schedule) { health.schedule.forEach(function(v) { if ((v.status === 'overdue' || v.status === 'upcoming') && v.dueDateMs) upcomingEvents.push({ type: 'vaccine', name: v.short || v.name, date: v.dueDate, status: v.status, dateMs: v.dueDateMs }); }); }
    try { var checkups = getCheckups(); checkups.forEach(function(c) { if ((c.status === 'overdue' || c.status === 'upcoming') && c.dueDateMs) upcomingEvents.push({ type: 'checkup', name: c.name, date: c.dueDate, status: c.status, dateMs: c.dueDateMs }); }); } catch (e) {}
    try { var illnesses = getIllnesses(); if (illnesses.active) { illnesses.active.forEach(function(ill) { if (ill.quarantineUntil) upcomingEvents.push({ type: 'quarantine', name: 'Карантина: ' + ill.illness, date: ill.quarantineUntil, status: 'upcoming', dateMs: new Date(ill.quarantineUntil.split('.').reverse().join('-')).getTime() || 0 }); if (ill.controlCheckup) upcomingEvents.push({ type: 'control', name: 'Контролен: ' + ill.illness, date: ill.controlCheckup, status: 'upcoming', dateMs: new Date(ill.controlCheckup.split('.').reverse().join('-')).getTime() || 0 }); }); } } catch (e) {}
    upcomingEvents.sort(function(a, b) { var sa = a.status === 'overdue' ? 0 : 1; var sb = b.status === 'overdue' ? 0 : 1; if (sa !== sb) return sa - sb; return (a.dateMs || 0) - (b.dateMs || 0); });
    var pediatricianPhone = profile['Педиатър телефон'] || '';
    var pediatricianName = profile['Педиатър име'] || profile['Лекуващ педиатър'] || '';
    return { profile: profile, age: age, milestonesCount: milestones.length, memoriesCount: memories.length, lastGrowth: growth.length > 0 ? growth[0] : null, nextVaccine: nextVaccine, overdueVaccines: overdueVaccines, activeNotes: notes.active ? notes.active.slice(0, 5) : [], activeNotesCount: notes.active ? notes.active.length : 0, upcomingEvents: upcomingEvents.slice(0, 8), pediatricianPhone: pediatricianPhone, pediatricianName: pediatricianName, recentMemories: memories.slice(0, 3), recentMilestones: milestones.slice(-3).reverse() };
  } catch (e) {
    Logger.log('Dashboard error: ' + e.message);
    return { error: e.message, profile: {}, age: null, milestonesCount: 0, memoriesCount: 0, lastGrowth: null, nextVaccine: null, overdueVaccines: 0, activeNotes: [], activeNotesCount: 0, upcomingEvents: [], pediatricianPhone: '', pediatricianName: '', recentMemories: [], recentMilestones: [] };
  }
}

// ============================================================
// PHOTO UPLOAD
// ============================================================
function uploadPhoto(base64Data, fileName, mimeType) {
  try {
    var folderName = 'Майчин Органайзър - Снимки';
    var folder;
    try { var folders = DriveApp.getFoldersByName(folderName); if (folders.hasNext()) folder = folders.next(); else folder = DriveApp.createFolder(folderName); }
    catch (permErr) { folder = DriveApp.getRootFolder(); }
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    var fileId = file.getId();
    var viewUrl = 'https://lh3.googleusercontent.com/d/' + fileId;
    return { success: true, url: viewUrl, fileId: fileId };
  } catch (e) { Logger.log('Upload error: ' + e.message); return { success: false, error: e.message }; }
}

function getSpreadsheetUrl() {
  try { const ss = _getOrCreateSpreadsheet(); return { ssId: ss.getId(), url: ss.getUrl() }; }
  catch (e) { return null; }
}

// ============================================================
// МАСОВО МАРКИРАНЕ + РЕДАКТИРАНЕ НА НАПРАВЕНИ ВАКСИНИ/ПРЕГЛЕДИ
// ============================================================
function bulkMarkVaccinesDone(items) {
  try {
    if (!items || !items.length) return { success: false, error: 'Няма избрани ваксини.' };
    var existing = _readSheet(SHEET_NAMES.HEALTH, HEALTH_COLS);
    var doneMap = {};
    existing.forEach(function(v) { if (v.done) doneMap[v.name] = true; });
    var sheet = _getSheet(SHEET_NAMES.HEALTH);
    if (!sheet) return { success: false, error: 'Листът Здраве не е намерен.' };
    var added = 0, skipped = 0;
    var rowsToAppend = [];
    items.forEach(function(item) {
      if (!item || !item.name) return;
      if (doneMap[item.name]) { skipped++; return; }
      rowsToAppend.push([item.name, _toDate(item.planned || ''), _toDate(item.done || new Date()), '', '', '', 'Отбелязана при активиране на профила']);
      doneMap[item.name] = true;
      added++;
    });
    if (rowsToAppend.length > 0) {
      var startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rowsToAppend.length, 7).setValues(rowsToAppend);
      SpreadsheetApp.flush();
    }
    return { success: true, added: added, skipped: skipped };
  } catch (e) { return { success: false, error: e.message }; }
}

function bulkMarkCheckupsDone(items) {
  try {
    _ensureNewSheets();
    if (!items || !items.length) return { success: false, error: 'Няма избрани прегледи.' };
    var existing = _readSheet(SHEET_NAMES.CHECKUPS, CHECKUP_COLS);
    var doneMap = {};
    existing.forEach(function(c) { if (c.done) doneMap[c.name] = true; });
    var sheet = _getSheet(SHEET_NAMES.CHECKUPS);
    if (!sheet) return { success: false, error: 'Листът Прегледи не е намерен.' };
    var added = 0, skipped = 0;
    var rowsToAppend = [];
    items.forEach(function(item) {
      if (!item || !item.name) return;
      if (doneMap[item.name]) { skipped++; return; }
      rowsToAppend.push([item.name, _toDate(item.planned || ''), _toDate(item.done || new Date()), '', 'Отбелязан при активиране на профила', 'Автоматичен']);
      doneMap[item.name] = true;
      added++;
    });
    if (rowsToAppend.length > 0) {
      var startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rowsToAppend.length, 6).setValues(rowsToAppend);
      SpreadsheetApp.flush();
    }
    return { success: true, added: added, skipped: skipped };
  } catch (e) { return { success: false, error: e.message }; }
}

function deleteVaccineByName(name) {
  try {
    if (!name) return { success: false, error: 'Няма име.' };
    var sheet = _getSheet(SHEET_NAMES.HEALTH);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    var deleted = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i][0] && data[i][0].toString() === name) { sheet.deleteRow(i + 2); deleted++; }
    }
    if (deleted === 0) return { success: false, error: 'Записът не е намерен.' };
    return { success: true, deleted: deleted };
  } catch (e) { return { success: false, error: e.message }; }
}

function deleteCheckupByName(name) {
  try {
    if (!name) return { success: false, error: 'Няма име.' };
    var sheet = _getSheet(SHEET_NAMES.CHECKUPS);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    var deleted = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i][0] && data[i][0].toString() === name) { sheet.deleteRow(i + 2); deleted++; }
    }
    if (deleted === 0) return { success: false, error: 'Записът не е намерен.' };
    return { success: true, deleted: deleted };
  } catch (e) { return { success: false, error: e.message }; }
}

function updateVaccineRecord(originalName, data) {
  try {
    if (!originalName) return { success: false, error: 'Няма име.' };
    var sheet = _getSheet(SHEET_NAMES.HEALTH);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var all = sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).getValues();
    for (var i = 0; i < all.length; i++) {
      if (all[i][0] && all[i][0].toString() === originalName) {
        var row = i + 2;
        if (data.done !== undefined) sheet.getRange(row, 3).setValue(_toDate(data.done));
        if (data.doctor !== undefined) sheet.getRange(row, 4).setValue(data.doctor || '');
        if (data.reaction !== undefined) sheet.getRange(row, 5).setValue(data.reaction || '');
        if (data.notes !== undefined) sheet.getRange(row, 7).setValue(data.notes || '');
        return { success: true };
      }
    }
    return { success: false, error: 'Записът не е намерен.' };
  } catch (e) { return { success: false, error: e.message }; }
}

function updateCheckupRecord(originalName, data) {
  try {
    if (!originalName) return { success: false, error: 'Няма име.' };
    var sheet = _getSheet(SHEET_NAMES.CHECKUPS);
    if (!sheet || sheet.getLastRow() < 2) return { success: false, error: 'Няма записи.' };
    var all = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
    for (var i = 0; i < all.length; i++) {
      if (all[i][0] && all[i][0].toString() === originalName) {
        var row = i + 2;
        if (data.done !== undefined) sheet.getRange(row, 3).setValue(_toDate(data.done));
        if (data.doctor !== undefined) sheet.getRange(row, 4).setValue(data.doctor || '');
        if (data.notes !== undefined) sheet.getRange(row, 5).setValue(data.notes || '');
        return { success: true };
      }
    }
    return { success: false, error: 'Записът не е намерен.' };
  } catch (e) { return { success: false, error: e.message }; }
}
