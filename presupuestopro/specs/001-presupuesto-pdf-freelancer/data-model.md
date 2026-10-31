# Data Model

Todo se guarda en localStorage como JSON.

## Negocio (uno solo)
| Campo | Tipo | Regla |
|-------|------|-------|
| identificacion | texto | obligatorio (RUC) |
| nombre | texto | obligatorio (nombre o marca) |
| logo | imagen base64 | opcional, tamaño máximo limitado |
| contacto | texto | obligatorio (teléfono/correo) |
| direccion | texto | obligatorio |
| ivaPorTipo | { ruc: 15, cedula: 15 } | porcentajes configurables, ≥ 0 |

Eliminar el negocio deja el formulario vacío (US1.3).

## Servicio
| Campo | Tipo | Regla |
|-------|------|-------|
| id | texto único | generado |
| nombre | texto | obligatorio |
| precioHora | decimal USD | > 0 |

## Cliente
| Campo | Tipo | Regla |
|-------|------|-------|
| id | texto único | generado |
| nombre | texto | obligatorio |
| tipo | "ruc" \| "cedula" | por defecto "ruc" |
| identificacion | texto | por defecto "999999999" |

## Presupuesto (calculado al emitir; no hay historial navegable)
| Campo | Regla |
|-------|-------|
| numero | AAAA-NNN |
| fechaEmision | fecha de hoy; validez 30 días |
| cliente | copia de nombre, tipo, identificación |
| lineas | copia de servicio, precioHora, horas |
| base | suma de subtotales |
| iva | base × IVA del tipo de cliente |
| retencion | RUC: base × 7 %; cédula: 0 |
| total | base + iva + retencion |

Línea: `horas` > 0; `subtotal = precioHora × horas`.

## Contador de numeración
`{ "2026": 2 }` → último consecutivo emitido por año.

## Relaciones y estados
- El presupuesto copia los datos de cliente y servicios al emitirse; editar o eliminar después no altera PDF ya descargados.
- Estados: borrador (en pantalla) → emitido (PDF descargado, consume número).
