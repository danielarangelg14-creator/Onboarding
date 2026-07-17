# Dashboard — Evaluación de Adaptación (F62-21) · Metelmex

Dashboard de RH para dar seguimiento a las evaluaciones de adaptación de nuevos
colaboradores. Se hospeda gratis en GitHub Pages y usa un Google Sheet como
base de datos "en la nube" (así puedes capturar evaluaciones desde el
dashboard y verlas desde cualquier dispositivo).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | El dashboard completo (no necesitas tocarlo) |
| `config.js` | Aquí pegas la URL de tu Google Sheet conectado — **es lo único que editas** |
| `apps-script-Code.gs` | Código que conecta tu Google Sheet a internet (se pega en Google, no en GitHub) |

---

## Paso 1 — Crear el Google Sheet

1. Crea un Google Sheet nuevo (puede estar vacío, la hoja `Evaluaciones` y los
   encabezados se crean solos la primera vez que se use).
2. Puedes ponerle el nombre que quieras, por ejemplo
   **"Evaluaciones de Adaptación — Metelmex"**.

## Paso 2 — Conectar el Sheet a internet (Google Apps Script)

1. En tu Google Sheet: **Extensiones → Apps Script**.
2. Borra el contenido que aparece por default y pega **todo** el contenido de
   `apps-script-Code.gs`.
3. Guarda (ícono de disco o Ctrl+S).
4. Arriba a la derecha: **Implementar → Nueva implementación**.
5. En "Seleccionar tipo" elige **Aplicación web**.
6. Configura:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
7. Da clic en **Implementar**. Google te pedirá autorizar permisos (es tu
   propio script, tocando tu propio Sheet — es seguro autorizarlo).
8. Copia la **URL de la aplicación web** que te entrega. Se ve así:
   `https://script.google.com/macros/s/AKfycb.../exec`

> ⚠️ Cada vez que edites el código del Apps Script después de este paso,
> tienes que crear una **nueva versión** de la implementación
> (Implementar → Administrar implementaciones → ✏️ → Nueva versión) para que
> el cambio se aplique. La URL no cambia.

## Paso 3 — Conectar el dashboard a tu Sheet

Abre `config.js` y pega tu URL:

```js
const CONFIG = {
  WEB_APP_URL: "https://script.google.com/macros/s/AKfycb.../exec"
};
```

Guarda el archivo. Mientras `WEB_APP_URL` esté vacío, el dashboard funciona en
**modo demo** con datos de ejemplo — así puedes ver cómo luce antes de
conectarlo.

## Paso 4 — Subir a GitHub

En tu repo ya existente:

```bash
git add index.html config.js
git commit -m "Dashboard de Evaluación de Adaptación"
git push
```

Para verlo en línea (no solo en tu repo), activa **GitHub Pages**:

1. En tu repo → **Settings → Pages**.
2. En "Branch" selecciona tu rama (usualmente `main`) y la carpeta donde están
   estos archivos.
3. Guarda. GitHub te da una URL tipo
   `https://tu-usuario.github.io/tu-repo/` — ábrela y ahí está tu dashboard.

## Cómo se usa

- **Dashboard**: KPIs, gráficas (nivel de adaptación, tendencia, promedio por
  área/planta) y tabla filtrable de todas las evaluaciones. Da clic en
  cualquier fila para ver el detalle.
- **Nueva Evaluación**: llena el formulario exactamente como en el F62-21
  (10 preguntas, escala 1–5). El puntaje, porcentaje y nivel se calculan
  solos mientras respondes. Al guardar, se agrega como una fila nueva a tu
  Google Sheet.

## Escala de interpretación (igual que el F62-21)

| % | Puntos | Nivel |
|---|---|---|
| 90–100% | 45–50 | Excelente — Adaptación sobresaliente |
| 75–89% | 38–44 | Bueno — Adaptación satisfactoria |
| 60–74% | 30–37 | Regular — Requiere seguimiento |
| 0–59% | 0–29 | Bajo — Requiere intervención inmediata |

## Notas

- No se necesita ninguna cuenta ni contraseña dentro del dashboard: la
  seguridad la controla el nivel de acceso que definas en tu propia
  implementación de Apps Script.
- Si quieres restringir quién puede ver el dashboard, la forma más simple es
  hacer el repo de GitHub **privado** (GitHub Pages en repos privados
  requiere GitHub Pro, o puedes dejarlo público ya que no contiene datos, solo
  el código — los datos viven en tu Google Sheet).
- Si algún día quieres migrar las secciones "Evaluación de Competencias"
  (STAR/dictamen) a un dashboard aparte, se puede replicar esta misma
  estructura con otro Sheet y otro Apps Script.
