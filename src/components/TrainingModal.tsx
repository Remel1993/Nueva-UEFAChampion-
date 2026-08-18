import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Sparkles, ArrowUp, CheckCircle, Shield, Swords, Target } from 'lucide-react';
import { peCostFor, MAX_SQUAD_CAPS } from '@/lib/career';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: any;
  career: any;
  maxLeagueStrength?: number;
  onApplyStats?: (newStats: { att: number; opp: number; def: number }, peSpent: number) => void;
  ui?: any;
}

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  team,
  career,
  onApplyStats,
  ui,
}) => {
  if (!isOpen || !team) return null;

  const currentPe = career?.pe ?? 0;
  const [att, setAtt] = useState(team.att || 2);
  const [opp, setOpp] = useState(team.opp || 2);
  const [def, setDef] = useState(team.def || 2);

  // Compute PE spent for preview
  const calcSpent = () => {
    let spent = 0;
    for (let v = team.att; v < att; v++) spent += peCostFor(v);
    for (let v = team.opp; v < opp; v++) spent += peCostFor(v);
    for (let v = team.def; v < def; v++) spent += peCostFor(v);
    return spent;
  };

  const totalSpent = calcSpent();
  const remainingPe = currentPe - totalSpent;

  const canUpgrade = (attr: 'att' | 'opp' | 'def', currentVal: number) => {
    const maxVal = MAX_SQUAD_CAPS[attr];
    if (currentVal >= maxVal) return false;
    const cost = peCostFor(currentVal);
    return remainingPe >= cost;
  };

  const handleUpgrade = (attr: 'att' | 'opp' | 'def') => {
    if (attr === 'att' && canUpgrade('att', att)) setAtt(a => a + 1);
    if (attr === 'opp' && canUpgrade('opp', opp)) setOpp(o => o + 1);
    if (attr === 'def' && canUpgrade('def', def)) setDef(d => d + 1);
  };

  const handleDowngrade = (attr: 'att' | 'opp' | 'def') => {
    if (attr === 'att' && att > team.att) setAtt(a => a - 1);
    if (attr === 'opp' && opp > team.opp) setOpp(o => o - 1);
    if (attr === 'def' && def > team.def) setDef(d => d - 1);
  };

  const handleConfirm = () => {
    if (onApplyStats && totalSpent > 0) {
      onApplyStats({ att, opp, def }, totalSpent);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 p-6 text-white shadow-2xl space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Desarrollo de Plantilla
            </span>
            <h3 className="text-xl font-black uppercase text-white tracking-wide">
              Entrenamiento y Evolución
            </h3>
          </div>
        </div>

        {/* Balance de PE */}
        <div className="flex items-center justify-between bg-slate-900/90 border border-white/10 rounded-2xl p-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Puntos de Evolución Disponibles</span>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5" />
              {remainingPe} <span className="text-xs text-slate-400 font-normal">/ {currentPe} PE</span>
            </div>
          </div>
          {totalSpent > 0 && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Costo Seleccionado</span>
              <div className="text-lg font-black text-rose-400">-{totalSpent} PE</div>
            </div>
          )}
        </div>

        {/* Atributos */}
        <div className="space-y-3">
          {/* ATT */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">Ataque (ATT)</div>
                <div className="text-[10px] text-slate-400">Goles a favor y definición</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-white">{att} / {MAX_SQUAD_CAPS.att}</span>
              {att > team.att && (
                <button
                  onClick={() => handleDowngrade('att')}
                  className="px-2 py-1 bg-white/10 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/20"
                >
                  -
                </button>
              )}
              {att < MAX_SQUAD_CAPS.att && (
                <button
                  onClick={() => handleUpgrade('att')}
                  disabled={!canUpgrade('att', att)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 ${
                    canUpgrade('att', att)
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-3 h-3" /> +{peCostFor(att)} PE
                </button>
              )}
            </div>
          </div>

          {/* OPP */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">Ocasiones (OPP)</div>
                <div className="text-[10px] text-slate-400">Creación de juego y dominio</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-white">{opp} / {MAX_SQUAD_CAPS.opp}</span>
              {opp > team.opp && (
                <button
                  onClick={() => handleDowngrade('opp')}
                  className="px-2 py-1 bg-white/10 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/20"
                >
                  -
                </button>
              )}
              {opp < MAX_SQUAD_CAPS.opp && (
                <button
                  onClick={() => handleUpgrade('opp')}
                  disabled={!canUpgrade('opp', opp)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 ${
                    canUpgrade('opp', opp)
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-3 h-3" /> +{peCostFor(opp)} PE
                </button>
              )}
            </div>
          </div>

          {/* DEF */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">Defensa (DEF)</div>
                <div className="text-[10px] text-slate-400">Solidez y goles encajados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-white">{def} / {MAX_SQUAD_CAPS.def}</span>
              {def > team.def && (
                <button
                  onClick={() => handleDowngrade('def')}
                  className="px-2 py-1 bg-white/10 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/20"
                >
                  -
                </button>
              )}
              {def < MAX_SQUAD_CAPS.def && (
                <button
                  onClick={() => handleUpgrade('def')}
                  disabled={!canUpgrade('def', def)}
                  className={`px-3 py-1 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 ${
                    canUpgrade('def', def)
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp className="w-3 h-3" /> +{peCostFor(def)} PE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={totalSpent === 0}
            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-center gap-1.5 ${
              totalSpent > 0
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Aplicar ({totalSpent} PE)
          </button>
        </div>
      </motion.div>
    </div>
  );
};
export default TrainingModal;
