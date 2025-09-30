[Inicio](./README.md) | [Anterior (1. Introducción)](./0-Introduccion.md) | [Próximo (3. Fundamentos de ChatGPT)](./2-Fundamentos.md)

---

# Markdown

**Objetivo:** Introducir a los participantes en el uso básico de Markdown para estructurar y formatear texto de manera eficiente.

## Índice

- [¿Qué es Markdown?](#qué-es-markdown)

- [Sintaxis básica de Markdown](#sintaxis-básica-de-markdown)
  - [Títulos y encabezados](#títulos-y-encabezados)
  - [Listas](#listas)
  - [Negrita, cursiva y enlaces](#negrita-cursiva-y-enlaces)
  - [Bloques de código](#bloques-de-código)
  - [Tablas](#tablas)
  - [Citas y comentarios](#citas-y-comentarios)
  - [Listas de tareas](#listas-de-tareas)
  
- [Editores y plataformas](#editores-y-plataformas)
  - [Visual Studio Code (VS Code)](#visual-studio-code-vs-code)
  - [GitHub](#github)
  - [MarkItDown](#markitdown)

## ¿Qué es Markdown?

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero que permite formatear texto utilizando una sintaxis simple.

**Ventajas sobre otros editores:** es fácil de leer y escribir, y el resultado es limpio y bien estructurado.

<img src="./Imagenes/meme-word.jpeg" alt="Código QR de acceso al curso" style="height: 200px;">

**Utilidad de Markdown**  
- Creación de documentación técnica.  
- Estructuración de reportes y presentaciones.  
- Integración con plataformas como GitHub, Bitbucket, etc.
- Es el lenguaje que usa ChatGPT.

## Sintaxis básica de Markdown

**Títulos y encabezados:**

- Uso de `#` para encabezados de diferentes niveles.  
- Ejemplo:
    ```markdown
    # Título de nivel 1
    ## Título de nivel 2
    ### Título de nivel 3
    ```

**Listas:**  
- Listas numeradas y no numeradas.  
- Ejemplo:
    ```markdown
    - Elemento de lista
    - Otro elemento de lista
    1. Elemento numerado
    2. Otro elemento numerado
    ```

**Negrita, cursiva y enlaces:**
- Cómo resaltar texto, crear enlaces y agregar imágenes.  
- Ejemplo:
    ```markdown
    **Texto en negrita**
    *Texto en cursiva*
    [Enlace a un sitio web](http://example.com)
    ![Texto alternativo de la imagen](imagen.jpg)
    ```

**Bloques de código:**
- Formateo de código con comillas invertidas (backticks).  
- Ejemplo:
    ```markdown
    `Código en línea`
    ```
    ```markdown
    ```python
    print("Hola, mundo")
    ```
    ```

**Tablas:**
- Cómo crear tablas para organizar información.
- Ejemplo:
    ```markdown
    | Columna 1 | Columna 2 | Columna 3 |
    |-----------|-----------|-----------|
    | Fila 1    | Dato 1    | Dato 2    |
    | Fila 2    | Dato 3    | Dato 4    |
    ```

**Citas y comentarios:**
- Cómo agregar citas y comentarios para mayor claridad.
- Ejemplo:
    ```markdown
    > Esto es una cita.
    <!-- Esto es un comentario -->
    ```

**Listas de tareas:**
- Creación de listas de tareas con casillas de verificación.  
- Ejemplo:
    ```markdown
    - [ ] Tarea 1
    - [x] Tarea completada
    ```

En los siguientes enlaces hay más y muy completa información para aprender Markdown:
- [The Ultimate Markdown Guide](https://medium.com/analytics-vidhya/the-ultimate-markdown-guide-for-jupyter-notebook-d5e5abf728fd)
- [Basic writing and formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [Markdown Guide](https://www.markdownguide.org/)
- [Markdown Preview](https://www.digitalocean.com/community/markdown)

## Editores y plataformas

### **Visual Studio Code (VS Code)**

[Visual Studio Code](https://code.visualstudio.com/) es un editor de código fuente gratuito, liviano y altamente extensible, desarrollado por Microsoft.
Ofrece soporte para Markdown con vista previa integrada, resaltado de sintaxis, extensiones útiles como *Markdown Preview Enhanced*, y funciones que facilitan la escritura técnica y estructurada.
Es ideal para quienes desean trabajar localmente en sus archivos Markdown con mayor control y personalización.

### **GitHub**

[GitHub](https://github.com/) es una plataforma de desarrollo colaborativo basada en Git, utilizada para alojar proyectos, compartir código y gestionar versiones.
Permite renderizar archivos Markdown directamente en los repositorios, por lo que es ampliamente usado para documentar proyectos, escribir README y generar wikis.
Además, es compatible con herramientas como GitHub Pages, que permiten convertir archivos Markdown en sitios web estáticos.

### MarkItDown

**MarkItDown** es una herramienta escrita en Python que permite convertir archivos de Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF, imágenes, audio, HTML, CSV, JSON, XML y archivos ZIP a formato Markdown . Es especialmente útil para preparar documentos que se integrarán con modelos de lenguaje o flujos de trabajo de IA.

✅ **Características destacadas**

* **Amplio soporte de formatos**: Convierte documentos de Office, PDF, imágenes (con OCR), audio (con transcripción), HTML, CSV, JSON, XML y archivos comprimidos.

* **Integración con IA**: Puede utilizar modelos de lenguaje para generar descripciones de contenido, lo que facilita la preparación de datos para análisis o entrenamiento de modelos.

* **Código abierto**: Disponible en GitHub, lo que permite a los desarrolladores personalizar y mejorar la herramienta según sus necesidades.

🚀 **¿Cómo usarla?**

Para utilizar MarkItDown, necesitás tener Python instalado en tu sistema. Podés instalar la herramienta utilizando pip :

```bash
pip install markitdown
```

Luego, podés convertir un archivo ejecutando un comando similar al siguiente:

```bash
markitdown convert archivo.docx
```

Esto generará un archivo en formato Markdown con el contenido convertido.

---
[Inicio](./README.md) | [Anterior (1. Introducción)](./0-Introduccion.md) | [Próximo (3. Fundamentos de ChatGPT)](./2-Fundamentos.md)