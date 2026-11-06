# Feature Specification: Diseño profesional y navegación por barras

**Feature Branch**: `002-diseno-profesional-ui`

**Created**: 2026-10-31

**Status**: Draft

**Input**: User description: "El diseño de las ventanas tiene que verse profesional, la navegación entre las ventanas debe ser por barras, agreguemos estilo a los componentes." Ver también [spec de presupuestos](../001-presupuesto-pdf-freelancer/spec.md).

## Clarifications

### Session 2026-10-31

- Q: ¿Qué tipo de barra de navegación se usa? → A: Barra superior horizontal.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar entre ventanas con una barra (Priority: P1)

El freelancer ve siempre en la parte superior una barra con las cuatro secciones (Negocio, Servicios, Clientes, Presupuesto) y cambia de ventana con un clic. La sección actual queda resaltada.

**Why this priority**: Es el pedido principal y la base para moverse por la app.

**Independent Test**: Abrir la app y pasar por las cuatro secciones, comprobando que la barra sigue visible y que la sección actual está resaltada.

**Acceptance Scenarios**:

1. **Given** cualquier ventana abierta, **When** el freelancer mira la parte superior, **Then** ve la barra con las cuatro secciones y el nombre de la aplicación.
2. **Given** la ventana Servicios abierta, **When** hace clic en Presupuesto, **Then** se muestra Presupuesto y solo esa sección aparece resaltada.
3. **Given** el cursor sobre una sección, **When** se mueve sobre ella, **Then** se nota un cambio visual que indica que es pulsable.

---

### User Story 2 - Aspecto profesional y consistente (Priority: P1)

Todas las ventanas comparten un estilo uniforme y cuidado: colores, tipografía y espaciado coherentes; formularios agrupados en tarjetas; tablas ordenadas con encabezado diferenciado; botones con jerarquía clara (principal, secundario, de eliminación); mensajes de error y de éxito visibles y distinguibles; totales del presupuesto destacados.

**Why this priority**: El presupuesto representa la marca del freelancer; la app debe transmitir confianza.

**Independent Test**: Recorrer las cuatro ventanas y verificar que cada componente (campos, botones, tablas, mensajes, totales) tiene el mismo estilo en todas.

**Acceptance Scenarios**:

1. **Given** cualquier ventana, **When** se muestra un formulario, **Then** sus campos tienen etiquetas claras, espaciado uniforme y un estado visible al enfocarlos.
2. **Given** una lista de servicios o clientes, **When** se muestra la tabla, **Then** tiene encabezado diferenciado, filas separadas y acciones alineadas.
3. **Given** una acción de eliminar, **When** se ve el botón, **Then** se distingue visualmente de las acciones normales.
4. **Given** un error de validación o una acción exitosa, **When** se muestra el mensaje, **Then** el error y el éxito tienen colores distintos y son fáciles de ver.
5. **Given** el presupuesto en armado, **When** se ven los totales, **Then** el total final destaca sobre base, IVA y retención.
6. **Given** una lista vacía, **When** se abre la ventana, **Then** se muestra un texto que indica cómo empezar.

---

### User Story 3 - Uso cómodo en distintos tamaños de pantalla (Priority: P2)

La app se ve y se usa bien tanto en pantallas de computadora como en pantallas pequeñas (hasta 360 px de ancho), sin que la barra ni las tablas queden cortadas.

**Why this priority**: Mejora la comodidad, pero la app es utilizable sin esto.

**Independent Test**: Reducir el ancho de la ventana a 360 px y usar las cuatro secciones.

**Acceptance Scenarios**:

1. **Given** un ancho de 360 px, **When** se abre cualquier ventana, **Then** la barra y su contenido son accesibles sin perder opciones.
2. **Given** una tabla más ancha que la pantalla, **When** se ve en pantalla pequeña, **Then** se puede desplazar sin romper el diseño.

---

### Edge Cases

