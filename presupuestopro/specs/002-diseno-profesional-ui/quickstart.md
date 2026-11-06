# Quickstart: validación del diseño

## Prerrequisitos
- En `presupuestopro\`: `python -m http.server 8000` y abrir `http://localhost:8000`.

## Pasos
1. **Barra** (US1): verificar la barra superior con el nombre y 4 secciones; pasar por cada una con un clic; la activa está resaltada y las demás cambian al pasar el cursor.
2. **Estilo uniforme** (US2): en cada ventana revisar tarjetas, etiquetas, campos con anillo de foco al enfocarlos, botones (principal azul, secundario neutro, eliminar rojo).
3. Provocar un error (guardar servicio sin nombre) y un éxito (guardar negocio): colores distintos y cerca de la acción.
4. Abrir Servicios y Clientes vacíos: aparece el texto guía.
5. Con 3 líneas de $160 (cliente RUC), el Total ($585.60) se ve ≥ 1.5× más grande, en negrita y color primario; sin líneas, Descargar PDF aparece deshabilitado.
6. Eliminar un servicio o cliente pide confirmación; un campo inválido muestra borde rojo y el mensaje debajo; sin logo no hay hueco.
7. **Responsive** (US3): reducir el ancho a 360 px; la barra sigue accesible y las tablas se desplazan sin cortar contenido.
8. Probar nombres muy largos y un logo grande: no deforman el diseño.
9. En `presupuestopro\`: `npm test` → 7 pruebas pasan y el PDF descargado es igual que antes.
