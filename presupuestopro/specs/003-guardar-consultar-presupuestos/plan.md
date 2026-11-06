# Implementation Plan: Guardar y consultar presupuestos

**Branch**: `003-guardar-consultar-presupuestos` | **Date**: 2026-11-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-guardar-consultar-presupuestos/spec.md`

## Summary

Se agrega una base SQLite en modo memoria, ejecutada dentro del navegador (SQLite compilado a WebAssembly, sin servidor ni archivo en disco), donde se guardan copias inmutables de los presupuestos. La pantalla "Presupuesto" gana el botón **Guardar** y muestra el número AAAA-NNN desde el inicio; una nueva pantalla **Guardados** lista (más reciente primero), filtra, abre el detalle y elimina con confirmación. Los datos se pierden al cerrar o recargar y la app lo advierte de forma visible.

## Technical Context

**Language/Version**: JavaScript ES2022 (módulos), HTML5/CSS3 existentes

**Primary Dependencies**: `sql.js` 1.15.x (SQLite → WebAssembly), copiado a `src/vendor/` (`sql-wasm.js` + `sql-wasm.wasm`) igual que `jspdf`; sin otras dependencias nuevas

**Storage**: SQLite en memoria (`new SQL.Database()`, sin archivo). Negocio, clientes, servicios y contador siguen en localStorage (sin cambios)

**Testing**: Vitest; pruebas unitarias de `src/db.js` con `sql.js` en Node + verificación manual guiada (quickstart)

**Target Platform**: Chrome, Edge y Firefox recientes, de 360 px a escritorio; servido por HTTP estático (los módulos ES ya lo exigen)

**Project Type**: web-app estática (extensión de las features 001 y 002)

**Performance Goals**: guardar < 5 s (SC-001); búsqueda con 100 guardados < 1 s (SC-003)

**Constraints**: offline, sin servidor; importes en centavos enteros (igual que `calculo.js`); textos en español de Ecuador y USD; los guardados son de solo lectura; no se toca `calculo.js`, `pdf.js` ni `storage.js`

**Scale/Scope**: 1 pantalla nueva, 1 botón nuevo, 1 módulo de datos, 2 tablas, decenas de registros

## Constitution Check

| Principio | Evaluación |
|-----------|------------|
| I. Simplicidad | OK: una sola dependencia vendorizada, 2 tablas, sin capas ni ORM, sin bundler |
| II. Idioma y mercado | OK: textos en español de Ecuador, USD con el formato existente |
| III. Cero alcance fantasma | OK: solo FR-001..FR-011 y FR-009a; sin edición, exportación ni persistencia |
| IV. Verificable por no técnico | OK: quickstart se comprueba usando la app (guardar, buscar, recargar) |
| V. Datos con respeto | OK: solo se copian datos ya capturados; sin secretos |

Resultado: **PASA**. Re-evaluado tras el diseño: sin cambios. SQLite es una decisión pedida por el usuario (FR-009a), no complejidad anticipada.

## Project Structure

### Documentation (this feature)

```text
specs/003-guardar-consultar-presupuestos/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-y-datos.md
└── tasks.md             # lo crea /speckit-tasks
```

### Source Code (repository root)

```text
index.html               # carga sql-wasm.js y agrega el botón "Guardados" a la navegación
src/
├── db.js                # NUEVO: base SQLite en memoria (esquema, guardar, listar, obtener, eliminar)
├── main.js              # agrega la pantalla "guardados"
├── vendor/
│   ├── sql-wasm.js      # NUEVO (copiado de sql.js)
│   └── sql-wasm.wasm   # NUEVO (copiado de sql.js)
└── ui/
    ├── presupuesto.js   # número visible al abrir, botón Guardar, avisos de ya guardado
    └── guardados.js     # NUEVO: lista, búsqueda, detalle, eliminar con confirmación y aviso de datos temporales
tests/unit/
└── db.test.js           # NUEVO
```

**Structure Decision**: Se mantiene el proyecto único. `db.js` recibe el motor SQLite por parámetro para poder probarlo en Node sin navegador; la UI lo inicia una vez con el `initSqlJs` global.

## Complexity Tracking

Sin violaciones; no aplica.
