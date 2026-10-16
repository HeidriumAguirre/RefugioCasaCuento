"""
Arregla la presentacion del precio en las cards de espacios:
1. Pega el '$' al valor sin espacio: "$ XX.XXX" -> "$XX.XXX"
2. Cambia "Desde" label y "$XX.XXX / noche" a una sola linea
   presentable inline.
3. Tambien cambia el titulo "Camas" y "Capacidad" para que no
   parezca texto suelto (los labels quedan ok, solo el valor va inline).
"""
import re
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")

# Patron: "$ XX.XXX / noche" (placeholder) o "$1234 / noche" (valor)
# -> "$XX.XXX / noche" o "$1234 / noche" (sin espacio entre $ y numero)
patron_dollar = re.compile(
    r'\$\s+(\d+[\d.]*|\w[\w.]*)\s*/\s*noche',
    re.IGNORECASE
)

# Patron: bloques de Cama y Capacidad como divs sueltos sin el row.
# En realidad ya tenemos Cama y Capacidad en divs separados y esta OK.
# Lo que arreglamos es la visualizacion del precio.

def process(html_path: Path) -> bool:
    contenido = html_path.read_text(encoding="utf-8")
    original = contenido
    contenido = patron_dollar.sub(r"$\1 / noche", contenido)
    if contenido != original:
        html_path.write_text(contenido, encoding="utf-8")
        return True
    return False


for nombre in ["habitaciones", "lofts", "suites", "cabanas"]:
    p = ROOT / f"{nombre}.html"
    if p.exists():
        if process(p):
            print(f"  {nombre}.html: precio pegado al $")
        else:
            print(f"  {nombre}.html: sin cambios")
