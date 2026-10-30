<!--
Sync Impact Report
- Version change: (plantilla sin completar) → 1.0.0
- Principios modificados: ninguno renombrado; se definieron 5 principios nuevos
- Secciones añadidas: Reglas del Producto, Forma de Trabajo
- Secciones eliminadas: ninguna
- TODOs pendientes: ninguno
-->
# PresupuestosPro Constitution

PresupuestosPro es una herramienta web para que freelancers generen presupuestos en PDF.

## Core Principles

### I. Simplicidad ante todo
Ante dos soluciones, se elige siempre la más simple. Es una versión 1: está prohibido
construir complejidad anticipada (extras "por si acaso", capas o configuraciones que nadie
pidió).

### II. Idioma y mercado
Todo el producto (pantallas, mensajes, PDF, documentación) MUST estar en español de Ecuador.
La moneda MUST ser el dólar (USD).

### III. Cero alcance fantasma
MUST NOT implementarse ninguna funcionalidad que no esté escrita en la spec. Si surge una
idea nueva, se propone y se agrega a la spec; no se construye hasta entonces.

### IV. Verificable por una persona no técnica
Cada criterio de éxito MUST poder comprobarse usando la app, sin leer código.

### V. Datos del usuario con respeto
Se piden solo los datos imprescindibles para generar el presupuesto. Claves, contraseñas y
secretos MUST NOT escribirse en el código.

## Reglas del Producto

- Solo se admite lo definido en la spec vigente; lo demás queda fuera de alcance.
- Los importes se muestran en dólares con formato claro para Ecuador.

## Forma de Trabajo

- Toda propuesta de funcionalidad nueva pasa primero por la spec, nunca directo al código.
- Cada entrega se revisa contra los cinco principios antes de darse por terminada.

## Governance

Esta constitution prevalece sobre otras prácticas del proyecto. Las enmiendas se documentan
por escrito y se versionan: MAJOR si se elimina o redefine un principio, MINOR si se agrega
uno o se amplía materialmente, PATCH para aclaraciones. Toda revisión de spec, plan o tareas
MUST verificar el cumplimiento de los principios y justificar cualquier excepción.

**Version**: 1.0.0 | **Ratified**: 2026-10-30 | **Last Amended**: 2026-10-30
