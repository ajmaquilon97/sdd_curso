---

description: "Lista de tareas para guardar y consultar presupuestos"
---

# Tasks: Guardar y consultar presupuestos

**Input**: `specs/003-guardar-consultar-presupuestos/` (spec.md, plan.md, research.md, data-model.md, contracts/ui-y-datos.md, quickstart.md)

**Prerequisites**: plan.md, spec.md (con las aclaraciones del 2026-11-02)

**Tests**: Solo se incluye `tests/unit/db.test.js`, previsto en plan.md. La UI se valida con quickstart.md.

**Regla vigente (spec, 2026-11-02)**: el número AAAA-NNN se consume **solo al guardar**; **Descargar PDF queda bloqueado hasta que el presupuesto esté guardado**. Donde plan.md, data-model.md, contracts o quickstart digan que descargar consume número, manda la spec (ver T003).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias)
- **[Story]**: US1, US2, US3
- Todos los textos de pantalla en español de Ecuador; importes en centavos enteros y mostrados en USD con `src/formato.js`

---

## Phase 1: Setup

**Purpose**: incorporar SQLite (sql.js) al proyecto, igual que `jspdf`

- [X] T001 Agregar `sql.js` (1.15.x) como dependencia de desarrollo con `npm install sql.js@1.15` en `package.json`
- [X] T002 [P] Copiar `node_modules/sql.js/dist/sql-wasm.js` y `node_modules/sql.js/dist/sql-wasm.wasm` a `src/vendor/`
- [x] T003 [P] Alinear `plan.md`, `data-model.md`, `contracts/ui-y-datos.md` y `quickstart.md` (en `specs/003-guardar-consultar-presupuestos/`) con la spec: el número se consume solo al guardar; Descargar PDF bloqueado hasta guardar; `numeroConsumido` deja de existir (basta `guardado`); agregar escenarios de fallo de base y guardado todo o nada al quickstart

---

## Phase 2: Foundational (bloquea todas las historias)

**Purpose**: módulo de datos y arranque de la base

- [X] T004 Crear `src/db.js` con `crearBase(SQL)`: `new SQL.Database()`, `PRAGMA foreign_keys = ON` y el esquema de `data-model.md` (tablas `presupuestos` y `lineas`; `numero` TEXT UNIQUE NOT NULL; `fecha` ISO `AAAA-MM-DD`; `creado_en` INTEGER NOT NULL; `cliente_tipo` `ruc` | `cedula`; `cliente_busqueda` nombre en minúsculas y sin tildes; `lineas.presupuesto_id` FK con `ON DELETE CASCADE`; `horas` REAL > 0, máx. 2 decimales; importes en centavos enteros)
- [X] T005 En `index.html` cargar `src/vendor/sql-wasm.js` antes de `src/main.js`, y agregar el botón "Guardados" a la navegación y el contenedor de la pantalla nueva
- [X] T006 En `src/main.js` iniciar la base una sola vez al abrir la app (`initSqlJs({ locateFile: () => "src/vendor/sql-wasm.wasm" })` + `crearBase`), exponerla a las pantallas y, si falla, mostrar un aviso claro en español y deshabilitar guardar, descargar PDF y la pantalla Guardados (spec Edge Cases)

**Checkpoint**: la app abre con la base lista o con el aviso de fallo.

---

## Phase 3: User Story 1 - Guardar un presupuesto (Priority: P1) 🎯 MVP

**Goal**: guardar un presupuesto con su número, copia de cliente, líneas y totales; descargar PDF solo si ya está guardado.

**Independent Test**: armar un presupuesto, pulsar Guardar y ver "Presupuesto AAAA-NNN guardado"; Guardar de nuevo avisa que ya está guardado; sin cliente o sin servicios explica qué falta.

### Tests for User Story 1

- [X] T007 [P] [US1] Crear `tests/unit/db.test.js` con `sql.js` en Node: guardar devuelve `{ ok: true, id }`; `sin-cliente`, `sin-lineas` y `duplicado` devuelven `{ ok: false, motivo }`; el guardado es todo o nada (si falla insertar una línea no queda presupuesto parcial); `obtenerPresupuesto` conserva los valores guardados

### Implementation for User Story 1

- [X] T008 [US1] En `src/db.js` implementar `guardarPresupuesto(db, p)` y `obtenerPresupuesto(db, id)` según `contracts/ui-y-datos.md`: valida cliente y al menos una línea, inserta presupuesto y líneas en una sola transacción con `ROLLBACK` ante cualquier error, y rechaza `numero` repetido como `duplicado`
- [X] T009 [US1] En `src/ui/presupuesto.js` mostrar el número AAAA-NNN al abrir la pantalla sin consumirlo (usar `src/numeracion.js` solo para leer el siguiente número)
- [X] T010 [US1] En `src/ui/presupuesto.js` agregar el botón **Guardar**: deshabilitado sin líneas; sin cliente o sin servicios muestra qué falta; al guardar consume el número (`src/numeracion.js`), confirma "Presupuesto AAAA-NNN guardado" y marca el borrador como guardado; si ya estaba guardado avisa "Este presupuesto ya está guardado" sin duplicar; si el guardado falla, muestra el error, no consume el número y permite reintentar con los datos intactos
- [X] T011 [US1] En `src/ui/presupuesto.js` bloquear **Descargar PDF** mientras el presupuesto no esté guardado, con un mensaje que explique que primero debe guardarse; una vez guardado, descargar usa el mismo número sin consumir otro
- [X] T012 [US1] En `src/ui/presupuesto.js` mostrar el aviso permanente "Los presupuestos guardados se pierden al cerrar o recargar la página."

