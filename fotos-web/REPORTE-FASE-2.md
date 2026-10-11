# Selección de fotos y videos - Fase 2

Reporte de la selección automática hecha para Refugio CasaCuento.

## Criterio de selección

**Fotos:** por cada categoría, se seleccionaron las N con mayor peso de archivo (proxy de calidad). Se descartaron las de resolución menor a 960x720. Cada foto fue convertida a WebP optimizado (calidad 80, max 1920px ancho).

**Videos:** se comprimieron todos a 720p H.264 (CRF 28, preset slow) sin audio, y se mantuvo solo 1 por categoría (el más corto en MB) en la carpeta web. El resto se guardó en `Material-para-redes/`.

## Resultado: fotos en web

| Categoría | Total originales | Seleccionadas | Peso original | Peso WebP | Reducción |
|---|---:|---:|---:|---:|---:|
| Cabaña AyMar | 3 | 3 | 330 KB | 263 KB | 20% |
| Cabaña PoetaDelTiempo | 46 | 8 | 3.4 MB | 1.2 MB | 63% |
| Habitación Paula | 1 | 1 | 374 KB | 305 KB | 19% |
| Habitación Unicornio | 2 | 2 | 395 KB | 173 KB | 56% |
| Loft ArcaLuz | 18 | 6 | 1.2 MB | 837 KB | 32% |
| Loft PatioAzul | 4 | 4 | 1.1 MB | 526 KB | 52% |
| Suite San Francisco | 3 | 2 | 466 KB | 339 KB | 27% |
| Suite Torreón | 8 | 6 | 2.0 MB | 714 KB | 64% |
| Galería general | 18 | 11 | 2.4 MB | 968 KB | 59% |
| **TOTAL** | **103** | **43** | **11.7 MB** | **5.3 MB** | **55%** |

## Resultado: videos en web

| Categoría | Total | Mantenidos | Peso comprimido |
|---|---:|---:|---:|
| Cabaña AyMar | 2 | 1 | 0.4 MB |
| Cabaña PoetaDelTiempo | 1 | 1 | 0.4 MB |
| Habitación Paula | 2 | 1 | 2.7 MB |
| Habitación Unicornio | 1 | 1 | 4.0 MB |
| Loft ArcaLuz | 1 | 1 | 0.9 MB |
| Loft PatioAzul | 1 | 1 | 2.0 MB |
| Suite San Francisco | 2 | 1 | 2.2 MB |
| Suite Torreón | 2 | 1 | 2.4 MB |
| Galería general | 2 | 1 | 8.7 MB |
| **TOTAL** | **14** | **9** | **23.7 MB** |

## Estructura en el repo

```
RefugioCasaCuento/
├── fotos-web/                    # 43 fotos, 5.3 MB
│   ├── cabana-aymar/         (3)
│   ├── cabana-poetadeltiempo/(8)
│   ├── habitacion-paula/     (1)
│   ├── habitacion-unicornio/ (2)
│   ├── loft-arcaluz/         (6)
│   ├── loft-patioazul/       (4)
│   ├── suite-sanfrancisco/   (2)
│   ├── suite-torreon/        (6)
│   └── galeria/              (11)
└── videos-web/                   # 9 videos, 23.7 MB
    ├── (mismas 8 categorías de alojamientos)
    └── generales/           (1)
```

## Material-para-redes (NO va al repo)

```
C:\Users\Heidi\Desktop\Alexis CasaCuento\Material-para-redes\
├── fotos-originales\         # 60 fotos no seleccionadas + todas las originales
└── videos-extras\            # 5 videos no seleccionados
└── videos-originales\        # 14 videos originales sin comprimir
```

## Notas

- La selección se hizo por **peso de archivo** como proxy de calidad. Si quieres cambiar alguna foto específica (porque viste una que te gusta más pero el script la descartó), solo dime cuál y la cambio.
- Las fotos con resolución menor a 960x720 se descartaron automáticamente (se ven borrosas en pantallas grandes).
- Los videos se recomprimieron sin audio porque en una web se usan como fondo o demostración silenciosa.
- Los videos originales (sin comprimir) están en `Material-para-redes/videos-originales/` por si quieres subir alguno a redes en mejor calidad.
