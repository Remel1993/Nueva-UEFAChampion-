import React from 'react';
import { X, CheckCircle, AlertCircle, Trophy, Sparkles, TrendingUp, Dumbbell, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SimulationFeedbackBannerProps {
  feedback: {
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
    repDelta?: number;
    repGained?: number;
    peDelta?: number;
    peGained?: number;
    matchPeGained?: number;
    trainingPeGained?: number;
    trainingResult?: any;
    rivalName?: string;
  };
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

  const resultColor = isWin
    ? 'from-emerald-950/80 via-slate-900/90 to-emerald-950/60 border-emerald-500/40 text-emerald-300'
    : isDraw
    ? 'from-amber-950/80 via-slate-900/90 to-amber-950/60 border-amber-500/40 text-amber-300'
    : 'from-rose-950/80 via-slate-900/90 to-rose-950/60 border-rose-500/40 text-rose-300';

  const resultBadgeColor = isWin
    ? 'bg-emerald-500 text-slate-950'
    : isDraw
    ? 'bg-amber-500 text-slate-950'
    : 'bg-rose-500 text-white';

  const resultLabel = isWin ? 'Victoria' : isDraw ? 'Empate' : isLoss ? 'Derrota' : 'Resultado';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative overflow-hidden rounded-3xl p-4 border bg-gradient-to-r ${resultColor} shadow-xl backdrop-blur-md`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {feedback.isChampions ? (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              <Star className="w-3 h-3 text-blue-400" /> Champions League
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Trophy className="w-3 h-3 text-amber-400" /> Jornada {feedback.matchday ?? ''}
            </span>
          )}
          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${resultBadgeColor}`}>
            {resultLabel}
          </span>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {feedback.headline && (
        <p className="mt-2 text-xs font-black uppercase tracking-wider text-slate-200">
          {feedback.headline}
        </p>
      )}

      {/* Marcador o resumen */}
      {feedback.homeName && feedback.awayName && feedback.scoreH !== undefined && feedback.scoreA !== undefined ? (
        <div className="mt-2 flex items-center justify-between bg-black/40 rounded-2xl px-4 py-2.5 border border-white/5">
          <span className="text-xs font-bold text-white truncate max-w-[120px]">{feedback.homeName}</span>
          <span className="text-base font-black text-white px-3 py-0.5 rounded-xl bg-white/10 tracking-widest tabular-nums">
            {feedback.scoreH} - {feedback.scoreA}
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[120px] text-right">{feedback.awayName}</span>
        </div>
      ) : feedback.summary ? (
        <p className="mt-2 text-xs text-slate-200 leading-relaxed font-medium">
          {feedback.summary}
        </p>
      ) : null}

      {/* Recompensas / deltas */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold">
        {peGained !== 0 && (
          <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-xl border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {peGained > 0 ? `+${peGained}` : peGained} PE
          </span>
        )}
        {repGained !== 0 && (
          <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-xl border border-blue-500/30">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            {repGained > 0 ? `+${repGained}` : repGained} Reputación
          </span>
        )}
        {feedback.posBefore !== undefined && feedback.posAfter !== undefined && (
          <span className="flex items-center gap-1 bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-xl border border-white/10">
            Posición: {feedback.posBefore}º → <strong className="text-white">{feedback.posAfter}º</strong>
          </span>
        )}
        {feedback.trainingResult && (
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30">
            <Dumbbell className="w-3 h-3 text-emerald-400" />
            Entrenamiento aplicado
          </span>
        )}
      </div>
    </motion.div>
  );
};
