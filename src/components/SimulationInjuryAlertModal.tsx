import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Sparkles, ShieldAlert, X } from 'lucide-react';

interface SimulationInjuryAlertModalProps {
  isOpen: boolean;
  affectedAttr?: string;
  attrLabel?: string;
  die?: number;
  physioCost?: number;
  categoryLabel?: string;
  career?: any;
  team?: any;
  onSelectOption: (option: 'accept_injury' | 'physio_elite') => void;
  onCancel?: () => void;
  ui?: any;
}

export const SimulationInjuryAlertModal: React.FC<SimulationInjuryAlertModalProps> = ({
  isOpen,
  affectedAttr,
  attrLabel = 'Atributo',
  die = 6,
  physioCost = 25,
  career,
  team,
  onSelectOption,
  onCancel,
}) => {
  if (!isOpen) return null;

  const currentPe = career?.pe ?? 0;
  const canAffordPhysio = currentPe >= physioCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/40 bg-slate-900 shadow-2xl p-6 text-white"
      >
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
              Alerta Médica de Simulación
            </span>
            <h3 className="text-lg font-black uppercase text-white">
              Lesión en Entrenamiento
            </h3>
          </div>
        </div>

        <div className="bg-rose-950/40 border border-rose-500/20 rounded-2xl p-4 mb-5 text-sm text-slate-300 space-y-2">
          <p>
            Durante la preparación de la jornada se ha producido un percance físico en <strong className="text-white">{attrLabel}</strong> (Dado: {die}).
          </p>
          <p className="text-xs text-rose-200">
            El atributo se verá reducido temporalmente a menos que se contrate fisioterapia de emergencia.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onSelectOption('physio_elite')}
            disabled={!canAffordPhysio}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border font-bold transition-all ${
              canAffordPhysio
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <Activity className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-xs font-black uppercase">Fisioterapia Élite</div>
                <div className="text-[10px] text-emerald-200">Anula la penalización y recupera al jugador</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl bg-black/30 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> -{physioCost} PE
            </span>
          </button>

          <button
            onClick={() => onSelectOption('accept_injury')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <div>
                <div className="text-xs font-black uppercase">Asumir Lesión</div>
                <div className="text-[10px] text-rose-200/80">Jugar con la baja deportiva sin gastar PE</div>
              </div>
            </div>
            <span className="text-xs font-black text-slate-400">0 PE</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default SimulationInjuryAlertModal;
