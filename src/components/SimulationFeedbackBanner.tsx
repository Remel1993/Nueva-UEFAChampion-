import React from 'react';
import {
  X,
  Sparkles,
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
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface SimulationFeedback {
  isChampions?: boolean;
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
  const posDifference = posBefore !== undefined && posAfter !== undefined ? posBefore - posAfter : 0;

  const isCleanSheet = feedback.cleanSheet ?? (feedback.myGa === 0);
  const isHighScoring = (feedback.myGf ?? 0) >= 3;

  const themeColors = isWin
    ? {
        border: 'border-emerald-500/30',
        bg: 'from-emerald-950/40 via-slate-900/90 to-slate-900/95',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        badgeText: 'Victoria',
        accentText: 'text-emerald-400'
      }
    : isDraw
    ? {
        border: 'border-amber-500/30',
        bg: 'from-amber-950/40 via-slate-900/90 to-slate-900/95',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        badgeText: 'Empate',
        accentText: 'text-amber-400'
      }
    : {
        border: 'border-rose-500/30',
        bg: 'from-rose-950/40 via-slate-900/90 to-slate-900/95',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        badgeText: 'Derrota',
        accentText: 'text-rose-400'
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative overflow-hidden rounded-3xl p-4 sm:p-5 border bg-gradient-to-br ${themeColors.bg} ${themeColors.border} shadow-xl backdrop-blur-md space-y-3.5`}
    >
      {/* Barra superior de encabezado */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-200 border border-white/10 shadow-sm">
            <FileText className="w-3 h-3 text-amber-400" />
            {feedback.isChampions ? 'Informe Técnico Continental' : `Informe Técnico · Jornada ${feedback.matchday ?? ''}`}
          </span>
          <span className={`text-[8.5px] font-black uppercase px-2.5 py-1 rounded-full border ${themeColors.badgeBg}`}>
            {themeColors.badgeText}
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="Cerrar informe"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Crónica Táctica / Resumen Fundamental del Mánager */}
      {feedback.summary && (
        <div className="bg-black/40 rounded-2xl p-3 border border-white/5">
          <p className="text-[11px] font-medium text-slate-200 leading-relaxed">
            {feedback.summary}
          </p>
        </div>
      )}

      {/* Indicadores Clave de Rendimiento No Repetidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9.5px] font-bold">
        {/* 1. Impacto en la Tabla */}
        {posBefore !== undefined && posAfter !== undefined ? (
          <div className={`rounded-xl px-2.5 py-2 border flex items-center gap-2 ${
            posDifference > 0
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : posDifference < 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-slate-800/50 border-white/10 text-slate-300'
          }`}>
            {posDifference > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : posDifference < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            )}
            <div className="truncate leading-tight">
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Efecto en Tabla</p>
              <p className="truncate font-black">
                {posDifference > 0
                  ? `▲ Sube ${posDifference} puesto${posDifference > 1 ? 's' : ''} (${posBefore}º➔${posAfter}º)`
                  : posDifference < 0
                  ? `▼ Cae ${Math.abs(posDifference)} puesto${Math.abs(posDifference) > 1 ? 's' : ''} (${posBefore}º➔${posAfter}º)`
                  : `= Afianza puesto ${posAfter}º`}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl px-2.5 py-2 border bg-slate-800/50 border-white/10 text-slate-300 flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="truncate leading-tight">
              <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Competición</p>
              <p className="truncate font-black">Fase Regular</p>
            </div>
          </div>
        )}

        {/* 2. Solidez & Rendimiento en Cancha */}
        <div className="rounded-xl px-2.5 py-2 border bg-slate-800/50 border-white/10 text-slate-200 flex items-center gap-2">
          {isCleanSheet ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : isHighScoring ? (
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : feedback.isHome ? (
            <Home className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          ) : (
            <Plane className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          )}
          <div className="truncate leading-tight">
            <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Rendimiento</p>
            <p className="truncate font-black text-white">
              {feedback.isGesta
                ? '⭐ Plus por Gesta'
                : isCleanSheet
                ? '🛡️ Portería a cero'
                : isHighScoring
                ? `⚡ ${feedback.myGf} goles a favor`
                : feedback.isHome
                ? '🏟️ En condición local'
                : '✈️ A domicilio'}
            </p>
          </div>
        </div>

        {/* 3. Área Médica & Entrenamiento */}
        <div className={`rounded-xl px-2.5 py-2 border flex items-center gap-2 ${
          feedback.injuryOccurred
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : feedback.trainingResult || (feedback.trainingPeGained && feedback.trainingPeGained > 0)
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-800/50 border-white/10 text-slate-300'
        }`}>
          {feedback.injuryOccurred ? (
            <HeartPulse className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <div className="truncate leading-tight">
            <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Salud & Físico</p>
            <p className="truncate font-black">
              {feedback.injuryOccurred
                ? '⚠️ Lesión registrada'
                : feedback.trainingResult || (feedback.trainingPeGained && feedback.trainingPeGained > 0)
                ? `🏋️ Entreno (+${feedback.trainingPeGained || 1} PE)`
                : '🩺 Plantilla disponible'}
            </p>
          </div>
        </div>

        {/* 4. Balance Directiva (PE & Prestigio) */}
        <div className="rounded-xl px-2.5 py-2 border bg-black/40 border-white/10 flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate leading-tight">
            <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">Balance Total</p>
            <p className="truncate font-black text-white flex items-center gap-1.5">
              <span className="text-amber-300">+{peGained} PE</span>
              <span className="text-slate-500">·</span>
              <span className={repGained > 0 ? 'text-emerald-400' : repGained < 0 ? 'text-rose-400' : 'text-slate-400'}>
                {repGained > 0 ? `+${repGained}` : `${repGained}`} Rep
              </span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
