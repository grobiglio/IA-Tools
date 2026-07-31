# Herramientas IA — cómo mantener esta página

`index.html` es un **artefacto generado**. La fuente de verdad es `herramientas.json`.

Antes, agregar una herramienta obligaba a editar tres bloques de HTML a mano en un archivo de casi 900 líneas, y nada actualizaba la lista de precache. Ahora es editar un objeto y correr un comando.

## Agregar una herramienta (3 pasos)

**1. El logo** — guardalo en esta carpeta como `logo_<id>.png`: PNG con transparencia, lienzo cuadrado de 64×64 y el dibujo centrado. Todos tienen la misma caja, así el tamaño se controla desde el CSS y no hace falta ningún `style` suelto.

Partiendo del favicon del sitio:

```bash
curl -sL -A "Mozilla/5.0" https://SITIO/favicon.ico -o /tmp/x.src
# Elige automáticamente el frame más grande si es un .ico multi-resolución
f=$(identify -format '%[fx:w*h] %s\n' /tmp/x.src | sort -rn | head -1 | awk '{print $2}')
convert "/tmp/x.src[$f]" -background none -alpha on \
        -resize 64x64 -gravity center -extent 64x64 -strip PNG32:logo_<id>.png
```

Si el archivo es un `.ico` y ImageMagick se queja de que no reconoce el formato, antepone `ico:` a la ruta. Y nunca decidas con `curl -I`: algunos sitios devuelven `content-length: 0` en HEAD y el GET sí trae la imagen.

**2. Los datos** — agregá el objeto en `herramientas.json`, dentro de la categoría que corresponda. El orden del array es el orden en que se ve la grilla.

```json
{
  "id": "ejemplo",
  "nombre": "Ejemplo",
  "url": "https://ejemplo.com/",
  "logo": "logo_ejemplo.png",
  "descripcionHtml": "Qué hace la herramienta y para qué sirve.",
  "tutorial": null
}
```

**3. Generar** — `node build.js`, revisá el `git diff` y commiteá.

## Campos

| Campo | Obligatorio | Para qué |
|---|---|---|
| `id` | sí | Solo `a-z` y `0-9`. Fija el id del modal (`modal-<id>`) |
| `nombre` | sí | Texto del botón. Es también lo que se envía a Google Analytics |
| `url` | sí | Adónde lleva el botón |
| `logo` | sí | Archivo local. Un `logo` que empiece por `http` se rechaza |
| `descripcionHtml` | sí | Cuerpo del modal. Se inserta sin escapar: admite `<br>`, `<em>`, viñetas |
| `tutorial` | sí | URL de la playlist, o `null` para que el ▶ salga deshabilitado |
| `alt` | no | Por defecto `"<nombre> Logo"` |
| `modalTitulo` | no | Por defecto el `nombre`. Útil si el título largo no entra en el botón |
| `enlaces` | no | `{"en": "...", "es": "..."}`, ambas opcionales. Ver el criterio abajo |
| `nombresPrevios` | no | Nombres anteriores. Ver abajo |
| `pendiente` | no | `true` deja la herramienta anotada sin que se renderice |
| `nota` | no | Apunte para vos. Nunca se emite al HTML |

## Criterio para los botones "More info" / "Más info"

Documentación oficial primero; Wikipedia solo como último recurso. Para cada idioma:

1. Documentación o centro de ayuda oficial en ese idioma.
2. Si no hay, el artículo de Wikipedia en ese idioma.
3. Si tampoco hay, se omite ese botón. Vale más un solo botón que uno que no aporta.

Nunca pongas documentación en inglés detrás del botón que dice ES: la etiqueta estaría
mintiendo sobre el idioma.

Varios sitios ofrecen la versión en español con un sufijo predecible, que conviene probar
antes de caer en Wikipedia: `?hl=es` en las propiedades de Google, `/es/` o `/es-es/` en
los centros de ayuda hechos con Intercom o Zendesk (Manus, Make, Notion, Microsoft y
Anthropic tienen español real por esa vía).

Al verificar un enlace, tené en cuenta que **muchos sitios responden 403 a `curl` por
bloqueo de bots aunque funcionen perfecto en un navegador**. Un 403 no es un enlace roto;
un 404 sí.

## Reglas

- **No edites `index.html` entre `<!-- BEGIN:… -->` y `<!-- END:… -->`**, ni `sw.js`
  entre `// BEGIN:…` y `// END:…`. Se pisan en el próximo build. Todo lo demás de
  esos archivos —el `<head>`, el tracking, el footer— se edita a mano como siempre.
- **El `nombre` es lo que llega a Google Analytics** como parámetro `herramienta`.
  Si una herramienta se renombra, cambialo igual: mostrar un nombre que ya no existe
  da peor impresión que perder continuidad en un informe. Pero agregá el anterior a
  `nombresPrevios`, para poder sumar las dos etiquetas al leer GA4. `node build.js`
  avisa cuando detecta un renombre, y te recuerda documentarlo si te olvidaste.
- **El `id` conviene dejarlo quieto** aunque cambie el nombre: fija el id del modal y
  el nombre del archivo de logo. Cambiarlo no rompe nada de cara afuera, solo obliga a
  renombrar el PNG.
- **Nada de logos hotlinkeados.** Dependían de que otro sitio no cambiara ni bloqueara
  la descarga.

## Comandos

```bash
node build.js              # regenera index.html y sw.js
node build.js --check      # no escribe; falla si algo quedó desactualizado
node build.js --stats      # conteos por categoría y logos que quedaron sin usar
node build.js --nombres    # tabla de renombres, para leer los informes de GA4
python3 -m http.server 8000   # previsualizar en http://localhost:8000/
```

## Cómo está armado

- `herramientas.json` → `build.js` → las dos regiones generadas de `index.html` y la
  lista de precache de `sw.js`. La salida es HTML estático: los buscadores ven los
  nombres y las descripciones, y la página funciona sin JavaScript.
- `styles.css` es una sola hoja con los dos temas en variables. El tema se aplica con
  `data-theme` en `<html>`, que fija un script del `<head>` antes del primer pintado.
  Oscuro es el predeterminado; `cual.html` está fijada en claro.
- `sw.js` usa red primero para el HTML y caché primero para el resto, y su
  `CACHE_NAME` lleva un hash del contenido: al regenerar, el caché viejo se borra solo
  y una herramienta nueva se ve en la primera recarga.
