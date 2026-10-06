import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Check, Layers, Clock, DollarSign, 
  UserCheck, ShieldCheck, CheckCircle2, XCircle, FileText, 
  Video, Eye, Layout, Coffee, Compass, ChevronRight 
} from 'lucide-react';
import { Logo } from './Logo';
import { ServiceType } from '../types';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenBooking: (serviceKey?: ServiceType) => void;
  onOpenCalculator: () => void;
  onOpenAuth: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenCalculator,
  onOpenAuth
}) => {
  const [differentialTab, setDifferentialTab] = useState<'pilares' | 'comparativa' | 'pasos'>('pilares');

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-semibold tracking-wide text-[#1c2120]">
                <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
                <span>Diseño Interior · Organización · Funcionalidad</span>
              </div>

              {/* Title & Tagline */}
              <h1 className="font-mont font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1c2120] tracking-tight leading-[1.1]">
                Diseño espacios que se adaptan a tu forma de <span className="underline decoration-[#fed767] decoration-wavy decoration-2">vivirlos</span>.
              </h1>

              {/* Subtitle / Proposition */}
              <p className="text-lg sm:text-xl text-[#1c2120]/80 leading-relaxed font-normal max-w-2xl">
                Cada proyecto nace de entender cómo vivís o trabajás, para crear espacios realmente funcionales, organizados y con identidad propia. En una plataforma digital ágil, clara y centralizada.
              </p>

              {/* Note from Euge with circular avatar + decontracted organic background */}
              <div className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-white border border-[#d9d1c5] rounded-[2.2rem_1.2rem_2.5rem_1.4rem] max-w-xl shadow-xs relative">
                <div className="relative shrink-0">
                  <img
                    src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
                    alt="Euge Demarco"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-[#fed767]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Euge" />
                </div>
                <div>
                  <p className="font-hand text-xl sm:text-2xl text-[#1c2120] leading-tight">
                    “La estética aparece, claro. Pero como consecuencia.”
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('servicios')}
                  className="px-6 py-3.5 rounded-xl bg-[#1c2120] text-white font-mont font-semibold text-sm hover:bg-black transition-colors shadow-sm flex items-center gap-2 group cursor-pointer"
                >
                  <span>Conocé mis servicios ONLINE</span>
                  <ArrowRight className="w-4 h-4 text-[#fed767] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('diagnostico')}
                  className="px-6 py-3.5 rounded-xl bg-white border border-[#d9d1c5] text-[#1c2120] font-mont font-semibold text-sm hover:bg-[#f2ece4] transition-colors cursor-pointer"
                >
                  ¿Con cuál te identificás?
                </button>

                <button
                  onClick={onOpenCalculator}
                  className="px-5 py-3.5 rounded-xl bg-[#fed767]/30 hover:bg-[#fed767]/50 text-[#1c2120] font-mont font-semibold text-sm transition-colors cursor-pointer"
                >
                  Calcular presupuesto
                </button>
              </div>

              {/* Quick Trust Points */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#1c2120]/70 pt-2">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>Sin moverte de tu casa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>Plataforma privada con visor 3D video</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>Hasta 3 cuotas con Mercado Pago</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Image with Organic Arch & Scribble Accent */}
            <div className="lg:col-span-5 relative">
              {/* Decorative Hand-drawn Scribble Circle */}
              <div className="absolute -top-7 -right-5 z-20 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" className="w-20 h-20 text-[#fed767]" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M 48,15 C 70,12 88,28 89,49 C 90,70 73,88 51,89 C 28,90 12,74 13,52 C 14,29 32,14 55,13 C 78,12 89,32 87,55 C 85,76 68,88 47,87 C 29,86 16,70 17,50 C 18,34 32,20 50,18" />
                </svg>
              </div>

              <div className="relative rounded-t-[4.5rem] rounded-b-[2rem] overflow-hidden shadow-xl border-2 border-[#d9d1c5] bg-[#f2ece4]">
                <img
                  src="/src/assets/images/portfolio_renovation_living_1790774122491.jpg"
                  alt="Espacio interior diseñado por Método CASA"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2120]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-block px-2.5 py-1 rounded bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs uppercase tracking-wider mb-2">
                    Proyecto Real
                  </div>
                  <h3 className="font-mont font-bold text-lg leading-tight">
                    Living & Espacio de Guardado a Medida
                  </h3>
                  <p className="text-xs text-white/80 font-normal">
                    Propuesta integral 3D + Documentación técnica
                  </p>
                </div>
              </div>

              {/* Floating Quote Stamp with Euge Thinking Avatar */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3.5 sm:p-4 rounded-[2rem_1rem_2.2rem_1.4rem] shadow-lg border border-[#d9d1c5] max-w-xs hidden sm:flex items-center gap-3">
                <img
                  src="/src/assets/images/euge_avatar_thinking_1790777118394.jpg"
                  alt="Euge"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <p className="font-hand text-lg text-[#1c2120] leading-snug">
                  “Espacios pensados para quienes los habitan, no para una foto de revista.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DESTACADA: EL MÉTODO DIFERENCIAL (TODO TU PROYECTO EN UN SOLO LUGAR) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-[#1c2120] shadow-md space-y-8 relative overflow-hidden">
          {/* Accent Ribbon */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#fed767]/20 rounded-bl-full pointer-events-none -mr-10 -mt-10"></div>

          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mi gran diferencial</span>
            </div>

            <h2 className="font-mont font-extrabold text-2xl sm:text-4xl text-[#1c2120] leading-tight">
              Mi método: Todo tu proyecto en un solo lugar.
            </h2>

            <p className="text-sm sm:text-base text-[#1c2120]/80 leading-relaxed font-normal">
              Busco practicidad y funcionalidad en los espacios <strong>y también en el proceso</strong>. Diseñar tu casa online no tiene por qué ser caótico, demorado ni costoso: creé esta plataforma para que sea ordenado, claro, completo, confiable y seguro de principio a fin.
            </p>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f2ece4] rounded-2xl max-w-md border border-[#d9d1c5]">
            <button
              onClick={() => setDifferentialTab('pilares')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mont font-bold transition-all cursor-pointer ${
                differentialTab === 'pilares'
                  ? 'bg-[#1c2120] text-white shadow-xs'
                  : 'text-[#1c2120]/70 hover:text-[#1c2120]'
              }`}
            >
              Los 4 Pilares
            </button>

            <button
              onClick={() => setDifferentialTab('comparativa')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mont font-bold transition-all cursor-pointer ${
                differentialTab === 'comparativa'
                  ? 'bg-[#1c2120] text-white shadow-xs'
                  : 'text-[#1c2120]/70 hover:text-[#1c2120]'
              }`}
            >
              Tabla Comparativa
            </button>

            <button
              onClick={() => setDifferentialTab('pasos')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mont font-bold transition-all cursor-pointer ${
                differentialTab === 'pasos'
                  ? 'bg-[#1c2120] text-white shadow-xs'
                  : 'text-[#1c2120]/70 hover:text-[#1c2120]'
              }`}
            >
              Proceso en 4 Pasos
            </button>
          </div>

          {/* TAB 1: LOS 4 PILARES */}
          {differentialTab === 'pilares' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Pilar 1: Tiempo */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-3 flex flex-col justify-between hover:border-[#1c2120] transition-colors">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
                    <Clock className="w-5 h-5 text-[#1c2120]" />
                  </div>
                  <h3 className="font-mont font-bold text-base text-[#1c2120]">
                    1. Ahorro de Tiempo
                  </h3>
                  <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                    Reservás online en un minuto y recibís tu entrega personalizada en plazos exactos.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#d9d1c5]/60 text-[11px] font-mont font-semibold text-[#1c2120]/70">
                  ⚡ Agilidad 100% online
                </div>
              </div>

              {/* Pilar 2: Dinero */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-3 flex flex-col justify-between hover:border-[#1c2120] transition-colors">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
                    <DollarSign className="w-5 h-5 text-[#1c2120]" />
                  </div>
                  <h3 className="font-mont font-bold text-base text-[#1c2120]">
                    2. Precios a la Vista
                  </h3>
                  <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                    Ya tenés un presupuesto estimado, cercano, para saber cuánto puede costarte antes de ponerte en contacto conmigo. Calculás m² online sin sorpresas ni presupuestos inflados, con opción de hasta 3 cuotas con Mercado Pago.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#d9d1c5]/60 text-[11px] font-mont font-semibold text-[#1c2120]/70">
                  💳 Transparencia económica
                </div>
              </div>

              {/* Pilar 3: Centralización */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-3 flex flex-col justify-between hover:border-[#1c2120] transition-colors">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
                    <Layers className="w-5 h-5 text-[#1c2120]" />
                  </div>
                  <h3 className="font-mont font-bold text-base text-[#1c2120]">
                    3. Todo Centralizado
                  </h3>
                  <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                    Olvidate de PDFs perdidos en correos o fotos desordenadas en WhatsApp. Tu espacio privado reúne láminas interactivas, video explicativo y roadmap de tu servicio contratado.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#d9d1c5]/60 text-[11px] font-mont font-semibold text-[#1c2120]/70">
                  📂 Acceso 24/7 en "Mi Espacio"
                </div>
              </div>

              {/* Pilar 4: Personalización (en primera persona) */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-3 flex flex-col justify-between hover:border-[#1c2120] transition-colors">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
                    <UserCheck className="w-5 h-5 text-[#1c2120]" />
                  </div>
                  <h3 className="font-mont font-bold text-base text-[#1c2120]">
                    4. Trato Mano a Mano
                  </h3>
                  <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                    No trabajo con plantillas automáticas ni renders genéricos. Es mi mirada profesional pensando cada centímetro para tu rutina real: te escucho, analizo tu espacio y diseño a medida de lo que necesitás.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#d9d1c5]/60 text-[11px] font-mont font-semibold text-[#1c2120]/70">
                  📐 Lic. en Diseño (U. Morón 2013)
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TABLA COMPARATIVA */}
          {differentialTab === 'comparativa' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#d9d1c5]">
                    <th className="py-3 px-4 font-mont font-bold text-[#1c2120] uppercase text-[11px] w-1/3">
                      Aspecto del Proceso
                    </th>
                    <th className="py-3 px-4 font-mont font-bold text-[#1c2120]/60 uppercase text-[11px] w-1/3 bg-[#f2ece4]/40">
                      Interiorismo Tradicional
                    </th>
                    <th className="py-3 px-4 font-mont font-bold text-[#1c2120] uppercase text-[11px] w-1/3 bg-[#fed767]/20 border-l-2 border-[#1c2120]">
                      Con Método CASA (Plataforma)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9d1c5]/60 font-normal">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#1c2120]">
                      Presupuestos y Precios
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120]/70 bg-[#f2ece4]/20 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Precios ocultos, demoras de semanas para cotizar y costos sorpresa en obra.</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120] font-medium bg-[#fed767]/10 border-l-2 border-[#1c2120]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Precios públicos desde $110.000, calculadora instantánea y hasta 3 cuotas.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#1c2120]">
                      Tiempos y Plazos
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120]/70 bg-[#f2ece4]/20 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Plazos difusos que se dilatan meses; reuniones presenciales difíciles de coordinar.</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120] font-medium bg-[#fed767]/10 border-l-2 border-[#1c2120]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Agendás en 72hs y recibís tu entrega en 5 a 10 días hábiles garantizados.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#1c2120]">
                      Organización de Información
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120]/70 bg-[#f2ece4]/20 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Archivos pesados por Wetransfer que vencen, audios eternos y fotos perdidas.</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120] font-medium bg-[#fed767]/10 border-l-2 border-[#1c2120]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Portal privado "Mi Espacio" con visor de láminas, videos y roadmap ordenado.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#1c2120]">
                      Certeza antes de Comprar
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120]/70 bg-[#f2ece4]/20 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Explicaciones en el aire o croquis en servilletas difíciles de dimensionar.</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120] font-medium bg-[#fed767]/10 border-l-2 border-[#1c2120]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Renders 3D fotorrealistas con video explicativo donde te guío paso a paso.</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-[#1c2120]">
                      Ejecución con Gremios
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120]/70 bg-[#f2ece4]/20 flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Carpinteros y electricistas improvisan en obra generando errores caros.</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2120] font-medium bg-[#fed767]/10 border-l-2 border-[#1c2120]">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Carpeta Técnica milimétrica: planos acotados, tomas de luz y lista de compras.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: PROCESO EN 4 PASOS */}
          {differentialTab === 'pasos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Cotizás o elegís servicio',
                  desc: 'Usás la calculadora o elegís tu asesoría. Sabés el costo exacto antes de empezar.'
                },
                {
                  step: '02',
                  title: 'Reservás con fecha y hora',
                  desc: 'Elegís el día en el calendario online y abonás por transferencia o cuotas con Mercado Pago.'
                },
                {
                  step: '03',
                  title: 'Diagnóstico guiado',
                  desc: 'Completás un formulario intuitivo con fotos y medidas de tu espacio sin moverte de tu casa.'
                },
                {
                  step: '04',
                  title: 'Tu propuesta en 3D',
                  desc: 'Ingresás a Mi Espacio para ver las láminas interactivas, el video explicativo y coordinar ajustes.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] relative space-y-2">
                  <span className="font-mont font-extrabold text-2xl text-[#fed767]">
                    {item.step}
                  </span>
                  <h4 className="font-mont font-bold text-sm text-[#1c2120]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#1c2120]/75 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Call to Action of Differential Section */}
          <div className="pt-4 border-t border-[#d9d1c5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/src/assets/images/euge_avatar_talking_1790777128105.jpg"
                  alt="Euge Demarco"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <p className="font-hand text-xl text-[#1c2120]">
                “Diseño cercano, intuitivo y sin vueltas: todo pensado para resolver.” — Euge
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCalculator}
                className="px-5 py-2.5 rounded-xl bg-[#1c2120] text-white font-mont font-bold text-xs hover:bg-black transition-colors cursor-pointer"
              >
                Probar calculadora inmediata
              </button>
              <button
                onClick={() => onNavigate('portfolio')}
                className="px-4 py-2.5 rounded-xl bg-[#f2ece4] text-[#1c2120] font-mont font-semibold text-xs hover:bg-[#d9d1c5] transition-colors cursor-pointer"
              >
                Ver proyectos reales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filosofía & Manifiesto */}
      <section className="bg-white border-y border-[#d9d1c5] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <span className="text-xs font-mont font-bold tracking-widest uppercase text-[#1c2120]/60">
            A eso me dedico
          </span>

          <h2 className="font-mont font-bold text-3xl sm:text-4xl text-[#1c2120] leading-snug">
            Muchas veces sentimos que un ambiente no termina de funcionar.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-2">
            {[
              { label: 'Falta lugar', desc: 'Objetos acumulados sin destino fijo' },
              { label: 'Cuesta ordenar', desc: 'Falta de sistemas pensados para tu rutina' },
              { label: 'Sobre la marcha', desc: 'Decisiones aisladas que desarticulan' },
              { label: 'No te representa', desc: 'El espacio quedó atrás de tu momento actual' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5]/70 space-y-1">
                <span className="w-6 h-6 rounded-full bg-[#fed767] flex items-center justify-center font-mont font-bold text-xs text-[#1c2120] mb-2">
                  {idx + 1}
                </span>
                <p className="font-mont font-semibold text-sm text-[#1c2120]">{item.label}</p>
                <p className="text-xs text-[#1c2120]/70">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Organic Curved Box from Reference Image */}
          <div className="p-6 sm:p-7 rounded-[3rem_1.5rem_3.2rem_1.8rem] bg-[#FAF8F5] text-[#1c2120] max-w-2xl mx-auto border-2 border-[#d9d1c5] shadow-xs space-y-2 relative">
            <div className="flex items-center justify-center gap-2.5">
              <img
                src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
                alt="Euge"
                className="w-8 h-8 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
                referrerPolicy="no-referrer"
              />
              <p className="font-mont font-bold text-base sm:text-lg">
                Pero no siempre hace falta empezar de cero.
              </p>
            </div>
            <p className="font-normal text-sm sm:text-base text-[#1c2120]/80">
              A veces alcanza con mirar el espacio desde otro lugar y diseñarlo pensando en cómo realmente se vive.
            </p>
          </div>
        </div>
      </section>

      {/* Qué entendemos antes de diseñar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mont font-bold tracking-widest uppercase text-[#1c2120]/60">
              El punto de partida
            </span>
            <h2 className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120] leading-tight">
              Un proyecto siempre se empieza entendiendo:
            </h2>
            <p className="text-sm text-[#1c2120]/70">
              No empezamos preguntándonos qué tendencia está de moda. Empiezo escuchando cómo usás cada metro cuadrado.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { title: 'Cómo vivís', note: 'Tus tiempos, tu dinámica familiar o personal' },
              { title: 'Cómo trabajás', note: 'Home office, estudio o tareas cotidianas' },
              { title: 'Qué necesitás guardar', note: 'Soluciones reales de guardado sin agobio' },
              { title: 'Qué actividades realizás', note: 'Zonificación que no interfiera' },
              { title: 'Qué cosas disfrutás', note: 'Iluminación cálida, lectura, relax' },
              { title: 'Qué cosas te incomodan', note: 'Obstáculos, enchufes lejos, rincones ciegos' }
            ].map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-[#d9d1c5] shadow-xs hover:border-[#1c2120] transition-colors">
                <div className="w-5 h-5 rounded-full bg-[#fed767] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1c2120]" />
                </div>
                <div>
                  <h4 className="font-mont font-bold text-sm text-[#1c2120]">{p.title}</h4>
                  <p className="text-xs text-[#1c2120]/70 mt-0.5">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Overview Preview */}
      <section className="bg-[#f2ece4]/60 py-16 border-y border-[#d9d1c5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mont font-bold tracking-widest uppercase text-[#1c2120]/60">
                Modalidad: Online
              </span>
              <h2 className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120] mt-1">
                Mis Servicios
              </h2>
            </div>
            <button
              onClick={() => onNavigate('servicios')}
              className="text-sm font-mont font-bold text-[#1c2120] hover:underline flex items-center gap-1 group cursor-pointer"
            >
              <span>Ver todos los detalles y qué incluye</span>
              <ArrowRight className="w-4 h-4 text-[#fed767] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Asesoría */}
            <div className="bg-white rounded-2xl p-6 border border-[#d9d1c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
                  01 · Asesoría
                </span>
                <h3 className="font-mont font-bold text-xl text-[#1c2120]">
                  Reunión Virtual 60'
                </h3>
                <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                  Para resolver dudas puntuales, ordenar ideas y encontrar la mejor solución para tu espacio antes de encarar cambios.
                </p>
              </div>
              <div className="pt-6 border-t border-[#d9d1c5]/60 mt-6 space-y-3">
                <div>
                  <span className="text-xs text-[#1c2120]/60">Tarifa fija</span>
                  <p className="font-mont font-extrabold text-2xl text-[#1c2120]">$110.000 <span className="text-xs font-normal">ARS</span></p>
                </div>
                <button
                  onClick={() => onOpenBooking('asesoria')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1c2120] text-white font-mont font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
                >
                  Reservar Asesoría
                </button>
              </div>
            </div>

            {/* 2. Diseño Integral */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#1c2120] shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#fed767] text-[#1c2120] font-mont font-bold text-[10px] rounded-full uppercase tracking-wider">
                Servicio Estrella ⭐
              </div>
              <div className="space-y-3">
                <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
                  02 · Diseño Integral
                </span>
                <h3 className="font-mont font-bold text-xl text-[#1c2120]">
                  Anteproyecto 3D
                </h3>
                <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                  Desarrollo de propuesta completa en imágenes 3D fotorrealistas con video explicativo para visualizar cada ambiente antes de ejecutar.
                </p>
              </div>
              <div className="pt-6 border-t border-[#d9d1c5]/60 mt-6 space-y-3">
                <div>
                  <span className="text-xs text-[#1c2120]/60">Desde</span>
                  <p className="font-mont font-extrabold text-2xl text-[#1c2120]">$290.000 <span className="text-xs font-normal">ARS</span></p>
                </div>
                <button
                  onClick={() => onOpenBooking('diseno_integral')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs hover:bg-[#fed458] transition-colors cursor-pointer"
                >
                  Solicitar Diseño 3D
                </button>
              </div>
            </div>

            {/* 3. Carpeta Técnica */}
            <div className="bg-white rounded-2xl p-6 border border-[#d9d1c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
                    03 · Documentación
                  </span>
                  <span className="text-[10px] font-mont font-bold px-2 py-0.5 rounded bg-[#f2ece4] text-[#1c2120]">
                    Upgrade
                  </span>
                </div>
                <h3 className="font-mont font-bold text-xl text-[#1c2120]">
                  Carpeta Técnica
                </h3>
                <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                  Toda la documentación ejecutiva: planos, instalaciones, cotizaciones estimadas y especificaciones para contratistas.
                </p>
              </div>
              <div className="pt-6 border-t border-[#d9d1c5]/60 mt-6 space-y-3">
                <div>
                  <span className="text-xs text-[#1c2120]/60">Desde</span>
                  <p className="font-mont font-extrabold text-2xl text-[#1c2120]">$275.000 <span className="text-xs font-normal">ARS</span></p>
                </div>
                <button
                  onClick={() => onOpenBooking('carpeta_tecnica')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1c2120] text-white font-mont font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
                >
                  Contratar Proyecto
                </button>
              </div>
            </div>

            {/* 4. Muebles a Medida */}
            <div className="bg-white rounded-2xl p-6 border border-[#d9d1c5] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
                  04 · Soluciones
                </span>
                <h3 className="font-mont font-bold text-xl text-[#1c2120]">
                  Muebles a Medida
                </h3>
                <p className="text-xs text-[#1c2120]/80 leading-relaxed">
                  Diseño milimétrico de placards, vanitorys, cocinas o escritorios con planos listos para mandar a fabricar.
                </p>
              </div>
              <div className="pt-6 border-t border-[#d9d1c5]/60 mt-6 space-y-3">
                <div>
                  <span className="text-xs text-[#1c2120]/60">Desde</span>
                  <p className="font-mont font-extrabold text-2xl text-[#1c2120]">$110.000 <span className="text-xs font-normal">ARS</span></p>
                </div>
                <button
                  onClick={() => onOpenBooking('muebles_medida')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1c2120] text-white font-mont font-semibold text-xs hover:bg-black transition-colors cursor-pointer"
                >
                  Diseñar Mueble
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Call to Action - Diagnóstico */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1c2120] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs uppercase tracking-wider">
              Diagnóstico guiado
            </span>
            <h3 className="font-mont font-extrabold text-3xl sm:text-4xl leading-tight">
              ¿No sabés por cuál servicio empezar?
            </h3>
            <p className="text-white/80 text-base font-normal">
              Contestá 4 situaciones cotidianas para que el sistema te recomiende exactamente la opción más eficiente para tu espacio.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('diagnostico')}
                className="px-6 py-3 rounded-xl bg-[#fed767] text-[#1c2120] font-mont font-bold text-sm hover:bg-[#fed458] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Hacer diagnóstico interactivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
            <Logo variant="badge" size="xl" />
          </div>
        </div>
      </section>

      {/* Sobre Euge Teaser with Organic Contour & Avatar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-[3.2rem_1.8rem_3.5rem_2rem] bg-white border border-[#d9d1c5] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xs">
          <div className="md:col-span-4 relative">
            <div className="rounded-t-[4.5rem] rounded-b-[2rem] overflow-hidden aspect-4/3 border-2 border-[#d9d1c5] bg-[#f2ece4] shadow-sm">
              <img
                src="/src/assets/images/euge_about_portrait_1790777141696.jpg"
                alt="Eugenia Demarco - Licenciada en Diseño de Interiores"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-white px-3 py-1.5 rounded-full border border-[#d9d1c5] shadow-xs flex items-center gap-1.5 text-[11px] font-mont font-bold text-[#1c2120]">
              <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
              <span>Euge Demarco</span>
            </div>
          </div>
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-mont font-bold tracking-widest uppercase text-[#1c2120]/60">
              Sobre mí
            </span>
            <h3 className="font-mont font-extrabold text-2xl sm:text-3xl text-[#1c2120]">
              Hola, soy Euge Demarco.
            </h3>
            <p className="text-sm sm:text-base text-[#1c2120]/80 leading-relaxed font-normal">
              Tengo 35 años y una fascinación bastante clara: pensar espacios. Me atraen especialmente esos lugares donde parece que "no entra nada" o "no hay mucho para hacer". Porque con decisiones inteligentes, un espacio cambia por completo... y también cambia la experiencia de quienes lo viven.
            </p>
            <div className="flex items-center gap-3 p-3.5 bg-[#FAF8F5] rounded-[2rem_1rem_2.2rem_1.2rem] border border-[#d9d1c5]/80">
              <img
                src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
                alt="Euge"
                className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shrink-0"
                referrerPolicy="no-referrer"
              />
              <p className="font-hand text-xl text-[#1c2120]">
                “Para mí, el diseño de interiores no debería ser un lujo reservado para unos pocos.”
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('sobre-mi')}
                className="text-xs font-mont font-bold text-[#1c2120] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <span>Conocé mi recorrido y visión completa</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
