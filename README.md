# UDG-Software-Beneficios

## Versión 0.1 - 26 Septiembre 2025

Resumen de cambios principales:

- Normalización de iconos/logos: la clase `.logo` fue unificada en `styles.css` para asegurar tamaños consistentes en tarjetas y listados (regla base 72x72px, variantes responsive y `.logo.small-fallback`).
- Se añadieron assets gráficos usados en la interfaz (logos SVG/PNG/WebP) en la carpeta `assets/`.
- Se añadieron guías en PDF para instalación y renovación de licencias en `guias/`.
- Correcciones visuales y de layout para evitar scroll horizontal en la sección `#especializado` (tabla con layout fijo, wrapping y regla fallback para navegadores con comportamiento extraño).

Cómo verificar:

1. Abrir `index.html` en tu navegador (por ejemplo con un servidor local)
2. Forzar recarga (Ctrl+F5) en Microsoft Edge para cargar la hoja de estilos actualizada.
3. Revisar la sección "Beneficios Adicionales" y "Productividad" para comprobar tamaños homogéneos de logos.

Notas:

- Si se requiere un tamaño distinto por razones de diseño, usar la clase `.logo.small-fallback` en la imagen correspondiente.
- Si detectas algún logo desalineado o pixelado, indícame cuál y lo ajusto.
