Necesito publicar un nuevo sermón en la web siguiendo exactamente este flujo:

**Parámetros de entrada**
- TÍTULO_SERMON = {La fe verdadera frente al juicio venidero}
- REFERENCIA_BÍBLICA = {2 Tesalonicenses 1:1-12}
- PDF_URL = {https://drive.google.com/file/d/11bmiHLTFb6h4MbNrdD3QlnHgchz5HmL1/view?usp=sharing}
- AUDIO_FILENAME = {250628-La-fe-verdadera-frente-al-juicio-venidero.m4a}
- TEMPLATE_HTML = {250622-Perder-la-vida-para-ganarla.html}
- IMG_SLUG = {la-fe-verdadera-frente-al-juicio-venidero}   # para nombrar el PNG/JPG resultante

**Paso 1 – Resúmenes**
1. Redacta un resumen “largo” de 75-100 palabras para la página.
2. Redacta un resumen “corto” de 25-30 palabras para la meta-description.

**Paso 2 – HTML**
3. Abre la plantilla indicada y genera un nuevo archivo HTML con el nombre `{IMG_SLUG}.html`, aplicando SOLO estos cambios:  
   • `<title>` → TÍTULO_SERMON  
   • `<meta name="description">` → resumen corto  
   • `<h2 class="sermon-title">` → TÍTULO_SERMON  
   • párrafo principal → resumen largo  
   • `<source src="audios/...">` → `audios/` + AUDIO_FILENAME  
   • enlace PDF (`href`) → PDF_URL  
   • `<img src="images/...">` → `images/` + IMG_SLUG + `.png`  
   Mantén intactos estilos, favicon, etc.  
4. Entrega el código en un lienzo/canvas (canmore.create_textdoc) listo para copiar-pegar. No repitas el código en el chat.

**Paso 3 – Imagen**
5. Sugiere 3 conceptos de imagen portada, claros y descriptivos (una frase cada uno). No las generes aún.  
6. Espera mi elección. Después, usa image_gen para crear la imagen seleccionada (1024×1024) y muéstrala en un carrusel al principio de tu respuesta.

**Paso 4 – Cierre**
7. Confirma de forma breve que todo quedó listo y ofrece más ayuda si hace falta.

IMPORTANTE:  
- Usa mis preferencias de estilo de sermones (texto bíblico en bloque-cita si fuera necesario).  
- Usa español neutro y tono pastoral-profesional.  
- Cita tus propias fuentes internas si corresponde; no incluyas URLs en el texto visible.  
- No pidas reconfirmaciones salvo elección de imagen.