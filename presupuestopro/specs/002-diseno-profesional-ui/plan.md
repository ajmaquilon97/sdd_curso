# Implementation Plan: Diseño profesional y navegación por barras

**Branch**: `002-diseno-profesional-ui` | **Date**: 2026-10-31 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-diseno-profesional-ui/spec.md`

## Summary

Cambio solo de presentación sobre la app existente (feature 001): barra de navegación superior con sección activa resaltada, hoja de estilos única con variables de diseño, y ajuste del HTML que generan las pantallas para usar tarjetas, tablas, botones y mensajes con clases comunes. Sin cambios a cálculo, datos ni PDF.

## Technical Context

**Language/Version**: HTML5, CSS3 (variables CSS, flexbox, media queries), JavaScript ES2022 existente

**Primary Dependencies**: Ninguna nueva (sin frameworks CSS ni íconos externos)

**Storage**: Sin cambios (localStorage)

**Testing**: Pruebas Vitest existentes (deben seguir pasando) + verificación manual guiada (quickstart)

**Target Platform**: Navegadores modernos, de 360 px de ancho a escritorio

**Project Type**: web-app estática (extensión de la feature 001)

**Performance Goals**: Una sola hoja de estilos local, sin fuentes, íconos ni librerías externas

**Constraints**: Offline; Chrome, Edge y Firefox recientes; de 360 px a escritorio; contenido centrado con máximo 960 px; contraste texto normal ≥ 4.5:1 y texto grande/bordes ≥ 3:1; solo cambian marcado y clases de `src/ui/*.js` más la confirmación al eliminar (`window.confirm`), sin tocar `calculo.js`, `numeracion.js`, `pdf.js` ni `storage.js`; la app abre en Negocio; sin modo oscuro ni animaciones

**Scale/Scope**: 4 pantallas, 1 hoja de estilos, 1 barra de navegación

## Constitution Check

| Principio | Evaluación |
|-----------|------------|
| I. Simplicidad | OK: un solo archivo CSS, sin librerías ni preprocesadores |
| II. Idioma y mercado | OK: textos en español, USD sin cambios |
| III. Cero alcance fantasma | OK: solo FR-001..018 de la spec 002; sin modo oscuro, animaciones, fuentes ni íconos externos |
| IV. Verificable por no técnico | OK: quickstart se comprueba mirando la app |
| V. Datos con respeto | OK: no se piden ni guardan datos nuevos |

Resultado: **PASA**. Re-evaluado tras el diseño: sin cambios.

## Project Structure

### Documentation (this feature)

```text
specs/002-diseno-profesional-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-components.md
└── tasks.md             # lo crea /speckit-tasks
```

### Source Code (repository root)

```text
index.html               # encabezado con barra de navegación y enlace a la hoja de estilos; se eliminan los estilos en línea
src/
├── estilos.css          # NUEVO: variables, barra, tarjetas, formularios, tablas, botones, mensajes, totales, responsive
├── main.js              # marca la sección activa (aria-current) en cada cambio; abre en Negocio
└── ui/
    ├── negocio.js       # clases comunes; logo oculto si falta o falla; borde rojo en campo inválido
    ├── servicios.js     # idem + estado vacío + confirmar al eliminar
    ├── clientes.js      # idem + estado vacío + confirmar al eliminar
    └── presupuesto.js   # idem + totales destacados + Descargar PDF deshabilitado sin líneas
```

**Structure Decision**: Se mantiene el proyecto único; el estilo vive en `src/estilos.css` y las pantallas solo cambian las clases del HTML que generan.

## Complexity Tracking

Sin violaciones; no aplica.
