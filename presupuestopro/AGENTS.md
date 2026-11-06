# AGENTS.md — PresupuestosPro

Herramienta web (solo navegador, sin servidor) para que freelancers generen presupuestos en PDF.
Estas reglas resumen `.specify/memory/constitution.md` (v1.0.0), que prevalece sobre cualquier otra práctica.

## Principios obligatorios

1. **Simplicidad ante todo**: entre dos soluciones, la más simple. Prohibida la complejidad anticipada (extras "por si acaso", capas o configuraciones no pedidas).
2. **Idioma y mercado**: todo (pantallas, mensajes, PDF, documentación) en español de Ecuador; moneda en dólares (USD) con formato claro para Ecuador.
3. **Cero alcance fantasma**: no implementar nada que no esté en la spec. Las ideas nuevas se proponen y se agregan a la spec primero.
4. **Verificable por una persona no técnica**: cada criterio de éxito debe poder comprobarse usando la app, sin leer código.
5. **Datos del usuario con respeto**: pedir solo los datos imprescindibles; nunca escribir claves, contraseñas ni secretos en el código.

## Forma de trabajo (Spec Kit)

- Flujo: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- Toda funcionalidad nueva pasa primero por la spec, nunca directo al código.
- Las specs viven en `specs/NNN-nombre/` (001 PDF, 002 diseño UI, 003 guardar/consultar presupuestos); la feature activa está en `.specify/feature.json`.
- Antes de dar una entrega por terminada, revisarla contra los cinco principios.
- Las specs describen el QUÉ y el POR QUÉ; los detalles técnicos van en el plan.
- Enmiendas a la constitution: versionadas (MAJOR/MINOR/PATCH) y documentadas.

## Decisiones vigentes de la spec 003

- Los presupuestos guardados viven en **SQLite en modo memoria, dentro del navegador** (sin servidor ni archivo en disco); se pierden al cerrar o recargar y la app lo advierte.
- Numeración AAAA-NNN: se muestra al abrir la pantalla, pero solo se consume al guardar o descargar el PDF.
- Los guardados son de solo lectura (sin edición) y conservan una copia de los datos al guardar.

## Código

- Stack: JavaScript (ES modules), `jspdf` para el PDF, pruebas con Vitest (`npm test`).
- Estructura: `src/` (código y `ui/`, `vendor/`), `tests/unit/`, `index.html`.
- Ejecutar `npm test` antes de dar un cambio por terminado.
