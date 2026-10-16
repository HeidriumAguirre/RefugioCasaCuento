"""Cambio global: hotel -> hostal en todo el repo."""
import re
from pathlib import Path

ROOT = Path("C:/Users/Heidi/IdeaProjects/RefugioCasaCuento")

# Word boundary + case-insensitive, pero sin pisar palabras como
# "hostal" (que empieza con h-o-s-t-a) ni "Hostal".
# Patron: \bhotel\b captura "hotel" "Hotel" "HOTEL" pero NO
# "hostel" (que seria \bhostel\b) ni "hostal" (que seria \bhostal\b).
patron = re.compile(r"\bhotel\b", re.IGNORECASE)

cambios = []
for path in ROOT.rglob("*"):
    if not path.is_file():
        continue
    if path.suffix not in (".html", ".css", ".js", ".md"):
        continue
    # Saltar partials que se inyectan dinamicamente (los toco igual)
    try:
        texto = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    nuevo = patron.sub(lambda m: m.group(0).replace("h", "H", 1).replace("otel", "ostal").replace("OTEL", "OSTAL").replace("OTEL", "OSTAL"), texto)
    # El lambda de arriba es complicado. Mas simple: capturar y reemplazar.
    def _repl(m):
        original = m.group(0)
        # Mantener el case del primer caracter
        if original[0].isupper():
            return "Hostal"
        return "hostal"
    nuevo = patron.sub(_repl, texto)
    if nuevo != texto:
        cambios.append((path, texto.count("hotel") + texto.count("Hotel") + texto.count("HOTEL")))
        path.write_text(nuevo, encoding="utf-8")

print(f"Archivos modificados: {len(cambios)}")
for path, n in cambios:
    print(f"  {path.relative_to(ROOT)}  ({n} reemplazos)")
