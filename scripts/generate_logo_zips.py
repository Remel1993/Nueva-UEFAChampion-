import os
import re
import unicodedata
import zipfile

def get_slug(name):
    nfkd = unicodedata.normalize('NFKD', name)
    no_accents = "".join([c for c in nfkd if not unicodedata.combining(c)])
    slug = re.sub(r'[^a-zA-Z0-9]+', '_', no_accents).lower()
    return slug.strip('_')

# Lista de todos los equipos del juego con sus colores oficiales
TEAMS = [
    # España 1
    ("Real Madrid", "#ffffff", "#1e3a8a", "ES", 1),
    ("FC Barcelona", "#a71930", "#004d98", "ES", 1),
    ("Atlético Madrid", "#cb3524", "#ffffff", "ES", 1),
    ("Villarreal CF", "#facc15", "#1e3a8a", "ES", 1),
    ("Real Sociedad", "#004d98", "#ffffff", "ES", 1),
    ("Athletic Club", "#cb3524", "#000000", "ES", 1),
    ("Girona FC", "#cb3524", "#ffffff", "ES", 1),
    ("Real Betis", "#16a34a", "#ffffff", "ES", 1),
    ("Valencia CF", "#ffffff", "#000000", "ES", 1),
    ("Sevilla FC", "#ffffff", "#cb3524", "ES", 1),
    ("Osasuna", "#cb3524", "#1e3a8a", "ES", 1),
    ("Getafe", "#1e3a8a", "#ffffff", "ES", 1),
    ("Celta Vigo", "#87d3f8", "#ffffff", "ES", 1),
    ("Mallorca", "#cb3524", "#000000", "ES", 1),
    ("Rayo Vallecano", "#ffffff", "#cb3524", "ES", 1),
    ("Elche CF", "#ffffff", "#006400", "ES", 1),
    ("Alavés", "#1e3a8a", "#ffffff", "ES", 1),
    ("Levante UD", "#a71930", "#004d98", "ES", 1),
    ("Real Oviedo", "#00529f", "#ffffff", "ES", 1),
    ("Espanyol", "#004d98", "#ffffff", "ES", 1),
    # España 2
    ("Almería", "#e30613", "#ffffff", "ES", 2),
    ("Cádiz CF", "#fde100", "#0000ff", "ES", 2),
    ("Granada CF", "#c8102e", "#ffffff", "ES", 2),
    ("SD Eibar", "#a71930", "#004d98", "ES", 2),
    ("Sporting Gijón", "#e30613", "#ffffff", "ES", 2),
    ("Valladolid", "#ffffff", "#951b81", "ES", 2),
    ("Las Palmas", "#facc15", "#1e3a8a", "ES", 2),
    ("Real Zaragoza", "#ffffff", "#00529f", "ES", 2),
    ("Racing Santander", "#ffffff", "#006400", "ES", 2),
    ("Leganés", "#ffffff", "#1e3a8a", "ES", 2),
    ("CD Tenerife", "#ffffff", "#00529f", "ES", 2),
    ("Burgos CF", "#ffffff", "#000000", "ES", 2),
    ("SD Huesca", "#a71930", "#004d98", "ES", 2),
    ("Málaga CF", "#ffffff", "#87ceeb", "ES", 2),
    ("Dep. La Coruña", "#ffffff", "#00529f", "ES", 2),
    ("Castellón", "#000000", "#ffffff", "ES", 2),
    ("Córdoba CF", "#ffffff", "#006400", "ES", 2),
    ("Albacete", "#ffffff", "#8b0000", "ES", 2),
    ("Mirandés", "#e30613", "#000000", "ES", 2),
    ("Eldense", "#e30613", "#0000ff", "ES", 2),
    
    # Inglaterra 1
    ("Manchester City", "#6caee0", "#ffffff", "EN", 1),
    ("Liverpool FC", "#c8102e", "#f6eb61", "EN", 1),
    ("Arsenal FC", "#ef0107", "#ffffff", "EN", 1),
    ("Aston Villa", "#95bfe5", "#670e36", "EN", 1),
    ("Tottenham", "#ffffff", "#132257", "EN", 1),
    ("Chelsea FC", "#034694", "#ffffff", "EN", 1),
    ("Man United", "#da291c", "#fbe122", "EN", 1),
    ("Newcastle", "#ffffff", "#000000", "EN", 1),
    ("West Ham", "#7a263a", "#1bb1e7", "EN", 1),
    ("Brighton", "#0057b8", "#ffffff", "EN", 1),
    ("Wolves", "#facc15", "#000000", "EN", 1),
    ("Bournemouth", "#cb3524", "#000000", "EN", 1),
    ("Fulham", "#ffffff", "#000000", "EN", 1),
    ("Crystal Palace", "#1e3a8a", "#cb3524", "EN", 1),
    ("Brentford", "#cb3524", "#ffffff", "EN", 1),
    ("Everton", "#003399", "#ffffff", "EN", 1),
    ("Nottingham Forest", "#cb3524", "#ffffff", "EN", 1),
    ("Leeds United", "#ffffff", "#1d428a", "EN", 1),
    ("Burnley", "#6c1d45", "#87ceeb", "EN", 1),
    ("Sunderland", "#ff0000", "#ffffff", "EN", 1),
    # Inglaterra 2
    ("Leicester City", "#1e3a8a", "#ffffff", "EN", 2),
    ("Ipswich Town", "#1e3a8a", "#ffffff", "EN", 2),
    ("Sheffield United", "#ee2737", "#ffffff", "EN", 2),
    ("Luton Town", "#f78f1e", "#000000", "EN", 2),
    ("West Bromwich", "#002f68", "#ffffff", "EN", 2),
    ("Norwich City", "#fff200", "#00a650", "EN", 2),
    ("Southampton", "#cb3524", "#ffffff", "EN", 2),
    ("Middlesbrough", "#e30613", "#ffffff", "EN", 2),
    ("Coventry City", "#87ceeb", "#ffffff", "EN", 2),
    ("Hull City", "#f5a12d", "#000000", "EN", 2),
    ("Watford", "#fbee21", "#ed2127", "EN", 2),
    ("Bristol City", "#e30613", "#ffffff", "EN", 2),
    ("Swansea City", "#ffffff", "#000000", "EN", 2),
    ("Preston N.E.", "#ffffff", "#000040", "EN", 2),
    ("QPR", "#ffffff", "#0033a0", "EN", 2),
    ("Stoke City", "#e30613", "#ffffff", "EN", 2),
    ("Sheffield Wed", "#0033a0", "#ffffff", "EN", 2),
    ("Blackburn", "#0033a0", "#ffffff", "EN", 2),
    ("Millwall", "#000040", "#ffffff", "EN", 2),
    ("Derby County", "#ffffff", "#000000", "EN", 2),

    # Italia 1
    ("Inter Milan", "#003399", "#000000", "IT", 1),
    ("Juventus", "#ffffff", "#000000", "IT", 1),
    ("AC Milan", "#fb090b", "#000000", "IT", 1),
    ("Napoli", "#00bfff", "#ffffff", "IT", 1),
    ("AS Roma", "#8e1f2f", "#f0bc42", "IT", 1),
    ("Atalanta", "#1e71b8", "#000000", "IT", 1),
    ("Lazio", "#87d3f8", "#ffffff", "IT", 1),
    ("Fiorentina", "#4b2e83", "#ffffff", "IT", 1),
    ("Bologna", "#a71930", "#1e3a8a", "IT", 1),
    ("Torino", "#8b0000", "#ffffff", "IT", 1),
    ("Sassuolo", "#000000", "#00a650", "IT", 1),
    ("Genoa", "#a71930", "#1e3a8a", "IT", 1),
    ("Lecce", "#facc15", "#cb3524", "IT", 1),
    ("Udinese", "#ffffff", "#000000", "IT", 1),
    ("Cagliari", "#a71930", "#1e3a8a", "IT", 1),
    ("Pisa", "#000000", "#0033a0", "IT", 1),
    ("Verona", "#facc15", "#1e3a8a", "IT", 1),
    ("Parma", "#ffffff", "#000000", "IT", 1),
    ("Como", "#1e3a8a", "#ffffff", "IT", 1),
    ("Cremonese", "#8b0000", "#a9a9a9", "IT", 1),
    # Italia 2
    ("Monza", "#ffffff", "#cb3524", "IT", 2),
    ("Frosinone", "#ffcc00", "#0033a0", "IT", 2),
    ("Salernitana", "#8b0000", "#ffffff", "IT", 2),
    ("Sampdoria", "#0033a0", "#ffffff", "IT", 2),
    ("Palermo", "#ffc0cb", "#000000", "IT", 2),
    ("Venezia", "#fb923c", "#16a34a", "IT", 2),
    ("Brescia", "#0033a0", "#ffffff", "IT", 2),
    ("Bari", "#ffffff", "#e30613", "IT", 2),
    ("Empoli", "#1e3a8a", "#ffffff", "IT", 2),
    ("Spezia", "#ffffff", "#000000", "IT", 2),
    ("Catanzaro", "#ffcc00", "#e30613", "IT", 2),
    ("Reggiana", "#8b0000", "#ffffff", "IT", 2),
    ("Südtirol", "#ffffff", "#e30613", "IT", 2),
    ("Modena", "#ffcc00", "#0033a0", "IT", 2),
    ("Cosenza", "#0033a0", "#e30613", "IT", 2),
    ("Cittadella", "#8b0000", "#ffffff", "IT", 2),
    ("Mantova", "#ffffff", "#e30613", "IT", 2),
    ("Cesena", "#ffffff", "#000000", "IT", 2),
    ("Juve Stabia", "#ffcc00", "#0033a0", "IT", 2),
    ("Carrarese", "#ffcc00", "#0033a0", "IT", 2),

    # Alemania 1
    ("Bayern Munich", "#dc052d", "#ffffff", "DE", 1),
    ("B. Dortmund", "#fde100", "#000000", "DE", 1),
    ("B. Leverkusen", "#e32221", "#000000", "DE", 1),
    ("RB Leipzig", "#ffffff", "#dd013f", "DE", 1),
    ("VfB Stuttgart", "#ffffff", "#e32221", "DE", 1),
    ("E. Frankfurt", "#000000", "#e32221", "DE", 1),
    ("SC Freiburg", "#000000", "#ffffff", "DE", 1),
    ("M'gladbach", "#000000", "#ffffff", "DE", 1),
    ("Wolfsburg", "#009d00", "#ffffff", "DE", 1),
    ("Werder Bremen", "#1d9053", "#ffffff", "DE", 1),
    ("Union Berlin", "#d71920", "#f6d800", "DE", 1),
    ("Hoffenheim", "#004f9f", "#ffffff", "DE", 1),
    ("Augsburg", "#ba3733", "#ffffff", "DE", 1),
    ("Mainz 05", "#ed1c24", "#ffffff", "DE", 1),
    ("FC Köln", "#e30613", "#ffffff", "DE", 1),
    ("Heidenheim", "#e2001a", "#ffffff", "DE", 1),
    ("St. Pauli", "#754b29", "#ffffff", "DE", 1),
    ("Hamburger SV", "#ffffff", "#0033a0", "DE", 1),
    # Alemania 2
    ("VfL Bochum", "#005ca9", "#ffffff", "DE", 2),
    ("Darmstadt 98", "#0033a0", "#ffffff", "DE", 2),
    ("Holstein Kiel", "#0053a4", "#ffffff", "DE", 2),
    ("Hertha BSC", "#0033a0", "#ffffff", "DE", 2),
    ("Schalke 04", "#0033a0", "#ffffff", "DE", 2),
    ("Hannover 96", "#e30613", "#000000", "DE", 2),
    ("F. Düsseldorf", "#e30613", "#ffffff", "DE", 2),
    ("Karlsruher SC", "#0033a0", "#ffffff", "DE", 2),
    ("FC Nürnberg", "#8b0000", "#ffffff", "DE", 2),
    ("SC Paderborn", "#000000", "#0033a0", "DE", 2),
    ("Greuther Fürth", "#00a650", "#ffffff", "DE", 2),
    ("SV Elversberg", "#ffffff", "#000000", "DE", 2),
    ("FC Magdeburg", "#0033a0", "#ffffff", "DE", 2),
    ("E. Braunschweig", "#ffcc00", "#0033a0", "DE", 2),
    ("Kaiserslautern", "#e30613", "#ffffff", "DE", 2),
    ("SSV Ulm", "#000000", "#ffffff", "DE", 2),
    ("Preußen Münster", "#00a650", "#000000", "DE", 2),
    ("Jahn Regensburg", "#ffffff", "#e30613", "DE", 2),

    # Francia 1
    ("PSG", "#004170", "#da291c", "FR", 1),
    ("AS Monaco", "#e30613", "#ffffff", "FR", 1),
    ("Marseille", "#ffffff", "#009dff", "FR", 1),
    ("Lille OSC", "#e2001a", "#002654", "FR", 1),
    ("Olympique Lyon", "#ffffff", "#da291c", "FR", 1),
    ("RC Lens", "#ed1c24", "#ffcc00", "FR", 1),
    ("OGC Nice", "#000000", "#e30613", "FR", 1),
    ("Stade Rennais", "#e2001a", "#000000", "FR", 1),
    ("Paris FC", "#0033a0", "#ffffff", "FR", 1),
    ("Strasbourg", "#00529f", "#ffffff", "FR", 1),
    ("Toulouse", "#542f88", "#ffffff", "FR", 1),
    ("FC Lorient", "#f68712", "#000000", "FR", 1),
    ("FC Nantes", "#fdf200", "#006532", "FR", 1),
    ("Brest", "#e2001a", "#ffffff", "FR", 1),
    ("Le Havre", "#00529f", "#87ceeb", "FR", 1),
    ("AJ Auxerre", "#ffffff", "#00529f", "FR", 1),
    ("Angers SCO", "#000000", "#ffffff", "FR", 1),
    ("FC Metz", "#6c1d45", "#ffffff", "FR", 1),
    # Francia 2
    ("Clermont Foot", "#e30613", "#0033a0", "FR", 2),
    ("Valenciennes FC", "#e30613", "#ffffff", "FR", 2),
    ("Chamois Niortais", "#ffcc00", "#006400", "FR", 2),
    ("Stade Reims", "#e30613", "#ffffff", "FR", 2),
    ("Rodez AF", "#e30613", "#ffcc00", "FR", 2),
    ("SM Caen", "#0033a0", "#e30613", "FR", 2),
    ("EA Guingamp", "#e30613", "#000000", "FR", 2),
    ("Amiens SC", "#ffffff", "#000000", "FR", 2),
    ("SC Bastia", "#0033a0", "#ffffff", "FR", 2),
    ("Pau FC", "#ffcc00", "#0033a0", "FR", 2),
    ("Grenoble Foot", "#0033a0", "#ffffff", "FR", 2),
    ("FC Annecy", "#e30613", "#ffffff", "FR", 2),
    ("ES Troyes AC", "#0033a0", "#ffffff", "FR", 2),
    ("AC Ajaccio", "#ffffff", "#e30613", "FR", 2),
    ("USL Dunkerque", "#87ceeb", "#ffffff", "FR", 2),
    ("Red Star FC", "#00a650", "#ffffff", "FR", 2),
    ("Saint-Étienne", "#006532", "#ffffff", "FR", 2),
    ("Montpellier", "#0033a0", "#f68712", "FR", 2),

    # Holanda 1
    ("PSV Eindhoven", "#ff0000", "#ffffff", "NL", 1),
    ("Feyenoord", "#ff0000", "#ffffff", "NL", 1),
    ("Ajax", "#ffffff", "#ff0000", "NL", 1),
    ("AZ Alkmaar", "#ff0000", "#ffffff", "NL", 1),
    ("FC Twente", "#ff0000", "#ffffff", "NL", 1),
    ("Utrecht", "#ff0000", "#ffffff", "NL", 1),
    ("Sparta Rotterdam", "#ff0000", "#ffffff", "NL", 1),
    ("Go Ahead Eagles", "#ff0000", "#ffff00", "NL", 1),
    ("NEC Nijmegen", "#ff0000", "#000000", "NL", 1),
    ("Heerenveen", "#0000ff", "#ffffff", "NL", 1),
    ("Fortuna Sittard", "#ffff00", "#16a34a", "NL", 1),
    ("Heracles Almelo", "#000000", "#ffffff", "NL", 1),
    ("PEC Zwolle", "#00bfff", "#ffffff", "NL", 1),
    ("FC Volendam", "#f5a12d", "#000000", "NL", 1),
    ("Excelsior", "#000000", "#e30613", "NL", 1),
    ("SC Telstar", "#ffffff", "#0033a0", "NL", 1),
    ("Groningen", "#16a34a", "#ffffff", "NL", 1),
    ("NAC Breda", "#ffff00", "#000000", "NL", 1),
    # Holanda 2
    ("Willem II", "#ff0000", "#ffffff", "NL", 2),
    ("Vitesse", "#ffcc00", "#000000", "NL", 2),
    ("Almere City", "#ff0000", "#000000", "NL", 2),
    ("De Graafschap", "#0033a0", "#ffffff", "NL", 2),
    ("ADO Den Haag", "#00a650", "#ffcc00", "NL", 2),
    ("SC Cambuur", "#ffcc00", "#0033a0", "NL", 2),
    ("FC Emmen", "#e30613", "#ffffff", "NL", 2),
    ("Roda JC", "#ffcc00", "#000000", "NL", 2),
    ("MVV Maastricht", "#e30613", "#ffffff", "NL", 2),
    ("VVV-Venlo", "#ffcc00", "#000000", "NL", 2),
    ("FC Dordrecht", "#00a650", "#ffffff", "NL", 2),
    ("Helmond Sport", "#e30613", "#000000", "NL", 2),
    ("FC Eindhoven", "#0033a0", "#ffffff", "NL", 2),
    ("RKC Waalwijk", "#ffff00", "#1e3a8a", "NL", 2),
    ("TOP Oss", "#e30613", "#ffffff", "NL", 2),
    ("FC Den Bosch", "#0033a0", "#ffffff", "NL", 2),
    ("Jong Ajax", "#ffffff", "#e30613", "NL", 2),
    ("Jong PSV", "#ff0000", "#ffffff", "NL", 2),

    # Miscelánea Europa 1 y 2
    ("FC Porto", "#003399", "#ffffff", "MI", 1),
    ("Benfica", "#e30613", "#ffffff", "MI", 1),
    ("Sporting CP", "#006532", "#ffffff", "MI", 1),
    ("Celtic FC", "#006532", "#ffffff", "MI", 1),
    ("Rangers FC", "#0033a0", "#ffffff", "MI", 1),
    ("Galatasaray", "#a32638", "#fdb913", "MI", 1),
    ("Fenerbahçe", "#0033a0", "#fdb913", "MI", 1),
    ("Olympiacos", "#e30613", "#ffffff", "MI", 1),
    ("Panathinaikos", "#006532", "#ffffff", "MI", 1),
    ("Club Brugge", "#0033a0", "#000000", "MI", 1),
    ("Anderlecht", "#542f88", "#ffffff", "MI", 1),
    ("RB Salzburg", "#ffffff", "#e30613", "MI", 1),
    ("Slavia Praga", "#e30613", "#ffffff", "MI", 1),
    ("Sparta Praga", "#a32638", "#0033a0", "MI", 1),
    ("Dinamo Zagreb", "#0033a0", "#ffffff", "MI", 1),
    ("Estrella Roja", "#e30613", "#ffffff", "MI", 1),
    ("FC Copenhague", "#ffffff", "#0033a0", "MI", 1),
    ("Malmö FF", "#87ceeb", "#ffffff", "MI", 1),
    ("Shakhtar D.", "#f68712", "#000000", "MI", 1),
    ("Dynamo Kyiv", "#ffffff", "#0033a0", "MI", 1),
    ("SC Braga", "#e30613", "#ffffff", "MI", 2),
    ("Besiktas", "#000000", "#ffffff", "MI", 2),
    ("AEK Athens", "#fde100", "#000000", "MI", 2),
    ("PAOK", "#000000", "#ffffff", "MI", 2),
    ("KRC Genk", "#0033a0", "#ffffff", "MI", 2),
    ("Royal Antwerp", "#e30613", "#ffffff", "MI", 2),
    ("Young Boys", "#ffd700", "#000000", "MI", 2),
    ("FC Basel", "#e30613", "#0033a0", "MI", 2),
    ("Trabzonspor", "#8b0000", "#87ceeb", "MI", 2),
    ("Hajduk Split", "#ffffff", "#0033a0", "MI", 2),
    ("FC Midtjylland", "#000000", "#e30613", "MI", 2),
    ("Brøndby IF", "#ffd700", "#0033a0", "MI", 2),
    ("Sturm Graz", "#000000", "#ffffff", "MI", 2),
    ("Viktoria Plzen", "#e30613", "#0033a0", "MI", 2),
    ("Ferencvaros", "#00a650", "#ffffff", "MI", 2),
    ("Ludogorets", "#00a650", "#ffffff", "MI", 2),
    ("Bodo/Glimt", "#ffff00", "#000000", "MI", 2),
    ("Qarabag FK", "#000000", "#ffffff", "MI", 2),
    ("Maccabi Tel Aviv", "#ffd700", "#0033a0", "MI", 2),
    ("Legia Warsaw", "#ffffff", "#000000", "MI", 2)
]

