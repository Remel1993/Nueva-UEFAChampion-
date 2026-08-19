import React, { useState } from 'react';

export type CompetitionId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'C1' | 'C2' | string;

interface CompetitionLogoProps {
  compId: CompetitionId;
  className?: string;
  size?: number;
  variant?: 'emblem' | 'full' | 'badge';
  showBackground?: boolean;
}

// Configuración de rutas y nombres de archivo en /public/logos/
const LOGO_PATHS: Record<string, string[]> = {
  'L1': ['/logos/laliga.png', '/logos/L1.png', '/logos/la_liga.png', '/logos/liga_espanola.png'],
  'L2': ['/logos/seriea.png', '/logos/L2.png', '/logos/serie_a.png', '/logos/liga_italiana.png'],
  'L3': ['/logos/premier.png', '/logos/L3.png', '/logos/premier_league.png', '/logos/liga_inglesa.png'],
  'L4': ['/logos/bundesliga.png', '/logos/L4.png', '/logos/liga_alemana.png'],
  'L5': ['/logos/eredivisie.png', '/logos/L5.png', '/logos/liga_holandesa.png'],
  'L6': ['/logos/ligue1.png', '/logos/L6.png', '/logos/ligue_1.png', '/logos/liga_francesa.png'],
  'L7': ['/logos/uefa.png', '/logos/L7.png', '/logos/miscelanea.png'],
  'C1': ['/logos/champions.png', '/logos/C1.png', '/logos/champions_league.png', '/logos/ucl.png'],
  'C2': ['/logos/fifa.png', '/logos/C2.png', '/logos/worldcup.png', '/logos/copa_del_mundo.png', '/logos/mundial.png'],
};

// ==========================================
// LOGOS VECTORIALES DE RESPALDO (FALLBACK)
// Si aún no has subido el archivo PNG a /public/logos/, se mostrarán estos:
// ==========================================

export const LaLigaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FF2B42">
      <path d="M110 80 L360 80 L200 240 L110 240 Z" />
      <path d="M220 200 L470 200 L310 360 L220 360 Z" />
      <path d="M40 400 H85 V460 H140 V485 H40 Z" />
      <path d="M155 485 L195 400 H235 L275 485 H235 L225 460 H205 L195 485 Z M215 425 L210 445 H220 Z" />
      <path d="M285 400 H330 V460 H385 V485 H285 Z" />
      <path d="M395 400 H430 V485 H395 Z" />
    </g>
  </svg>
);

export const SerieALogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 40 L440 330 L256 440 Z" fill="#00A3FF" />
    <path d="M256 40 L72 330 L256 440 Z" fill="#0048DB" />
    <path d="M256 180 L350 330 L256 390 L162 330 Z" fill="#07154B" />
    <path d="M256 180 L320 280 L256 320 Z" fill="#002D8C" />
    <path d="M256 180 L192 280 L256 320 Z" fill="#001859" />
    <path d="M256 390 L320 330 L256 440 Z" fill="#0080FF" />
    <path d="M256 390 L192 330 L256 440 Z" fill="#0035A8" />
    <text x="256" y="472" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="44" letterSpacing="2">SERIE A</text>
  </svg>
);

export const PremierLeagueLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 45 C280 45 295 70 305 85 C320 70 335 75 345 90 C365 75 390 85 395 110 C410 115 425 130 425 155 C435 175 435 200 425 225 C435 250 430 275 410 295 C415 320 405 345 385 365 C390 395 365 425 330 445 C300 460 260 465 220 455 C190 445 165 420 150 390 C130 400 105 385 100 355 C90 335 95 305 110 285 C95 265 95 240 105 215 C95 190 100 160 120 140 C115 115 135 90 165 85 C180 65 205 60 225 75 C235 55 245 45 256 45 Z" fill="#38003C" />
    <path d="M256 65 L270 100 L300 85 L295 125 L330 115 L310 145 L350 150 L315 175 L360 200 L310 215 L355 250 L300 255 L335 300 L280 295 L300 345 L255 330 L260 380 L225 350 L210 400 L190 350 L160 385 L165 335 L130 345 L150 295 L115 285 L150 250 L110 225 L155 205 L125 175 L170 165 L150 130 L195 135 L190 95 L225 110 L240 70 Z" fill="#FFFFFF" />
    <path d="M256 120 C280 120 330 150 330 220 C330 290 270 330 240 330 C200 330 180 280 180 220 C180 150 230 120 256 120 Z" fill="#38003C" />
    <circle cx="270" cy="200" r="10" fill="#FFFFFF" />
    <path d="M230 100 L256 70 L282 100 L270 125 L242 125 Z" fill="#00FF85" />
  </svg>
);

