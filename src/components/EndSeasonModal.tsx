import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, ArrowRight, Sparkles, Inbox, RefreshCw, X, Shield } from 'lucide-react';

interface EndSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToInbox?: () => void;
  onOpenReview?: () => void;
  onOpenChampions?: () => void;
  onSimulateChampions?: () => void;
  onNewSeason?: () => void;
  isClQualified?: boolean;
  championsFinished?: boolean;
  allLeaguesFinished?: boolean;
  team?: any;
  position?: number;
  totalTeams?: number;
  objectivesMet?: number;
  objectivesTotal?: number;
  season?: number;
  isChampion?: boolean;
  isPromoted?: boolean;
  offersCount?: number;
  ui?: any;
}

export const EndSeasonModal: React.FC<EndSeasonModalProps> = ({
  isOpen,
  onClose,
  onGoToInbox,
  onOpenReview,
  onOpenChampions,
  onSimulateChampions,
  onNewSeason,
  isClQualified = false,
  championsFinished = false,
  allLeaguesFinished = false,
  team,
  position = 1,
  totalTeams = 20,
  objectivesMet = 0,
  objectivesTotal = 0,
  season = 1,
  isChampion = false,
  isPromoted = false,
  offersCount = 0,
  ui,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {isChampion ? <Trophy className="w-7 h-7" /> : <Award className="w-7 h-7" />}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Temporada {season} Finalizada
            </span>
            <h3 className="text-xl font-black uppercase text-white tracking-wide">
              {isChampion
                ? '¡Campeones de Liga!'
                : isPromoted
                ? '¡Ascenso Conseguido!'
                : 'Fin del Campeonato'}
            </h3>
          </div>
        </div>

        {/* Resumen de la temporada */}
        <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">Posición</span>
            <div className="text-lg font-black text-amber-400">{position}º <span className="text-[10px] text-slate-500 font-normal">/ {totalTeams}</span></div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">Objetivos</span>
            <div className="text-lg font-black text-emerald-400">{objectivesMet} <span className="text-[10px] text-slate-500 font-normal">/ {objectivesTotal}</span></div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400">Ofertas</span>
            <div className="text-lg font-black text-sky-400">{offersCount}</div>
          </div>
        </div>

        {/* Acciones contextuales */}
        <div className="space-y-2.5">
          {onOpenReview && (
            <button
              onClick={() => {
                onClose();
                onOpenReview();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Award className="w-4 h-4" /> Ver Balance de Temporada y Contratos
            </button>
          )}

          {isClQualified && !championsFinished && onOpenChampions && (
            <button
              onClick={onOpenChampions}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-300" /> Jugar Fase Final de Champions League
            </button>
          )}

          {offersCount > 0 && onGoToInbox && (
            <button
              onClick={() => {
                onClose();
                onGoToInbox();
              }}
              className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <Inbox className="w-4 h-4" /> Revisar Buzón de Ofertas ({offersCount})
            </button>
          )}

          {onNewSeason && (
            <button
              onClick={() => {
                onClose();
                onNewSeason();
              }}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" /> Avanzar a la Siguiente Temporada
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default EndSeasonModal;
