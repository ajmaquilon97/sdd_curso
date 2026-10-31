# Contratos de interfaz

## Pantallas (español de Ecuador)
| Pantalla | Acciones | Mensajes clave |
|----------|----------|----------------|
| Negocio | guardar, editar, eliminar | "Complete los datos de su negocio" |
| Servicios | crear, editar precio, eliminar | — |
| Clientes | crear (RUC 999999999 por defecto), editar, eliminar | — |
| Presupuesto | elegir cliente, agregar servicio, editar horas, ver totales, descargar PDF | "Agregue al menos un servicio"; "Las horas deben ser mayores a 0"; "Complete los datos de su negocio antes de descargar" |

## Cálculo (función pura)
Entrada: `{ lineas:[{precioHora, horas}], tipoCliente, ivaPorTipo }`
Salida: `{ subtotales[], base, iva, retencion, total }` en centavos enteros, cada importe redondeado hacia arriba.

Ejemplo verificable: 3 líneas de $160, tipo RUC, IVA 15 % → base 48000, iva 7200, retención 3360, total 58560 (centavos).

## Numeración
`siguienteNumero(contador, fecha)` → `"2026-001"`, `"2026-002"`; al cambiar el año → `"2027-001"`.

## PDF (contenido y orden)
1. Logo, nombre, identificación, contacto, dirección del freelancer.
2. Número AAAA-NNN y fecha de emisión.
3. Datos del cliente (nombre, tipo, identificación).
4. Tabla: servicio, precio/hora, horas, subtotal.
5. Base, IVA, retención, total en USD.
6. Leyenda "Válido por 30 días".
