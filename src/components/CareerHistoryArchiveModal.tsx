import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, History, Trash2, Award, Calendar, Shield } from 'lucide-react';

interface CareerHistoryArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastCareers?: any[];
  onDeletePastCareer?: (id: string | number) => void;
  ui?: any;
}

export const CareerHistoryArchiveModal: React.FC<CareerHistoryArchiveModalProps> = ({
  isOpen,
  onClose,
  pastCareers = [],
  onDeletePastCareer,
  ui,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 p-6 text-white shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <History className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Salón de la Fama
              </span>
              <h3 className="text-xl font-black uppercase text-white">
                Historial de Carreras Pasadas
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {pastCareers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-bold uppercase tracking-wider">
              No hay carreras anteriores archivadas en el historial.
            </div>
          ) : (
            pastCareers.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{c.manager || 'Mánager Legendario'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      Reputación: {c.rep || 0}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Último club: <strong className="text-slate-200">{c.lastTeamName || c.teamName || 'Desconocido'}</strong></span>
                    <span>• Temporadas: {c.seasonsCount || c.season || 1}</span>
                    <span>• Títulos: {c.titlesCount || (c.titles?.length || 0)}</span>
                  </div>
                </div>

                {onDeletePastCareer && (
                  <button
                    onClick={() => onDeletePastCareer(c.id || idx)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 transition-colors"
                    title="Eliminar del archivo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase"
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  );
};
export default CareerHistoryArchiveModal;
