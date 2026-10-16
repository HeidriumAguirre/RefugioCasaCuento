"""
Actualiza las descripciones de cada espacio segun las instrucciones
de Alexis.

CAMBIOS:
  habitaciones.html:
    - Paula: "Suite" -> "Habitacion", agregar "bano exclusivo"
      y "vista al mar"
    - Unicornio: "Habitacion" + "bano compartido" + "vista al mar"
  lofts.html (ArcaLuz, PatioAzul): "...moderno, con cocina incluida,
    para quienes buscan comodidad y privacidad con hermosa vista al
    mar y su bosque"
  suites.html: actualizar las 2 descripciones para incluir "vista
    al mar" (en variaciones: bahia, costa, mar)
  cabanas.html: actualizar las 2 descripciones para incluir "vista
    al mar" (en variaciones: mar, caleta, bahia, costa)
"""
import re
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")

# Nuevas descripciones por nombre de espacio (data-alojamiento EXACTO
# segun aparece en el HTML). uso frases diferentes para "vista al mar".
NUEVAS_DESCRIPCIONES = {
    # habitaciones
    "1": "Habitacion intima con detalles en madera nativa, bano exclusivo y hermosa vista al mar. Ideal para parejas que buscan tranquilidad y privacidad en un entorno magico de bosque y costa.",  # Paula
    "Habitación Unicornio": "Habitacion especial con detalles unicos que inspiran su nombre: bano compartido, decoracion encantada y vista costera al mar Pacifico. Para quien aprecia el diseno contemporaneo en un entorno natural.",  # Unicornio
    # lofts
    "Loft ArcaLuz": "Loft amplio con diseno moderno, grandes ventanales y luz natural. Dispone de cocina incluida, perfecto para quienes buscan comodidad y privacidad con hermosa vista al mar y su bosque. Ideal para escapadas romanticas.",
    "Loft PatioAzul": "Loft con patio privado, diseno contemporaneo y decoracion inspirada en la costa. Cuenta con cocina incluida y hermosa vista al mar y al bosque, ideal para estadias largas en pareja.",
    # suites (IDs con acento, espacio y/o mayusculas exactos)
    "Suite San Francisco": "Suite espaciosa con grandes ventanales y vista a la bahia. Diseno elegante con materiales nobles y orientacion que captura la luz del Pacifico. Para quienes privilegian amplitud y horizonte maritimo.",
    "Suite Torreón": "Suite con identidad unica, amplios ventanales y decoracion que homenajea el entorno. Ofrece privilegiada vista al mar y a la bahia, combinando amplitud arquitectonica con cercania a la costa.",
    # cabanas
    "Cabaña AyMar": "Cabana que combina la calidez del mar con la paz del bosque nativo. Diseno rustico-chic con espacios comunes, cocina equipada y privilegiada vista al mar. Ideal para familias pequenas y escapadas prolongadas en la costa.",
    "Cabaña PoetaDelTiempo": "Cabana espaciosa, la mas versatil del lugar. Multiples ambientes para grupos pequenos, cocina completa y vista que combina la caleta con el horizonte. Pensada para quien necesita amplitud sin perder la cercania al mar.",
}

# Patron: data-alojamiento="X" en el form, luego el description.
# Estrategia: buscar el bloque de description mas cercano (anterior) al
# data-alojamiento que coincida con el nombre de la habitacion.
patron = re.compile(
    r'(<p class="alojamiento-descripcion">)([^<]+)(</p>\s*<div class="alojamiento-detalles">\s*'
    r'<div class="alojamiento-detalle">\s*'
    r'<div class="alojamiento-detalle-icon">[^<]*<svg[^>]*>.*?</svg>\s*</div>\s*'
    r'(?:<div class="alojamiento-detalle-label">[^<]+</div>)?\s*'
    r'<div class="alojamiento-detalle-valor">[^<]*</div>\s*'
    r'</div>\s*'
    r'(?:<div class="alojamiento-detalle">[^<]*<svg[^>]*>.*?</svg>\s*</div>\s*'
    r'<div class="alojamiento-detalle-label">[^<]+</div>\s*'
    r'<div class="alojamiento-detalle-valor">[^<]*</div>\s*</div>)?\s*'
    r'(?:<div class="alojamiento-detalle">[^<]*<svg[^>]*>.*?</svg>\s*</div>\s*'
    r'<div class="alojamiento-detalle-label">[^<]+</div>\s*'
    r'<div class="alojamiento-detalle-valor">[^<]*</div>\s*</div>)?\s*'
    r'</div>\s*'
    r'<form class="alojamiento-form"[^>]*data-alojamiento=")([^"]+)([^>]*>)',
    re.DOTALL
)


def process(html_path: Path) -> bool:
    contenido = html_path.read_text(encoding="utf-8")
    original = contenido

    def _replace(m):
        desc_actual = m.group(2)
        id_alojamiento = m.group(4)
        nueva_desc = NUEVAS_DESCRIPCIONES.get(id_alojamiento)
        if nueva_desc is None:
            return m.group(0)
        return f"{m.group(1)}{nueva_desc}{m.group(3)}data-alojamiento=\"{id_alojamiento}\"{m.group(5)}"

    contenido = patron.sub(_replace, contenido)

    if contenido != original:
        html_path.write_text(contenido, encoding="utf-8")
        return True
    return False


for nombre in ["habitaciones", "lofts", "suites", "cabanas"]:
    p = ROOT / f"{nombre}.html"
    if p.exists():
        if process(p):
            print(f"  {nombre}.html: descripciones actualizadas")
        else:
            print(f"  {nombre}.html: sin cambios")
    else:
        print(f"  {nombre}.html: no existe")
