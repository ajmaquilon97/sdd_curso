# Research: Presupuestos PDF para Freelancer

## Plataforma
- **Decision**: Web estática (HTML + JavaScript puro).
- **Rationale**: La constitución define "herramienta web"; sin cuentas ni nube, no se necesita servidor. Es lo más simple.
- **Alternatives**: Framework (React/Vue) y backend propio: rechazados por complejidad anticipada.

## Persistencia
- **Decision**: localStorage con JSON; logo en base64 (se limita su tamaño, p. ej. 500 KB).
- **Rationale**: Persiste entre sesiones, sin infraestructura, cumple FR-001 y SC-003.
- **Alternatives**: IndexedDB (innecesario a esta escala); archivos exportables (fuera de alcance).

## Generación de PDF
- **Decision**: jsPDF en el navegador.
- **Rationale**: Funciona offline, soporta imágenes (logo) y texto en español.
- **Alternatives**: Impresión del navegador a PDF (resultado menos controlable); PDF en servidor (requiere backend).

## Dinero y redondeo
- **Decision**: Calcular en centavos enteros. Cada importe (subtotal de línea, IVA, retención) se redondea hacia arriba (`ceil`) al centavo; el total es la suma de importes ya redondeados.
- **Rationale**: Evita errores de coma flotante; cumple FR-009 y que el PDF cuadre sumando.
- **Alternatives**: Decimales flotantes: imprecisos.

## Numeración
- **Decision**: Guardar el último consecutivo por año; al emitir, `AAAA-` + (último+1) con 3 dígitos mínimo. El año se toma de la fecha de emisión.
- **Rationale**: Cumple FR-011 y reinicio anual. El número se consume al descargar el PDF, para no dejar saltos por presupuestos no emitidos.
- **Alternatives**: Contar presupuestos guardados (requeriría historial, fuera de alcance).

## IVA configurable por tipo de cliente
- **Decision**: Tabla simple de porcentajes de IVA por tipo (RUC, cédula), ambos 15 % por defecto, editable en la pantalla de Negocio.
- **Rationale**: FR-006 pide configurable sin sobreconstruir.
- **Alternatives**: IVA por cliente individual: más complejo, no pedido.

## Pruebas
- **Decision**: Vitest para cálculo y numeración; quickstart manual para UI/PDF.
- **Rationale**: La lógica monetaria es la de mayor riesgo y es automatizable.

Sin elementos NEEDS CLARIFICATION pendientes.