**Checkpoint**: US1 funciona sola (quickstart escenarios 1, 2, 3 y 6).

---

## Phase 4: User Story 2 - Consultar presupuestos guardados (Priority: P1)

**Goal**: ver la lista (más reciente primero) y abrir el detalle completo.

**Independent Test**: guardar dos presupuestos, abrir Guardados, ver ambos del más reciente al más antiguo y comprobar que el detalle coincide con lo guardado; sin guardados se ve el mensaje de vacío.

### Tests for User Story 2

- [X] T013 [P] [US2] En `tests/unit/db.test.js` agregar pruebas de `listarPresupuestos` (orden del más reciente al más antiguo por `creado_en`, con desempate estable) y de `obtenerPresupuesto` (devuelve `null` si no existe, líneas en su `posicion` original)

### Implementation for User Story 2

- [X] T014 [US2] En `src/db.js` implementar `listarPresupuestos(db)` (filas `{ id, numero, fecha, clienteNombre, total }`, más reciente primero)
- [X] T015 [US2] Crear `src/ui/guardados.js` con la lista (número, cliente, fecha, total en USD con `src/formato.js`), el mensaje "Aún no hay presupuestos guardados." y el aviso permanente de datos temporales
- [X] T016 [US2] En `src/ui/guardados.js` agregar el detalle: cliente, líneas (servicio, precio/hora, horas, subtotal) y totales (base, IVA, retención, total), con los mismos importes guardados, y la forma de volver a la lista
- [X] T017 [US2] En `src/main.js` registrar la pantalla "guardados" y conectarla al botón de navegación de T005

**Checkpoint**: US1 + US2 funcionan (quickstart escenario 4 y 7).

---

## Phase 5: User Story 3 - Buscar y eliminar guardados (Priority: P2)

**Goal**: filtrar por cliente o número y eliminar con confirmación.

**Independent Test**: con tres guardados, buscar por cliente muestra solo coincidentes; eliminar con confirmar lo quita, con cancelar lo conserva.

### Tests for User Story 3

- [X] T018 [P] [US3] En `tests/unit/db.test.js` agregar pruebas del filtro por cliente o número sin distinguir mayúsculas ni tildes ("ÁLVAREZ" = "alvarez"), filtro vacío o con solo espacios devuelve todo, y de `eliminarPresupuesto` (borra también sus líneas; devuelve `true` si existía, `false` si no)

### Implementation for User Story 3

- [X] T019 [US3] En `src/db.js` agregar el filtro opcional a `listarPresupuestos(db, filtro?)` (coincidencia parcial en `cliente_busqueda` o `numero`, normalizando el texto a minúsculas y sin tildes) e implementar `eliminarPresupuesto(db, id)`
- [X] T020 [US3] En `src/ui/guardados.js` agregar el campo de búsqueda con resultados al escribir y el mensaje "No hay resultados." cuando no hay coincidencias
- [X] T021 [US3] En `src/ui/guardados.js` agregar Eliminar con `window.confirm` previo: confirmar quita el registro y actualiza la lista (y vuelve a la lista si estaba abierto el detalle); cancelar lo conserva; el número eliminado no se reutiliza

**Checkpoint**: las tres historias funcionan (quickstart escenario 5).

---

## Phase 6: Polish & Cross-Cutting

- [X] T022 [P] Agregar en `src/estilos.css` los estilos de la pantalla Guardados y de los avisos, coherentes con el diseño de la spec 002 y legibles desde 360 px
- [X] T023 Ejecutar `npm test` y corregir fallos
- [ ] T024 Recorrer `specs/003-guardar-consultar-presupuestos/quickstart.md` en el navegador (incluido el fallo de base y el guardado todo o nada) y revisar la entrega contra los cinco principios de la constitution

---

## Dependencies & Execution Order

- **Setup (T001–T003)**: T002 depende de T001; T003 es independiente.
- **Foundational (T004–T006)**: depende de T002; T005 y T006 dependen de T004. Bloquea las historias.
- **US1 (T007–T012)**: tras Foundational. T008 antes de T010; T009–T012 tocan `src/ui/presupuesto.js` y van en orden.
- **US2 (T013–T017)**: tras Foundational; usa datos guardados por US1 para la prueba manual, pero el código es independiente.
- **US3 (T018–T021)**: tras US2 (extiende `listarPresupuestos` y `guardados.js`).
- **Polish (T022–T024)**: al final.

## Parallel Opportunities

- T002 y T003 juntos tras T001.
- T007 (pruebas US1) en paralelo con T009 una vez creado T004.
- T013 (pruebas US2) en paralelo con T014–T016.
- T022 en paralelo con cualquier tarea de UI ya terminada.

## Implementation Strategy

### MVP (solo US1)
1. Setup + Foundational.
2. US1 completa.
3. **Parar y validar** con quickstart 1, 2, 3 y 6.

### Entrega incremental
1. Agregar US2 → validar → listo para demostrar.
2. Agregar US3 → validar.
3. Polish y revisión final contra los cinco principios.

## Notes

- No tocar `src/calculo.js`, `src/pdf.js` ni `src/storage.js` (plan.md, Constraints), salvo lo mínimo de `numeracion.js` para ofrecer el número sin consumirlo.
- Sin edición de guardados, persistencia permanente, cuentas ni nube (FR-011).
- Confirmar cada tarea con un commit pequeño al terminar.
