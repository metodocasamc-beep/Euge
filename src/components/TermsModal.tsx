import React from 'react';
import { StudioSettings } from '../types';
import { X, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, settings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2120]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        <div className="p-5 bg-[#FAF8F5] border-b border-[#d9d1c5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="badge" size="sm" />
            <div>
              <h3 className="text-base font-heading font-extrabold text-[#1c2120]">
                Términos y Condiciones del Servicio
              </h3>
              <p className="text-[11px] text-[#1c2120]/60 font-medium">
                Versión oficial vigente: {settings.termsCurrentVersion}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#1c2120]/50 hover:text-[#1c2120] hover:bg-[#d9d1c5]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-[#1c2120]/85 whitespace-pre-line bg-[#FAF8F5]/30">
          {settings.termsFullText}
        </div>

        <div className="p-4 bg-white border-t border-[#d9d1c5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl cursor-pointer shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
