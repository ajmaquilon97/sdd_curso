# Implementation Plan: Presupuestos PDF para Freelancer

**Branch**: `001-presupuesto-pdf-freelancer` | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-presupuesto-pdf-freelancer/spec.md`

## Summary

Herramienta web local (sin servidor, sin cuentas) donde el freelancer configura su negocio, servicios y clientes, arma un presupuesto con cálculo automático de base, IVA, retención y total, y descarga un PDF numerado AAAA-NNN. Enfoque: aplicación estática en JavaScript puro, datos en el navegador, PDF generado en el cliente.

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos nativos), sin transpilación

**Primary Dependencies**: jsPDF (generación de PDF en el navegador); ninguna otra

**Storage**: localStorage del navegador (JSON); logo guardado como imagen en base64

**Testing**: Vitest para la lógica de cálculo y numeración; verificación manual guiada (quickstart) para UI y PDF

**Target Platform**: Navegadores de escritorio modernos, un solo dispositivo

**Project Type**: web-app estática de una sola página

**Performance Goals**: Totales recalculados al instante (<100 ms); PDF descargado en <3 s

**Constraints**: Offline, sin backend, sin autenticación ni nube (FR-013); español de Ecuador y USD

**Scale/Scope**: 1 freelancer, decenas de clientes/servicios; 4 pantallas (Negocio, Servicios, Clientes, Presupuesto)

## Constitution Check

| Principio | Evaluación |
|-----------|------------|
| I. Simplicidad | OK: sin framework, sin backend, una sola dependencia |
| II. Idioma y mercado | OK: textos y PDF en español de Ecuador, USD |
| III. Cero alcance fantasma | OK: solo FR-001..013; no hay historial navegable de presupuestos |
| IV. Verificable por no técnico | OK: quickstart usa solo la app y el PDF |
| V. Datos con respeto | OK: solo datos requeridos, sin secretos |

Resultado: **PASA**, sin violaciones. Re-evaluado tras el diseño: sin cambios.

## Project Structure

### Documentation (this feature)

```text
specs/001-presupuesto-pdf-freelancer/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-and-pdf.md
└── tasks.md             # lo crea /speckit-tasks
```

### Source Code (repository root)

```text
index.html
src/
├── main.js              # navegación y arranque
├── storage.js           # lectura/escritura en localStorage
├── calculo.js           # subtotales, IVA, retención, total, redondeo
├── numeracion.js        # AAAA-NNN y reinicio anual
├── pdf.js               # armado del PDF
└── ui/
    ├── negocio.js
    ├── servicios.js
    ├── clientes.js
    └── presupuesto.js
tests/
└── unit/
    ├── calculo.test.js
    └── numeracion.test.js
```

**Structure Decision**: Proyecto único estático; la lógica de negocio (`calculo.js`, `numeracion.js`) está separada de la UI para poder probarla sin navegador.

## Complexity Tracking

Sin violaciones; no aplica.
