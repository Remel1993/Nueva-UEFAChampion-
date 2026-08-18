import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Shield, History, Trash2, X, TrendingUp, Sparkles } from 'lucide-react';

interface CareerLegendProfileProps {
  career: any;
  team: any;
  ui?: any;
  isModal?: boolean;
  onClose?: () => void;
  onOpenArchiveModal?: () => void;
  onOpenDeleteCareerModal?: () => void;
  pastCareersCount?: number;
}

export const CareerLegendProfile: React.FC<CareerLegendProfileProps> = ({
  career,
  team,
  ui,
  isModal = false,
  onClose,
  onOpenArchiveModal,
  onOpenDeleteCareerModal,
  pastCareersCount = 0,
}) => {
  const titles = career?.titles || [];
  const rep = career?.rep || 0;
  const seasons = career?.season || 1;
  const manager = career?.manager || 'Mánager';

  const content = (
    <div className="space-y-6 text-white">
      {/* Header / Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/40 border border-amber-500/30">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Perfil Legendario
            </span>
            <h2 className="text-2xl font-black uppercase text-white tracking-wide">
              {manager}
            </h2>
            <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
              <span>Club actual: <strong className="text-amber-300">{team?.name || 'Club'}</strong></span>
              <span>• Temporada {seasons}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400">Reputación</span>
            <div className="text-xl font-black text-amber-400">{rep}</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400">Títulos</span>
            <div className="text-xl font-black text-emerald-400">{titles.length}</div>
          </div>
        </div>
      </div>

      {/* Palmarés / Títulos ganados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Palmarés y Títulos Conquistados ({titles.length})
          </h3>
        </div>

        {titles.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 font-medium">
            Aún no has ganado títulos en esta carrera. ¡Lleva a tu club a la gloria para inscribir tu nombre en la historia!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {titles.map((t: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase text-white">
                      {t.compName || t.name || 'Competición'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Temporada {t.season || 1} {t.teamName ? `· con ${t.teamName}` : ''}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-400">🏆</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {onOpenArchiveModal && (
          <button
            onClick={onOpenArchiveModal}
            className="flex-1 min-w-[200px] py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-black uppercase text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-amber-400" />
            Archivo Histórico ({pastCareersCount})
          </button>
        )}

        {onOpenDeleteCareerModal && (
          <button
            onClick={onOpenDeleteCareerModal}
            className="py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-black uppercase text-rose-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            Gestionar / Reiniciar Carrera
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-slate-950 p-6 shadow-2xl"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};
export default CareerLegendProfile;
