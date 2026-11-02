# Research

## Motor SQLite en el navegador
- **Decision**: `sql.js` (SQLite compilado a WebAssembly), con `sql-wasm.js` y `sql-wasm.wasm` copiados a `src/vendor/`.
- **Rationale**: Es SQLite real ejecutándose en el navegador, en memoria por defecto (`new SQL.Database()`), sin servidor (clarificación 2026-11-01) y funciona offline. Se vendoriza como `jspdf`, sin bundler.
- **Alternatives**: SQLite WASM oficial con OPFS (persiste en disco: contradice FR-009 y exige cabeceras especiales); servidor local con SQLite (rechazado en clarificación); `localStorage` (no es SQLite).

## Carga del WASM
- **Decision**: `initSqlJs({ locateFile: () => "src/vendor/sql-wasm.wasm" })` una sola vez, al abrir la app; la base es un singleton del módulo `db.js`.
- **Rationale**: Mantiene los datos mientras se navega entre pantallas y los descarta al recargar, como pide FR-009.
- **Alternatives**: Reiniciar la base por pantalla (perdería datos al navegar).

## Búsqueda sin mayúsculas ni tildes
- **Decision**: Se guardan columnas normalizadas (`cliente_busqueda`, `numero`) con minúsculas y sin diacríticos (`normalize("NFD")` sin marcas); la consulta usa `LIKE` con el texto normalizado de la misma forma.
- **Rationale**: `LIKE` de SQLite solo ignora mayúsculas ASCII, no tildes.
- **Alternatives**: Extensión ICU de SQLite (no incluida en sql.js).

## Importes
- **Decision**: Centavos enteros en la base, igual que `calculo.js`; se muestran con `usd()`.
- **Rationale**: Evita errores de redondeo y garantiza que el detalle coincida exacto con lo guardado (SC-002).

## Número AAAA-NNN
- **Decision**: Al abrir la pantalla se calcula con `siguienteNumero` sin persistir el contador; solo se persiste (`guardar("contador")`) al guardar; descargar el PDF exige haber guardado (aclaración 2026-11-02). El borrador conserva ese número; `numero` es `UNIQUE` en la base como respaldo contra duplicados.
- **Rationale**: Cumple la clarificación 2026-10-31 y FR-001 sin tocar `numeracion.js`.

## Aviso de datos temporales
- **Decision**: Mensaje visible fijo en la pantalla Guardados y junto al botón Guardar: "Los presupuestos guardados se pierden al cerrar o recargar la página."
- **Rationale**: FR-009 y SC-005 exigen advertir el 100 % de las veces.
