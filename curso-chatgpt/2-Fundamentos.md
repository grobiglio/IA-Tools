[Inicio](./README.md) | [Anterior (2. Markdown)](./1-Markdown.md) | [Próximo (4. Ingeniería de Prompts)](./3-IngPrompts.md)

---

# Fundamentos de ChatGPT y conceptos clave

**Objetivo**: Comprender cómo funciona ChatGPT, su estructura y los conceptos esenciales para interactuar eficazmente.

## Introducción a ChatGPT

### ¿Qué es ChatGPT?

[ChatGPT](https://es.wikipedia.org/wiki/ChatGPT) (Chat Generative Pre-Trained Transformer) es un sistema conversacional basado en inteligencia artificial desarrollado por OpenAI. Utiliza modelos avanzados de lenguaje natural llamados **GPT (Generative Pre-trained Transformer)** para comprender, procesar y generar texto en múltiples idiomas.

ChatGPT es capaz de:
- responder preguntas,
- redactar textos de todo tipo,
- generar código en diversos lenguajes de programación,
- analizar documentos e imágenes,
- traducir y resumir información,
- asistir en tareas académicas y profesionales, entre muchas otras funciones.

Desde 2025, la versión disponible en el plan **ChatGPT Plus** utiliza **GPT-5**, un modelo multimodal (texto, imágenes y audio) más preciso, veloz y con mejor memoria contextual que su predecesor GPT-4-turbo. Además, incluye acceso a herramientas como **búsqueda web integrada, visor de archivos, Python para análisis de datos, proyectos colaborativos, tareas programadas y memoria persistente.**

---

## Breve historia de los modelos de lenguaje

El desarrollo de ChatGPT se inscribe en la evolución del **Procesamiento de Lenguaje Natural (PLN)**, un área de la inteligencia artificial que busca enseñar a las máquinas a comprender, interpretar y generar lenguaje humano.

### De las reglas al aprendizaje profundo
- **Décadas de 1960-1980:** Los primeros sistemas (como ELIZA y SHRDLU) se basaban en reglas gramaticales simples y bases de datos cerradas.
- **Décadas de 1990-2000:** Se introdujeron modelos estadísticos como los n-gramas y algoritmos de aprendizaje automático como Naive Bayes y SVM.
- **Años 2010:** Aparecen modelos de **aprendizaje profundo**, como Word2Vec y las redes neuronales recurrentes (RNN), capaces de manejar relaciones más complejas entre palabras.

### La revolución de los Transformers
- En 2017, Google presenta el paper *“Attention is All You Need”*, que introduce la arquitectura **Transformer**. Esta innovación permite entrenar modelos más grandes, con mejor comprensión contextual.
- En 2018-2020 surgen modelos masivos como **BERT (Google)**, **GPT-2 (OpenAI)** y **T5**, que comienzan a usarse en tareas del mundo real.

### GPT y los grandes modelos actuales
- **GPT-3 (2020):** 175 mil millones de parámetros, sorprendente en redacción, programación y razonamiento.
- **GPT-4 (2023):** Modelo multimodal (texto e imágenes), más preciso y seguro.
- **GPT-4-turbo (2023):** Versión optimizada, más rápida y económica.
- **GPT-5 (2025):** Modelo multimodal avanzado con integración de texto, imágenes y audio, mayor coherencia en diálogos largos y mejor memoria persistente.

En paralelo, otras empresas desarrollaron modelos competitivos:
- **Claude 3 (Anthropic, 2024):** Enfoque en seguridad y control de la IA.
- **Gemini 1.5 (Google DeepMind, 2024):** Multimodal con capacidades extendidas en razonamiento.
- **LLaMA 3 (Meta, 2024):** Open source, ampliamente adoptado en investigación.
- **Mistral / Mixtral (2024):** Modelos abiertos con arquitecturas eficientes.
- **Grok 2 (xAI, 2025):** Integrado a la plataforma X (ex Twitter), con acceso a datos en tiempo real.

### Impacto y futuro
Hoy en día, estos modelos se aplican en educación, salud, ingeniería, derecho, atención al cliente y creatividad digital, transformando la forma en que interactuamos con la tecnología.  
A la vez, plantean desafíos éticos: sesgo en los datos, privacidad y riesgo de uso indebido. El futuro apunta a una integración aún mayor en la vida diaria y profesional.

---

## ¿Cómo funciona ChatGPT?

ChatGPT se basa en un modelo de lenguaje entrenado para predecir texto de forma contextual. Su arquitectura **Transformer** utiliza un mecanismo de **atención** que analiza relaciones entre palabras, frases e ideas.

### Arquitectura basada en Transformers
A diferencia de las redes tradicionales, los Transformers permiten procesar múltiples palabras en paralelo y captar relaciones complejas a larga distancia, lo que mejora la coherencia de las respuestas.

- El mecanismo de **atención** asigna relevancia a cada palabra dentro del contexto.
- El modelo no “lee” de manera secuencial, sino que comprende **relaciones globales**.

### Generación de texto paso a paso

1. **Tokenización**  
   El texto se divide en *tokens*.  
   Ejemplo:  
   - "inteligencia artificial" → `["int", "eligencia", " artificial"]`

2. **Predicción probabilística**  
   El modelo calcula cuál es el siguiente token más probable considerando el contexto.

3. **Selección del siguiente token**  
   Puede elegir la opción más probable o aplicar muestreo para diversificar resultados.

Este proceso se repite hasta formar frases completas.

### Contexto y memoria
ChatGPT considera todo el historial de la conversación dentro de una **ventana de contexto** de hasta **128.000 tokens** en GPT-4-turbo y GPT-5.  
Además:
- Mantiene coherencia a lo largo de diálogos largos.  
- Con la **memoria persistente** (2024 en adelante), puede recordar información entre sesiones, como tu nombre o preferencias de estilo.  

### Instrucciones del sistema y roles
Al iniciar una conversación, ChatGPT recibe una **instrucción oculta del sistema** (system prompt) que define su comportamiento.  
El usuario también puede personalizar estas instrucciones para ajustar el tono y estilo de las respuestas.

### Capacidad de adaptación
ChatGPT adapta su estilo al del usuario:
- Puede ser técnico, creativo, formal o coloquial.  
- Responde en el idioma y con el nivel de detalle solicitado.  

---

## Concepto de tokens

Los modelos de lenguaje procesan el texto en pequeñas unidades llamadas **tokens**.

### ¿Qué es un token?
Un *token* puede ser:
- Una palabra (`mañana`)
- Una parte de palabra (`incre`, `íble`)
- Un símbolo (`?`, `¡`)
- Un espacio

Ejemplo:  
“Hola, ¿cómo estás?” → `["Hola", ",", "¿", "cómo", "estás", "?"]`

> Regla práctica: **1 token ≈ 4 caracteres en inglés** (en español suele ser un poco más).

### ¿Para qué sirven los tokens?
- El modelo no analiza frases completas, sino secuencias de tokens.  
- Calcula probabilidades de cuál será el siguiente token.  
- Tanto la entrada del usuario como la salida del modelo consumen tokens.

### Límite de tokens por conversación
Cada modelo tiene una **ventana de contexto**:

| Modelo              | Límite de tokens |
|---------------------|------------------|
| GPT-3.5             | 16.000           |
| GPT-4-turbo         | 128.000          |
| GPT-5               | 128.000          |

Cuando se alcanza este límite:
- ChatGPT comienza a olvidar mensajes anteriores.  
- O bien la sesión se reinicia.  

👉 Herramienta útil: [Tokenizador de OpenAI](https://platform.openai.com/tokenizer)

---

## Limitaciones y buenas prácticas

### Limitaciones del modelo
- **Alucinaciones:** puede inventar información.  
- **Sesgos:** refleja prejuicios de los datos de entrenamiento.  
- **Dependencia de contexto:** si el prompt es vago, la respuesta puede ser poco útil.  
- **Conexión a internet limitada:** la búsqueda integrada mejora esto, pero no siempre garantiza fuentes confiables.  

### Buenas prácticas para interactuar
- **Validar la información técnica** con fuentes oficiales.  
- **Dar contexto claro** en los prompts.  
- **Dividir textos largos** en partes manejables.  
- **Combinar ChatGPT con otras herramientas** para obtener resultados más robustos.  

---

[Inicio](./README.md) | [Anterior (2. Markdown)](./1-Markdown.md) | [Próximo (4. Ingeniería de Prompts)](./3-IngPrompts.md)