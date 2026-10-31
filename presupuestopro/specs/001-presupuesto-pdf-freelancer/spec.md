# Feature Specification: Presupuestos PDF para Freelancer

**Feature Branch**: `001-presupuesto-pdf-freelancer`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "Elaborar un presupuesto/cotización automáticamente a partir de la configuración del freelancer (datos del negocio, servicios, clientes), calcular base, IVA, retención y total, y descargar un PDF numerado YYYY-001 con validez de 30 días."

## Clarifications

### Session 2026-10-31

- Q: ¿Cómo se calcula la retención? → A: Por tipo de cliente (RUC 7 %, cédula 0 %).
- Q: ¿Cuál es la retención correcta del ejemplo? → A: 7 % de $480 = $33.60; total $585.60.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurar mis datos de negocio (Priority: P1)

El freelancer registra una sola vez su identificación (RUC), nombre o marca, logo, medios de contacto y dirección. Estos datos permanecen guardados y se usan en todos los presupuestos.

**Why this priority**: Sin datos del emisor el presupuesto no sale con su marca; es base del documento.

**Independent Test**: Ingresar los datos, cerrar y reabrir la app, y comprobar que siguen ahí; editarlos y eliminarlos.

**Acceptance Scenarios**:

1. **Given** no hay datos de negocio, **When** el freelancer los ingresa y guarda, **Then** quedan persistidos y visibles al reabrir la app.
2. **Given** datos guardados, **When** los edita, **Then** los cambios se reflejan en nuevos presupuestos.
3. **Given** datos guardados, **When** los elimina, **Then** la app vuelve a mostrar el formulario vacío.

---

### User Story 2 - Gestionar mis servicios (Priority: P1)

El freelancer mantiene una lista de servicios con su precio habitual por hora (p. ej. Análisis $20/h, Diseño $40/h, Desarrollo $80/h, Implementación $120/h), pudiendo crear, actualizar y eliminar.

**Why this priority**: Los servicios son la materia prima del cálculo.

**Independent Test**: Crear, editar el precio y eliminar un servicio, verificando la lista en cada paso.

**Acceptance Scenarios**:

1. **Given** la lista vacía, **When** agrega "Análisis" a $20/hora, **Then** aparece en la lista.
2. **Given** un servicio existente, **When** cambia su precio, **Then** la lista muestra el nuevo precio.
3. **Given** un servicio existente, **When** lo elimina, **Then** deja de aparecer para nuevos presupuestos.

---

### User Story 3 - Gestionar mis clientes (Priority: P1)

El freelancer mantiene una lista de clientes (crear, editar, eliminar). Cada cliente tiene un tipo de identificación (RUC o cédula); por defecto un cliente nuevo se considera con RUC y el valor por defecto 999999999.

**Why this priority**: El tipo de cliente determina la retención y el IVA aplicable.

**Independent Test**: Crear un cliente sin indicar identificación y verificar que queda con RUC 999999999; editarlo y eliminarlo.

**Acceptance Scenarios**:

1. **Given** el formulario de nuevo cliente, **When** solo ingresa el nombre, **Then** el cliente queda como tipo RUC con identificación 999999999.
2. **Given** un cliente existente, **When** cambia su tipo a cédula, **Then** se guarda el cambio.
3. **Given** un cliente existente, **When** lo elimina, **Then** deja de estar disponible para nuevos presupuestos.

---

### User Story 4 - Armar presupuesto con totales automáticos (Priority: P1)

El freelancer elige un cliente, agrega servicios al presupuesto, edita las horas de cada uno y ve automáticamente la base imponible, el IVA, la retención (según tipo de cliente) y el total.

**Why this priority**: Es el valor central: cotizar de inmediato.

**Independent Test**: Armar tres líneas de $160 con un cliente RUC y comprobar Base $480.00, IVA $72.00, Retención $33.60 y Total $585.60.

**Acceptance Scenarios**:

1. **Given** un cliente con RUC y tres líneas de $160 cada una, **When** se calcula, **Then** Base = $480.00, IVA = $72.00, Retención = $33.60 y Total = $585.60.
2. **Given** un servicio agregado, **When** el freelancer edita las horas, **Then** el subtotal de la línea (precio por hora × horas) y todos los totales se recalculan al instante.
3. **Given** un cliente con cédula, **When** se calcula, **Then** la retención es $0.00.
4. **Given** un presupuesto sin servicios, **When** el freelancer intenta generarlo, **Then** la app lo impide e indica que debe agregar al menos un servicio.

---

### User Story 5 - Descargar el presupuesto en PDF (Priority: P1)

El freelancer descarga un PDF con la marca del freelancer, datos del cliente, detalle de servicios (precio/hora, horas, subtotal), base, IVA, retención, total, número de presupuesto y la leyenda de validez de 30 días.