export const BundesligaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="30" width="432" height="360" rx="36" fill="#D20515" />
    <circle cx="400" cy="140" r="28" fill="#FFFFFF" />
    <circle cx="180" cy="115" r="24" fill="#FFFFFF" />
    <path d="M165 140 L230 170 L210 285 L145 345 L125 320 L180 265 L190 200 L140 185 L115 220 L90 200 L130 150 Z" fill="#FFFFFF" />
    <path d="M210 220 L365 175 L380 205 L235 260 Z" fill="#FFFFFF" />
    <path d="M225 170 L285 130 L300 150 L245 190 Z" fill="#FFFFFF" />
    <text x="256" y="460" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="52" letterSpacing="3">BUNDESLIGA</text>
  </svg>
);

export const EredivisieLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#002F6C">
      <path d="M256 50 C345 50 420 110 445 195 L385 210 C368 150 318 105 256 105 C173 105 105 173 105 256 C105 339 173 407 256 407 C318 407 368 362 385 302 L445 317 C420 402 345 462 256 462 C142 462 50 370 50 256 C50 142 142 50 256 50 Z" fill="#002F6C" />
      <path d="M170 230 H360 V282 H170 Z" fill="#002F6C" />
      <circle cx="256" cy="256" r="62" fill="#002F6C" />
      <circle cx="256" cy="256" r="32" fill="#FFFFFF" />
    </g>
    <text x="256" y="495" textAnchor="middle" fill="#002F6C" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="40" letterSpacing="1">eredivisie</text>
  </svg>
);

export const Ligue1Logo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF">
      <path d="M210 60 L290 60 L180 230 L110 230 Z" />
      <path d="M245 130 L325 130 L325 380 L245 380 Z" />
      <path d="M245 380 L325 380 L285 410 L205 410 Z" />
      <text x="256" y="480" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="54" letterSpacing="4">LIGUE 1</text>
    </g>
  </svg>
);

export const UefaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF">
      <path d="M60 250 C110 130 390 130 452 250 L425 265 C375 165 135 165 87 265 Z" />
      <path d="M130 360 C180 300 332 300 382 360 L360 375 C318 325 194 325 152 375 Z" />
      <path d="M100 270 H130 V315 C130 330 140 340 155 340 C170 340 180 330 180 315 V270 H210 V315 C210 348 185 365 155 365 C125 365 100 348 100 315 Z" />
      <path d="M225 270 H295 V295 H255 V305 H288 V330 H255 V340 H295 V365 H225 Z" />
      <path d="M310 270 H380 V295 H340 V310 H372 V335 H340 V365 H310 Z" />
      <path d="M390 365 L430 270 H465 L505 365 H472 L462 340 H432 L422 365 Z M440 318 H454 L447 296 Z" transform="translate(-10, 0)" />
    </g>
  </svg>
);

export const ChampionsLeagueLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF">
      <polygon points="256,120 268,155 305,155 275,175 286,210 256,190 226,210 237,175 207,155 244,155" />
      <polygon points="345,150 355,180 388,180 362,198 372,228 345,210 318,228 328,198 302,180 335,180" />
      <polygon points="380,240 388,270 420,270 395,288 403,318 380,300 357,318 365,288 340,270 372,270" />
      <polygon points="325,325 333,355 365,355 340,372 348,402 325,385 302,402 310,372 285,355 317,355" />
      <polygon points="187,325 195,355 227,355 202,372 210,402 187,385 164,402 172,372 147,355 179,355" />
      <polygon points="132,240 140,270 172,270 147,288 155,318 132,300 109,318 117,288 92,270 124,270" />
      <polygon points="167,150 177,180 210,180 184,198 194,228 167,210 140,228 150,198 124,180 157,180" />
      <circle cx="256" cy="256" r="160" stroke="#FFFFFF" strokeWidth="12" strokeDasharray="20 12" />
    </g>
    <path d="M180 430 C220 415 292 415 332 430" stroke="#FFFFFF" strokeWidth="4" fill="none" />
    <text x="256" y="460" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" letterSpacing="3">UEFA</text>
    <text x="256" y="492" textAnchor="middle" fill="#FFFFFF" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" fontSize="26" letterSpacing="2">CHAMPIONS LEAGUE</text>
  </svg>
);

