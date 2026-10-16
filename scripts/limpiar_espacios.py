"""Limpia los archivos de espacios correctamente.

ANTES de correr este script, los archivos tenian:
  - Cama: "1 Queen" (con la palabra del tamano de la cama)
  - Capacidad: "2 personas" (con la palabra 'personas')
  - Desde: "$ XX.XXX / noche" (template literal sin valor)

El usuario quiere:
  - Cama: solo el numero (sin "Queen"/"King"/etc)
  - Capacidad: SIN CAMBIOS (mantener "2 personas")
  - Desde: eliminar todo el row (label + valor)
  - Ademas, el card de estado: cambiar "Estado" a "Disponibilidad"
  - Quitar el "estado-help" (texto chico que dice "Disponibilidad actualizada desde...")
"""
import re
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")


def process(path: Path) -> bool:
    contenido = path.read_text(encoding="utf-8")
    original = contenido
    n = 0

    # 1) Quitar tamano de la cama SOLO en el row de "Camas", no en "Capacidad".
    #    Match: <div class="alojamiento-detalle-row">
    #             <div class="alojamiento-detalle-label">Camas</div>
    #             <div class="alojamiento-detalle-valor">1 Queen</div>
    #           </div>
    #    Mantener SOLO el numero "1" dentro del .alojamiento-detalle-valor.
    #    Grupos: 1=antes-de-Camas, 2=antes-de-valor, 3=numero, 4=despues-de-valor
    patron_cama = re.compile(
        r'(<div class="alojamiento-detalle-row">\s*'
        r'<div class="alojamiento-detalle-label">Camas</div>\s*'
        r'<div class="alojamiento-detalle-valor">)(\d+)(?:\s+[A-Za-z][^<]*)?('
        r'</div>\s*</div>)',
        re.IGNORECASE
    )
    contenido, c1 = patron_cama.subn(r"\1\2\3", contenido)
    n += c1

    # 2) Quitar el row completo de "Desde" (label + valor + row).
    patron_desde = re.compile(
        r'<div class="alojamiento-detalle-row">\s*'
        r'<div class="alojamiento-detalle-label">Desde</div>\s*'
        r'<div class="alojamiento-detalle-valor">[^<]*</div>\s*'
        r'</div>\s*',
        re.IGNORECASE
    )
    contenido, c2 = patron_desde.subn("", contenido)
    n += c2

    # 3) Cambiar el card de estado: "Estado" -> "Disponibilidad"
    patron_estado = re.compile(
        r'<div class="estado-label">Estado</div>'
    )
    contenido, c3 = patron_estado.subn(
        r'<div class="estado-label">Disponibilidad</div>', contenido
    )
    n += c3

    # 4) Quitar el "estado-help" (texto chico debajo del badge)
    patron_help = re.compile(
        r'<div class="estado-help">.*?</div>\s*',
        re.DOTALL
    )
    contenido, c4 = patron_help.subn("", contenido)
    n += c4

    if contenido != original:
        path.write_text(contenido, encoding="utf-8")
    return n > 0


for nombre in ("habitaciones", "lofts", "suites", "cabanas"):
    p = ROOT / f"{nombre}.html"
    if p.exists():
        result = process(p)
        print(f"  {nombre}.html: {'cambios aplicados' if result else 'sin cambios'}")
    else:
        print(f"  {nombre}.html: no existe")
