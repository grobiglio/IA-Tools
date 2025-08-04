## 📑 CONTEXTO DEL PROYECTO
- Aeronave: **IA-100B** – Certificación Tipo (FAR 23 Emenda 64).
- Disciplina a analizar: **{{DISCIPLINA}}**  
  (ej.: Física del Vuelo, Estructuras, Sistemas, Planta de Potencia…).
- Sección normativa: **{{SUBPARTE o PÁRRAFO}}**  
  (ej.: Subparte B – Flight, §23.2400-2440, §23.1529 + Appendix A).
- Documentación adjunta / enlaces accesibles:  
  1. Plan de Certificación ANAC – IT/CERT/004/25  
  2. Plan de Certificación DIGAMC – IT/CERT/005/25  
  3. FAR 23 (link ECFR)  
  4. Docket FAA-2024-0969 – Accepted Means of Compliance  
  5. FAR/ASTM correspondiente (p.ej. F3114-22)  
  6. LCC-IA-100B (Excel editable)  

## 🎯 OBJETIVOS DEL ANÁLISIS
1. **Verificar** que los Medios de Cumplimiento (MOC) propuestos en la LCC para {{SUBPARTE}} coincidan con los listados en el Docket y las ASTM vigentes.  
2. **Identificar** todos los documentos de sustanciación requeridos para demostrar cumplimiento de {{SUBPARTE}}.  
3. **Estimar** la carga de trabajo:  
   - Horas ingeniero (h-persona) por documento.  
   - Fechas previstas de inicio y fin (asumí ~25 h/semana dedicadas al proyecto).  
4. Generar tabla resumen y recomendaciones de actualización (LCC columna Y, Doc-Sust).

## 📋 FORMATO DE RESPUESTA REQUERIDO
```markdown
### 1️⃣ Validación de MOC
| § FAR 23 | Tema | ASTM en LCC | ¿Coincide con Docket? | Observación |
|----------|------|-------------|-----------------------|-------------|
| …        | …    | …           | ✔/✖                  | …           |

### 2️⃣ Documentos de Sustanciación y Carga de Trabajo
| Código | Documento / Alcance | § FAR 23 | ASTM | Horas | Inicio | Fin |
|--------|---------------------|----------|------|-------|--------|-----|
| …      | …                   | …        | …    | … h   | dd-mmm | dd-mmm |

**Subtotal:** XX h  **Lectura normativa (común IPT):** 12 h  
**Total Disciplina {{DISCIPLINA}}:** YY h

### 3️⃣ Acciones en LCC y Doc-Sust
- Columna J “Área responsable”: …  
- Columna Y “Cambios”: …  
- Documentos cargados en hoja “Doc-Sust”.

### 4️⃣ Tiempo humano estimado para generar esta cotización
≈ 5 – 6 h de ingeniero senior (sin IA).
```

## 💡 INSTRUCCIONES ESPECIALES PARA CHATGPT
- **Idioma:** español técnico, tono ingenieril.  
- **Citas:** si tu versión permite, referenciá párrafos/líneas de los PDFs o celdas de la LCC.  
- **Asumí conocimiento previo** en FAR 23 y ASTM; no “expliques la ley”, solo valida y cotiza.  
- **Sé conciso**: no excedas 300 palabras fuera de las tablas.