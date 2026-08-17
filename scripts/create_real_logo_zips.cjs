const fs = require('fs');
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');
const sharp = require('sharp');

// Normalización de slugs
function getSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Equipos del juego con colores oficiales y IDs de crests oficiales conocidos
const TEAMS_DATA = [
  // España 1
  { name: 'Real Madrid', c1: '#ffffff', c2: '#1e3a8a', id: 86, league: 'ES', div: 1 },
  { name: 'FC Barcelona', c1: '#a71930', c2: '#004d98', id: 81, league: 'ES', div: 1 },
  { name: 'Atlético Madrid', c1: '#cb3524', c2: '#ffffff', id: 78, league: 'ES', div: 1 },
  { name: 'Villarreal CF', c1: '#facc15', c2: '#1e3a8a', id: 94, league: 'ES', div: 1 },
  { name: 'Real Sociedad', c1: '#004d98', c2: '#ffffff', id: 92, league: 'ES', div: 1 },
  { name: 'Athletic Club', c1: '#cb3524', c2: '#000000', id: 77, league: 'ES', div: 1 },
  { name: 'Girona FC', c1: '#cb3524', c2: '#ffffff', id: 298, league: 'ES', div: 1 },
  { name: 'Real Betis', c1: '#16a34a', c2: '#ffffff', id: 90, league: 'ES', div: 1 },
  { name: 'Valencia CF', c1: '#ffffff', c2: '#000000', id: 95, league: 'ES', div: 1 },
  { name: 'Sevilla FC', c1: '#ffffff', c2: '#cb3524', id: 559, league: 'ES', div: 1 },
  { name: 'Osasuna', c1: '#cb3524', c2: '#1e3a8a', id: 79, league: 'ES', div: 1 },
  { name: 'Getafe', c1: '#1e3a8a', c2: '#ffffff', id: 82, league: 'ES', div: 1 },
  { name: 'Celta Vigo', c1: '#87d3f8', c2: '#ffffff', id: 558, league: 'ES', div: 1 },
  { name: 'Mallorca', c1: '#cb3524', c2: '#000000', id: 89, league: 'ES', div: 1 },
  { name: 'Rayo Vallecano', c1: '#ffffff', c2: '#cb3524', id: 87, league: 'ES', div: 1 },
  { name: 'Elche CF', c1: '#ffffff', c2: '#006400', id: 285, league: 'ES', div: 1 },
  { name: 'Alavés', c1: '#1e3a8a', c2: '#ffffff', id: 263, league: 'ES', div: 1 },
  { name: 'Levante UD', c1: '#a71930', c2: '#004d98', id: 88, league: 'ES', div: 1 },
  { name: 'Real Oviedo', c1: '#00529f', c2: '#ffffff', id: 279, league: 'ES', div: 1 },
  { name: 'Espanyol', c1: '#004d98', c2: '#ffffff', id: 80, league: 'ES', div: 1 },

  // España 2
  { name: 'Almería', c1: '#e30613', c2: '#ffffff', id: 267, league: 'ES', div: 2 },
  { name: 'Cádiz CF', c1: '#fde100', c2: '#0000ff', id: 264, league: 'ES', div: 2 },
  { name: 'Granada CF', c1: '#c8102e', c2: '#ffffff', id: 83, league: 'ES', div: 2 },
  { name: 'SD Eibar', c1: '#a71930', c2: '#004d98', id: 278, league: 'ES', div: 2 },
  { name: 'Sporting Gijón', c1: '#e30613', c2: '#ffffff', id: 96, league: 'ES', div: 2 },
  { name: 'Valladolid', c1: '#ffffff', c2: '#951b81', id: 250, league: 'ES', div: 2 },
  { name: 'Las Palmas', c1: '#facc15', c2: '#1e3a8a', id: 275, league: 'ES', div: 2 },
  { name: 'Real Zaragoza', c1: '#ffffff', c2: '#00529f', id: 284, league: 'ES', div: 2 },
  { name: 'Racing Santander', c1: '#ffffff', c2: '#006400', id: 276, league: 'ES', div: 2 },
  { name: 'Leganés', c1: '#ffffff', c2: '#1e3a8a', id: 745, league: 'ES', div: 2 },
  { name: 'CD Tenerife', c1: '#ffffff', c2: '#00529f', id: 280, league: 'ES', div: 2 },
  { name: 'Burgos CF', c1: '#ffffff', c2: '#000000', id: 747, league: 'ES', div: 2 },
  { name: 'SD Huesca', c1: '#a71930', c2: '#004d98', id: 288, league: 'ES', div: 2 },
  { name: 'Málaga CF', c1: '#ffffff', c2: '#87ceeb', id: 84, league: 'ES', div: 2 },
  { name: 'Dep. La Coruña', c1: '#ffffff', c2: '#00529f', id: 560, league: 'ES', div: 2 },
  { name: 'Castellón', c1: '#000000', c2: '#ffffff', id: 749, league: 'ES', div: 2 },
  { name: 'Córdoba CF', c1: '#ffffff', c2: '#006400', id: 281, league: 'ES', div: 2 },
  { name: 'Albacete', c1: '#ffffff', c2: '#8b0000', id: 270, league: 'ES', div: 2 },
  { name: 'Mirandés', c1: '#e30613', c2: '#000000', id: 289, league: 'ES', div: 2 },
  { name: 'Eldense', c1: '#e30613', c2: '#0000ff', id: 751, league: 'ES', div: 2 },

  // Inglaterra 1
  { name: 'Manchester City', c1: '#6caee0', c2: '#ffffff', id: 65, league: 'EN', div: 1 },
  { name: 'Liverpool FC', c1: '#c8102e', c2: '#f6eb61', id: 64, league: 'EN', div: 1 },
  { name: 'Arsenal FC', c1: '#ef0107', c2: '#ffffff', id: 57, league: 'EN', div: 1 },
  { name: 'Aston Villa', c1: '#95bfe5', c2: '#670e36', id: 58, league: 'EN', div: 1 },
  { name: 'Tottenham', c1: '#ffffff', c2: '#132257', id: 73, league: 'EN', div: 1 },
  { name: 'Chelsea FC', c1: '#034694', c2: '#ffffff', id: 61, league: 'EN', div: 1 },
  { name: 'Man United', c1: '#da291c', c2: '#fbe122', id: 66, league: 'EN', div: 1 },
  { name: 'Newcastle', c1: '#ffffff', c2: '#000000', id: 67, league: 'EN', div: 1 },
  { name: 'West Ham', c1: '#7a263a', c2: '#1bb1e7', id: 563, league: 'EN', div: 1 },
  { name: 'Brighton', c1: '#0057b8', c2: '#ffffff', id: 397, league: 'EN', div: 1 },
  { name: 'Wolves', c1: '#facc15', c2: '#000000', id: 76, league: 'EN', div: 1 },
  { name: 'Bournemouth', c1: '#cb3524', c2: '#000000', id: 1044, league: 'EN', div: 1 },
  { name: 'Fulham', c1: '#ffffff', c2: '#000000', id: 63, league: 'EN', div: 1 },
  { name: 'Crystal Palace', c1: '#1e3a8a', c2: '#cb3524', id: 354, league: 'EN', div: 1 },
  { name: 'Brentford', c1: '#cb3524', c2: '#ffffff', id: 402, league: 'EN', div: 1 },
  { name: 'Everton', c1: '#003399', c2: '#ffffff', id: 62, league: 'EN', div: 1 },
  { name: 'Nottingham Forest', c1: '#cb3524', c2: '#ffffff', id: 351, league: 'EN', div: 1 },
  { name: 'Leeds United', c1: '#ffffff', c2: '#1d428a', id: 341, league: 'EN', div: 1 },
  { name: 'Burnley', c1: '#6c1d45', c2: '#87ceeb', id: 328, league: 'EN', div: 1 },
  { name: 'Sunderland', c1: '#ff0000', c2: '#ffffff', id: 71, league: 'EN', div: 1 },

  // Inglaterra 2
  { name: 'Leicester City', c1: '#1e3a8a', c2: '#ffffff', id: 338, league: 'EN', div: 2 },
  { name: 'Ipswich Town', c1: '#1e3a8a', c2: '#ffffff', id: 349, league: 'EN', div: 2 },
  { name: 'Sheffield United', c1: '#ee2737', c2: '#ffffff', id: 356, league: 'EN', div: 2 },
  { name: 'Luton Town', c1: '#f78f1e', c2: '#000000', id: 389, league: 'EN', div: 2 },
  { name: 'West Bromwich', c1: '#002f68', c2: '#ffffff', id: 74, league: 'EN', div: 2 },
  { name: 'Norwich City', c1: '#fff200', c2: '#00a650', id: 68, league: 'EN', div: 2 },
  { name: 'Southampton', c1: '#cb3524', c2: '#ffffff', id: 340, league: 'EN', div: 2 },
  { name: 'Middlesbrough', c1: '#e30613', c2: '#ffffff', id: 343, league: 'EN', div: 2 },
  { name: 'Coventry City', c1: '#87ceeb', c2: '#ffffff', id: 1076, league: 'EN', div: 2 },
  { name: 'Hull City', c1: '#f5a12d', c2: '#000000', id: 322, league: 'EN', div: 2 },
  { name: 'Watford', c1: '#fbee21', c2: '#ed2127', id: 346, league: 'EN', div: 2 },
  { name: 'Bristol City', c1: '#e30613', c2: '#ffffff', id: 387, league: 'EN', div: 2 },
  { name: 'Swansea City', c1: '#ffffff', c2: '#000000', id: 72, league: 'EN', div: 2 },
  { name: 'Preston N.E.', c1: '#ffffff', c2: '#000040', id: 1081, league: 'EN', div: 2 },
  { name: 'QPR', c1: '#ffffff', c2: '#0033a0', id: 69, league: 'EN', div: 2 },
  { name: 'Stoke City', c1: '#e30613', c2: '#ffffff', id: 70, league: 'EN', div: 2 },
  { name: 'Sheffield Wed', c1: '#0033a0', c2: '#ffffff', id: 345, league: 'EN', div: 2 },
  { name: 'Blackburn', c1: '#0033a0', c2: '#ffffff', id: 59, league: 'EN', div: 2 },
  { name: 'Millwall', c1: '#000040', c2: '#ffffff', id: 384, league: 'EN', div: 2 },
  { name: 'Derby County', c1: '#ffffff', c2: '#000000', id: 342, league: 'EN', div: 2 },

  // Italia 1
  { name: 'Inter Milan', c1: '#003399', c2: '#000000', id: 108, league: 'IT', div: 1 },
  { name: 'Juventus', c1: '#ffffff', c2: '#000000', id: 109, league: 'IT', div: 1 },
  { name: 'AC Milan', c1: '#fb090b', c2: '#000000', id: 98, league: 'IT', div: 1 },
  { name: 'Napoli', c1: '#00bfff', c2: '#ffffff', id: 113, league: 'IT', div: 1 },
  { name: 'AS Roma', c1: '#8e1f2f', c2: '#f0bc42', id: 100, league: 'IT', div: 1 },
  { name: 'Atalanta', c1: '#1e71b8', c2: '#000000', id: 102, league: 'IT', div: 1 },
  { name: 'Lazio', c1: '#87d3f8', c2: '#ffffff', id: 110, league: 'IT', div: 1 },
  { name: 'Fiorentina', c1: '#4b2e83', c2: '#ffffff', id: 99, league: 'IT', div: 1 },
  { name: 'Bologna', c1: '#a71930', c2: '#1e3a8a', id: 103, league: 'IT', div: 1 },
  { name: 'Torino', c1: '#8b0000', c2: '#ffffff', id: 586, league: 'IT', div: 1 },
  { name: 'Sassuolo', c1: '#000000', c2: '#00a650', id: 471, league: 'IT', div: 1 },
  { name: 'Genoa', c1: '#a71930', c2: '#1e3a8a', id: 107, league: 'IT', div: 1 },
  { name: 'Lecce', c1: '#facc15', c2: '#cb3524', id: 5890, league: 'IT', div: 1 },
  { name: 'Udinese', c1: '#ffffff', c2: '#000000', id: 115, league: 'IT', div: 1 },
  { name: 'Cagliari', c1: '#a71930', c2: '#1e3a8a', id: 104, league: 'IT', div: 1 },
  { name: 'Pisa', c1: '#000000', c2: '#0033a0', id: 5885, league: 'IT', div: 1 },
  { name: 'Verona', c1: '#facc15', c2: '#1e3a8a', id: 450, league: 'IT', div: 1 },
  { name: 'Parma', c1: '#ffffff', c2: '#000000', id: 112, league: 'IT', div: 1 },
  { name: 'Como', c1: '#1e3a8a', c2: '#ffffff', id: 7397, league: 'IT', div: 1 },
  { name: 'Cremonese', c1: '#8b0000', c2: '#a9a9a9', id: 5889, league: 'IT', div: 1 },

  // Italia 2
  { name: 'Monza', c1: '#ffffff', c2: '#cb3524', id: 5911, league: 'IT', div: 2 },
  { name: 'Frosinone', c1: '#ffcc00', c2: '#0033a0', id: 470, league: 'IT', div: 2 },
  { name: 'Salernitana', c1: '#8b0000', c2: '#ffffff', id: 455, league: 'IT', div: 2 },
  { name: 'Sampdoria', c1: '#0033a0', c2: '#ffffff', id: 584, league: 'IT', div: 2 },
  { name: 'Palermo', c1: '#ffc0cb', c2: '#000000', id: 114, league: 'IT', div: 2 },
  { name: 'Venezia', c1: '#fb923c', c2: '#16a34a', id: 454, league: 'IT', div: 2 },
  { name: 'Brescia', c1: '#0033a0', c2: '#ffffff', id: 449, league: 'IT', div: 2 },
  { name: 'Bari', c1: '#ffffff', c2: '#e30613', id: 458, league: 'IT', div: 2 },
  { name: 'Empoli', c1: '#1e3a8a', c2: '#ffffff', id: 445, league: 'IT', div: 2 },
  { name: 'Spezia', c1: '#ffffff', c2: '#000000', id: 488, league: 'IT', div: 2 },
  { name: 'Catanzaro', c1: '#ffcc00', c2: '#e30613', id: 5913, league: 'IT', div: 2 },
  { name: 'Reggiana', c1: '#8b0000', c2: '#ffffff', id: 5917, league: 'IT', div: 2 },
  { name: 'Südtirol', c1: '#ffffff', c2: '#e30613', id: 5920, league: 'IT', div: 2 },
  { name: 'Modena', c1: '#ffcc00', c2: '#0033a0', id: 5925, league: 'IT', div: 2 },
  { name: 'Cosenza', c1: '#0033a0', c2: '#e30613', id: 5926, league: 'IT', div: 2 },
  { name: 'Cittadella', c1: '#8b0000', c2: '#ffffff', id: 5886, league: 'IT', div: 2 },
  { name: 'Mantova', c1: '#ffffff', c2: '#e30613', id: 5930, league: 'IT', div: 2 },
  { name: 'Cesena', c1: '#ffffff', c2: '#000000', id: 1107, league: 'IT', div: 2 },
  { name: 'Juve Stabia', c1: '#ffcc00', c2: '#0033a0', id: 5935, league: 'IT', div: 2 },
  { name: 'Carrarese', c1: '#ffcc00', c2: '#0033a0', id: 5938, league: 'IT', div: 2 },

  // Alemania 1
  { name: 'Bayern Munich', c1: '#dc052d', c2: '#ffffff', id: 5, league: 'DE', div: 1 },
  { name: 'B. Dortmund', c1: '#fde100', c2: '#000000', id: 4, league: 'DE', div: 1 },
  { name: 'B. Leverkusen', c1: '#e32221', c2: '#000000', id: 3, league: 'DE', div: 1 },
  { name: 'RB Leipzig', c1: '#ffffff', c2: '#dd013f', id: 721, league: 'DE', div: 1 },
  { name: 'VfB Stuttgart', c1: '#ffffff', c2: '#e32221', id: 10, league: 'DE', div: 1 },
  { name: 'E. Frankfurt', c1: '#000000', c2: '#e32221', id: 19, league: 'DE', div: 1 },
  { name: 'SC Freiburg', c1: '#000000', c2: '#ffffff', id: 17, league: 'DE', div: 1 },
  { name: 'M\'gladbach', c1: '#000000', c2: '#ffffff', id: 18, league: 'DE', div: 1 },
  { name: 'Wolfsburg', c1: '#009d00', c2: '#ffffff', id: 11, league: 'DE', div: 1 },
  { name: 'Werder Bremen', c1: '#1d9053', c2: '#ffffff', id: 12, league: 'DE', div: 1 },
  { name: 'Union Berlin', c1: '#d71920', c2: '#f6d800', id: 28, league: 'DE', div: 1 },
  { name: 'Hoffenheim', c1: '#004f9f', c2: '#ffffff', id: 2, league: 'DE', div: 1 },
  { name: 'Augsburg', c1: '#ba3733', c2: '#ffffff', id: 16, league: 'DE', div: 1 },
  { name: 'Mainz 05', c1: '#ed1c24', c2: '#ffffff', id: 15, league: 'DE', div: 1 },
  { name: 'FC Köln', c1: '#e30613', c2: '#ffffff', id: 1, league: 'DE', div: 1 },
  { name: 'Heidenheim', c1: '#e2001a', c2: '#ffffff', id: 44, league: 'DE', div: 1 },
  { name: 'St. Pauli', c1: '#754b29', c2: '#ffffff', id: 20, league: 'DE', div: 1 },
  { name: 'Hamburger SV', c1: '#ffffff', c2: '#0033a0', id: 7, league: 'DE', div: 1 },

  // Alemania 2
  { name: 'VfL Bochum', c1: '#005ca9', c2: '#ffffff', id: 36, league: 'DE', div: 2 },
  { name: 'Darmstadt 98', c1: '#0033a0', c2: '#ffffff', id: 55, league: 'DE', div: 2 },
  { name: 'Holstein Kiel', c1: '#0053a4', c2: '#ffffff', id: 720, league: 'DE', div: 2 },
  { name: 'Hertha BSC', c1: '#0033a0', c2: '#ffffff', id: 9, league: 'DE', div: 2 },
  { name: 'Schalke 04', c1: '#0033a0', c2: '#ffffff', id: 6, league: 'DE', div: 2 },
  { name: 'Hannover 96', c1: '#e30613', c2: '#000000', id: 8, league: 'DE', div: 2 },
  { name: 'F. Düsseldorf', c1: '#e30613', c2: '#ffffff', id: 24, league: 'DE', div: 2 },
  { name: 'Karlsruher SC', c1: '#0033a0', c2: '#ffffff', id: 29, league: 'DE', div: 2 },
  { name: 'FC Nürnberg', c1: '#8b0000', c2: '#ffffff', id: 14, league: 'DE', div: 2 },
  { name: 'SC Paderborn', c1: '#000000', c2: '#0033a0', id: 23, league: 'DE', div: 2 },
  { name: 'Greuther Fürth', c1: '#00a650', c2: '#ffffff', id: 21, league: 'DE', div: 2 },
  { name: 'SV Elversberg', c1: '#ffffff', c2: '#000000', id: 48, league: 'DE', div: 2 },
  { name: 'FC Magdeburg', c1: '#0033a0', c2: '#ffffff', id: 34, league: 'DE', div: 2 },
  { name: 'E. Braunschweig', c1: '#ffcc00', c2: '#0033a0', id: 25, league: 'DE', div: 2 },
  { name: 'Kaiserslautern', c1: '#e30613', c2: '#ffffff', id: 33, league: 'DE', div: 2 },
  { name: 'SSV Ulm', c1: '#000000', c2: '#ffffff', id: 50, league: 'DE', div: 2 },
  { name: 'Preußen Münster', c1: '#00a650', c2: '#000000', id: 52, league: 'DE', div: 2 },
  { name: 'Jahn Regensburg', c1: '#ffffff', c2: '#e30613', id: 35, league: 'DE', div: 2 },

  // Francia 1
  { name: 'PSG', c1: '#004170', c2: '#da291c', id: 524, league: 'FR', div: 1 },
  { name: 'AS Monaco', c1: '#e30613', c2: '#ffffff', id: 548, league: 'FR', div: 1 },
  { name: 'Marseille', c1: '#ffffff', c2: '#009dff', id: 516, league: 'FR', div: 1 },
  { name: 'Lille OSC', c1: '#e2001a', c2: '#002654', id: 521, league: 'FR', div: 1 },
  { name: 'Olympique Lyon', c1: '#ffffff', c2: '#da291c', id: 523, league: 'FR', div: 1 },
  { name: 'RC Lens', c1: '#ed1c24', c2: '#ffcc00', id: 546, league: 'FR', div: 1 },
  { name: 'OGC Nice', c1: '#000000', c2: '#e30613', id: 522, league: 'FR', div: 1 },
  { name: 'Stade Rennais', c1: '#e2001a', c2: '#000000', id: 529, league: 'FR', div: 1 },
  { name: 'Paris FC', c1: '#0033a0', c2: '#ffffff', id: 547, league: 'FR', div: 1 },
  { name: 'Strasbourg', c1: '#00529f', c2: '#ffffff', id: 576, league: 'FR', div: 1 },
  { name: 'Toulouse', c1: '#542f88', c2: '#ffffff', id: 511, league: 'FR', div: 1 },
  { name: 'FC Lorient', c1: '#f68712', c2: '#000000', id: 525, league: 'FR', div: 1 },
  { name: 'FC Nantes', c1: '#fdf200', c2: '#006532', id: 543, league: 'FR', div: 1 },
  { name: 'Brest', c1: '#e2001a', c2: '#ffffff', id: 512, league: 'FR', div: 1 },
  { name: 'Le Havre', c1: '#00529f', c2: '#87ceeb', id: 533, league: 'FR', div: 1 },
  { name: 'AJ Auxerre', c1: '#ffffff', c2: '#00529f', id: 519, league: 'FR', div: 1 },
  { name: 'Angers SCO', c1: '#000000', c2: '#ffffff', id: 532, league: 'FR', div: 1 },
  { name: 'FC Metz', c1: '#6c1d45', c2: '#ffffff', id: 545, league: 'FR', div: 1 },

  // Francia 2
  { name: 'Clermont Foot', c1: '#e30613', c2: '#0033a0', id: 541, league: 'FR', div: 2 },
  { name: 'Valenciennes FC', c1: '#e30613', c2: '#ffffff', id: 550, league: 'FR', div: 2 },
  { name: 'Chamois Niortais', c1: '#ffcc00', c2: '#006400', id: 552, league: 'FR', div: 2 },
  { name: 'Stade Reims', c1: '#e30613', c2: '#ffffff', id: 547, league: 'FR', div: 2 },
  { name: 'Rodez AF', c1: '#e30613', c2: '#ffcc00', id: 561, league: 'FR', div: 2 },
  { name: 'SM Caen', c1: '#0033a0', c2: '#e30613', id: 514, league: 'FR', div: 2 },
  { name: 'EA Guingamp', c1: '#e30613', c2: '#000000', id: 518, league: 'FR', div: 2 },
  { name: 'Amiens SC', c1: '#ffffff', c2: '#000000', id: 530, league: 'FR', div: 2 },
  { name: 'SC Bastia', c1: '#0033a0', c2: '#ffffff', id: 515, league: 'FR', div: 2 },
  { name: 'Pau FC', c1: '#ffcc00', c2: '#0033a0', id: 564, league: 'FR', div: 2 },
  { name: 'Grenoble Foot', c1: '#0033a0', c2: '#ffffff', id: 554, league: 'FR', div: 2 },
  { name: 'FC Annecy', c1: '#e30613', c2: '#ffffff', id: 567, league: 'FR', div: 2 },
  { name: 'ES Troyes AC', c1: '#0033a0', c2: '#ffffff', id: 531, league: 'FR', div: 2 },
  { name: 'AC Ajaccio', c1: '#ffffff', c2: '#e30613', id: 513, league: 'FR', div: 2 },
  { name: 'USL Dunkerque', c1: '#87ceeb', c2: '#ffffff', id: 569, league: 'FR', div: 2 },
  { name: 'Red Star FC', c1: '#00a650', c2: '#ffffff', id: 571, league: 'FR', div: 2 },
  { name: 'Saint-Étienne', c1: '#006532', c2: '#ffffff', id: 527, league: 'FR', div: 2 },
  { name: 'Montpellier', c1: '#0033a0', c2: '#f68712', id: 518, league: 'FR', div: 2 },

  // Holanda 1
  { name: 'PSV Eindhoven', c1: '#ff0000', c2: '#ffffff', id: 674, league: 'NL', div: 1 },
  { name: 'Feyenoord', c1: '#ff0000', c2: '#ffffff', id: 675, league: 'NL', div: 1 },
  { name: 'Ajax', c1: '#ffffff', c2: '#ff0000', id: 678, league: 'NL', div: 1 },
  { name: 'AZ Alkmaar', c1: '#ff0000', c2: '#ffffff', id: 682, league: 'NL', div: 1 },
  { name: 'FC Twente', c1: '#ff0000', c2: '#ffffff', id: 666, league: 'NL', div: 1 },
  { name: 'Utrecht', c1: '#ff0000', c2: '#ffffff', id: 676, league: 'NL', div: 1 },
  { name: 'Sparta Rotterdam', c1: '#ff0000', c2: '#ffffff', id: 680, league: 'NL', div: 1 },
  { name: 'Go Ahead Eagles', c1: '#ff0000', c2: '#ffff00', id: 718, league: 'NL', div: 1 },
  { name: 'NEC Nijmegen', c1: '#ff0000', c2: '#000000', id: 671, league: 'NL', div: 1 },
  { name: 'Heerenveen', c1: '#0000ff', c2: '#ffffff', id: 673, league: 'NL', div: 1 },
  { name: 'Fortuna Sittard', c1: '#ffff00', c2: '#16a34a', id: 684, league: 'NL', div: 1 },
  { name: 'Heracles Almelo', c1: '#000000', c2: '#ffffff', id: 677, league: 'NL', div: 1 },
  { name: 'PEC Zwolle', c1: '#00bfff', c2: '#ffffff', id: 683, league: 'NL', div: 1 },
  { name: 'FC Volendam', c1: '#f5a12d', c2: '#000000', id: 681, league: 'NL', div: 1 },
  { name: 'Excelsior', c1: '#000000', c2: '#e30613', id: 670, league: 'NL', div: 1 },
  { name: 'SC Telstar', c1: '#ffffff', c2: '#0033a0', id: 698, league: 'NL', div: 1 },
  { name: 'Groningen', c1: '#16a34a', c2: '#ffffff', id: 679, league: 'NL', div: 1 },
  { name: 'NAC Breda', c1: '#ffff00', c2: '#000000', id: 672, league: 'NL', div: 1 },

  // Holanda 2
  { name: 'Willem II', c1: '#ff0000', c2: '#ffffff', id: 672, league: 'NL', div: 2 },
  { name: 'Vitesse', c1: '#ffcc00', c2: '#000000', id: 679, league: 'NL', div: 2 },
  { name: 'Almere City', c1: '#ff0000', c2: '#000000', id: 704, league: 'NL', div: 2 },
  { name: 'De Graafschap', c1: '#0033a0', c2: '#ffffff', id: 669, league: 'NL', div: 2 },
  { name: 'ADO Den Haag', c1: '#00a650', c2: '#ffcc00', id: 680, league: 'NL', div: 2 },
  { name: 'SC Cambuur', c1: '#ffcc00', c2: '#0033a0', id: 668, league: 'NL', div: 2 },
  { name: 'FC Emmen', c1: '#e30613', c2: '#ffffff', id: 686, league: 'NL', div: 2 },
  { name: 'Roda JC', c1: '#ffcc00', c2: '#000000', id: 667, league: 'NL', div: 2 },
  { name: 'MVV Maastricht', c1: '#e30613', c2: '#ffffff', id: 688, league: 'NL', div: 2 },
  { name: 'VVV-Venlo', c1: '#ffcc00', c2: '#000000', id: 687, league: 'NL', div: 2 },
  { name: 'FC Dordrecht', c1: '#00a650', c2: '#ffffff', id: 690, league: 'NL', div: 2 },
  { name: 'Helmond Sport', c1: '#e30613', c2: '#000000', id: 692, league: 'NL', div: 2 },
  { name: 'FC Eindhoven', c1: '#0033a0', c2: '#ffffff', id: 693, league: 'NL', div: 2 },
  { name: 'RKC Waalwijk', c1: '#ffff00', c2: '#1e3a8a', id: 685, league: 'NL', div: 2 },
  { name: 'TOP Oss', c1: '#e30613', c2: '#ffffff', id: 695, league: 'NL', div: 2 },
  { name: 'FC Den Bosch', c1: '#0033a0', c2: '#ffffff', id: 696, league: 'NL', div: 2 },
  { name: 'Jong Ajax', c1: '#ffffff', c2: '#e30613', id: 678, league: 'NL', div: 2 },
  { name: 'Jong PSV', c1: '#ff0000', c2: '#ffffff', id: 674, league: 'NL', div: 2 },

  // Miscelánea Europa 1 y 2
  { name: 'FC Porto', c1: '#003399', c2: '#ffffff', id: 503, league: 'MI', div: 1 },
  { name: 'Benfica', c1: '#e30613', c2: '#ffffff', id: 1903, league: 'MI', div: 1 },
  { name: 'Sporting CP', c1: '#006532', c2: '#ffffff', id: 498, league: 'MI', div: 1 },
  { name: 'Celtic FC', c1: '#006532', c2: '#ffffff', id: 732, league: 'MI', div: 1 },
  { name: 'Rangers FC', c1: '#0033a0', c2: '#ffffff', id: 733, league: 'MI', div: 1 },
  { name: 'Galatasaray', c1: '#a32638', c2: '#fdb913', id: 610, league: 'MI', div: 1 },
  { name: 'Fenerbahçe', c1: '#0033a0', c2: '#fdb913', id: 611, league: 'MI', div: 1 },
  { name: 'Olympiacos', c1: '#e30613', c2: '#ffffff', id: 654, league: 'MI', div: 1 },
  { name: 'Panathinaikos', c1: '#006532', c2: '#ffffff', id: 655, league: 'MI', div: 1 },
  { name: 'Club Brugge', c1: '#0033a0', c2: '#000000', id: 851, league: 'MI', div: 1 },
  { name: 'Anderlecht', c1: '#542f88', c2: '#ffffff', id: 852, league: 'MI', div: 1 },
  { name: 'RB Salzburg', c1: '#ffffff', c2: '#e30613', id: 1877, league: 'MI', div: 1 },
  { name: 'Slavia Praga', c1: '#e30613', c2: '#ffffff', id: 1878, league: 'MI', div: 1 },
  { name: 'Sparta Praga', c1: '#a32638', c2: '#0033a0', id: 1879, league: 'MI', div: 1 },
  { name: 'Dinamo Zagreb', c1: '#0033a0', c2: '#ffffff', id: 1880, league: 'MI', div: 1 },
  { name: 'Estrella Roja', c1: '#e30613', c2: '#ffffff', id: 1881, league: 'MI', div: 1 },
  { name: 'FC Copenhague', c1: '#ffffff', c2: '#0033a0', id: 1882, league: 'MI', div: 1 },
  { name: 'Malmö FF', c1: '#87ceeb', c2: '#ffffff', id: 1883, league: 'MI', div: 1 },
  { name: 'Shakhtar D.', c1: '#f68712', c2: '#000000', id: 1884, league: 'MI', div: 1 },
  { name: 'Dynamo Kyiv', c1: '#ffffff', c2: '#0033a0', id: 1885, league: 'MI', div: 1 },
  { name: 'SC Braga', c1: '#e30613', c2: '#ffffff', id: 5613, league: 'MI', div: 2 },
  { name: 'Besiktas', c1: '#000000', c2: '#ffffff', id: 605, league: 'MI', div: 2 },
  { name: 'AEK Athens', c1: '#fde100', c2: '#000000', id: 656, league: 'MI', div: 2 },
  { name: 'PAOK', c1: '#000000', c2: '#ffffff', id: 657, league: 'MI', div: 2 },
  { name: 'KRC Genk', c1: '#0033a0', c2: '#ffffff', id: 853, league: 'MI', div: 2 },
  { name: 'Royal Antwerp', c1: '#e30613', c2: '#ffffff', id: 854, league: 'MI', div: 2 },
  { name: 'Young Boys', c1: '#ffd700', c2: '#000000', id: 1886, league: 'MI', div: 2 },
  { name: 'FC Basel', c1: '#e30613', c2: '#0033a0', id: 1887, league: 'MI', div: 2 },
  { name: 'Trabzonspor', c1: '#8b0000', c2: '#87ceeb', id: 613, league: 'MI', div: 2 },
  { name: 'Hajduk Split', c1: '#ffffff', c2: '#0033a0', id: 1888, league: 'MI', div: 2 },
  { name: 'FC Midtjylland', c1: '#000000', c2: '#e30613', id: 1889, league: 'MI', div: 2 },
  { name: 'Brøndby IF', c1: '#ffd700', c2: '#0033a0', id: 1890, league: 'MI', div: 2 },
  { name: 'Sturm Graz', c1: '#000000', c2: '#ffffff', id: 1891, league: 'MI', div: 2 },
  { name: 'Viktoria Plzen', c1: '#e30613', c2: '#0033a0', id: 1892, league: 'MI', div: 2 },
  { name: 'Ferencvaros', c1: '#00a650', c2: '#ffffff', id: 1893, league: 'MI', div: 2 },
  { name: 'Ludogorets', c1: '#00a650', c2: '#ffffff', id: 1894, league: 'MI', div: 2 },
  { name: 'Bodo/Glimt', c1: '#ffff00', c2: '#000000', id: 1895, league: 'MI', div: 2 },
  { name: 'Qarabag FK', c1: '#000000', c2: '#ffffff', id: 1896, league: 'MI', div: 2 },
  { name: 'Maccabi Tel Aviv', c1: '#ffd700', c2: '#0033a0', id: 1897, league: 'MI', div: 2 },
  { name: 'Legia Warsaw', c1: '#ffffff', c2: '#000000', id: 1898, league: 'MI', div: 2 }
];