**Why this priority**: El éxito de la app es entregar este documento al cliente.

**Independent Test**: Generar un presupuesto, descargar el PDF y verificar su contenido y numeración.

**Acceptance Scenarios**:

1. **Given** un presupuesto completo, **When** lo descarga, **Then** el PDF contiene logo, datos del freelancer, datos del cliente, líneas, totales y "Válido por 30 días".
2. **Given** que es el primer presupuesto de 2026, **When** se emite, **Then** su número es 2026-001 y el siguiente es 2026-002.
3. **Given** presupuestos emitidos en 2026, **When** se emite el primero de 2027, **Then** su número es 2027-001.

---

### Edge Cases

- Todos los importes se redondean siempre hacia arriba al centavo.
- Horas en cero, negativas o vacías: no se permiten. Las horas pueden ser decimales (hasta 2 decimales).
- Cliente eliminado después de emitir presupuestos: los PDF ya emitidos no cambian.
- Freelancer sin datos de negocio configurados: la app indica que debe completarlos antes de descargar.
- Servicio o cliente eliminado no afecta la numeración ya emitida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir registrar, editar, eliminar y persistir los datos del freelancer: identificación/RUC, nombre o marca, logo (máximo 500 KB), medios de contacto y dirección.
- **FR-002**: El sistema MUST permitir crear, actualizar y eliminar servicios con nombre y precio por hora.
- **FR-003**: El sistema MUST permitir crear, editar y eliminar clientes con tipo de identificación (RUC o cédula); por defecto un cliente nuevo es RUC con identificación 999999999.
- **FR-004**: El sistema MUST permitir elegir un cliente, agregar servicios y editar las horas de cada servicio en el presupuesto, y quitar un servicio del presupuesto.
- **FR-005**: El subtotal de cada línea MUST ser precio por hora × horas; la base MUST ser la suma de los subtotales.
- **FR-006**: El IVA MUST ser Base × porcentaje de IVA configurable por tipo de cliente; el valor vigente es 15 %.
- **FR-007**: La retención MUST calcularse según el tipo de cliente: RUC 7 % de la base; cédula no se retiene.
- **FR-008**: El total MUST ser Base + IVA + Retención.
- **FR-009**: Todos los importes calculados MUST redondearse siempre hacia arriba al centavo.
- **FR-010**: El sistema MUST generar un PDF descargable con los datos del freelancer, del cliente, el detalle, los totales y la leyenda de validez de 30 días.
- **FR-011**: Cada PDF MUST llevar numeración AAAA-NNN (p. ej. 2026-001), consecutiva y reiniciada cada año.
- **FR-012**: Todo el producto (pantallas, mensajes y PDF) MUST estar en español de Ecuador y en dólares (USD).
- **FR-013**: Quedan fuera de alcance: cuentas, contraseñas, inicios de sesión y conexiones a la nube.

### Key Entities

- **Freelancer (emisor)**: identificación/RUC, nombre o marca, logo, contactos, dirección. Uno solo.
- **Servicio**: nombre, precio por hora.
- **Cliente**: nombre, tipo de identificación (RUC/cédula), número de identificación (por defecto 999999999 con RUC).
- **Presupuesto**: número AAAA-NNN, fecha de emisión, validez 30 días, cliente, líneas, base, IVA, retención, total.
- **Línea de presupuesto**: servicio, precio por hora, horas, subtotal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un freelancer con datos ya configurados genera y descarga un presupuesto de 3 servicios en menos de 3 minutos.
- **SC-002**: Tres líneas de $160 con cliente RUC producen Base $480.00, IVA $72.00, Retención $33.60 y Total $585.60 en el 100 % de las pruebas.
- **SC-003**: Los datos del negocio, servicios y clientes siguen disponibles tras cerrar y reabrir la app.
- **SC-004**: La numeración de 10 presupuestos consecutivos no repite ni salta números, y reinicia en 001 al cambiar de año.
- **SC-005**: El 100 % de los PDF incluyen la marca del freelancer, los datos del cliente, los totales y la leyenda de 30 días.

## Assumptions

- Un solo freelancer usa la app en un solo dispositivo; los datos se guardan localmente.
- La retención depende del tipo de cliente (RUC 7 %, cédula 0), confirmado en clarificación; la regla R4 de la entrada queda reemplazada.
- El valor $2.80 del ejemplo original era un error: la retención correcta es $33.60. Las horas del ejemplo original no cuadran con $160 por línea; se toma como referencia que las tres líneas suman $480.00 y los totales siempre se calculan con FR-005 a FR-008.
- La retención se suma al total, tal como se definió en la regla de negocio.
- El IVA por tipo de cliente es configurable, con 15 % para ambos tipos por ahora.
- El redondeo hacia arriba aplica al centavo.
