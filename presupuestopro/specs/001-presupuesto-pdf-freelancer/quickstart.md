# Quickstart: validación de extremo a extremo

## Prerrequisitos
- Navegador moderno. Para pruebas automáticas: Node.js y `npm test` (Vitest).

## Pasos
1. Abrir `index.html` (o servir la carpeta con un servidor estático local).
2. **Negocio**: ingresar RUC, nombre, logo, contacto, dirección; recargar la página y verificar que persisten.
3. **Servicios**: crear Análisis $20, Diseño $40, Desarrollo $80, Implementación $120; editar uno y eliminar otro.
4. **Clientes**: crear un cliente solo con nombre → debe quedar RUC 999999999; crear otro con cédula.
5. **Presupuesto**: elegir cliente RUC y armar tres líneas de $160 (ajustando horas) → Base $480.00, IVA $72.00, Retención $33.60, Total $585.60.
6. Cambiar al cliente con cédula → Retención $0.00.
7. Intentar descargar sin servicios u horas ≤ 0 → la app lo impide con mensaje.
8. Descargar el PDF: verificar marca, cliente, líneas, totales, "Válido por 30 días" y número 2026-001; descargar otro → 2026-002.
9. Simular cambio de año (fecha del sistema 2027) → número 2027-001.

## Pruebas automáticas
`npm test` → cálculo (ejemplo de $480, redondeo hacia arriba, cédula sin retención) y numeración (consecutivo y reinicio anual).