export const FifaLogo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg viewBox="0 0 512 256" width={size} height={size ? size * 0.5 : 16} className={`inline-block shrink-0 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#003B94">
      <path d="M50 40 H160 V88 H104 V116 H150 V160 H104 V216 H50 Z" />
      <path d="M178 40 H232 V216 H178 Z" />
      <path d="M250 40 H360 V88 H304 V116 H350 V160 H304 V216 H250 Z" />
      <path d="M375 216 L430 40 H490 L545 216 H490 L480 176 H440 L430 216 Z M450 135 H470 L460 88 Z" transform="translate(-60, 0)" />
    </g>
  </svg>
);

// Fallback selector
const FallbackLogo: React.FC<{ compId: CompetitionId; size?: number }> = ({ compId, size = 32 }) => {
  switch (compId) {
    case 'L1': return <LaLigaLogo size={size} />;
    case 'L2': return <SerieALogo size={size} />;
    case 'L3': return <PremierLeagueLogo size={size} />;
    case 'L4': return <BundesligaLogo size={size} />;
    case 'L5': return <EredivisieLogo size={size} />;
    case 'L6': return <Ligue1Logo size={size} />;
    case 'L7': return <UefaLogo size={size} />;
    case 'C1': return <ChampionsLeagueLogo size={size} />;
    case 'C2': return <FifaLogo size={size} />;
    default:   return <UefaLogo size={size} />;
  }
};

// ==========================================
// COMPONENTE PRINCIPAL (Carga PNG y si no existe usa el fallback)
// ==========================================
export const CompetitionLogo: React.FC<CompetitionLogoProps> = ({
  compId,
  className = '',
  size = 32,
  showBackground = true
}) => {
  const possiblePaths = LOGO_PATHS[compId] || [`/logos/${compId}.png`];
  const [pathIndex, setPathIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const currentSrc = possiblePaths[pathIndex];

  const handleImageError = () => {
    if (pathIndex + 1 < possiblePaths.length) {
      setPathIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  // Preset gradients and accents for badge styling
  const getBadgeStyle = () => {
    switch (compId) {
      case 'L1': return 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30 text-red-400';
      case 'L2': return 'bg-gradient-to-br from-blue-500/20 to-cyan-600/10 border-blue-500/30 text-blue-400';
      case 'L3': return 'bg-gradient-to-br from-purple-500/20 to-fuchsia-600/10 border-purple-500/30 text-purple-300';
      case 'L4': return 'bg-gradient-to-br from-red-600/20 to-rose-700/10 border-red-600/30 text-red-300';
      case 'L5': return 'bg-gradient-to-br from-sky-600/20 to-blue-700/10 border-sky-500/30 text-sky-300';
      case 'L6': return 'bg-gradient-to-br from-slate-600/20 to-slate-800/10 border-slate-400/30 text-slate-200';
      case 'L7': return 'bg-gradient-to-br from-indigo-500/20 to-blue-600/10 border-indigo-500/30 text-indigo-300';
      case 'C1': return 'bg-gradient-to-br from-blue-600/20 to-indigo-900/30 border-blue-400/40 text-blue-200';
      case 'C2': return 'bg-gradient-to-br from-sky-500/20 to-blue-700/20 border-sky-400/30 text-sky-200';
      default:   return 'bg-white/10 border-white/20 text-white';
    }
  };

  const renderContent = () => {
    if (hasError || !currentSrc) {
      return <FallbackLogo compId={compId} size={size} />;
    }

    return (
      <img
        src={currentSrc}
        alt={`Logo ${compId}`}
        className="w-full h-full object-contain max-h-full max-w-full drop-shadow-sm select-none"
        style={{ width: size, height: size }}
        onError={handleImageError}
        loading="lazy"
      />
    );
  };

  if (!showBackground) {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl border backdrop-blur-md shadow-md p-1.5 transition-transform ${getBadgeStyle()} ${className}`}
      style={{ minWidth: size + 10, minHeight: size + 10, width: size + 10, height: size + 10 }}
    >
      {renderContent()}
    </div>
  );
};

export default CompetitionLogo;
