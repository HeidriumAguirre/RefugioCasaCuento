"""
Reconstruye los divs de Cama (y tambien Capacidad si quedo vacio) en
las cards de presentacion, segun el contexto del form mas cercano.

Estructura tipica del HTML tras la limpieza:
  <article>
    <div>icono</div>
    <h3>titulo</h3>
    <p>descripcion</p>
    <div class="alojamiento-detalles">
      <div>icono <span class="alojamiento-detalle-label">Camas</span>
           <span class="alojamiento-detalle-valor"></span></div>
      <div>icono <span class="alojamiento-detalle-label">Capacidad</span>
           <span class="alojamiento-detalle-valor">2 personas</span></div>
      <div>icono <span class="alojamiento-detalle-label">Desde</span>
           <span class="alojamiento-detalle-valor">$ XX.XXX / noche</span></div>
    </div>
    <form data-alojamiento="X">...</form>
  </article>

El script pone el numero correcto en Cama (segun data-alojamiento del
form) y en Capacidad (N personas) segun corresponda.
"""
import re
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")

NOMBRE_A_NUM = {
    "Habitación Paula":     1,
    "Habitación Unicornio": 1,
    "Loft ArcaLuz":        1,
    "Loft PatioAzul":      1,
    "Suite SanFrancisco":   1,
    "Suite Torreon":        1,
    "Cabaña AyMar":         1,
    "Cabaña PoetaDelTiempo": 1,
}


def camas_para_id(valor_id: str) -> int:
    if valor_id.isdigit():
        return int(valor_id)
    return NOMBRE_A_NUM.get(valor_id, 1)


def process(html_path: Path) -> bool:
    contenido = html_path.read_text(encoding="utf-8")
    original = contenido
    n = 0

    # Recorre cada <article> ... </article> y rellena los divs vacios.
    patron_article = re.compile(
        r'(<article[^>]*>)(.*?)(</article>)',
        re.DOTALL
    )

    def _rellenar_article(m):
        nonlocal n
        inicio, contenido_article, fin = m.group(1), m.group(2), m.group(3)

        # Buscar el data-alojamiento en este article
        m_id = re.search(r'data-alojamiento="([^"]+)"', contenido_article)
        if not m_id:
            return m.group(0)
        valor_id = m_id.group(1)
        num_camas = camas_para_id(valor_id)

        # Reemplazar el div vacio de Cama por num_camas
        nuevo = re.sub(
            r'(<div class="alojamiento-detalle-label">Camas</div>\s*'
            r'<div class="alojamiento-detalle-valor">)(</div>)',
            rf'\g<1>{num_camas}\g<2>',
            contenido_article,
            count=1,
        )
        if nuevo != contenido_article:
            n += 1

        # Si el div de Capacidad quedo vacio, poner "2 personas"
        nuevo = re.sub(
            r'(<div class="alojamiento-detalle-label">Capacidad</div>\s*'
            r'<div class="alojamiento-detalle-valor">)(</div>)',
            r'\g<1>2 personas\g<2>',
            nuevo,
            count=1,
        )
        if nuevo != contenido_article:
            n += 1

        return inicio + nuevo + fin

    contenido = patron_article.sub(_rellenar_article, contenido)

    if contenido != original:
        html_path.write_text(contenido, encoding="utf-8")
    return n > 0


for nombre in ["habitaciones", "lofts", "suites", "cabanas"]:
    p = ROOT / f"{nombre}.html"
    if p.exists():
        if process(p):
            print(f"  {nombre}.html: camas reconstruidas")
        else:
            print(f"  {nombre}.html: sin cambios")
    else:
        print(f"  {nombre}.html: no existe")
