[Inicio](./README.md) | [Anterior (2. Fundamentos de ChatGPT y conceptos clave)](./2-Fundamentos.md) | [Próximo (4. Herramientas y funcionalidades)](./4-Herramientas.md)

---

# Ingeniería de Prompts

**Objetivo:** Dominar la técnica de diseñar y optimizar prompts para obtener el máximo valor de modelos de IA como ChatGPT, Gemini, Notebook LM y Perplexity, especialmente en contextos de certificación, diseño, producción y soporte de aeronaves.

## Índice

- [¿Qué es la ingeniería de prompts?](#qué-es-la-ingeniería-de-prompts)

- [¿Sirven los mismos prompts para todos los modelos de IA?](#sirven-los-mismos-prompts-para-todos-los-modelos-de-ia)

- [Principios y buenas prácticas de ingeniería de prompts](#principios-y-buenas-prácticas-de-ingeniería-de-prompts)
  - [Principios básicos](#principios-básicos)
  - [Buenas prácticas para ingeniería aeronáutica](#buenas-prácticas-para-ingeniería-aeronáutica)
  - [Recomendaciones específicas por modelo](#recomendaciones-específicas-por-modelo)

- [Errores comunes a evitar](#errores-comunes-a-evitar)

- [Plantillas de prompts para ingeniería aeronáutica](#plantillas-de-prompts-para-ingeniería-aeronáutica)
  - [A. Informe técnico](#a-informe-técnico)
  - [B. Lista de chequeo](#b-lista-de-chequeo)
  - [C. Análisis normativo](#c-análisis-normativo)
  - [D. Simulación de consulta al cliente](#d-simulación-de-consulta-al-cliente)
  - [E. Preparación de auditoría](#e-preparación-de-auditoría)

- [Recursos y enlaces recomendados](#recursos-y-enlaces-recomendados)

- [Ejemplos prácticos](#ejemplos-prácticos)

- [Conclusión](#conclusión)

## ¿Qué es la ingeniería de prompts?

La **ingeniería de prompts** es el arte y técnica de crear instrucciones claras y estructuradas para modelos de inteligencia artificial conversacional. Su meta es obtener respuestas útiles, precisas y adaptadas al contexto técnico y profesional.

En **ingeniería aeronáutica**, los prompts permiten:

- Redactar informes de certificación y cumplimiento normativo.
- Generar listas de chequeo para inspección y control de calidad.
- Analizar regulaciones y normativas aeronáuticas.
- Planificar auditorías y ensayos.
- Simular consultas de clientes para el soporte logístico y el ciclo de vida del producto.

## ¿Sirven los mismos prompts para todos los modelos de IA?

**No necesariamente.** Los principios básicos se aplican a todos los modelos, pero hay diferencias importantes según la plataforma. Adaptar los prompts puede mejorar significativamente los resultados:

| Modelo        | Características relevantes                    | Recomendaciones de prompts                                  |
|---------------|----------------------------------------------|-------------------------------------------------------------|
| ChatGPT       | Conversación larga, multietapa, iterativo     | Detallá contexto, dividí en pasos, pedí mejoras sucesivas.  |
| Gemini        | Multimodal (texto, imagen, audio)             | Aprovechá referencias visuales o documentos adjuntos.       |
| Notebook LM   | Análisis de archivos/documentos extensos      | Referenciá secciones, tablas o páginas específicas.         |
| Perplexity    | Respuestas con fuentes externas actualizadas  | Pedí siempre referencias, comparaciones y síntesis.         |

## Principios y buenas prácticas de ingeniería de prompts

### Principios básicos

1. **Ser específico:** Claridad sobre el objetivo y el resultado esperado.
2. **Contextualizar:** Incluí antecedentes, normativas aplicables, o el uso final del contenido.
3. **Formato explícito:** Indicá si preferís listas, tablas, reportes, respuestas breves, etc.
4. **Iteración:** Mejorá el prompt en base a la respuesta obtenida.
5. **Desglose en pasos:** Para tareas complejas, pedí un desarrollo paso a paso.
6. **Solicitá ejemplos:** Para formatos nuevos o poco frecuentes.
7. **Referencias técnicas:** Citá documentos, páginas o fuentes externas cuando sea relevante.

### Buenas prácticas para ingeniería aeronáutica

- **Normativas:** “Resumí los requisitos clave de la norma CS-23 para pruebas estructurales.”
- **Checklists:** “Generá una lista de chequeo para inspección de tren de aterrizaje según FAR 21.”
- **Auditorías:** “Proponé un plan de auditoría para el área de control de calidad en producción.”
- **Soporte al cliente:** “Simulá una respuesta técnica a un reporte de falla en el sistema hidráulico.”
- **Comparaciones normativas:** “Compará los requisitos de FAA y EASA para certificación de modificaciones.”

### Recomendaciones específicas por modelo

- **ChatGPT y Gemini:** Utilizá prompts conversacionales, iterativos y con pedidos de mejora.
- **Notebook LM:** Especificá los archivos y las secciones relevantes del material de referencia.
- **Perplexity:** Pedí siempre fuentes, enlaces o resúmenes comparativos.

## Errores comunes a evitar

- Prompts vagos o genéricos (“Explicá la certificación”).
- No dar contexto ni propósito al pedido.
- Pedir demasiadas tareas en un solo prompt.
- Ignorar la longitud máxima (tokens) de la respuesta.
- No pedir formato de salida ni ejemplos.

## Plantillas de prompts para ingeniería aeronáutica

### A. Informe técnico

```markdown
Redactá un informe técnico sobre la validación estructural del componente [X] de la aeronave [Y] según la norma [Z]. El informe debe incluir: 
- Descripción del componente
- Metodología utilizada
- Resultados y discusión
- Conclusiones y recomendaciones
```

### B. Lista de chequeo

```markdown
Generá una lista de chequeo para la inspección de [sistema/componente] en la etapa de [producción/servicio] según el estándar [especificar]. Presentá la lista en formato de tabla con columnas: Ítem, Acción, Criterio de aceptación, Observaciones.
```

### C. Análisis normativo

```markdown
Analizá los requisitos de la norma [CS-23/FAR 21/Part 145] y listá los puntos clave que afectan a la certificación de [componente/sistema/proceso].
```

### D. Simulación de consulta al cliente

```markdown
Simulá una interacción de soporte donde el cliente reporta [problema técnico]. Redactá una respuesta técnica adecuada y sugerí pasos iniciales de diagnóstico.
```

### E. Preparación de auditoría

```markdown
Prepará un plan de auditoría interna para la línea de producción de [componente], cubriendo las áreas de [calidad, documentación, trazabilidad], incluyendo los objetivos y la documentación a revisar.
```

## Recursos y enlaces recomendados

- Carpeta de prompts de ejemplo: [Prompts de ejemplo](https://github.com/grobiglio/IA-Tools/tree/main/Prompts)
- Ejemplo de corrección de informes: [Prompt ejemplo](https://chatgpt.com/share/6799109e-e5d4-800d-ab2c-ec7ff5d9bf2c)
- Documentación de referencia: EASA, FAA, ANAC, manuales internos.

## Ejemplos prácticos

Ver caprpeta de prompts aquí 👉 [Prompts](https://github.com/grobiglio/IA-Tools/tree/main/Prompts)

Ver los siguientes prompts archivados:
- [Corrección de Informe Técnico](https://chatgpt.com/share/6799109e-e5d4-800d-ab2c-ec7ff5d9bf2c)
- [Informe del área](https://chatgpt.com/share/67991053-a638-800d-8003-3e592b221f1b)

## Conclusión

La ingeniería de prompts es una habilidad esencial para sacar el máximo provecho de los modelos de IA, especialmente en contextos críticos como la certificación, producción y soporte de aeronaves. Los principios básicos son universales, pero conviene adaptar el diseño y formato del prompt según la plataforma elegida y el objetivo específico de la tarea. Con práctica y atención al detalle, la IA se convierte en un aliado estratégico en la ingeniería aeronáutica.

---
[Inicio](./README.md) | [Anterior (2. Fundamentos de ChatGPT y conceptos clave)](./2-Fundamentos.md) | [Próximo (4. Herramientas y funcionalidades)](./4-Herramientas.md)