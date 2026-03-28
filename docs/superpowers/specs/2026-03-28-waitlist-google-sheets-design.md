# Diseño: Waitlist → Google Sheets

**Fecha:** 2026-03-28
**Estado:** Aprobado

## Problema

El formulario de waitlist en `index.html` valida el email en el cliente y muestra un mensaje de éxito, pero no persiste los datos en ningún sitio. Los emails se pierden.

## Solución

Integrar el formulario con Google Sheets mediante un Google Apps Script desplegado como Web App (endpoint HTTPS público). El sitio sigue siendo 100% estático.

## Arquitectura

```
Usuario rellena form → fetch POST a Apps Script URL → Apps Script escribe fila en Google Sheet
```

- **Hosting:** GitHub Pages o Vercel (estático, sin cambios)
- **Backend:** Google Apps Script Web App (gratuito, sin dependencias externas)
- **Almacenamiento:** Google Sheets — columnas: `Timestamp`, `Email`

## Componentes

### 1. Google Apps Script (`Code.gs`)

Función `doPost(e)` que:
- Lee el campo `email` del cuerpo JSON de la petición
- Valida que no esté vacío
- Hace `appendRow([new Date(), email])` en la primera hoja
- Devuelve JSON `{ result: "success" }` o `{ result: "error", message: "..." }`
- Incluye cabeceras CORS para permitir peticiones desde cualquier origen

Desplegado como **Web App** con acceso "Anyone" (sin autenticación requerida).

### 2. Cambios en `index.html`

En el handler `submit` del formulario (`#wl-form`, línea ~1141):
- Reemplazar la lógica actual (que solo muestra el mensaje de éxito sin enviar nada) por un `fetch` POST a la URL del Apps Script
- Mostrar estado de carga mientras se envía ("Enviando…")
- En éxito: comportamiento actual (ocultar form, mostrar `#wl-confirm`)
- En error: mostrar mensaje de error inline sin perder el email escrito

### 3. Instrucciones de setup para el usuario

Documento paso a paso que el usuario ejecuta una sola vez:
1. Crear Google Sheet con columnas `Timestamp` y `Email`
2. Abrir Apps Script desde el Sheet (`Extensiones → Apps Script`)
3. Pegar el código, guardar
4. Publicar como Web App (ejecutar como: yo, acceso: cualquiera)
5. Copiar la URL generada y reemplazar el placeholder en `index.html`

## Lo que NO incluye este diseño

- Notificaciones (email, webhook, etc.) — no requerido
- Panel de administración — se gestiona directamente desde Google Sheets
- Double opt-in o confirmación por email — fuera de alcance
- Rate limiting o protección anti-spam — fuera de alcance (volumen bajo esperado)
