import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, HelpCircle, MessageCircle, FileText, Layout, PenTool, CheckCircle2 } from 'lucide-react';
import { ServiceType } from '../types';

interface DiagnosticViewProps {
  onOpenBooking: (serviceType: ServiceType) => void;
  onOpenCalculator: () => void;
  onNavigateServices: () => void;
}

interface SituationOption {
  id: string;
  situation: string;
  clientQuote: string;
  recommendedService: ServiceType;
  recommendedTitle: string;
  priceNote: string;
  whyThis: string;
  deliverablesSummary: string[];
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  onOpenBooking,
  onOpenCalculator,
  onNavigateServices
}) => {
  const situations: SituationOption[] = [
    {
      id: 'cero',
      situation: 'Estoy empezando de cero',
      clientQuote: '“Quiero un espacio que me represente y funcione para mi forma de vivir desde el primer día.”',
      recommendedService: 'diseno_integral',
      recommendedTitle: 'Diseño Integral + Carpeta Técnica',
      priceNote: 'Desde $290.000 ARS (Servicio Estrella)',
      whyThis: 'Ideal porque necesitás ver todo el espacio en 3D antes de comprar nada, y luego tener planos técnicos para que los gremios no improvisen.',
      deliverablesSummary: [
        'Propuesta 3D completa de distribución y estética',
        'Video explicativo con criterio de cada decisión',
        'Planos generales, cotas e instalaciones'
      ]
    },
    {
      id: 'renovar',
      situation: 'Mi espacio ya existe',
      clientQuote: '“Pero siento que necesita renovarse, adaptarse a una nueva etapa o volver a sentirlo propio.”',
      recommendedService: 'diseno_integral',
      recommendedTitle: 'Diseño Integral / Anteproyecto 3D',
      priceNote: 'Desde $290.000 ARS',
      whyThis: 'Te permite repensar la distribución y la iluminación conservando o reacomodando lo que ya tenés sin romper de más.',
      deliverablesSummary: [
        'Imágenes realistas 3D de la transformación',
        'Zonificación inteligente y paleta de materiales',
        '1 instancia de modificaciones incluida'
      ]
    },
    {
      id: 'mueble',
      situation: 'Tengo un problema puntual con un mueble',
      clientQuote: '“Necesito resolver o rediseñar un placard, una despensa o un escritorio que no consigo en el mercado.”',
      recommendedService: 'muebles_medida',
      recommendedTitle: 'Diseño de Mobiliario + Soluciones a Medida',
      priceNote: 'Desde $110.000 ARS',
      whyThis: 'Diseñar a medida aprovecha cada centímetro para guardado y orden real con la estética justa para tu hogar.',
      deliverablesSummary: [
        'Diseño milimétrico adaptado a tus objetos',
        'Planos técnicos listos para carpintería/herrería',
        'Definición de melaminas, laqueados y herrajes'
      ]
    },
    {
      id: 'dudas',
      situation: 'Necesito una segunda mirada experta',
      clientQuote: '“Tengo dudas puntuales sobre colores, iluminación o compras y quiero evitar errores antes de avanzar.”',
      recommendedService: 'asesoria',
      recommendedTitle: 'Asesoría Virtual (60 minutos)',
      priceNote: 'Tarifa fija $110.000 ARS',
      whyThis: 'La forma más rápida y económica de destrabar decisiones con una diseñadora profesional sin contratar un proyecto completo.',
      deliverablesSummary: [
        '1 videollamada mano a mano de 60 minutos',
        'Revisión previa de tus planos, fotos y videos',
        'PDF resumen con mini roadmap de acción'
      ]
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('cero');
  const activeSituation = situations.find(s => s.id === selectedId) || situations[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-mont font-bold text-[#1c2120]">
          <Sparkles className="w-3.5 h-3.5 text-[#fed767]" />
          <span>Diagnóstico inteligente de Método CASA</span>
        </div>
        <h1 className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120]">
          ¿Con cuál de estas situaciones te identificás?
        </h1>
        <p className="text-sm sm:text-base text-[#1c2120]/80">
          Hacé clic en la opción que mejor describe tu momento para ver el camino más directo, claro y ordenado.
        </p>
      </div>

      {/* Interactive Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {situations.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-2 border-[#1c2120] shadow-md ring-2 ring-[#fed767]/50'
                  : 'bg-[#FAF8F5] border-[#d9d1c5] hover:bg-white hover:border-[#1c2120]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mont ${
                    isSelected ? 'bg-[#fed767] text-[#1c2120]' : 'bg-[#d9d1c5]/60 text-[#1c2120]/70'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </span>
                  <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/60">
                    Caso real
                  </span>
                </div>
                <h3 className="font-mont font-bold text-base text-[#1c2120] leading-snug">
                  {item.situation}
                </h3>
              </div>
              <p className="text-xs text-[#1c2120]/70 italic mt-3 pt-3 border-t border-[#d9d1c5]/50">
                {item.clientQuote}
              </p>
            </button>
          );
        })}
      </div>

      {/* Recommended Solution Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#d9d1c5] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d1c5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs uppercase tracking-wider">
                Recomendación para tu caso
              </span>
            </div>
            <h2 className="font-mont font-extrabold text-2xl sm:text-3xl text-[#1c2120] mt-2">
              {activeSituation.recommendedTitle}
            </h2>
            <p className="text-xs sm:text-sm font-mont font-semibold text-[#1c2120]/70 mt-1">
              {activeSituation.priceNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenBooking(activeSituation.recommendedService)}
              className="px-5 py-3 rounded-xl bg-[#1c2120] text-white font-mont font-bold text-xs hover:bg-black transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Reservar ahora</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-4 py-3 rounded-xl bg-[#f2ece4] text-[#1c2120] font-mont font-semibold text-xs hover:bg-[#d9d1c5] transition-colors cursor-pointer"
            >
              Calcular m² exactos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h4 className="font-mont font-bold text-sm text-[#1c2120] uppercase tracking-wider">
              ¿Por qué es la opción indicada?
            </h4>
            <p className="text-sm text-[#1c2120]/80 leading-relaxed">
              {activeSituation.whyThis}
            </p>
            <div className="flex items-center gap-3.5 p-3.5 rounded-[2rem_1.2rem_2.2rem_1rem] bg-[#FAF8F5] border border-[#d9d1c5]/80 shadow-xs">
              <div className="relative shrink-0">
                <img
                  src="/src/assets/images/euge_avatar_thinking_1790777118394.jpg"
                  alt="Euge"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/60 block mb-0.5">Consejo de Euge:</span>
                <p className="font-hand text-xl text-[#1c2120] leading-snug">
                  “No gastes plata en materiales o muebles antes de tener la foto clara del conjunto.”
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-mont font-bold text-sm text-[#1c2120] uppercase tracking-wider">
              ¿Qué te llevás concretamente?
            </h4>
            <ul className="space-y-2.5">
              {activeSituation.deliverablesSummary.map((del, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1c2120]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#1c2120] shrink-0 mt-0.5" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Authentic Doubts from Canva */}
      <div className="space-y-4">
        <h3 className="font-mont font-bold text-lg text-[#1c2120] text-center">
          Dudas cotidianas que resolvemos en Método CASA:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#d9d1c5] space-y-2">
            <span className="text-xl">🪚</span>
            <p className="font-mont font-medium text-sm text-[#1c2120]">
              “Si mi diseño lleva un mueble a medida en el living, ¿qué info le paso al carpintero?”
            </p>
            <p className="text-xs text-[#1c2120]/70">
              En la <strong>Carpeta Técnica</strong> o en el servicio de <strong>Muebles a Medida</strong> te entregamos planos milimétricos acotados con vistas, cortes y despiece para que el carpintero fabrique directo sin margen de error.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#d9d1c5] space-y-2">
            <span className="text-xl">💡</span>
            <p className="font-mont font-medium text-sm text-[#1c2120]">
              “El electricista me pide plano de la nueva disposición de la conexión eléctrica planteada.”
            </p>
            <p className="text-xs text-[#1c2120]/70">
              Con la <strong>Carpeta Técnica</strong> tenés el plano de bocas, llaves de encendido y alturas de tomas para coordinar con el instalador de forma clara y ordenada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
