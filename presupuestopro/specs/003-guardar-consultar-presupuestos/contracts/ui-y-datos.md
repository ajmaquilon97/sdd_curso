# Contratos: módulo de datos y pantallas

## `src/db.js` (interfaz interna)
| Función | Entrada | Salida |
|---------|---------|--------|
| `crearBase(SQL)` | motor `sql.js` | instancia con el esquema creado |
| `guardarPresupuesto(db, p)` | `{ numero, fecha, cliente{nombre,tipo,identificacion}, lineas[{nombre,precioHora,horas,subtotal}], calculo{base,iva,retencion,total} }` | `{ ok: true, id }` o `{ ok: false, motivo: "sin-cliente" \| "sin-lineas" \| "duplicado" }` |
| `listarPresupuestos(db, filtro?)` | texto opcional (cliente o número) | filas `{ id, numero, fecha, clienteNombre, total }`, más reciente primero |
| `obtenerPresupuesto(db, id)` | id | presupuesto completo con `lineas`, o `null` |
| `eliminarPresupuesto(db, id)` | id | `true` si existía |

## Pantalla "Presupuesto" (cambios)
- Muestra el número AAAA-NNN al abrirse (sin consumirlo).
- Botón **Guardar**: deshabilitado sin líneas; sin cliente o sin servicios muestra el mensaje de qué falta; al guardar confirma "Presupuesto AAAA-NNN guardado"; si ya estaba guardado avisa "Este presupuesto ya está guardado" y no duplica.
- **Descargar PDF**: bloqueado hasta que el presupuesto esté guardado (con mensaje que lo explica); usa el número ya consumido al guardar.
- Si el guardado falla, no queda registro parcial, no se consume el número y se puede reintentar.
- Si la base no inicia: aviso claro; Guardar, Descargar PDF y Guardados quedan deshabilitados.
- Aviso permanente: "Los presupuestos guardados se pierden al cerrar o recargar la página."

## Pantalla "Guardados" (nueva)
- Navegación: nuevo botón "Guardados" en la barra.
- Lista: número, cliente, fecha, total en USD, más reciente primero; vacía → "Aún no hay presupuestos guardados."
- Búsqueda por cliente o número, sin distinguir mayúsculas ni tildes; sin coincidencias → "No hay resultados."
- Detalle: cliente, líneas (servicio, precio/hora, horas, subtotal) y totales (base, IVA, retención, total).
- Eliminar: `window.confirm` previo; cancelar conserva el registro.
- Aviso permanente de datos temporales.