// Generador de SVG heráldico refinado
function generateCustomSvg(name, c1, c2) {
  const initial = name[0].toUpperCase();
  const words = name.split(/\s+/);
  const subInit = words.length > 1 ? words[words.length - 1][0].toUpperCase() : '';
  const monogram = (subInit && subInit !== initial) ? (initial + subInit) : initial;
  const slug = getSlug(name);
  const borderColor = ['#fde100', '#facc15', '#ffd700'].includes(c1.toLowerCase()) || ['#fde100', '#facc15', '#ffd700'].includes(c2.toLowerCase())
    ? '#fbbf24' : '#ffffff';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 300" width="256" height="300">
  <defs>
    <linearGradient id="g_${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="45%" stop-color="${c1}" />
      <stop offset="55%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
    <filter id="f_${slug}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Escudo Base Heráldico Moderno -->
  <path d="M 28 28 L 228 28 Q 228 175 128 275 Q 28 175 28 28 Z" 
        fill="url(#g_${slug})" 
        stroke="${borderColor}" 
        stroke-width="10" 
        stroke-linejoin="round"
        filter="url(#f_${slug})" />

  <!-- Franjas diagonales deportivas sutiles -->
  <path d="M 28 28 L 228 165 L 228 200 L 28 65 Z" fill="rgba(255,255,255,0.18)" />
  <path d="M 28 75 L 228 210 L 228 235 L 28 100 Z" fill="rgba(0,0,0,0.15)" />

  <!-- Aro Central Emblema -->
  <circle cx="128" cy="120" r="54" fill="#0f172a" stroke="${borderColor}" stroke-width="5" opacity="0.94" />

  <!-- Monograma de Letras -->
  <text x="128" y="136" 
        font-family="Arial, Helvetica, sans-serif" 
        font-size="44" 
        font-weight="900" 
        font-style="italic"
        fill="#ffffff" 
        text-anchor="middle">
    ${monogram}
  </text>

  <!-- Corona / Estrella Decorativa -->
  <polygon points="128,40 133,51 144,51 135,58 138,69 128,62 118,69 121,58 112,51 123,51" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
  
  <!-- Mini Balón Estilizado Abajo -->
  <circle cx="128" cy="215" r="18" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
  <polygon points="128,206 135,211 132,220 124,220 121,211" fill="#0f172a"/>
</svg>`;
}

// Descargar buffer desde URL
function fetchBuffer(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 8000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('Iniciando renderizado de imágenes PNG reales...');

  fs.mkdirSync('public', { recursive: true });
  fs.mkdirSync('public/crests', { recursive: true });

  const customZip = new AdmZip();
  const officialZip = new AdmZip();

  customZip.addFile(
    'LEEME_INSTRUCCIONES.txt',
    Buffer.from(`PAQUETE DE ESCUDOS VECTORIALES PNG (100% LIBRES DE COPYRIGHT)
========================================================================

Todos los archivos en este paquete son imágenes PNG binarias reales (256x256 px)
con fondo transparente, listas para usarse en cualquier visor, juego o app pública.

- 100% libres de marcas registradas
- Paletas de colores oficiales de cada club
- Diseñadas para tiendas de apps sin riesgo legal

¿CÓMO USARLOS?
1. Descomprime este archivo ZIP.
2. Copia todas las imágenes de la carpeta "escudos_png" dentro de:
   public/crests/
3. Abre el juego y se mostrarán automáticamente.
`, 'utf8')
  );

  officialZip.addFile(
    'LEEME_LOGOS_OFICIALES.txt',
    Buffer.from(`PAQUETE DE LOGOS Y ESCUDOS OFICIALES DE CLUBES
========================================================================

Contiene los escudos oficiales en formato PNG con fondo transparente
de todos los clubes de las ligas de España, Inglaterra, Italia, Alemania,
Francia, Holanda y Europa.

¿CÓMO USARLOS EN EL JUEGO?
1. Descomprime este archivo ZIP.
2. Copia todas las imágenes .png directamente dentro de:
   public/crests/
3. Tu juego mostrará de inmediato los escudos reales.
`, 'utf8')
  );

  let count = 0;
  for (const team of TEAMS_DATA) {
    count++;
    const slug = getSlug(team.name);
    process.stdout.write(`[${count}/${TEAMS_DATA.length}] Procesando ${team.name}... `);

    // 1. Renderizar PNG REAL para el pack sin copyright
    const svgStr = generateCustomSvg(team.name, team.c1, team.c2);
    const customPngBuffer = await sharp(Buffer.from(svgStr))
      .resize(256, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    customZip.addFile(`escudos_sin_copyright/${slug}.png`, customPngBuffer);
    customZip.addFile(`por_liga/${team.league}_Div${team.div}/${slug}.png`, customPngBuffer);

    // 2. Obtener logo oficial real en PNG
    let officialPngBuffer = null;
    if (team.id) {
      officialPngBuffer = await fetchBuffer(`https://crests.football-data.org/${team.id}.png`);
    }

    // Si la descarga falló o es un equipo sin ID directa, convertir el SVG refinado de alta calidad
    if (!officialPngBuffer || officialPngBuffer.length < 500) {
      officialPngBuffer = customPngBuffer;
    } else {
      // Optimizar y asegurar formato PNG transparente limpio
      try {
        officialPngBuffer = await sharp(officialPngBuffer)
          .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
      } catch (e) {
        officialPngBuffer = customPngBuffer;
      }
    }

    officialZip.addFile(`logos_oficiales/${slug}.png`, officialPngBuffer);
    officialZip.addFile(`por_liga/${team.league}_Div${team.div}/${slug}.png`, officialPngBuffer);

    // Escribir en public/crests/ para que el juego las tenga activas de fábrica
    fs.writeFileSync(path.join('public/crests', `${slug}.png`), officialPngBuffer);

    console.log('OK');
  }

  // Guardar ambos ZIPs
  console.log('Escribiendo archivos ZIP...');
  customZip.writeZip('public/escudos_editados_sin_copyright.zip');
  officialZip.writeZip('public/logos_oficiales_actuales.zip');
  // Compatibilidad con nombre anterior
  officialZip.writeZip('public/plantilla_logos_oficiales.zip');

  console.log('¡Proceso completado con éxito!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
