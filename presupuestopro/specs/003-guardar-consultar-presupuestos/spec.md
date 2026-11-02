# Feature Specification: Guardar y consultar presupuestos

**Feature Branch**: `003-guardar-consultar-presupuestos`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "bien, necesitamos ahora que el diseno de los presupuestos se puedan guardar en una base en memoria, y puedan ser consultados."

## Clarifications

### Session 2026-10-31

- Q: ¿El número AAAA-NNN se asigna al guardar o al descargar el PDF? → A: Se muestra al abrir la pantalla del presupuesto, pero solo se consume al hacer clic en guardar; (ajustado el 2026-11-02: descargar el PDF exige haber guardado antes).

### Session 2026-11-01

- Q: ¿Con qué tecnología se configura la memoria temporal (base en memoria)? → A: Con SQLite en modo memoria; sigue siendo temporal (se pierde al cerrar o recargar la app).
- Q: ¿Dónde se ejecuta la base SQLite en memoria? → A: Dentro del navegador, sin servidor; recargar o cerrar la página descarta los datos.

### Session 2026-11-02

- Q: Si se descarga el PDF sin haber guardado, ¿qué pasa con el número consumido? → A: Se bloquea la descarga hasta que el presupuesto esté guardado; el número solo se consume al guardar.
- Q: Si la base en memoria no logra iniciarse, ¿cómo se comporta la app? → A: Aviso claro; guardar, descargar y Guardados quedan deshabilitados.
- Q: Si el guardado falla a mitad, ¿qué queda? → A: Todo o nada: no queda registro parcial, no se consume el número y se puede reintentar.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar un presupuesto (Priority: P1)

El freelancer arma un presupuesto (cliente, servicios y horas) y lo guarda para no perderlo. Queda registrado con su número AAAA-NNN, la fecha, el cliente, el detalle de líneas y los totales (base, IVA, retención y total en USD).

**Why this priority**: Sin guardar, no hay nada que consultar; es la base de la funcionalidad.

**Independent Test**: Armar un presupuesto, pulsar "Guardar" y comprobar que aparece un mensaje de confirmación y que el presupuesto figura en la lista de guardados.

**Acceptance Scenarios**:

1. **Given** un presupuesto con cliente y al menos un servicio, **When** el freelancer lo guarda, **Then** se confirma el guardado y el presupuesto aparece en la lista con su número, cliente, fecha y total.
2. **Given** un presupuesto sin cliente o sin servicios, **When** intenta guardarlo, **Then** el sistema lo impide y explica qué falta.
3. **Given** un presupuesto ya guardado, **When** el freelancer cambia luego el precio de un servicio o edita el cliente, **Then** el presupuesto guardado conserva los valores con los que se creó.

---

### User Story 2 - Consultar presupuestos guardados (Priority: P1)

El freelancer abre la lista de presupuestos guardados, ordenada del más reciente al más antiguo, y entra a cualquiera para ver su detalle completo: datos del cliente, líneas con horas y subtotales, y totales.

**Why this priority**: Es la razón de guardar: volver a revisar lo que se cotizó.

**Independent Test**: Guardar dos presupuestos, abrir la lista, verificar que ambos aparecen y que el detalle de cada uno coincide con lo guardado.

**Acceptance Scenarios**:

1. **Given** varios presupuestos guardados, **When** abre la lista, **Then** los ve del más reciente al más antiguo con número, cliente, fecha y total.
2. **Given** la lista, **When** selecciona un presupuesto, **Then** ve su detalle completo con los mismos importes calculados al guardarlo.
3. **Given** que no hay presupuestos guardados, **When** abre la lista, **Then** ve un mensaje claro indicando que aún no hay presupuestos.

---

### User Story 3 - Buscar y eliminar guardados (Priority: P2)

El freelancer filtra la lista por nombre de cliente o por número de presupuesto, y puede eliminar un presupuesto guardado que ya no necesita, con confirmación previa.

**Why this priority**: Facilita encontrar y depurar cuando la lista crece, pero no es indispensable para el valor básico.

**Independent Test**: Con tres presupuestos guardados, buscar por cliente y comprobar que solo salen los coincidentes; eliminar uno y comprobar que desaparece.

**Acceptance Scenarios**:

1. **Given** varios presupuestos, **When** escribe parte del nombre de un cliente o del número, **Then** la lista muestra solo los que coinciden.
2. **Given** una búsqueda sin coincidencias, **When** se aplica, **Then** se muestra un mensaje de "sin resultados".
3. **Given** un presupuesto guardado, **When** pide eliminarlo y confirma, **Then** deja de aparecer en la lista; si cancela, permanece.

---

### Edge Cases

