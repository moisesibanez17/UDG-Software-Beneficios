
# UDG-Software-Beneficios

Documentación del proyecto y guía rápida

## Descripción

`UDG-Software-Beneficios` es una página estática que centraliza información sobre licencias de software, descuentos y recursos disponibles para estudiantes y personal de la Universidad de Guadalajara (UDG). El objetivo es ofrecer una guía visual y práctica para acceder a herramientas profesionales (Office, Adobe, JetBrains, Azure, etc.), con enlaces, instrucciones y guías de instalación.

La interfaz está diseñada con una paleta amarilla intensa y elementos visuales llamativos para facilitar la lectura y resaltar ofertas temporales.

## Estructura del repositorio

- `index.html` — Página principal y estructura HTML.
- `styles.css` — Todas las reglas CSS: tema amarillo, tarjetas, tabla `#softwareTable`, reglas responsive y normalización de logos.
- `scripts.js` — JavaScript de interacción: filtros, filas expandibles, notificaciones y pequeños comportamientos UX.
- `assets/` — Logos, iconos y gráficos usados en la interfaz (SVG, PNG, WebP).
- `guias/` — Guías PDF de instalación y renovación de licencias.
- `README.md` — Esta documentación.

## Cómo ejecutar localmente

Puedes servir los archivos estáticos desde cualquier servidor web o usando Python. Ejemplo con Python 3 (desde la carpeta del proyecto):

```powershell
# En PowerShell
python -m http.server 8000
# Abrir en el navegador: http://localhost:8000
```

También puedes abrir `index.html` directamente en el navegador, pero algunos comportamientos (como fetch o rutas relativas en ciertos navegadores) funcionan mejor sirviendo desde un servidor local.

## Principales características

- Tema visual amarillo con degradados, animaciones sutiles y tarjetas.
- Sección "Beneficios por Tiempo Limitado" con badges y expiraciones.
- Grid de "Beneficios Adicionales" con logos normalizados y enlaces a activación.
- Tabla "Software Especializado" con búsquedas, filas expandibles y detalles (transforma a tarjetas en pantallas pequeñas para evitar scroll horizontal).
- Notificaciones del navegador (opcional) para avisos.

## Cambios en Versión 0.1 (historial)

Fecha: 26 de septiembre de 2025

- Normalización de iconos/logos: la clase `.logo` fue unificada en `styles.css` para garantizar tamaños consistentes (regla base 72x72px, y variantes responsive con `.logo.small-fallback`).
- Se añadieron assets gráficos (SVG/PNG/WebP) en `assets/` usados por las tarjetas.
- Se añadieron guías PDF a `guias/` (instalación y renovación de AutoCAD).
- Correcciones para remover scroll horizontal en la sección `#especializado`:
	- Removido `min-width` forzado en la tabla.
	- Añadido `table-layout: fixed`, `white-space: normal`, `word-break: break-word`.
	- Media query que transforma la tabla en tarjetas apiladas en pantallas pequeñas.
	- Regla fallback global `html, body { overflow-x: hidden !important; }` añadida como última medida para navegadores con comportamiento extraño (p.ej. Edge).
- Commit inicial y assets subidos al repositorio.

## Cómo contribuir

Si quieres colaborar:

1. Haz fork del repositorio.
2. Crea una rama feature/tu-cambio.
3. Abre un Pull Request con una descripción clara de los cambios.

Buenas prácticas:

- Para nuevas imágenes, usa formatos vectoriales (SVG) cuando sea posible.
- Mantén las reglas CSS centradas en `styles.css` y evita estilos inline salvo casos necesarios.
- Añade pruebas visuales o capturas si cambias el layout.

## Nota sobre licencias y marcas

Los logos y marcas usadas en `assets/` pertenecen a sus respectivos dueños. Este proyecto es informativo y no tiene fines de lucro.

## Tagging y releases

Si deseas un release formal, puedo crear un tag en Git (por ejemplo `v0.1`) y empujarlo al remoto.

## Contacto

Si detectas errores de contenido o quieres solicitar enlaces/beneficios adicionales, abre un issue en el repositorio o contáctame dentro del repositorio.


