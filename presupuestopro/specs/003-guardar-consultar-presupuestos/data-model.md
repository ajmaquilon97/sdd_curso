# Data Model

Base SQLite en memoria (se crea al abrir la app, se descarta al cerrar o recargar). Importes en centavos enteros.

## presupuestos
| Columna | Tipo | Regla |
|---------|------|-------|
| id | INTEGER PK autoincremental | interno |
| numero | TEXT UNIQUE NOT NULL | AAAA-NNN; evita duplicados al guardar dos veces |
| fecha | TEXT NOT NULL | ISO `AAAA-MM-DD`, fecha de guardado |
| creado_en | INTEGER NOT NULL | marca de tiempo, para ordenar del más reciente al más antiguo |
| cliente_nombre | TEXT NOT NULL | copia del cliente |
| cliente_tipo | TEXT NOT NULL | `ruc` \| `cedula` |
| cliente_identificacion | TEXT NOT NULL | copia |
| cliente_busqueda | TEXT NOT NULL | nombre en minúsculas y sin tildes, para filtrar |
| base | INTEGER NOT NULL | suma de subtotales |
| iva | INTEGER NOT NULL | |
| retencion | INTEGER NOT NULL | 0 para cédula |
| total | INTEGER NOT NULL | base + iva + retención |

## lineas
| Columna | Tipo | Regla |
|---------|------|-------|
| id | INTEGER PK | |
| presupuesto_id | INTEGER NOT NULL | FK → presupuestos(id), `ON DELETE CASCADE` |
| posicion | INTEGER NOT NULL | orden original |
| servicio | TEXT NOT NULL | copia del nombre |
| precio_hora | INTEGER NOT NULL | centavos |
| horas | REAL NOT NULL | > 0, máx. 2 decimales |
| subtotal | INTEGER NOT NULL | |

## Reglas
- Guardar exige cliente y al menos una línea válida (FR-002); todo se inserta en una transacción (presupuesto + líneas).
- Son inmutables: no hay actualización; solo insertar, consultar y eliminar (FR-011).
- Sin relación con las tablas de clientes/servicios de localStorage: editar o borrar esos datos no altera lo guardado (FR-003).
- Eliminar un presupuesto elimina sus líneas; el número consumido no se reutiliza.

## Estado del borrador (en pantalla, no en la base)
`{ numero, guardado: boolean }` — `guardado` pasa a verdadero solo al guardar, y es entonces cuando se consume el número. Descargar el PDF exige `guardado = true`.
