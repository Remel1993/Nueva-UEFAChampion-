import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Archive, Trash2, X } from 'lucide-react';

interface DeleteCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: any;
  team: any;
  onArchiveAndReset: () => void;
  onHardDelete: () => void;
  ui?: any;
}

export const DeleteCareerModal: React.FC<DeleteCareerModalProps> = ({
  isOpen,
  onClose,
  career,
  team,
  onArchiveAndReset,
  onHardDelete,
  ui,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/40 bg-slate-950 p-6 text-white shadow-2xl space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
              Gestión de Partida
            </span>
            <h3 className="text-lg font-black uppercase text-white">
              ¿Reiniciar o Borrar Carrera?
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Estás a punto de finalizar la trayectoria de <strong className="text-amber-300">{career?.manager || 'tu mánager'}</strong> con <strong className="text-white">{team?.name || 'este club'}</strong>. Puedes archivar sus hazañas para conservarlas en el historial o borrarla por completo.
        </p>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={onArchiveAndReset}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Archive className="w-4 h-4" /> Archivar en Salón de la Fama y Nueva Carrera
          </button>

          <button
            onClick={onHardDelete}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Eliminar Definitivamente sin Archivar
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold uppercase"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default DeleteCareerModal;
