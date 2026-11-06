---

description: "Lista de tareas: Presupuestos PDF para Freelancer"
---

# Tasks: Presupuestos PDF para Freelancer

**Input**: Documentos de diseño en `/specs/001-presupuesto-pdf-freelancer/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-and-pdf.md, quickstart.md

**Tests**: El plan (research.md) exige pruebas Vitest solo para cálculo y numeración; la UI y el PDF se validan con quickstart.md.

**Organization**: Tareas agrupadas por historia de usuario. Todos los textos de pantalla y PDF en español de Ecuador, importes en USD.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede ejecutar en paralelo (archivos distintos, sin dependencias)
- **[Story]**: Historia de usuario (US1..US5)

## Phase 1: Setup

- [X] T001 Crear la estructura `index.html`, `src/`, `src/ui/`, `tests/unit/` según plan.md
- [X] T002 Crear `package.json` (type module) con Vitest como devDependency y script `"test": "vitest run"`; agregar jsPDF como dependencia (copia local en `src/vendor/jspdf.umd.min.js` para uso offline)
- [X] T003 [P] Crear `index.html` con navegación de 4 pantallas (Negocio, Servicios, Clientes, Presupuesto) en español y `<script type="module" src="src/main.js">`

---

## Phase 2: Foundational (bloquea todas las historias)

- [X] T004 Implementar `src/storage.js`: funciones `leer(clave, porDefecto)` y `guardar(clave, valor)` sobre localStorage con JSON; claves `negocio`, `servicios`, `clientes`, `contador`
- [X] T005 [P] Implementar utilidades de formato en `src/formato.js`: centavos → "$1,234.56" (punto decimal, igual que spec y quickstart) y generador de ids únicos
- [X] T006 Implementar `src/main.js`: arranque y cambio de pantalla; cada pantalla expone `montar(contenedor)` desde `src/ui/`

**Checkpoint**: base lista; las historias pueden empezar.

---

## Phase 3: User Story 1 - Configurar mis datos de negocio (Priority: P1) 🎯 MVP

**Goal**: Guardar, editar y eliminar los datos del freelancer de forma persistente.

**Independent Test**: Ingresar datos, recargar la página y verlos; editarlos; eliminarlos y ver el formulario vacío.

- [X] T007 [US1] Crear `src/ui/negocio.js` con formulario: identificacion (obligatorio, RUC), nombre (obligatorio), logo (opcional, imagen en base64 con tamaño máximo 500 KB y mensaje en español si se excede), contacto (obligatorio), direccion (obligatorio)
- [X] T008 [US1] En `src/ui/negocio.js` agregar campos `ivaPorTipo` `{ ruc: 15, cedula: 15 }` (porcentajes ≥ 0, configurables) guardados con el negocio
- [X] T009 [US1] En `src/ui/negocio.js` implementar guardar/editar y botón Eliminar (vuelve al formulario vacío, mensaje "Complete los datos de su negocio") usando `src/storage.js`

**Checkpoint**: US1 funcional por sí sola.

---

## Phase 4: User Story 2 - Gestionar mis servicios (Priority: P1)

**Goal**: Crear, actualizar y eliminar servicios con precio por hora.

**Independent Test**: Crear Análisis $20, editar el precio, eliminarlo.

- [X] T010 [P] [US2] Crear `src/ui/servicios.js` con lista y formulario: nombre (obligatorio), precioHora (decimal USD, > 0, con validación y mensaje en español)
- [X] T011 [US2] En `src/ui/servicios.js` implementar crear, editar precio y eliminar, persistiendo con `src/storage.js` (clave `servicios`)

**Checkpoint**: US2 funcional por sí sola.

---

## Phase 5: User Story 3 - Gestionar mis clientes (Priority: P1)

**Goal**: Crear, editar y eliminar clientes con tipo RUC/cédula.

**Independent Test**: Crear cliente solo con nombre → queda RUC 999999999; editar a cédula; eliminar.

- [X] T012 [P] [US3] Crear `src/ui/clientes.js` con lista y formulario: nombre (obligatorio), tipo ("ruc" | "cedula", por defecto "ruc"), identificacion (por defecto "999999999")
- [X] T013 [US3] En `src/ui/clientes.js` implementar crear (aplicando los valores por defecto cuando se omiten), editar y eliminar, persistiendo con `src/storage.js` (clave `clientes`)

**Checkpoint**: US3 funcional por sí sola.

---

## Phase 6: User Story 4 - Armar presupuesto con totales automáticos (Priority: P1)

**Goal**: Elegir cliente, agregar servicios, editar horas y ver base, IVA, retención y total.

**Independent Test**: Cliente RUC con tres líneas de $160 → Base $480.00, IVA $72.00, Retención $33.60, Total $585.60; cliente cédula → Retención $0.00.

### Tests

- [X] T014 [P] [US4] Crear `tests/unit/calculo.test.js`: ejemplo de 3 líneas de $160 con RUC → base 48000, iva 7200, retención 3360, total 58560 (centavos); cédula → retención 0; redondeo siempre hacia arriba al centavo (p. ej. 1.25 h × $10.01); caso de coma flotante 1.1 h × $30 = 3300 sin sumar un centavo de más; IVA tomado de `ivaPorTipo`

### Implementation

- [X] T015 [US4] Implementar `src/calculo.js`: función pura `calcular({ lineas:[{precioHora, horas}], tipoCliente, ivaPorTipo })` → `{ subtotales, base, iva, retencion, total }` en centavos enteros, usando solo aritmética entera (horas en centésimas, porcentajes en puntos básicos; sin `Math.ceil` sobre productos con coma flotante): subtotal = ceil(precioCentavos × horasCentésimas / 100); base = suma de subtotales; iva = ceil(base × ivaPorTipo[tipo]×100 / 10000); retencion = ceil(base × 700 / 10000) si tipo "ruc", 0 si "cedula"; total = base + iva + retencion (hacer pasar T014)
- [X] T016 [US4] Crear `src/ui/presupuesto.js`: selector de cliente, agregar servicios desde la lista, campo horas por línea (> 0, máximo 2 decimales; mensaje "Las horas deben ser mayores a 0"), quitar línea
- [X] T017 [US4] En `src/ui/presupuesto.js` mostrar base, IVA, retención y total recalculados al instante con `src/calculo.js` y formato USD de `src/formato.js`
- [X] T018 [US4] En `src/ui/presupuesto.js` bloquear la generación sin cliente o sin servicios con el mensaje "Agregue al menos un servicio"

**Checkpoint**: US4 funcional con US2 y US3 ya implementadas.

---

## Phase 7: User Story 5 - Descargar el presupuesto en PDF (Priority: P1)

**Goal**: Descargar un PDF numerado AAAA-NNN con toda la información y validez de 30 días.

**Independent Test**: Descargar PDF → 2026-001; otro → 2026-002; con fecha de 2027 → 2027-001.

### Tests

- [X] T019 [P] [US5] Crear `tests/unit/numeracion.test.js`: primer número del año "2026-001", siguiente "2026-002", cambio a 2027 → "2027-001", 3 dígitos mínimo

### Implementation

- [X] T020 [US5] Implementar `src/numeracion.js`: `siguienteNumero(contador, fecha)` devuelve `{ numero, contador }` usando el contador `{ "AAAA": ultimo }` (hacer pasar T019)
- [X] T021 [US5] Implementar `src/pdf.js` con jsPDF según contracts/ui-and-pdf.md: logo, nombre, identificación, contacto y dirección del freelancer; número y fecha de emisión; datos del cliente; tabla servicio/precio-hora/horas/subtotal; base, IVA, retención y total en USD; leyenda "Válido por 30 días"
- [X] T022 [US5] En `src/ui/presupuesto.js` agregar botón "Descargar PDF": exigir negocio configurado (mensaje "Complete los datos de su negocio antes de descargar"), copiar datos de cliente y líneas al emitir, obtener número con `src/numeracion.js`, guardar el contador en `src/storage.js` solo al generar el PDF y descargar el archivo `Presupuesto-AAAA-NNN.pdf`

**Checkpoint**: flujo completo de extremo a extremo.

---

## Phase 8: Polish

- [X] T023 Ejecutar `npm test` y corregir fallos
- [ ] T024 Ejecutar la validación manual de `specs/001-presupuesto-pdf-freelancer/quickstart.md` (pasos 1–9) y corregir diferencias
- [X] T025 [P] Revisar que no haya textos en otro idioma, ni cuentas, contraseñas, logins o conexiones a la nube (constitución y FR-013)

---

## Dependencies & Execution Order

- Setup → Foundational → historias → Polish.
- US1, US2, US3 son independientes entre sí (tras Foundational).
- US4 usa los servicios (US2), clientes (US3) y `ivaPorTipo` (US1); se puede probar con datos de ejemplo.
- US5 depende de US4 y de US1 (datos del emisor).
- Dentro de cada historia: pruebas → lógica → UI.

### Parallel Opportunities

- T003 con T002; T005 con T004.
- T010, T012 y T007 en paralelo (archivos distintos).
- T014 y T019 en paralelo con la UI.

## Implementation Strategy

1. MVP: Setup + Foundational + US1 (configuración persistente del negocio).
2. Agregar US2 y US3, luego US4 (cálculo) y US5 (PDF) para el valor completo del producto.
3. Validar cada checkpoint con su Independent Test antes de seguir.
