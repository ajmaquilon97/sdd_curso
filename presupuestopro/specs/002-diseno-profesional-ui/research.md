# Research: Diseño profesional y navegación por barras

## Estilos
- **Decision**: Una hoja CSS propia (`src/estilos.css`) con variables CSS para colores, espaciado, radios y sombras.
- **Rationale**: Mantiene la simplicidad (principio I), funciona offline y da consistencia (FR-003).
- **Alternatives**: Bootstrap/Tailwind (dependencia y peso innecesarios); CSS por pantalla (inconsistencias).

## Barra de navegación
- **Decision**: Barra superior fija con el nombre de la app a la izquierda y los 4 enlaces a la derecha; sección activa marcada con `aria-current="page"` y estilizada por ese atributo. En pantallas ≤ 600 px los enlaces pasan a una fila con desplazamiento horizontal (sin menú hamburguesa).
- **Rationale**: Un clic por sección (SC-001) y sin JavaScript extra para el menú móvil.
- **Alternatives**: Barra lateral (descartada por el usuario); menú hamburguesa (más complejidad).

## Paleta y tipografía
- **Decision**: Azul corporativo (#1d4ed8) como primario, grises neutros (texto #1f2937 sobre fondo #f3f4f6 y tarjetas blancas), rojo (#b91c1c) para eliminación/errores, verde (#15803d) para éxito; fuente del sistema (system-ui). Contraste: texto normal ≥ 4.5:1; texto grande y bordes de componentes ≥ 3:1 (todos los pares anteriores sobre blanco o #f3f4f6 cumplen 4.5:1; el borde de campos usa #6b7280). Sección activa: fondo claro sobre barra oscura, ≥ 3:1 frente a las inactivas.
- **Rationale**: Aspecto profesional sobrio, sin cargar fuentes externas (offline).
- **Alternatives**: Google Fonts (requiere internet).
- **Exclusiones**: sin modo oscuro, animaciones, fuentes ni íconos externos.

## Componentes
- **Decision**: Clases comunes: `.tarjeta`, `.campo`, `.boton` (`.primario`, `.secundario`, `.peligro`), `.tabla-contenedor` (desplazamiento horizontal), `.mensaje` (`.error`, `.ok`), `.vacio`, `.totales`.
- **Rationale**: Cubre FR-004..009 con un vocabulario mínimo.

## Responsive y accesibilidad
- **Decision**: Diseño fluido con contenido centrado de máximo 960 px y un solo punto de quiebre a 600 px; `:focus-visible` en todo elemento interactivo; tablas dentro de un contenedor con `overflow-x:auto`; `overflow-wrap:anywhere` para textos largos; `img.logo{max-width:100%}`. Navegadores: Chrome, Edge y Firefox recientes.
- **Rationale**: Cumple FR-010, FR-011, FR-013 y FR-017.

## Verificación
- **Decision**: Sin pruebas automáticas nuevas (presentación pura); se ejecutan las pruebas existentes para confirmar que nada de negocio cambió (SC-005) y el quickstart manual.

Sin elementos NEEDS CLARIFICATION pendientes.
