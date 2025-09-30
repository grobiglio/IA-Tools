[Inicio](./README.md) | [Anterior (3. Fundamentos de ChatGPT)](./2-Fundamentos.md) | [Próximo (5. Herramientas y funcionalidades)](./4-Herramientas.md)

---

# Ingeniería de Prompts

**Objetivo:** Dominar la técnica de diseñar y optimizar prompts para obtener el máximo valor de modelos de IA como ChatGPT 5, Claude 3, Gemini 1.5, Mixtral o Grok 2, especialmente en contextos de certificación, diseño, producción y soporte de aeronaves.

## ¿Qué es la ingeniería de prompts?

La **ingeniería de prompts** es el arte y técnica de crear instrucciones claras y estructuradas para modelos de inteligencia artificial conversacional. Su meta es obtener respuestas útiles, precisas y adaptadas al contexto técnico y profesional.

En **ingeniería aeronáutica**, los prompts permiten:

* Redactar informes de certificación y cumplimiento normativo.
* Generar listas de chequeo para inspección y control de calidad.
* Analizar regulaciones y normativas aeronáuticas.
* Planificar auditorías y ensayos.
* Simular consultas de clientes para soporte logístico y ciclo de vida del producto.

---

## ¿Sirven los mismos prompts para todos los modelos de IA?

**No necesariamente.** Los principios básicos se aplican a todos los modelos, pero cada uno tiene fortalezas particulares. Adaptar los prompts puede mejorar significativamente los resultados:

| Modelo         | Características relevantes                                      | Recomendaciones de prompts                                      |
| -------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| **ChatGPT 5**  | Multimodal (texto, imágenes, audio), memoria y proyectos        | Aprovechá la multimodalidad y pedí mejoras iterativas.          |
| **Claude 3**   | Gran precisión en textos largos, enfoque en seguridad           | Usá prompts extensos, pedí resúmenes y verificaciones cruzadas. |
| **Gemini 1.5** | Análisis multimodal avanzado, integración con ecosistema Google | Incorporá imágenes, PDFs o tablas; pedí comparaciones técnicas. |
| **Mixtral**    | Open source, eficiente en tareas estructuradas                  | Pedí salidas en formato tabla o JSON para análisis.             |
| **Grok 2**     | Conectado en tiempo real a la plataforma X                      | Pedí información actualizada con referencias inmediatas.        |

---

## Principios y buenas prácticas de ingeniería de prompts

### Principios básicos

1. **Ser específico:** Claridad sobre el objetivo y el resultado esperado.
2. **Contextualizar:** Incluir antecedentes, normativas aplicables o el uso final del contenido.
3. **Formato explícito:** Indicar si se prefiere lista, tabla, reporte o gráfico.
4. **Iteración:** Refinar el prompt en base a las respuestas.
5. **Desglose en pasos:** Para tareas complejas, solicitar un desarrollo paso a paso.
6. **Solicitar ejemplos:** Especialmente en formatos nuevos o poco frecuentes.
7. **Referencias técnicas:** Citar documentos, normas o fuentes externas cuando sea relevante.
8. **Aprovechar memoria y proyectos:** Usar la memoria persistente y archivos adjuntos en lugar de repetir contexto.
9. **Combinar modalidades:** Si se dispone de imágenes, audios o PDFs, incorporarlos al prompt.

---

### Buenas prácticas para ingeniería aeronáutica

* **Normativas:** “Resumí los requisitos clave de la norma CS-23 para pruebas estructurales.”
* **Checklists:** “Generá una lista de chequeo para inspección de tren de aterrizaje según FAR 21.”
* **Auditorías:** “Proponé un plan de auditoría para el área de control de calidad en producción.”
* **Soporte al cliente:** “Simulá una respuesta técnica a un reporte de falla en el sistema hidráulico.”
* **Comparaciones normativas:** “Compará los requisitos de FAA y EASA para certificación de modificaciones.”
* **Integración multimodal:** “Dado este PDF con resultados de ensayo y esta imagen de planos, generá un informe técnico con conclusiones.”

---

## Recomendaciones específicas por modelo

* **ChatGPT 5:** Prompts conversacionales, iterativos y multimodales. Usar memoria y proyectos para continuidad.
* **Claude 3:** Ideal para prompts extensos y verificación de coherencia.
* **Gemini 1.5:** Combinar datos tabulares, imágenes y documentos para análisis más ricos.
* **Mixtral:** Utilizar formatos estructurados (JSON, CSV) para procesar datos.
* **Grok 2:** Diseñar prompts que exploten información en tiempo real (ejemplo: regulaciones recién publicadas).

---

## Errores comunes a evitar

* Prompts vagos o genéricos (“Explicá la certificación”).
* No dar contexto ni propósito al pedido.
* Pedir demasiadas tareas en un solo prompt.
* Ignorar la longitud máxima de tokens.
* No indicar formato de salida.
* Desaprovechar la multimodalidad (ejemplo: no adjuntar un documento cuando está disponible).

---

## Plantillas de prompts para ingeniería aeronáutica

### A. Informe técnico

Redactá un informe técnico sobre la validación estructural del componente \[X] de la aeronave \[Y] según la norma \[Z]. El informe debe incluir:

* Descripción del componente
* Metodología utilizada
* Resultados y discusión
* Conclusiones y recomendaciones

### B. Lista de chequeo

Generá una lista de chequeo para la inspección de \[sistema/componente] en la etapa de \[producción/servicio] según el estándar \[especificar]. Presentá la lista en formato de tabla con columnas: Ítem, Acción, Criterio de aceptación, Observaciones.

### C. Análisis normativo

Analizá los requisitos de la norma \[CS-23/FAR 21/Part 145] y listá los puntos clave que afectan a la certificación de \[componente/sistema/proceso].

### D. Simulación de consulta al cliente

Simulá una interacción de soporte donde el cliente reporta \[problema técnico]. Redactá una respuesta técnica adecuada y sugerí pasos iniciales de diagnóstico.

### E. Preparación de auditoría

Prepará un plan de auditoría interna para la línea de producción de \[componente], cubriendo las áreas de \[calidad, documentación, trazabilidad], incluyendo los objetivos y la documentación a revisar.

### F. Prompt multimodal

Dado el archivo adjunto \[nombre.pdf] y la imagen \[plano.png], elaborá un resumen técnico que combine la información de ambos y genere conclusiones aplicables a la certificación de \[sistema/componente].

---

## Recursos y enlaces recomendados

* Carpeta de prompts de ejemplo: [Prompts de ejemplo](https://github.com/grobiglio/IA-Tools/tree/main/Prompts)
* Ejemplo de corrección de informes: [Prompt ejemplo](https://chatgpt.com/share/6799109e-e5d4-800d-ab2c-ec7ff5d9bf2c)
* Documentación de referencia: EASA, FAA, ANAC, manuales internos.

---

## Conclusión

La ingeniería de prompts es una habilidad esencial para aprovechar al máximo los modelos de IA, especialmente en contextos críticos como la certificación, producción y soporte de aeronaves.

Los principios básicos siguen siendo universales, pero con GPT-5 y los modelos de nueva generación conviene:

* Usar multimodalidad (texto, imagen, audio).
* Incorporar memoria y proyectos para continuidad.
* Diseñar prompts adaptados a cada plataforma.

Con práctica y atención al detalle, la IA se convierte en un aliado estratégico en la ingeniería aeronáutica.

---

[Inicio](./README.md) | [Anterior (3. Fundamentos de ChatGPT)](./2-Fundamentos.md) | [Próximo (5. Herramientas y funcionalidades)](./4-Herramientas.md)