def generate_custom_svg(name, c1, c2):
    """Genera un escudo heráldico estilizado libre de derechos de autor con la paleta de colores del club"""
    initial = name[0].upper()
    sub_init = name.split()[-1][0].upper() if len(name.split()) > 1 else ""
    
    # Texto de iniciales (máximo 2-3 letras limpias)
    monogram = (initial + sub_init) if sub_init and sub_init != initial else initial

    # Color de texto contrastante
    text_color = "#ffffff" if c1.lower() in ["#000000", "#1e3a8a", "#0033a0", "#003399", "#8b0000", "#a71930", "#006532", "#542f88", "#004170", "#002654"] else "#0f172a"
    border_color = "#f59e0b" if ("#fde100" in [c1.lower(), c2.lower()] or "#facc15" in [c1.lower(), c2.lower()]) else "#ffffff"

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs>
    <linearGradient id="grad_{get_slug(name)}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{c1}" />
      <stop offset="50%" stop-color="{c1}" />
      <stop offset="50%" stop-color="{c2}" />
      <stop offset="100%" stop-color="{c2}" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Escudo Base -->
  <path d="M 20 20 L 180 20 Q 180 140 100 220 Q 20 140 20 20 Z" 
        fill="url(#grad_{get_slug(name)})" 
        stroke="{border_color}" 
        stroke-width="8" 
        stroke-linejoin="round"
        filter="url(#shadow)" />

  <!-- Franja Diagonal Interna Decorativa -->
  <path d="M 20 20 L 180 140 L 180 170 L 20 50 Z" fill="rgba(255,255,255,0.15)" />

  <!-- Aro Central Emblema -->
  <circle cx="100" cy="95" r="42" fill="#0f172a" stroke="{border_color}" stroke-width="4" opacity="0.9" />

  <!-- Monograma de Letras -->
  <text x="100" y="108" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="34" 
        font-weight="900" 
        font-style="italic"
        fill="#ffffff" 
        text-anchor="middle"
        letter-spacing="1">
    {monogram}
  </text>

  <!-- Estrellas / Detalles Heráldicos -->
  <polygon points="100,28 104,36 112,36 106,41 108,49 100,44 92,49 94,41 88,36 96,36" fill="#fbbf24" stroke="#d97706" stroke-width="0.8"/>
  
  <!-- Mini Balón Clásico Abajo -->
  <circle cx="100" cy="170" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
  <polygon points="100,163 105,167 103,173 97,173 95,167" fill="#0f172a"/>
