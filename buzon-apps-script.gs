/**
 * BUZÓN DE RESULTADOS — Práctica de programación
 * Recibe los resultados de todas las máquinas y los va escribiendo
 * en una sola planilla del Drive de la escuela.
 *
 * ─────────────────────────────────────────────────────────────
 * CÓMO PONERLO A ANDAR (5 minutos, una sola vez)
 * ─────────────────────────────────────────────────────────────
 *
 *  1. Entrá a drive.google.com con la cuenta de la escuela y creá
 *     una planilla nueva. Ponele de nombre, por ejemplo:
 *     "Resultados práctica de programación".
 *
 *  2. En esa planilla: menú  Extensiones → Apps Script.
 *     Se abre un editor con un archivo Código.gs que tiene una
 *     función vacía. Borrá TODO lo que haya ahí.
 *
 *  3. Copiá este archivo entero y pegalo en su lugar. Guardá
 *     (el icono del disquete, o Ctrl+S).
 *
 *  4. Arriba a la derecha: botón azul  Implementar → Nueva implementación.
 *       · Tocá el engranaje y elegí el tipo  "Aplicación web"
 *       · Descripción: buzón
 *       · Ejecutar como:        Yo  (tu cuenta)
 *       · Quién tiene acceso:   Cualquier usuario     ← IMPORTANTE
 *     Tocá  Implementar.
 *
 *  5. Google te va a pedir permisos la primera vez. Aceptá.
 *     Va a aparecer una pantalla que dice que la app no está
 *     verificada: es tu propio script, andá a "Configuración
 *     avanzada" → "Ir a (nombre del proyecto)".
 *
 *  6. Al final te da una  URL de la aplicación web , que termina
 *     en  /exec . Copiala y pasámela: va en la constante
 *     URL_BUZON de index.html.
 *
 * ─────────────────────────────────────────────────────────────
 * QUÉ HACE
 * ─────────────────────────────────────────────────────────────
 * Crea (si no existen) dos hojas:
 *
 *   Tandas   → una fila por tanda: fecha, alumno, año, sala, modo,
 *              practicó, sin ayuda, %, pistas, salteadas, minutos.
 *   Detalle  → una fila por ejercicio, para ver dónde falló cada uno.
 *
 * Si una misma tanda llega dos veces (porque se reintentó el envío),
 * la ignora: cada una tiene un id único.
 *
 * NOTA SOBRE PRIVACIDAD
 * Esto manda el nombre que escribe el alumno a una planilla de Drive.
 * Si preferís no guardar nombres completos, pediles que pongan
 * nombre y la inicial del apellido, o el número de lista.
 */

var HOJA_TANDAS  = 'Tandas';
var HOJA_ENVIOS  = 'Envíos';

/* Clave para que sólo la profe pueda leer los programas que mandan (proyecto final).
   La misma que se escribe una vez en la pantalla de la profe: proyecto-final.html#profe */
var CLAVE_PROFE = 'cambiar-esta-clave';
var HOJA_DETALLE = 'Detalle';

/* ID de la planilla donde escribir. Es la parte larga de su URL:
   docs.google.com/spreadsheets/d/  ESTO DE ACÁ  /edit
   Se usa openById en vez de getActiveSpreadsheet() para que el script
   funcione aunque no esté vinculado a la planilla (si lo creaste desde
   script.google.com y no desde Extensiones → Apps Script). */
var ID_PLANILLA = '15Z-tYVsm7q5-hsA4zH-l8-tpnQL2XNBH9vg_j6YS2cE';

function doPost(e) {
  try {
    var t = JSON.parse(e.postData.contents);
    if (!t || !t.id) return _ok('sin id');

    var ss = SpreadsheetApp.openById(ID_PLANILLA);
    var hT = _hoja(ss, HOJA_TANDAS, [
      'id','Fecha','Alumno','Año','Sala','Modo','Ejercicios',
      'Practicó (con ayuda)','Sin ayuda','% sin ayuda','Pistas','Salteadas','Minutos','Recibido'
    ]);

    if (_yaEsta(hT, t.id)) return _ok('repetida');

    /* Proyecto final: un programa que un equipo mandó a la placa. Va a su propia hoja. */
    if (t.envio) {
      var hE = _hoja(ss, HOJA_ENVIOS, ['Recibido','Alumno','Código','Programa','id']);
      hE.appendRow([new Date(), t.alumno || '', t.envio, t.programa || '', t.id]);
      return _ok('ok');
    }

    var pct = t.total ? Math.round(t.sinAyuda / t.total * 100) : 0;
    hT.appendRow([
      t.id, t.fecha || '', t.alumno || '', t.anio || '', t.salaNom || t.sala || '',
      t.modo === 'cuenta' ? 'Cuenta' : 'Práctica',
      t.total || 0, t.resueltos || 0, t.sinAyuda || 0, pct,
      t.pistas || 0, t.salteadas || 0, Math.round((t.seg || 0) / 6) / 10,
      new Date()
    ]);

    var ejs = t.ejs || [];
    if (ejs.length) {
      var hD = _hoja(ss, HOJA_DETALLE, [
        'id','Fecha','Alumno','Año','Sala','Concepto','Tipo','Consigna',
        'Intentos','Sin ayuda','Lo resolvió','Pistas','Salteado','Segundos'
      ]);
      var filas = ejs.map(function (x) {
        return [
          t.id, t.fecha || '', t.alumno || '', t.anio || '', t.salaNom || '',
          x.c || '', x.t || '', x.q || '',
          x.i || 0, x.ok1 ? 'SÍ' : 'no', x.ok ? 'sí' : 'no',
          x.p || 0, x.s ? 'sí' : '', x.sg || 0
        ];
      });
      hD.getRange(hD.getLastRow() + 1, 1, filas.length, filas[0].length).setValues(filas);
    }

    return _ok('ok');
  } catch (err) {
    return _ok('error: ' + err);
  }
}

/* Para probar desde el navegador que quedó publicado:
   abrí la URL y tiene que decir "buzón activo". */
function doGet(e) {
  /* La pantalla de la profe pide los últimos programas enviados, con su clave. */
  if (e && e.parameter && e.parameter.envios) {
    if (e.parameter.k !== CLAVE_PROFE) return _ok('clave incorrecta');
    var h = SpreadsheetApp.openById(ID_PLANILLA).getSheetByName(HOJA_ENVIOS);
    var out = [];
    if (h && h.getLastRow() > 1) {
      var n = h.getLastRow() - 1, desde = Math.max(2, h.getLastRow() - 39);
      var filas = h.getRange(desde, 1, h.getLastRow() - desde + 1, 5).getValues();
      out = filas.map(function (f) { return { t: f[0], alumno: f[1], codigo: f[2], id: f[4] }; }).reverse();
    }
    return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('buzón activo');
}

function _hoja(ss, nombre, encabezados) {
  var h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(encabezados);
    h.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function _yaEsta(hoja, id) {
  var n = hoja.getLastRow();
  if (n < 2) return false;
  var ids = hoja.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) return true;
  return false;
}

function _ok(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