- ¿Qué pasa al cerrar o recargar la app? Los presupuestos guardados en memoria se pierden; la app lo advierte de forma visible.
- ¿Qué pasa si se guarda dos veces el mismo presupuesto armado? El segundo intento no crea un duplicado: el presupuesto ya tiene su número y se avisa que ya está guardado.
- ¿Qué pasa si se descarga el PDF de un presupuesto ya guardado? Usa el mismo número, no uno nuevo.
- ¿Qué pasa si se intenta descargar el PDF sin haber guardado? Se bloquea y se indica que primero debe guardarse.
- ¿Qué pasa si la base en memoria no logra iniciarse? La app muestra un aviso claro y deshabilita guardar, descargar y Guardados.
- ¿Qué pasa si el guardado falla a mitad? Es todo o nada: no queda registro parcial, no se consume el número, se avisa el error y el usuario puede reintentar con sus datos intactos.
- ¿Qué pasa si el cliente o un servicio se elimina después de guardar? El presupuesto guardado sigue mostrándose completo.
- ¿Qué pasa con una búsqueda con mayúsculas, minúsculas o tildes distintas? Debe coincidir sin distinguirlas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar el número AAAA-NNN en la pantalla del presupuesto, consumirlo solo cuando el usuario guarda el presupuesto (sin consumirlo si abandona la pantalla), permitir guardarlo con ese número aunque no se haya descargado el PDF, y bloquear la descarga del PDF mientras el presupuesto no esté guardado (con un mensaje que lo explique), registrando además fecha, cliente, líneas (servicio, precio por hora, horas, subtotal) y totales (base, IVA, retención, total).
- **FR-002**: El sistema MUST impedir guardar un presupuesto sin cliente o sin al menos un servicio, con un mensaje en español que indique qué falta.
- **FR-003**: El presupuesto guardado MUST conservar una copia de los datos y valores al momento de guardar, sin cambiar si luego se editan o eliminan clientes o servicios.
- **FR-004**: El sistema MUST mostrar la lista de presupuestos guardados del más reciente al más antiguo, con número, cliente, fecha y total en USD.
- **FR-005**: El sistema MUST permitir abrir el detalle completo de un presupuesto guardado.
- **FR-006**: El sistema MUST permitir filtrar la lista por nombre de cliente o número, sin distinguir mayúsculas ni tildes.
- **FR-007**: El sistema MUST permitir eliminar un presupuesto guardado tras una confirmación.
- **FR-008**: El sistema MUST mostrar mensajes claros cuando no hay presupuestos guardados o la búsqueda no tiene resultados.
- **FR-009**: Los presupuestos guardados MUST mantenerse únicamente mientras la app esté abierta y MUST NOT persistir tras cerrarla o recargarla; la app MUST advertirlo visiblemente.
- **FR-009a**: La memoria temporal donde se guardan los presupuestos MUST configurarse con SQLite en modo memoria ejecutándose dentro del navegador (sin servidor ni archivo en disco); el esquema (presupuestos y sus líneas) se crea al iniciar la app y se descarta al cerrarla o recargarla.
- **FR-010**: Todo texto e importe MUST estar en español de Ecuador y en dólares (USD), con el mismo formato de los presupuestos existentes.
- **FR-011**: Quedan fuera de alcance: editar un presupuesto guardado, persistencia permanente, cuentas, inicios de sesión y conexión a la nube.

### Key Entities *(include if feature involves data)*

- **Presupuesto guardado**: registro inmutable con número AAAA-NNN, fecha, copia del cliente (nombre, tipo e identificación), líneas y totales.
- **Línea de presupuesto**: servicio, precio por hora, horas y subtotal; pertenece a un presupuesto guardado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un freelancer guarda un presupuesto ya armado en un solo paso, en menos de 5 segundos.
- **SC-002**: El 100 % de los presupuestos guardados aparecen en la lista y su detalle coincide exactamente con lo guardado (mismos importes).
- **SC-003**: Con hasta 100 presupuestos guardados, la búsqueda muestra resultados al instante (menos de 1 segundo).
- **SC-004**: Una persona sin conocimientos técnicos encuentra y abre un presupuesto guardado en menos de 30 segundos, sin ayuda.
- **SC-005**: El 100 % de las veces la app advierte que los datos se perderán al cerrarla.

## Assumptions

- "Base en memoria" significa que los datos viven solo mientras la app está abierta; se pierden al cerrarla o recargarla (confirmado por FR-009). Esa memoria temporal se implementa con SQLite en modo memoria (FR-009a), sin persistencia en disco.
- Se reutiliza la numeración AAAA-NNN existente; cada presupuesto recibe un único número, que se muestra en pantalla desde el inicio pero solo se consume cuando el usuario guarda el presupuesto (la descarga del PDF exige haberlo guardado). Si abandona la pantalla sin guardar, el número no se consume y se vuelve a ofrecer.
- Los guardados son de solo lectura: no se editan (principio de cero alcance fantasma).
- Un único usuario (el freelancer); sin cuentas ni nube, coherente con la spec 001.
- Depende de la spec 001 (cálculo de totales y clientes/servicios) y de la 002 (diseño de la interfaz).
