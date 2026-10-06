import React, { useState } from 'react';
import { StudioSettings, ServiceType } from '../types';
import { formatARS } from '../utils/dateUtils';
import { Check, ArrowRight, Sparkles, Clock, Calendar, HelpCircle, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ServicesViewProps {
  settings: StudioSettings;
  onSelectService: (service: ServiceType) => void;
  onCalculateService: (service: ServiceType) => void;
  onOpenDiagnostic?: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  settings,
  onSelectService,
  onCalculateService,
  onOpenDiagnostic
}) => {
  const [activeTab, setActiveTab] = useState<ServiceType>('diseno_integral');

  const servicesData = [
    {
      type: 'asesoria' as ServiceType,
      title: 'Asesoría Virtual (60 minutos)',
      subtitle: 'Claridad rápida y soluciones puntuales para tu espacio',
      badge: 'Reunión 1 a 1',
      badgeClass: 'bg-[#f2ece4] text-[#1c2120]',
      basePrice: settings.servicePrices.asesoria.basePriceARS || 110000,
      priceLabel: 'Tarifa fija',
      modalidad: 'Online · Videollamada de 60 minutos',
      description: 'Una reunión virtual personalizada para resolver dudas, ordenar ideas y encontrar la mejor solución para tu espacio. Ideal si necesitás una mirada profesional antes de tomar decisiones o empezar un proyecto.',
      overviewQuote: '“Tengo una reunión personalizada donde analizamos juntxs tu espacio, tus necesidades y las posibilidades que tiene para verse y funcionar mejor.”',
      includes: [
        '1 videollamada de 60\' para conocernos y analizar el espacio y tus necesidades.',
        'Revisión previa de planos, medidas, fotos y videos que nos envíes.',
        'Entrega de PDF con resumen de la charla con un mini roadmap de acción.',
        'Sugerencias de paleta cromática, iluminación y disposición de mobiliario existente.'
      ],
      idealFor: [
        'Necesitás claridad y una mirada profesional para algo específico.',
        'Tenés dudas puntuales de color, compras o distribución y querés evitar errores costosos.',
        'Querés saber por dónde arrancar sin contratar un proyecto completo.'
      ],
      whatYouGet: [
        'Propuestas, recomendaciones e ideas concretas para tu espacio.',
        'Una dirección estética y funcional clara.',
        'Resolución de dudas y consultas específicas.'
      ],
      timeframe: 'Agendable con 72 hs de anticipación previa'
    },
    {
      type: 'diseno_integral' as ServiceType,
      title: 'Diseño Integral / Anteproyecto 3D',
      subtitle: 'La propuesta completa para transformar tus ambientes vistos en 3D',
      badge: 'Servicio Estrella ⭐',
      badgeClass: 'bg-[#fed767] text-[#1c2120] font-bold',
      basePrice: settings.servicePrices.diseno_integral.basePriceARS || 290000,
      priceLabel: 'Desde',
      modalidad: 'Online · Renders 3D + Video Explicativo',
      description: 'Desarrollo una propuesta completa para crear o transformar uno o varios ambientes. Incluye todo el interiorismo de tus espacios vistos en 3D: distribución, estética y organización, para que el espacio funcione y refleje tu identidad.',
      overviewQuote: '“Una propuesta de diseño completa presentada a través de imágenes realistas (renders), acompañadas por mi explicación conceptual, estética y funcional.”',
      includes: [
        '1 videollamada para conocernos y conversar sobre necesidades, ideas, inspiración y objetivos del espacio.',
        'Revisión previa de planos, medidas, fotos y videos del ambiente.',
        'Entrega de presentación de diseño con video explicativo (recorrido de la propuesta).',
        'Hasta 1 instancia de modificación incluida en caso de ser necesaria.',
        'Contacto directo por WhatsApp para canalizar dudas durante el proceso.'
      ],
      idealFor: [
        'Necesitás una propuesta integral y completa del espacio, pero sin planos de obra.',
        'Te basta con que alguien con criterio profesional te presente la idea y te muestre exactamente cómo va a quedar.',
        'Buscás un resultado estético y funcional bien pensado para vivirlo mejor.'
      ],
      whatYouGet: [
        'Una propuesta explicada y vista de forma realista en 3D.',
        'Claridad visual y conceptual total antes de comprar o pintar.',
        'Una dirección concreta para avanzar con seguridad.'
      ],
      timeframe: '5 a 7 días hábiles de entrega'
    },
    {
      type: 'carpeta_tecnica' as ServiceType,
      title: 'Carpeta Técnica / Proyecto Ejecutivo',
      subtitle: 'Toda la documentación técnica para ejecutar la obra sin errores',
      badge: 'Upgrade Constructivo',
      badgeClass: 'bg-[#1c2120] text-white',
      basePrice: settings.servicePrices.carpeta_tecnica.basePriceARS || 275000,
      priceLabel: 'Desde',
      modalidad: 'Online · Planos ejecutivos y especificaciones',
      description: 'Después de la propuesta de diseño, recibís toda la documentación técnica necesaria para ejecutar el proyecto. Planos, detalles y especificaciones para llevar la idea a la realidad con claridad y a tu tiempo.',
      overviewQuote: '“Incluye planos, instalaciones, muebles a medida, materiales, cálculos y cantidades orientativas generales.”',
      includes: [
        'Desarrollo de documentación técnica según las necesidades del proyecto.',
        'Planos generales acotados y específicos de obra.',
        'Diseño y planos de muebles a medida, si aplica al espacio.',
        'Selección de materiales, terminaciones, iluminación y referencias comerciales.',
        'Presupuesto estimado y cantidades orientativas para gremios.',
        'Hasta 1 instancia de modificaciones y acompañamiento por WhatsApp.'
      ],
      idealFor: [
        'Querés llevar el proyecto a la realidad de manera segura y organizada.',
        'Buscás entregarle toda la info correcta, definida y completa en detalle a gremios, contratistas o proveedores para evitar errores y gastos inesperados.',
        'Querés coordinar carpinteros, pintores y electricistas con planos precisos.'
      ],
      whatYouGet: [
        'Una guía técnica clara, profesional y exhaustiva.',
        'Menos improvisación, menos demoras y cero gastos sorpresa.',
        'Un proyecto mucho más ordenado, preciso y coherente.'
      ],
      timeframe: '10 días hábiles de desarrollo'
    },
    {
      type: 'muebles_medida' as ServiceType,
      title: 'Diseño de Mobiliario + Soluciones a Medida',
      subtitle: 'Guardado y funcionalidad milimétrica adaptada a tus necesidades',
      badge: 'Solución a Medida',
      badgeClass: 'bg-[#FAF8F5] text-[#1c2120] border border-[#d9d1c5]',
      basePrice: settings.servicePrices.muebles_medida?.basePriceARS || 110000,
      priceLabel: 'Desde',
      modalidad: 'Online · Renders + Planos para taller',
      description: 'Diseño de muebles y soluciones personalizadas para resolver necesidades puntuales de: guardado, organización o aprovechamiento del espacio. Cada propuesta se adapta a tu forma de usar ese ambiente, a una estética y a lo que realmente necesitás.',
      overviewQuote: '“Diseñar un mueble a medida es pensar en una solución que aproveche el espacio, responda a tus necesidades y se integre naturalmente.”',
      includes: [
        '1 videollamada para conocer el espacio, las necesidades y tus objetivos.',
        'Revisión previa de planos, medidas, fotos y videos del rincón a resolver.',
        'Diseño personalizado del mobiliario o la solución propuesta.',
        'Renders o imágenes de referencia para visualizar el resultado.',
        'Planos técnicos y documentación necesaria para su fabricación en taller.',
        'Definición de materiales, terminaciones, herrajes y cantos.',
        'Hasta 1 instancia de modificaciones y soporte por WhatsApp.'
      ],
      idealFor: [
        'Necesitás aprovechar mejor un espacio específico (placard, bajomesada, escritorio).',
        'Querés diseñar o rediseñar un mueble que no conseguís en el mercado masivo.',
        'Buscás resolver problemas de guardado crónico o de funcionamiento.'
      ],
      whatYouGet: [
        'Un diseño pensado en detalle exclusivamente para tu espacio.',
        'Planos listos para fabricar con los proveedores o carpinteros que elijas.',
        'Aprovechamiento de cada centímetro útil.'
      ],
      timeframe: '7 días hábiles de desarrollo'
    }
  ];

  const currentService = servicesData.find(s => s.type === activeTab) || servicesData[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-mont font-bold text-[#1c2120]">
          <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
          <span>Modalidad: 100% Online · En todo el país y el exterior</span>
        </div>
        <h1 className="font-mont font-extrabold text-3xl sm:text-5xl text-[#1c2120] tracking-tight">
          Mis Servicios
        </h1>
        <p className="text-base sm:text-lg text-[#1c2120]/80 font-normal">
          Soluciones de interiorismo claras, transparentes y organizadas. Elegí la modalidad que mejor se adapte a tu etapa.
        </p>

        {/* El Método Diferencial Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 text-left">
          <div className="p-3 rounded-xl bg-white border border-[#d9d1c5]/80 space-y-1">
            <span className="text-xs font-mont font-bold text-[#1c2120] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed767]"></span>
              Ahorro de Tiempo
            </span>
            <p className="text-[11px] text-[#1c2120]/70">Entrega en 5 a 10 días hábiles garantizados.</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#d9d1c5]/80 space-y-1">
            <span className="text-xs font-mont font-bold text-[#1c2120] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed767]"></span>
              Precios Claros
            </span>
            <p className="text-[11px] text-[#1c2120]/70">Tarifas públicas fijas y hasta 3 cuotas.</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#d9d1c5]/80 space-y-1">
            <span className="text-xs font-mont font-bold text-[#1c2120] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed767]"></span>
              Todo en un Solo Lugar
            </span>
            <p className="text-[11px] text-[#1c2120]/70">Láminas, video y chat en tu espacio privado.</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#d9d1c5]/80 space-y-1">
            <span className="text-xs font-mont font-bold text-[#1c2120] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fed767]"></span>
              100% Personalizado
            </span>
            <p className="text-[11px] text-[#1c2120]/70">Diseñado a medida por la Lic. Euge Demarco.</p>
          </div>
        </div>
      </div>

      {/* Service Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-1.5 bg-[#f2ece4] rounded-2xl border border-[#d9d1c5]">
        {servicesData.map(service => {
          const isActive = service.type === activeTab;
          return (
            <button
              key={service.type}
              onClick={() => setActiveTab(service.type)}
              className={`p-3.5 sm:p-4 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white text-[#1c2120] shadow-sm font-bold border border-[#d9d1c5]'
                  : 'text-[#1c2120]/70 hover:text-[#1c2120] hover:bg-white/40'
              }`}
            >
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mont font-bold mb-1.5 ${service.badgeClass}`}>
                  {service.badge}
                </span>
                <p className="font-mont font-bold text-xs sm:text-sm line-clamp-2">
                  {service.type === 'asesoria' ? '01 · Asesoría' :
                   service.type === 'diseno_integral' ? '02 · Diseño Integral 3D' :
                   service.type === 'carpeta_tecnica' ? '03 · Carpeta Técnica' :
                   '04 · Muebles a Medida'}
                </p>
              </div>
              <p className="text-xs font-mont font-extrabold text-[#1c2120] mt-2">
                {service.priceLabel} {formatARS(service.basePrice)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Service Detailed Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#d9d1c5] shadow-xs space-y-8">
        {/* Top Header of Active Service */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#d9d1c5]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mont font-bold uppercase tracking-wider ${currentService.badgeClass}`}>
                {currentService.badge}
              </span>
              <span className="text-xs text-[#1c2120]/70 font-mont">
                {currentService.modalidad}
              </span>
            </div>
            <h2 className="font-mont font-extrabold text-2xl sm:text-4xl text-[#1c2120]">
              {currentService.title}
            </h2>
            <p className="text-sm sm:text-base text-[#1c2120]/80 font-normal">
              {currentService.subtitle}
            </p>
          </div>

          {/* Pricing & CTAs */}
          <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] text-right sm:min-w-[260px] space-y-3">
            <div>
              <span className="text-xs font-mont text-[#1c2120]/60 uppercase tracking-wider block">
                {currentService.priceLabel}
              </span>
              <p className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120]">
                {formatARS(currentService.basePrice)}
                <span className="text-xs font-normal text-[#1c2120]/70 ml-1">ARS</span>
              </p>
              <div className="space-y-1 mt-1">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  20% OFF por Transferencia ({formatARS(Math.round(currentService.basePrice * 0.80))})
                </span>
                <p className="text-[11px] text-[#1c2120]/70">
                  O en 3 cuotas fijas de {formatARS(Math.round(currentService.basePrice / 3))} con Mercado Pago
                </p>
                <p className="text-[10px] text-amber-800 font-semibold">
                  ⚡ 8% OFF extra contratando en Pack (ej. Diseño + Carpeta)
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onSelectService(currentService.type)}
                className="w-full py-3 px-4 rounded-xl bg-[#1c2120] text-white font-mont font-bold text-xs hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reservar este servicio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
              </button>

              <button
                onClick={() => onCalculateService(currentService.type)}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#d9d1c5] text-[#1c2120] font-mont font-semibold text-xs hover:bg-[#f2ece4] transition-colors cursor-pointer"
              >
                Calcular según tus ambientes
              </button>
            </div>
          </div>
        </div>

        {/* Narrative & Quote from Euge with circular avatar + decontracted organic shape */}
        <div className="p-5 sm:p-6 rounded-[2.5rem_1.4rem_2.8rem_1.2rem] bg-[#ffffff] border border-[#d9d1c5] shadow-xs flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/euge_avatar_talking_1790777128105.jpg"
              alt="Euge Demarco"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="space-y-1.5 flex-1">
            <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/60 block">Euge te explica este servicio:</span>
            <p className="font-hand text-2xl sm:text-3xl text-[#1c2120] leading-snug">
              {currentService.overviewQuote}
            </p>
            <p className="text-xs sm:text-sm text-[#1c2120]/75 font-mont leading-relaxed">
              {currentService.description}
            </p>
          </div>
        </div>

        {/* 3 Detail Columns: Qué Incluye / Ideal Para / Qué te Llevás */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
          {/* Qué Incluye */}
          <div className="space-y-4">
            <h3 className="font-mont font-bold text-sm text-[#1c2120] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
              ¿Qué incluye?
            </h3>
            <ul className="space-y-2.5">
              {currentService.includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1c2120]/90">
                  <Check className="w-4 h-4 text-[#1c2120] shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal para vos si */}
          <div className="space-y-4">
            <h3 className="font-mont font-bold text-sm text-[#1c2120] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
              Ideal para vos, si:
            </h3>
            <ul className="space-y-2.5">
              {currentService.idealFor.map((idf, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1c2120]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#1c2120] shrink-0 mt-0.5" />
                  <span>{idf}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Qué te llevás */}
          <div className="space-y-4">
            <h3 className="font-mont font-bold text-sm text-[#1c2120] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
              ¿Qué te llevás?
            </h3>
            <ul className="space-y-2.5">
              {currentService.whatYouGet.map((wyg, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1c2120]/90 font-medium">
                  <Sparkles className="w-4 h-4 text-[#fed767] shrink-0 mt-0.5" />
                  <span>{wyg}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#d9d1c5]/60">
              <span className="text-[11px] font-mont font-bold text-[#1c2120]/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Plazo: {currentService.timeframe}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Diagnostic Banner */}
      {onOpenDiagnostic && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#f2ece4] border border-[#d9d1c5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-mont font-bold text-lg text-[#1c2120]">
              ¿Tenés dudas entre Asesoría y Diseño Integral?
            </h4>
            <p className="text-xs sm:text-sm text-[#1c2120]/70">
              Probá nuestro selector de situaciones reales para descubrir cuál es la opción ideal para tu caso.
            </p>
          </div>
          <button
            onClick={onOpenDiagnostic}
            className="px-5 py-2.5 rounded-xl bg-[#1c2120] text-white font-mont font-bold text-xs hover:bg-black transition-colors cursor-pointer shrink-0"
          >
            Hacer diagnóstico
          </button>
        </div>
      )}
    </div>
  );
};
