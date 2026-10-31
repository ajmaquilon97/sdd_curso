# Tasks: Diseño profesional y navegación por barras

**Input**: `specs/002-diseno-profesional-ui/` (plan.md, spec.md, research.md, data-model.md, contracts/ui-components.md, quickstart.md)

**Tests**: No se piden pruebas nuevas (cambio solo de presentación). Se reutilizan las pruebas existentes (`npm test`) para confirmar que nada de negocio cambió (SC-005).

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [X] T001 Crear `src/estilos.css` con variables CSS (colores primario #1d4ed8, error #b91c1c, éxito #15803d, grises, espaciado, radios, sombra, fuente system-ui) y estilos base de `body`, `.contenedor`, `:focus-visible`
- [X] T002 En `index.html` reemplazar el bloque `<style>` por `<link rel="stylesheet" href="src/estilos.css">` y asegurar `lang="es-EC"` y el viewport

---

## Phase 2: Foundational

**Purpose**: Componentes compartidos que usan todas las pantallas (contrato `contracts/ui-components.md`)

- [X] T003 En `src/estilos.css` definir `.tarjeta`, `.campo` (etiqueta + control, anillo de foco azul), `.boton` con variantes `.primario`, `.secundario`, `.peligro` (y estado `:disabled`)
- [X] T004 En `src/estilos.css` definir `.tabla-contenedor` (`overflow-x:auto`) y estilo de `table` (encabezado gris, filas separadas, columna de acciones alineada a la derecha)
- [X] T005 En `src/estilos.css` definir `.mensaje.error`, `.mensaje.ok`, `.vacio`, `.campo-error` (borde rojo), `img.logo` y `.totales` con `.total` ≥ 1.5× el texto normal, negrita y color primario; `.contenedor` centrado con `max-width:960px`; estados `:hover`, `:focus-visible` y `:disabled` únicos

**Checkpoint**: la hoja de estilos cubre todos los componentes del contrato.

---

## Phase 3: User Story 1 - Navegar con una barra superior (P1) 🎯 MVP

**Goal**: Barra horizontal superior con nombre de la app y 4 secciones; la activa resaltada (FR-001, FR-002).

**Independent Test**: Desde cualquier ventana, un clic en la barra lleva a otra sección y la activa se ve resaltada (quickstart paso 1).

- [X] T006 [US1] En `index.html` reemplazar `<h1>` y `<nav>` por `<header class="barra">` con el nombre "PresupuestosPro" y `<nav id="nav">` con botones `data-p` (Negocio, Servicios, Clientes, Presupuesto) alcanzables con teclado; `<main id="app" class="contenedor">`; la app abre en Negocio
- [X] T007 [US1] En `src/estilos.css` estilizar `.barra` (fija arriba, fondo oscuro, nombre a la izquierda, enlaces a la derecha), hover y estado activo `[aria-current="page"]`
- [X] T008 [US1] En `src/main.js` actualizar `mostrar()` para fijar `aria-current="page"` en la sección activa (y quitarlo de las demás) manteniendo la clase `activo` solo si hace falta; sin cambiar la lógica de montaje

---

## Phase 4: User Story 2 - Aspecto profesional y consistente (P1)

**Goal**: Tarjetas, formularios, tablas, botones y mensajes con estilo uniforme en las 4 ventanas (FR-003..009).

**Independent Test**: Recorrer las 4 ventanas y comprobar estilo uniforme, mensajes diferenciados, total destacado y textos guía (quickstart pasos 2–5).

- [X] T009 [P] [US2] En `src/ui/negocio.js` envolver el formulario en `.tarjeta`, usar `.campo` con `<label for>`, botón Guardar `.boton.primario`, mensajes `.mensaje.ok/.error` debajo del botón, `.campo-error` en el campo inválido, y vista previa `img.logo` solo si hay logo y oculta (`onerror`) si falla la carga; sin cambiar lógica
- [X] T010 [P] [US2] En `src/ui/servicios.js` usar `.tarjeta`, `.tabla-contenedor`, acciones en última columna `.acciones`, Editar `.secundario`, Eliminar `.peligro` con `confirm()` antes de borrar, `.mensaje`, `.campo-error` y estado vacío `.vacio`: "Aún no tiene servicios. Agregue el primero con el formulario."
- [X] T011 [P] [US2] En `src/ui/clientes.js` aplicar lo mismo que T010 con el texto vacío: "Aún no tiene clientes. Agregue el primero con el formulario."
- [X] T012 [US2] En `src/ui/presupuesto.js` usar `.tarjeta`, `.campo` con `<label for>`, `.tabla-contenedor` con filas `.linea`, Quitar `.peligro` (sin confirmación), Descargar PDF `.primario` y `disabled` mientras no haya líneas, bloque `.totales` con `.total`, `.mensaje` debajo del botón y `.vacio` "Agregue servicios para calcular el presupuesto."; sin tocar cálculos ni `pdf.js`

---

## Phase 5: User Story 3 - Uso cómodo en distintos tamaños (P2)

**Goal**: Usable desde 360 px de ancho (FR-010, FR-011).

**Independent Test**: A 360 px de ancho las 4 ventanas se usan completas sin contenido cortado (quickstart pasos 6–7).

- [X] T013 [US3] En `src/estilos.css` añadir `@media (max-width: 600px)`: barra con enlaces en una fila desplazable horizontalmente, tarjetas con menor relleno, botones a ancho completo si hace falta
- [X] T014 [US3] En `src/estilos.css` asegurar que textos largos y el logo no deformen el diseño (`overflow-wrap:anywhere`, `img.logo{max-width:100%}`) y revisar los pares de color: texto normal ≥ 4.5:1, texto grande y bordes ≥ 3:1, sección activa ≥ 3:1 frente a inactivas (FR-011)

---

## Phase 6: Polish

- [X] T015 Ejecutar `npm test` y confirmar que las 7 pruebas existentes pasan (SC-005)
- [ ] T016 Servir la app (`python -m http.server 8000`) y ejecutar la validación manual de `specs/002-diseno-profesional-ui/quickstart.md`; marcar esta tarea solo si todos los pasos se cumplen
- [X] T017 Confirmar que `src/calculo.js`, `src/numeracion.js`, `src/pdf.js` y `src/storage.js` no cambiaron (`git diff --stat`) (FR-012)

---

## Dependencies & Execution Order

- Setup (T001–T002) → Foundational (T003–T005) → historias.
- US1 (T006–T008) y US2 (T009–T012) pueden hacerse en paralelo tras la fase 2; T009–T011 son [P] (archivos distintos).
- US3 (T013–T014) depende de la hoja de estilos base y de la barra (US1).
- Polish al final.

## Parallel Example

T009, T010 y T011 juntos (negocio.js, servicios.js, clientes.js).

## Implementation Strategy

- **MVP**: Setup + Foundational + US1 (barra de navegación).
- Luego US2 (aspecto), después US3 (responsive) y Polish.

## Notes

- Solo cambian clases y estructura HTML; ninguna lógica de negocio.
- Las checklists `ux.md` y `plan.md` están sin revisar; `/speckit-implement` preguntará antes de continuar.
