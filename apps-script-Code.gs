/**
 * METELMEX · Evaluación de Adaptación (F62-21) + Catálogo de Empleados
 * Backend en Google Apps Script.
 * Convierte el Google Sheet en una mini API que el dashboard (index.html) consume por fetch().
 *
 * INSTALACIÓN:
 * 1. Abre tu Google Sheet.
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega TODO este archivo.
 * 4. Guarda (ícono de disco).
 * 5. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 6. Copia la URL ("Web app URL") y pégala desde la pestaña "Conexión" del dashboard
 *    (o en config.js si prefieres dejarla fija).
 * 7. Cada vez que edites este código, crea una NUEVA VERSIÓN de la implementación
 *    (Implementar > Administrar implementaciones > ✏️ > Nueva versión) para que el
 *    cambio surta efecto. Sube el número de VERSION abajo cada vez que hagas esto —
 *    así la pestaña "Conexión" del dashboard te confirma que estás en la versión correcta.
 */

const VERSION = "1.1"; // <-- sube este número cada vez que despliegues una nueva versión

const EVAL_SHEET_NAME = 'Evaluaciones';
const EVAL_HEADERS = [
  'ID', 'Nombre', 'Area_Planta', 'Fecha',
  'S1_P1', 'S1_P2', 'S1_P3', 'S1_P4', 'Subtotal_S1',
  'S2_P1', 'S2_P2', 'S2_P3', 'S2_P4', 'S2_P5', 'S2_P6', 'Subtotal_S2',
  'Total', 'Porcentaje', 'Nivel'
];

const EMP_SHEET_NAME = 'Empleados';
const EMP_HEADERS = [
  'ID', 'Nombre', 'Area_Planta', 'Puesto', 'Fecha_Ingreso', 'Estatus'
];

function getSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getRange(1, 1).getValue() !== headers[0]) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function readRows_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return data
    .filter(function (row) { return row.some(function (v) { return v !== '' && v !== null; }); })
    .map(function (row) {
      const obj = {};
      headers.forEach(function (h, i) { obj[h] = row[i]; });
      return obj;
    });
}

function doGet(e) {
  const params = (e && e.parameter) || {};

  // --- Endpoint de estatus / metadatos (usado por la pestaña "Conexión") ---
  if (params.meta === '1') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const evalSheet = getSheet_(EVAL_SHEET_NAME, EVAL_HEADERS);
    const empSheet = getSheet_(EMP_SHEET_NAME, EMP_HEADERS);
    const meta = {
      status: 'ok',
      version: VERSION,
      sheetName: ss.getName(),
      serverTime: new Date().toISOString(),
      evaluaciones: Math.max(0, evalSheet.getLastRow() - 1),
      empleados: Math.max(0, empSheet.getLastRow() - 1)
    };
    return ContentService.createTextOutput(JSON.stringify(meta))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // --- Catálogo de empleados ---
  if (params.sheet === 'empleados') {
    const sheet = getSheet_(EMP_SHEET_NAME, EMP_HEADERS);
    return ContentService.createTextOutput(JSON.stringify(readRows_(sheet, EMP_HEADERS)))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // --- Evaluaciones (default, compatible con versiones anteriores) ---
  const sheet = getSheet_(EVAL_SHEET_NAME, EVAL_HEADERS);
  return ContentService.createTextOutput(JSON.stringify(readRows_(sheet, EVAL_HEADERS)))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const target = payload._sheet === 'empleados' ? 'empleados' : 'evaluaciones';

  if (target === 'empleados') {
    const sheet = getSheet_(EMP_SHEET_NAME, EMP_HEADERS);
    const id = 'EMP-' + new Date().getTime();
    const row = EMP_HEADERS.map(function (h) {
      if (h === 'ID') return id;
      return payload[h] !== undefined ? payload[h] : '';
    });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', id: id }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet_(EVAL_SHEET_NAME, EVAL_HEADERS);
  const id = 'EV-' + new Date().getTime();
  const row = EVAL_HEADERS.map(function (h) {
    if (h === 'ID') return id;
    return payload[h] !== undefined ? payload[h] : '';
  });
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', id: id }))
    .setMimeType(ContentService.MimeType.JSON);
}
