"""
Modifica habitaciones/lofts/suites/cabanas.html:
  - Reemplaza el boton "Ver en Booking" por dropdown "Ver sitios de alianza"
  - Agrega una card de "Estado" con placeholder para disponibilidad automatica
  - Agrega una tabla de "Valores por noche" (1, 2, 3, +3)

Estructura esperada en cada HTML: la card actual tiene un
<form> con campos y un boton de submit + el link a Booking.
Reemplazamos ese link + el boton adyacente por:
  1. card de Estado (badge verde/rojo)
  2. card con tabla de precios
  3. dropdown "Ver sitios de alianza" (Booking, Expedia, Airbnb)
"""
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")

# Estructura de cada espacio. Clave = slug del archivo, valor = dict
ESPACIOS = {
    "habitaciones": {
        "Paula":       {"1": 98000,  "2": 80000,  "3": 75000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
        "Unicornio":   {"1": 98000,  "2": 80000,  "3": 75000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
    },
    "lofts": {
        "ArcaLuz":      {"1": 110000, "2": 85000,  "3": 75000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
        "PatioAzul":    {"1": 98000,  "2": 79000,  "3": 65000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
    },
    "suites": {
        "SanFrancisco": {"1": 110000, "2": 85000,  "3": 75000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
        "Torreon":      {"1": 150000, "2": 130000, "3": 120000, "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
    },
    "cabanas": {
        "AyMar":            {"1": 78000,  "2": 68000,  "3": 60000,  "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
        "PoetaDelTiempo":   {"1": 130000, "2": 120000, "3": 110000, "booking": "https://www.booking.com/hotel/cl/casa-cuento.es.html", "expedia": "https://www.expedia.com/Hotel-Search?destination=Refugio+CasaCuento", "airbnb": "https://www.airbnb.com/s/Refugio-CasaCuento"},
    },
}


def fmt_precio(n: int) -> str:
    """100000 -> '$ 100.000'"""
    return f"$ {n:,}".replace(",", ".")


def build_estado_card(espacio_nombre: str) -> str:
    """Card con badge de estado (placeholder, se actualiza via JS con data/availability.json)."""
    return f'''<div class="estado-card" data-espacio="{espacio_nombre}">
          <div class="estado-badge" data-estado-badge>...</div>
          <div class="estado-label">Estado</div>
          <div class="estado-help">Disponibilidad actualizada desde
            <a href="mailto:refugiocasacuento@gmail.com">refugiocasacuento@gmail.com</a>
          </div>
        </div>'''


def build_precios_card(precios: dict) -> str:
    """Tabla compacta de precios por noche."""
    return f'''<div class="precios-card">
          <div class="precios-titulo">Valores por noche</div>
          <table class="precios-tabla">
            <thead>
              <tr><th>1 Noche</th><th>2 Noches</th><th>3 Noches</th><th>+3 Noches</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>{fmt_precio(precios["1"])}</td>
                <td>{fmt_precio(precios["2"])}</td>
                <td>{fmt_precio(precios["3"])}</td>
                <td><strong>A Cotizar</strong> via WhatsApp</td>
              </tr>
            </tbody>
          </table>
        </div>'''


def build_dropdown_booking(precios: dict) -> str:
    """Dropdown con Booking, Expedia, Airbnb. data-sitio es un selector CSS
    que el JS de includes.js intercepta para mostrar/ocultar el menu."""
    return f'''<div class="booking-dropdown" data-sitio="dropdown">
          <button type="button" class="btn btn-bosque btn-bosque-dropdown" aria-haspopup="true" aria-expanded="false">
            Ver sitios de alianza
            <span class="caret">▾</span>
          </button>
          <ul class="booking-dropdown-menu" role="menu">
            <li><a role="menuitem" href="{precios["booking"]}" target="_blank" rel="noopener">Booking.com</a></li>
            <li><a role="menuitem" href="{precios["expedia"]}" target="_blank" rel="noopener">Expedia</a></li>
            <li><a role="menuitem" href="{precios["airbnb"]}" target="_blank" rel="noopener">Airbnb</a></li>
          </ul>
        </div>'''


def replace_booking_link(html: str, espacio_nombre: str, html_path: Path) -> str:
    """Reemplaza el <a href='...booking.com...' ...>Ver en Booking</a> por las 3 cards."""
    import re
    patron = re.compile(
        r'<a href="https://www\.booking\.com/hostal/cl/casa-cuento\.es\.html"[^>]*>\s*Ver en Booking\s*</a>',
        re.IGNORECASE
    )
    if not patron.search(html):
        # Si no esta el patron, intentar otra variante
        patron = re.compile(
            r'<a [^>]*booking\.com[^>]*>\s*Ver en Booking\s*</a>',
            re.IGNORECASE
        )
    espacio = ESPACIOS[html_path.stem][espacio_nombre]
    replacement = (
        build_estado_card(espacio_nombre) + "\n"
        + build_precios_card(espacio) + "\n"
        + build_dropdown_booking(espacio)
    )
    return patron.sub(replacement, html)


def nombre_archivo_a_espacio(html_path: Path) -> str:
    """habitaciones.html -> habitaciones"""
    return html_path.stem


def process_file(html_path: Path):
    """Lee el HTML, reemplaza el link de Booking, escribe."""
    contenido = html_path.read_text(encoding="utf-8")
    original = contenido

    # Detectar cada espacio presente en el HTML (busca titulo o id)
    # Estrategia: el nombre aparece como heading o atributo id del articulo.
    espacios_en_archivo = list(ESPACIOS[html_path.stem].keys())

    for espacio_nombre in espacios_en_archivo:
        contenido = replace_booking_link(contenido, espacio_nombre, html_path)

    if contenido != original:
        html_path.write_text(contenido, encoding="utf-8")
        print(f"  {html_path.relative_to(ROOT)}: {len(espacios_en_archivo)} espacios actualizados")
    else:
        print(f"  {html_path.relative_to(ROOT)}: sin cambios (no se encontro el link de Booking)")


if __name__ == "__main__":
    print("Modificando archivos de espacios...")
    for nombre in ("habitaciones", "lofts", "suites", "cabanas"):
        path = ROOT / f"{nombre}.html"
        if path.exists():
            process_file(path)
        else:
            print(f"  {path.relative_to(ROOT)}: no existe")
    print("Listo.")