</svg>'''
    return svg

def build_zip_packs():
    os.makedirs("public", exist_ok=True)
    os.makedirs("public/crests", exist_ok=True)

    # 1. ZIP: LOGOS EDITADOS / CRESTAS VECTORIALES SIN COPYRIGHT
    custom_zip_path = "public/escudos_editados_sin_copyright.zip"
    with zipfile.ZipFile(custom_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        readme_text = """PAQUETE DE ESCUDOS VECTORIALES (100% LIBRES DE COPYRIGHT)
========================================================================

Este paquete contiene escudos geométricos heráldicos estilizados y modernos
para TODOS los clubes del juego:
- Paletas de colores oficiales y degradados refinados
- Monogramas tipográficos de cada club
- 100% libre de marcas registradas o copyright protegidos para publicación en tiendas.

¿CÓMO USARLOS?
1. Descomprime este archivo ZIP.
2. Copia todos los archivos .png / .svg directamente dentro de la carpeta:
   public/crests/
3. La aplicación los reconocerá y mostrará de inmediato en todas las pantallas.
"""
        z.writestr("LEEME_INSTRUCCIONES.txt", readme_text)

        for name, c1, c2, league, div in TEAMS:
            slug = get_slug(name)
            svg_content = generate_custom_svg(name, c1, c2)
            # Guardar como SVG y también preparar entrada
            z.writestr(f"escudos_vectoriales/{slug}.svg", svg_content)
            # Para máxima compatibilidad con el juego directo
            z.writestr(f"para_pegar_en_public_crests/{slug}.png", svg_content)

    # 2. ZIP: PLANTILLA Y GUÍA PARA LOGOS OFICIALES
    official_zip_path = "public/plantilla_logos_oficiales.zip"
    with zipfile.ZipFile(official_zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        guide_text = """PAQUETE Y ESTRUCTURA PARA LOGOS OFICIALES
========================================================================

Este archivo ZIP contiene la estructura exacta de nombres de archivo PNG
para que puedas colocar tus propios escudos oficiales descargados de internet
o de packs comunitarios (ej. megapacks de Football Manager / PES).

¿CÓMO REEMPLAZAR POR TUS ESCUDOS REALES?
1. Consigue las imágenes de los escudos oficiales en formato PNG con fondo transparente.
2. Renombra la imagen de cada equipo exactamente con el nombre de archivo que viene aquí
   (ejemplo: real_madrid.png, fc_barcelona.png, manchester_city.png, etc.).
3. Copia todas las imágenes a la carpeta de tu juego:
   public/crests/

LISTADO COMPLETO DE NOMBRES INCLUIDOS EN ESTE ZIP:
"""
        for name, c1, c2, league, div in TEAMS:
            slug = get_slug(name)
            guide_text += f"\n- {slug}.png  -->  {name} ({league} Div {div})"
            placeholder_svg = generate_custom_svg(name, c1, c2)
            z.writestr(f"logos_por_liga/{league}_Div{div}/{slug}.png", placeholder_svg)

        z.writestr("GUIA_DE_NOMBRES.txt", guide_text)

    print("Zips creados exitosamente en /public/!")

if __name__ == "__main__":
    build_zip_packs()
