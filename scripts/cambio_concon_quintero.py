"""Cambiar Concón por Quintero en index.html, segun instrucciones de la usuaria."""
from pathlib import Path

p = Path("C:/Users\Heidi\IdeaProjects\RefugioCasaCuento/index.html")
text = p.read_text(encoding="utf-8")

# Reemplazos pedidos:
# "Habitaciones equipadas, piscina, áreas verdes y un toque mágico en
#  plena costa de la V Región. Tu escape perfecto en Mantagua, Concón."
# ->
#  "...Quintero, frente a la playa Ritoque y a 2.5km de la rotonda de Concón."
old = ("Habitaciones equipadas, piscina, áreas verdes y un toque mágico en "
        "plena costa de la V Región. Tu escape perfecto en Mantagua, Concón.")
new = ("Habitaciones equipadas, piscina, áreas verdes y un toque mágico en "
        "plena costa de la V Región. Tu escape perfecto en Quintero, "
        "frente a la playa Ritoque y a 2.5km de la rotonda de Concón.")

if old in text:
    text = text.replace(old, new)
    print("OK: parrafo principal actualizado")
else:
    print("WARN: parrafo principal NO encontrado, revisar")

p.write_text(text, encoding="utf-8")
print(f"Guardado: {p}")
