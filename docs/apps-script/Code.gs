// AI Melilla 2025 — Waitlist collector
// Despliega como Web App: ejecutar como "Yo", acceso "Cualquiera"

var SHEET_NAME = 'Waitlist';

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: 'Servicio ocupado, intenta de nuevo' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: 'Solicitud vacía' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var email = (data.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({ result: 'error', message: 'Email inválido' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([new Date(), email]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Para probar desde el editor: ejecuta esta función manualmente
function test_doPost() {
  var fakeEvent = { postData: { contents: JSON.stringify({ email: 'test@ejemplo.com' }) } };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
