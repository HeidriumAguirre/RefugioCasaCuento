"""En el index.html:
1. Reemplaza el data-include de info-acceso.html por consideraciones.html
2. Esto es porque el index es la landing; los avisos del modal flotante
   son apropiados alli. En las otras paginas se mantiene info-acceso.html
   como seccion visible (porque el modal no se muestra ahi).
"""
from pathlib import Path

p = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento/index.html")
contenido = p.read_text(encoding="utf-8")
original = contenido

# Reemplazar la inclusion del partial
contenido = contenido.replace(
    'data-include="partials/info-acceso.html"',
    'data-include="partials/consideraciones.html"',
    1,
)

if contenido != original:
    p.write_text(contenido, encoding="utf-8")
    print(f"OK: {p.name} -> consideraciones.html (modal flotante)")
else:
    print(f"WARN: no se encontro info-acceso en {p.name}")
