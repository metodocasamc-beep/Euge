import React, { useState } from 'react';
import { StudioSettings } from '../types';
import { X, MessageCircle, Send, Sparkles, HelpCircle, PhoneCall, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { Logo } from './Logo';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, settings }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string; canContact?: boolean }[]>([
    {
      sender: 'assistant',
      text: '¡Hola! Podés consultarme sobre plazos, qué incluye cada servicio, cómo funciona el crédito de Asesoría o las formas de pago de Método CASA.',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || isLoading) return;

    const userText = questionInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      const response = await api.askFaq(userText);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: response.answer,
        canContact: response.canContactEuge
      }]);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'No pude procesar tu consulta en este momento. Podés escribirle a Euge directamente por WhatsApp.',
        canContact: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedFaqs = [
    '¿Cómo funciona el crédito de Asesoría a Diseño Integral?',
    '¿Cuáles son los plazos de entrega?',
    '¿Qué pasa si necesito reprogramar el Meet?',
    '¿Cuáles son las formas de pago aceptadas?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2120]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col h-[580px] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-[#FAF8F5] border-b border-[#d9d1c5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="badge" size="sm" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 tracking-wider">
                Consultas Rápidas
              </span>
              <h3 className="text-xl font-heading font-extrabold text-[#1c2120]">
                Preguntas Frecuentes
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-[#1c2120]/50 hover:text-[#1c2120] hover:bg-[#d9d1c5]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick questions chips */}
        <div className="p-3 bg-[#ffffff] border-b border-[#d9d1c5]/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {predefinedFaqs.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestionInput(q);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#fed767]/30 border border-[#d9d1c5] text-[#1c2120] whitespace-nowrap cursor-pointer transition-colors shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#FAF8F5]/50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#1c2120] text-white rounded-br-xs'
                    : 'bg-[#ffffff] text-[#1c2120] border border-[#d9d1c5] rounded-bl-xs shadow-2xs'
                }`}
              >
                {m.text}

                {m.canContact && (
                  <div className="mt-2.5 pt-2 border-t border-[#d9d1c5]/60 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${settings.eugeWhatsApp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1c2120] hover:underline"
                    >
                      <PhoneCall className="w-3 h-3 text-[#fed767]" />
                      <span>Consultar con Euge por WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-[#1c2120]/60 p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#fed767]" />
              <span>Consultando políticas del estudio...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleAsk} className="p-3 bg-[#ffffff] border-t border-[#d9d1c5] flex items-center gap-2">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Escribí tu pregunta sobre el servicio..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
          />
          <button
            type="submit"
            disabled={!questionInput.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