- Nombres largos de servicios o clientes no desbordan ni deforman la tabla.
- Listas con muchas filas mantienen el estilo y la legibilidad.
- Un logo grande o muy ancho no deforma el formulario del negocio.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La aplicación MUST mostrar una barra de navegación superior horizontal, visible en todas las ventanas, con las secciones Negocio, Servicios, Clientes y Presupuesto y el nombre de la aplicación.
- **FR-002**: La barra MUST resaltar la sección activa con un fondo o subrayado de color distinto (contraste ≥ 3:1 frente a las demás secciones, marcada con `aria-current`) y mostrar un cambio visual al pasar el cursor o enfocar con teclado.
- **FR-003**: Todas las ventanas MUST usar una misma paleta de colores, tipografía y escala de espaciado.
- **FR-004**: Los formularios MUST presentarse agrupados en tarjetas con etiquetas claras y un estado visible al enfocar cada campo.
- **FR-005**: Las tablas MUST tener encabezado diferenciado, filas separadas y las acciones en la última columna, alineadas a la derecha.
- **FR-006**: Los botones MUST distinguir tres niveles: principal, secundario y de eliminación.
- **FR-007**: Los mensajes de error y de éxito MUST diferenciarse por color y ubicarse directamente debajo del formulario o botón que los origina.
- **FR-008**: En el presupuesto, el total final MUST destacarse sobre base, IVA y retención con tamaño de texto ≥ 1.5 veces el normal, negrita y color primario.
- **FR-009**: Las listas vacías MUST mostrar un texto guía en español.
- **FR-010**: La app MUST ser utilizable desde 360 px de ancho; las tablas anchas se desplazan horizontalmente.
- **FR-011**: El texto normal MUST tener contraste ≥ 4.5:1 y el texto grande y los bordes de componentes ≥ 3:1 sobre el fondo.
- **FR-012**: Esta mejora MUST NOT cambiar reglas de cálculo, datos guardados ni el contenido del PDF; los textos siguen en español de Ecuador.
- **FR-013**: Todos los elementos interactivos MUST ser alcanzables con teclado en orden natural de tabulación, mostrar un foco visible y cada campo MUST tener su etiqueta asociada.
- **FR-014**: Antes de eliminar un servicio o un cliente guardado, la app MUST pedir confirmación con el diálogo del navegador; quitar una línea del presupuesto en armado no la requiere.
- **FR-015**: Los botones sin acción posible (por ejemplo, Descargar PDF sin líneas) MUST mostrarse deshabilitados con aspecto atenuado.
- **FR-016**: Un campo con error de validación MUST mostrar borde rojo además del mensaje de error.
- **FR-017**: El contenido MUST centrarse con un ancho máximo de 960 px.
- **FR-018**: Si no hay logo no se muestra vista previa ni espacio vacío; si el logo no carga, la imagen se oculta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde cualquier ventana, el freelancer llega a otra sección con un solo clic en la barra (100 % de los casos).
- **SC-002**: En el 100 % de las ventanas la sección activa se distingue de las demás por color de fondo o subrayado (FR-002), sin necesidad de leer el texto.
- **SC-003**: Un revisor no técnico confirma que campos, botones, tablas y mensajes tienen estilo uniforme en las cuatro ventanas.
- **SC-004**: Las cuatro ventanas se usan completas a 360 px de ancho sin contenido cortado.
- **SC-005**: Las pruebas de cálculo y numeración existentes siguen pasando y el PDF no cambia.

## Assumptions

- La barra es superior y horizontal (confirmado en clarificación).
- Un solo tema claro; no se incluye modo oscuro ni animaciones elaboradas.
- No se agregan funciones nuevas: solo cambia la presentación.
- Se mantienen las cuatro ventanas existentes.
- Navegadores soportados: versiones recientes de Chrome, Edge y Firefox.
- Sin fuentes, íconos ni librerías externas: la app sigue funcionando sin internet.
- Los estados hover, foco y deshabilitado se definen una sola vez y aplican igual a barra, botones y campos.
- La app abre en Negocio y la sección activa se actualiza en cada cambio de ventana.
