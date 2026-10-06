import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Clock, Sparkles, Send, Bell, ArrowRight } from 'lucide-react';

interface DigitalGuidesViewProps {
  onNavigateServices: () => void;
}

export const DigitalGuidesView: React.FC<DigitalGuidesViewProps> = ({
  onNavigateServices
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setIsSubscribed(true);
  };

  const guides = [
    {
      id: 'g1',
      title: 'Por dónde empezar a ordenar',
      tagline: 'El primer paso contra el agobio visual',
      description: 'Una hoja de ruta progresiva para atacar un espacio saturado sin tirar todo por los aires. Pasos de 20 minutos con foco y criterio.',
      topics: ['Despeje de superficies horizontales', 'Zonificación de transitoriedad', 'Checklist de primeros 3 días']
    },
    {
      id: 'g2',
      title: 'Guía práctica para el descarte',
      tagline: 'Soltar sin culpa y con método',
      description: 'Criterios objetivos para discernir qué conservar, qué donar y qué reciclar. Incluye cuestionario de descarte sin arrepentimiento.',
      topics: ['Las 4 preguntas filtro', 'Qué hacer con objetos sentimentales', 'Circuito de donación responsable']
    },
    {
      id: 'g3',
      title: 'Cómo organizar un placard',
      tagline: 'Aprovechamiento vertical y orden sostenible',
      description: 'Técnicas de doblado, alturas de barrales, uso de canastos y orden por frecuencias de uso para mantenerlo impecable todo el año.',
      topics: ['Cómputo de perchas y alturas', 'Dobles fondos y estantes altos', 'Sistemas para calzado y accesorios']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-mont font-bold text-[#1c2120]">
            <span className="w-2 h-2 rounded-full bg-[#fed767]"></span>
            <span>En breve · Productos digitales</span>
          </div>

          <h1 className="font-mont font-extrabold text-3xl sm:text-5xl text-[#1c2120] leading-tight">
            Guías prácticas descargables
          </h1>

          <p className="text-base sm:text-lg text-[#1c2120]/80 font-normal leading-relaxed">
            Organizá a tu ritmo, con ayuda real. ¿Querés empezar pero no sabés cómo? Estas guías digitales te acompañan paso a paso con instrucciones simples, ejercicios concretos y estructura para que organices sin agobio.
          </p>

          <p className="text-xs sm:text-sm text-[#1c2120]/70">
            Ideal para quienes prefieren hacerlo por su cuenta, pero con una hoja de ruta profesional que funcione de verdad.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mont font-semibold text-[#1c2120] pt-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#fed767]" />
              Formato: PDF descargable
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#fed767]" />
              Uso libre, sin vencimiento
            </span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-[#d9d1c5] shadow-lg bg-[#f2ece4] aspect-4/3 relative">
            <img
              src="/src/assets/images/digital_guides_flatlay_1790774133363.jpg"
              alt="Guías descargables de Método CASA"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#1c2120] text-white font-mont font-bold text-xs uppercase tracking-wider">
              En construcción
            </div>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-6">
        <h2 className="font-mont font-bold text-2xl text-[#1c2120] text-center">
          Guías del catálogo inicial:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((g, idx) => (
            <div
              key={g.id}
              className="p-6 rounded-3xl bg-white border border-[#d9d1c5] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-[#fed767] flex items-center justify-center font-mont font-bold text-xs text-[#1c2120]">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-mont font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1c2120]/70 border border-[#d9d1c5]/60">
                    PDF imprimible
                  </span>
                </div>

                <h3 className="font-mont font-bold text-lg text-[#1c2120] leading-snug">
                  {g.title}
                </h3>

                <p className="text-xs font-mont font-semibold text-[#1c2120]/60">
                  {g.tagline}
                </p>

                <p className="text-xs text-[#1c2120]/80 leading-relaxed font-normal">
                  {g.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d9d1c5]/50 space-y-2">
                <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/50">
                  Incluye:
                </span>
                <ul className="space-y-1">
                  {g.topics.map((t, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#1c2120]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#fed767] shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Early Access / Notify Me Box */}
      <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-[#d9d1c5] max-w-2xl mx-auto text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#fed767]/40 flex items-center justify-center mx-auto text-[#1c2120]">
          <Bell className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="font-mont font-bold text-2xl text-[#1c2120]">
            Avisarme cuando estén disponibles
          </h3>
          <p className="text-xs sm:text-sm text-[#1c2120]/70 max-w-md mx-auto">
            Dejanos tu contacto para recibir acceso anticipado y un 20% de descuento en el primer paquete de guías descargables.
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 rounded-xl bg-white border border-[#1c2120] text-[#1c2120] space-y-1">
            <p className="font-mont font-bold text-sm">¡Anotadx con éxito! 🎉</p>
            <p className="text-xs text-[#1c2120]/70">Te vamos a avisar apenas estén listas las guías para descargar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tu nombre"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d9d1c5] bg-white text-xs font-mont focus:outline-none focus:border-[#1c2120]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Email o WhatsApp (+54...)"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d9d1c5] bg-white text-xs font-mont focus:outline-none focus:border-[#1c2120]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1c2120] text-white font-mont font-bold text-xs hover:bg-black transition-colors cursor-pointer shrink-0"
              >
                Avisarme
              </button>
            </div>
          </form>
        )}

        <div className="pt-2">
          <button
            onClick={onNavigateServices}
            className="text-xs font-mont font-bold text-[#1c2120] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <span>¿Necesitás asesoramiento personalizado ahora? Ver servicios</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
          </button>
        </div>
      </div>
    </div>
  );
};
