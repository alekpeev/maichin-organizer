// ============================================================
// МАЙЧИН ОРГАНАЙЗЪР - Apps Script Web App
// ВЕРСИЯ v15 - Само аналитика
// Данните са в Google Drive НА ПОТРЕБИТЕЛКАТА.
// Разработчикът НЯМА достъп до тях.
// ============================================================

const API_CLIENT_ID = '488308267310-ibfdaokrhpcq0mh8q2gf3jjnjrhii3fe.apps.googleusercontent.com';
const ADMIN_SHEET_ID = '1YtNB77H3DZ76Rlmo0TuPA9_j8qaW_QxTFGOitZ4tEXo';

/** GET — обработва JSONP заявки от GitHub Pages */
function doGet(e) {
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
      var json = JSON.stringify({ success: true, result: result });
      return ContentService.createTextOutput(cbName + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } catch (err) {
      var json = JSON.stringify({ success: false, error: err.message });
      return ContentService.createTextOutput(cbName + '(' + json + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
  }
  if (e && e.parameter && e.parameter.ping) {
    return ContentService.createTextOutput(JSON.stringify({ ok: true, v: 'v15-privacy' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('Майчин Органайзър API v15')
    .setMimeType(ContentService.MimeType.TEXT);
}

/** Рутира само разрешените actions — v15 обработва само аналитиката */
function _routeAction(action, data, email) {
  switch (action) {
    case 'init':
      _logAnalytics(email, data.country || '');
      return { email: email, ok: true };
    default:
      throw new Error('Операцията се извършва директно от браузъра в v15.');
  }
}

/** Верифицира Google id_token и връща email на потребителя */
function _verifyIdToken(token) {
  try {
    var parts = token.split('.');
    if (parts.length !== 3) throw new Error('Невалиден формат на токен.');
    var payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payload.length % 4) payload += '=';
    var decoded = Utilities.base64Decode(payload);
    var info = JSON.parse(Utilities.newBlob(decoded).getDataAsString());
    if (!info.email) throw new Error('Токенът не съдържа email.');
    if (info.aud !== API_CLIENT_ID) throw new Error('Токенът не е за това приложение.');
    if (info.exp && info.exp * 1000 < Date.now()) throw new Error('Токенът е изтекъл.');
    if (info.iss !== 'https://accounts.google.com' && info.iss !== 'accounts.google.com') {
      throw new Error('Токенът не е от Google.');
    }
    return info.email;
  } catch (err) {
    throw new Error('Грешка при верификация: ' + err.message);
  }
}

/** Записва влизанията в Admin Sheet за аналитика */
function _logAnalytics(email, country) {
  try {
    var ss = SpreadsheetApp.openById(ADMIN_SHEET_ID);
    var sheet = ss.getSheets()[0];
    var now = new Date();
    var data = sheet.getLastRow() < 2 ? [] : sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    var userRow = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === email) { userRow = i + 2; break; }
    }
    if (userRow === -1) {
      sheet.appendRow([email, now, now, 1, country || 'Неизвестна']);
    } else {
      sheet.getRange(userRow, 3).setValue(now);
      sheet.getRange(userRow, 4).setValue((data[userRow - 2][3] || 0) + 1);
    }
  } catch (e) {
    Logger.log('Аналитика грешка: ' + e.message);
  }
}
