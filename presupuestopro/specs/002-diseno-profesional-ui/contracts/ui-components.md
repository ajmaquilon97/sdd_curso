# Contrato de componentes de interfaz

## Estructura de página
`<header class="barra">` (nombre de la app + `<nav>` con 4 enlaces) → `<main class="contenedor">` con una o más `.tarjeta`.

## Barra de navegación
| Elemento | Regla |
|----------|-------|
| Nombre | "PresupuestosPro" a la izquierda |
| Enlaces | Negocio, Servicios, Clientes, Presupuesto |
| Activo | `aria-current="page"`, fondo/subrayado resaltado |
| Hover/foco | Cambio visual visible |
| ≤ 600 px | Enlaces en una fila desplazable horizontalmente |

## Componentes
| Clase | Uso |
|-------|-----|
| `.tarjeta` | Agrupa formulario o tabla; fondo blanco, borde suave, sombra ligera |
| `.campo` | Etiqueta + control con espaciado uniforme; foco con anillo azul |
| `.boton.primario` | Acción principal (Guardar, Agregar, Descargar PDF) |
| `.boton.secundario` | Cancelar, Editar |
| `.boton.peligro` | Eliminar, Quitar |
| `.tabla-contenedor > table` | Encabezado gris, filas separadas, última columna `.acciones` alineada a la derecha, desplazamiento horizontal |
| `.mensaje.error` / `.mensaje.ok` | Rojo / verde, directamente debajo del formulario o botón de origen |
| `.campo-error` | Borde rojo en el control con error de validación (además del `.mensaje.error`) |
| `.linea` | Fila de una línea del presupuesto (servicio, horas, subtotal, Quitar) |
| `img.logo` | Vista previa del logo; `max-width:100%`; se oculta si no hay logo o falla la carga |
| `.vacio` | Texto guía en listas sin elementos |
| `.totales` | Base, IVA y retención normales; `.total` ≥ 1.5× el texto normal, negrita, color primario |

## Estados (únicos para barra, botones y campos)
- Hover: cambio de fondo/tono visible.
- Foco: `:focus-visible` con anillo azul en todo elemento interactivo; orden natural de tabulación; cada campo con `<label for>`.
- Deshabilitado: `:disabled` atenuado, cursor `not-allowed`; Descargar PDF deshabilitado sin líneas.
- Eliminar servicio/cliente: pide `confirm()` antes de borrar; Quitar línea del presupuesto no lo pide.

## Contenedor
`.contenedor` centrado, `max-width: 960px`. La app abre en Negocio.

## Textos de estado vacío
- Servicios: "Aún no tiene servicios. Agregue el primero con el formulario."
- Clientes: "Aún no tiene clientes. Agregue el primero con el formulario."
- Presupuesto sin líneas: "Agregue servicios para calcular el presupuesto."
