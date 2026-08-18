import React from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Dumbbell,
  ShieldCheck,
  Award,
  HeartPulse,
  Flame,
  Plane,
  Home,
  Target,
  Sparkles,
  Trophy,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface SimulationFeedback {
  isChampions?: boolean;
  phaseLabel?: string;
  headline?: string;
  summary?: string;
  matchday?: number;
  homeName?: string;
  awayName?: string;
  scoreH?: number;
  scoreA?: number;
  myGf?: number;
  myGa?: number;
  result?: 'W' | 'D' | 'L' | string;
  posBefore?: number;
  posAfter?: number;
  posDelta?: number;
  repDelta?: number;
  repGained?: number;
  peDelta?: number;
  peGained?: number;
  matchPeGained?: number;
  trainingPeGained?: number;
  trainingResult?: any;
  rivalName?: string;
  isHome?: boolean;
  cleanSheet?: boolean;
  isGesta?: boolean;
  bonusPE?: number;
  bonusRep?: number;
  injuryOccurred?: boolean;
  immunityWeeks?: number;
}

interface SimulationFeedbackBannerProps {
  feedback: SimulationFeedback;
  onDismiss?: () => void;
}

export const SimulationFeedbackBanner: React.FC<SimulationFeedbackBannerProps> = ({
  feedback,
  onDismiss
}) => {
  if (!feedback) return null;

  const result = feedback.result;
  const isWin = result === 'W';
  const isDraw = result === 'D';
  const isLoss = result === 'L';

  const peGained = feedback.peDelta ?? feedback.peGained ?? 0;
  const repGained = feedback.repDelta ?? feedback.repGained ?? 0;
  const posBefore = feedback.posBefore;
  const posAfter = feedback.posAfter;
  const posDiff = posBefore !== undefined && posAfter !== undefined ? posBefore - posAfter : 0;

  const isCleanSheet = feedback.cleanSheet ?? (feedback.myGa === 0);
  const isHighScoring = (feedback.myGf ?? 0) >= 3;

  const bannerTheme = isWin
    ? {
        border: 'border-emerald-500/50',
        bg: 'from-slate-900 via-slate-900 to-emerald-950/60',
        badgeBg: 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
        badgeLabel: 'Victoria 🏆'
      }
    : isDraw
    ? {
        border: 'border-amber-500/50',
        bg: 'from-slate-900 via-slate-900 to-amber-950/60',
        badgeBg: 'bg-amber-400 text-slate-950 shadow-amber-400/30',
        badgeLabel: 'Empate 🤝'
      }
    : {
        border: 'border-rose-500/50',
        bg: 'from-slate-900 via-slate-900 to-rose-950/60',
        badgeBg: 'bg-rose-600 text-white shadow-rose-500/30',
        badgeLabel: 'Derrota ❌'
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 border ${bannerTheme.border} bg-gradient-to-br ${bannerTheme.bg} shadow-2xl backdrop-blur-lg space-y-4`}
    >
      {/* 1. Barra de Encabezado con contraste alto */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1 rounded-full border border-white/15 shadow-sm text-xs font-black uppercase tracking-wider">
            {feedback.isChampions ? (
              <>
                <Star className="w-3.5 h-3.5 text-blue-400" />
                <span>UEFA Champions League</span>
              </>
            ) : (
              <>
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Informe Técnico · Jornada {feedback.matchday ?? ''}</span>
              </>
            )}
          </div>

          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${bannerTheme.badgeBg}`}>
            {bannerTheme.badgeLabel}
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 transition-colors shrink-0"
            title="Cerrar informe"
            aria-label="Cerrar informe"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Crónica / Resumen Táctico (100% legible con buen tamaño y contraste) */}
      {feedback.summary && (
        <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-white/10 shadow-inner">
          <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
            {feedback.summary}
          </p>
        </div>
      )}

      {/* 3. Cuadrícula de Métricas Fundamentales No Congeladas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* BLOQUE 1: Efecto en Clasificación */}
        <div className={`rounded-2xl p-3 border flex items-center gap-3 shadow-md ${
          feedback.isChampions
            ? 'bg-blue-950/40 border-blue-500/30'
            : posDiff > 0
            ? 'bg-emerald-950/40 border-emerald-500/40'
            : posDiff < 0
            ? 'bg-rose-950/40 border-rose-500/40'
            : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
            {feedback.isChampions ? (
              <Star className="w-4 h-4 text-blue-400" />
            ) : posDiff > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : posDiff < 0 ? (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            ) : (
              <Target className="w-4 h-4 text-sky-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {feedback.isChampions ? 'Fase del Torneo' : 'Efecto en Tabla'}
            </p>
            <p className="text-xs sm:text-sm font-black leading-tight mt-0.5 text-white">
              {feedback.isChampions ? (
                <span className="text-blue-300">{feedback.phaseLabel || 'Eliminatoria'}</span>
              ) : posDiff > 0 ? (
                <span className="text-emerald-400">▲ +{posDiff} puesto{posDiff > 1 ? 's' : ''} ({posBefore}º➔{posAfter}º)</span>
              ) : posDiff < 0 ? (
                <span className="text-rose-400">▼ -{Math.abs(posDiff)} puesto{Math.abs(posDiff) > 1 ? 's' : ''} ({posBefore}º➔{posAfter}º)</span>
              ) : (
                <span className="text-sky-300">= Puesto {posAfter ?? posBefore}º afianzado</span>
              )}
            </p>
          </div>
        </div>

        {/* BLOQUE 2: Rendimiento Táctico */}
        <div className="rounded-2xl p-3 border bg-slate-900/90 border-white/10 flex items-center gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
            {feedback.isGesta ? (
              <Sparkles className="w-4 h-4 text-amber-400" />
            ) : isCleanSheet ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : isHighScoring ? (
              <Flame className="w-4 h-4 text-amber-400" />
            ) : feedback.isHome ? (
              <Home className="w-4 h-4 text-blue-400" />
            ) : (
              <Plane className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Rendimiento Táctico
            </p>
            <p className="text-xs sm:text-sm font-black leading-tight mt-0.5 text-white">
              {feedback.isGesta ? (
                <span className="text-amber-300">⭐ Plus Rival Superior</span>
              ) : isCleanSheet ? (
                <span className="text-emerald-400">🛡️ Portería a Cero</span>
              ) : isHighScoring ? (
                <span className="text-amber-300">⚡ {feedback.myGf} Goles anotados</span>
              ) : feedback.isHome ? (
                <span className="text-slate-200">🏟️ Condición Local</span>
              ) : (
                <span className="text-slate-200">✈️ Condición Visitante</span>
              )}
            </p>
          </div>
        </div>

        {/* BLOQUE 3: Área Médica y Entrenamiento */}
        <div className={`rounded-2xl p-3 border flex items-center gap-3 shadow-md ${
          feedback.injuryOccurred
            ? 'bg-rose-950/40 border-rose-500/40'
            : feedback.trainingResult || (feedback.trainingPeGained && feedback.trainingPeGained > 0)
            ? 'bg-emerald-950/40 border-emerald-500/40'
            : 'bg-slate-900/90 border-white/10'
        }`}>
          <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
            {feedback.injuryOccurred ? (
              <HeartPulse className="w-4 h-4 text-rose-400" />
            ) : (
              <Dumbbell className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Salud & Preparación
            </p>
            <p className="text-xs sm:text-sm font-black leading-tight mt-0.5 text-white">
              {feedback.injuryOccurred ? (
                <span className="text-rose-400">⚠️ Incidencia médica</span>
              ) : feedback.trainingResult || (feedback.trainingPeGained && feedback.trainingPeGained > 0) ? (
                <span className="text-emerald-400">🏋️ Entreno (+{feedback.trainingPeGained || 1} PE)</span>
              ) : (
                <span className="text-slate-200">🩺 Plantilla al 100%</span>
              )}
            </p>
          </div>
        </div>

        {/* BLOQUE 4: Balance Directiva (PE y Reputación) */}
        <div className="rounded-2xl p-3 border bg-slate-900/90 border-white/10 flex items-center gap-3 shadow-md">
          <div className="p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Balance Obtenido
            </p>
            <p className="text-xs sm:text-sm font-black leading-tight mt-0.5 text-white flex items-center gap-1.5 flex-wrap">
              <span className="text-amber-300">+{peGained} PE</span>
              <span className="text-slate-500">·</span>
              <span className={repGained > 0 ? 'text-emerald-400' : repGained < 0 ? 'text-rose-400' : 'text-slate-300'}>
                {repGained > 0 ? `+${repGained}` : `${repGained}`} Rep
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
