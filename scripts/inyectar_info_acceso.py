"""Inyecta el partial info-acceso.html despues del header en todas las paginas."""
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")
PARTIAL = '<div data-include="partials/info-acceso.html"></div>'

for path in ROOT.glob("*.html"):
    if path.name in ("README.md",):
        continue
    contenido = path.read_text(encoding="utf-8")
    if 'partials/info-acceso.html' in contenido:
        print(f"  SKIP (ya tiene): {path.name}")
        continue
    # Inyectar despues del partial del footer del header (que es <div data-include="partials/header.html"></div>)
    # Estrategia simple: insertar antes del <main> o, si no hay <main>, despues del header.
    if "<main" in contenido:
        nuevo = contenido.replace(
            '<main',
            f'{PARTIAL}\n\n<main',
            1,
        )
    else:
        # fallback: despues del header
        nuevo = contenido.replace(
            '<div data-include="partials/header.html"></div>',
            '<div data-include="partials/header.html"></div>\n\n' + PARTIAL,
            1,
        )
    if nuevo != contenido:
        path.write_text(nuevo, encoding="utf-8")
        print(f"  OK: {path.name}")
    else:
        print(f"  SKIP (sin header?): {path.name}")
