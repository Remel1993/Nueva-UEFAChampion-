import React from 'react';
import { Newspaper } from 'lucide-react';

interface RumorsTickerProps {
  rumors?: string[] | { text: string; id?: string | number }[];
}

export const RumorsTicker: React.FC<RumorsTickerProps> = ({ rumors = [] }) => {
  if (!rumors || rumors.length === 0) return null;

  const rumorTexts = rumors.map(r => (typeof r === 'string' ? r : r.text)).filter(Boolean);
  if (rumorTexts.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-sky-500/20 bg-slate-900/80 px-3 py-2 shadow-inner backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-black uppercase tracking-wider shrink-0">
          <Newspaper className="w-3 h-3 text-sky-400 animate-pulse" />
          <span>Mercado</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-marquee text-xs font-semibold text-slate-300 space-x-8">
            {rumorTexts.map((text, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <span>{text}</span>
                {idx < rumorTexts.length - 1 && (
                  <span className="text-sky-500/50 font-black">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RumorsTicker;
