# Quickstart: validación

## Requisitos
- `npm install` y servir la carpeta con cualquier servidor estático (p. ej. `npx http-server .`); abrir en Chrome, Edge o Firefox.
- Tener el negocio, al menos un cliente y un servicio creados.
- Pruebas automáticas: `npm test` (incluye `tests/unit/db.test.js`).

## Escenarios
1. **Guardar (US1)**: en Presupuesto el número AAAA-NNN ya se ve; agregar un servicio y pulsar Guardar → aparece "Presupuesto AAAA-NNN guardado". Pulsar Guardar otra vez → avisa que ya está guardado, sin duplicar.
2. **Validación**: sin cliente o sin servicios, Guardar explica qué falta.
3. **Inmutabilidad**: editar el precio del servicio o el cliente → el presupuesto guardado conserva sus valores.
4. **Consultar (US2)**: guardar dos presupuestos → en Guardados salen del más reciente al más antiguo; abrir uno → importes idénticos a los de pantalla. Sin guardados → mensaje de vacío.
5. **Buscar y eliminar (US3)**: buscar "ÁLVAREZ" o "alvarez" muestra los mismos resultados; búsqueda sin coincidencias → "No hay resultados". Eliminar con confirmar → desaparece; con cancelar → permanece.
6. **Número**: abrir Presupuesto y salir sin guardar ni descargar → al volver se ofrece el mismo número. Intentar Descargar PDF sin guardar → se bloquea y explica que primero se guarda. Guardar y luego descargar → mismo número, sin consumir otro.
7. **Fallos**: si la base no inicia, el aviso es claro y Guardar, Descargar PDF y Guardados quedan deshabilitados. Si un guardado falla, no aparece a medias en la lista, el número no se gasta y se puede reintentar.
8. **Temporal (FR-009)**: el aviso es visible; recargar la página → la lista queda vacía.

Referencias: [data-model.md](data-model.md), [contracts/ui-y-datos.md](contracts/ui-y-datos.md).
