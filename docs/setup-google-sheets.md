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
