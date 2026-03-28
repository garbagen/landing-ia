# Waitlist → Google Sheets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guardar cada email del formulario de waitlist en una hoja de Google Sheets usando un Google Apps Script como endpoint.

**Architecture:** El formulario hace un `fetch` POST a un Google Apps Script desplegado como Web App pública. El script recibe el email y lo escribe en una Google Sheet. El sitio sigue siendo completamente estático.

**Tech Stack:** Vanilla JS (fetch API), Google Apps Script (V8), Google Sheets

---

## Archivos que se tocan

| Acción | Ruta | Responsabilidad |
|--------|------|-----------------|
| Crear | `docs/apps-script/Code.gs` | Código que el usuario copia en Apps Script |
| Modificar | `index.html` líneas 1141–1157 | Handler del formulario — añadir fetch real |
| Crear | `docs/setup-google-sheets.md` | Instrucciones paso a paso para el usuario |

---

## Task 1: Crear el código del Apps Script

**Files:**
- Create: `docs/apps-script/Code.gs`

- [ ] **Paso 1: Crear el archivo con el código del script**

Crear `docs/apps-script/Code.gs` con este contenido exacto:

```javascript
// AI Melilla 2025 — Waitlist collector
// Despliega como Web App: ejecutar como "Yo", acceso "Cualquiera"

var SHEET_NAME = 'Waitlist';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

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
```

- [ ] **Paso 2: Commit**

```bash
git add docs/apps-script/Code.gs
git commit -m "feat: add Apps Script code for waitlist → Sheets"
```

---

## Task 2: Actualizar el formulario en index.html

**Files:**
- Modify: `index.html` líneas 1141–1157

- [ ] **Paso 1: Reemplazar el handler del formulario**

Localizar el bloque `/* ── WAITLIST FORM ─────────── */` (línea ~1136) y reemplazar **desde** `form.addEventListener('submit', e => {` **hasta** el `});` de cierre (línea ~1157) por:

```javascript
var APPS_SCRIPT_URL = 'PEGA_AQUI_TU_URL';

form.addEventListener('submit', function(e) {
  e.preventDefault();
  var emailInput = document.getElementById('wl-email');
  var email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInput.focus();
    emailInput.style.borderColor = 'rgba(255,80,80,0.6)';
    setTimeout(function() { emailInput.style.borderColor = ''; }, 2000);
    return;
  }

  var btn = form.querySelector('.waitlist-btn');
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    if (data.result === 'success') {
      wrap.style.opacity = '0';
      wrap.style.transform = 'translateY(-10px)';
      wrap.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(function() {
        wrap.style.display = 'none';
        confirm.classList.add('show');
      }, 300);
    } else {
      btn.textContent = 'Apuntarme →';
      btn.disabled = false;
      emailInput.style.borderColor = 'rgba(255,80,80,0.6)';
      setTimeout(function() { emailInput.style.borderColor = ''; }, 2000);
    }
  })
  .catch(function() {
    btn.textContent = 'Apuntarme →';
    btn.disabled = false;
    emailInput.style.borderColor = 'rgba(255,80,80,0.6)';
    setTimeout(function() { emailInput.style.borderColor = ''; }, 2000);
  });
});
```

> Nota: `PEGA_AQUI_TU_URL` es un placeholder que el usuario reemplazará en el Task 4 con la URL real de su Apps Script.

- [ ] **Paso 2: Verificar que el resto del script (smooth scroll, etc.) sigue intacto**

Las líneas después del handler del form (el bloque `/* ── SMOOTH CTA scroll ──`) deben quedar sin tocar.

- [ ] **Paso 3: Commit**

```bash
git add index.html
git commit -m "feat: connect waitlist form to Apps Script endpoint"
```

---

## Task 3: Escribir las instrucciones de setup para el usuario

**Files:**
- Create: `docs/setup-google-sheets.md`

- [ ] **Paso 1: Crear el archivo de instrucciones**

Crear `docs/setup-google-sheets.md` con este contenido:

```markdown
# Cómo conectar el formulario de waitlist a Google Sheets

Haz esto una sola vez. Tardas ~10 minutos.

## Paso 1 — Crea la hoja de cálculo

1. Ve a [sheets.google.com](https://sheets.google.com) e inicia sesión con tu cuenta de Google.
2. Pulsa **"+"** para crear una hoja nueva.
3. Nómbrala como quieras (ej. "AI Melilla Waitlist").
4. En la parte inferior verás la pestaña "Hoja 1" (o "Sheet1"). Haz doble clic en ella y renómbrala exactamente: `Waitlist`.
5. En la primera fila escribe en la celda A1: `Timestamp` y en B1: `Email`.

## Paso 2 — Abre el editor de Apps Script

1. En la hoja, ve al menú **Extensiones → Apps Script**.
2. Se abrirá el editor de código. Borra todo lo que haya por defecto.

## Paso 3 — Pega el código

1. Abre el archivo `docs/apps-script/Code.gs` de este proyecto.
2. Copia todo su contenido.
3. Pégalo en el editor de Apps Script.
4. Pulsa el icono de guardar (💾) o Ctrl+S.

## Paso 4 — Prueba que funciona (opcional pero recomendado)

1. En el menú desplegable de funciones (arriba), selecciona `test_doPost`.
2. Pulsa **Ejecutar**.
3. Acepta los permisos que te pida Google (es tu propio script).
4. Ve a tu hoja — debería haber aparecido una fila nueva con la fecha y `test@ejemplo.com`.
5. Borra esa fila de prueba.

## Paso 5 — Despliega como Web App

1. Pulsa **Implementar → Nueva implementación**.
2. En "Tipo", selecciona **Aplicación web**.
3. Configura así:
   - **Descripción:** Waitlist AI Melilla
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier persona
4. Pulsa **Implementar**.
5. Copia la URL que aparece (empieza por `https://script.google.com/macros/s/...`).

## Paso 6 — Conecta la URL a la página web

1. Abre `index.html`.
2. Busca la línea: `var APPS_SCRIPT_URL = 'PEGA_AQUI_TU_URL';`
3. Reemplaza `PEGA_AQUI_TU_URL` por la URL que copiaste en el paso anterior.
4. Guarda el archivo.

## Paso 7 — Prueba en el navegador

1. Abre `index.html` en el navegador.
2. Ve a la sección de waitlist y escribe un email real.
3. Pulsa "Apuntarme →".
4. Comprueba que el email aparece en tu Google Sheet.

¡Listo! Cada nuevo registro aparecerá automáticamente en la hoja.
```

- [ ] **Paso 2: Commit**

```bash
git add docs/setup-google-sheets.md
git commit -m "docs: add step-by-step Google Sheets setup guide"
```

---

## Task 4 (manual — lo hace el usuario): Setup y URL final

Este task lo ejecuta el usuario siguiendo `docs/setup-google-sheets.md`.

Una vez tenga la URL del Apps Script:

- [ ] Reemplazar `PEGA_AQUI_TU_URL` en `index.html` por la URL real
- [ ] Probar en el navegador que un email llega a la hoja
- [ ] Commit final:

```bash
git add index.html
git commit -m "feat: set live Apps Script URL for waitlist"
```
