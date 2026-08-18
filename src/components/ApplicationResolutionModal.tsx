import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, XCircle, Clock, ArrowRight, Shield } from 'lucide-react';

interface ApplicationResolutionModalProps {
  isOpen: boolean;
  resolution: any;
  career: any;
  onAccept: (offer: any) => void;
  onReject: (offer: any) => void;
  onDecideLater: (offer: any) => void;
}

export const ApplicationResolutionModal: React.FC<ApplicationResolutionModalProps> = ({
  isOpen,
  resolution,
  career,
  onAccept,
  onReject,
  onDecideLater,
}) => {
  if (!isOpen || !resolution) return null;

  const isAccepted = resolution.status === 'accepted' || resolution.accepted;
  const offer = resolution.offer || resolution;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border ${
          isAccepted ? 'border-emerald-500/40 bg-slate-900' : 'border-rose-500/40 bg-slate-900'
        } p-6 text-white shadow-2xl space-y-4`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${
              isAccepted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isAccepted ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Resolución de Candidatura
            </span>
            <h3 className="text-lg font-black uppercase text-white">
              {isAccepted ? '¡Propuesta Aprobada!' : 'Candidatura Desestimada'}
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
          <div className="text-sm font-bold text-white">
            {offer.teamName || resolution.teamName}
          </div>
          <div className="text-xs text-slate-400">
            {offer.compName || resolution.compName} · {offer.div === 2 ? '2ª División' : '1ª División'} · Tier {offer.tier || resolution.tier || 1}
          </div>
          {resolution.reason && (
            <p className="text-xs text-slate-300 italic pt-1 border-t border-white/5">
              "{resolution.reason}"
            </p>
          )}
        </div>

        {isAccepted ? (
          <div className="space-y-2 pt-2">
            <button
              onClick={() => onAccept(offer)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Aceptar y Firmar Ahora
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onDecideLater(offer)}
                className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" /> Decidir Luego
              </button>
              <button
                onClick={() => onReject(offer)}
                className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs uppercase flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" /> Rechazar
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <button
              onClick={() => onReject(offer)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase"
            >
              Continuar en el club actual
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default ApplicationResolutionModal;
