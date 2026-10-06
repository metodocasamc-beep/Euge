import React from 'react';
import { ArrowRight, Mail, Instagram, Phone, MapPin, Award, Heart, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ScribbleCircle } from './OrganicShapes';

interface AboutViewProps {
  onNavigateServices: () => void;
  onOpenBooking: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateServices,
  onOpenBooking
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Top Hero Bio with Organic Arch Frame and Decorative Scribble Accent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative">
          {/* Decorative Scribble Circle */}
          <div className="absolute -top-7 -right-6 z-20 pointer-events-none">
            <ScribbleCircle className="w-20 h-20 text-[#fed767]" />
          </div>

          <div className="relative">
            <div className="rounded-t-[5.5rem] rounded-b-[2.5rem] overflow-hidden border-2 border-[#d9d1c5] shadow-lg bg-[#f2ece4] aspect-4/5">
              <img
                src="/src/assets/images/euge_about_portrait_1790777141696.jpg"
                alt="Euge Demarco — Lic. en Diseño de Interiores"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Stamp Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl border border-[#d9d1c5] shadow-md flex items-center gap-2.5">
              <Logo variant="icon" size="sm" />
              <div>
                <p className="font-mont font-bold text-xs text-[#1c2120]">Euge Demarco</p>
                <p className="text-[10px] text-[#1c2120]/60">Lic. en Diseño de Interiores</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2ece4] border border-[#d9d1c5] text-xs font-mont font-bold text-[#1c2120]">
            <Award className="w-3.5 h-3.5 text-[#fed767]" />
            <span>Sobre mí & Método CASA</span>
          </div>

          <h1 className="font-mont font-extrabold text-3xl sm:text-5xl text-[#1c2120] tracking-tight leading-tight">
            Hola, soy Euge.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-[#1c2120]/80 leading-relaxed font-normal">
            <p>
              Tengo 35 años y una fascinación bastante clara: <strong>pensar espacios</strong>.
            </p>
            <p>
              Me atraen especialmente esos lugares donde parece que <em>"no entra nada"</em> o <em>"no hay mucho para hacer"</em>.
            </p>
            <p>
              Porque muchas veces, con decisiones inteligentes, un espacio cambia por completo... y también cambia la experiencia de quienes lo viven.
            </p>
          </div>

          {/* Note from Euge with circular avatar + decontracted organic background */}
          <div className="flex items-center gap-3.5 p-4 bg-white border border-[#d9d1c5] rounded-[2.2rem_1.2rem_2.5rem_1.4rem] shadow-xs">
            <img
              src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
              alt="Euge"
              className="w-12 h-12 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-hand text-2xl text-[#1c2120] leading-snug">
                “Creo que el diseño de interiores no debería ser un lujo reservado para unos pocos.”
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onNavigateServices}
              className="px-6 py-3 rounded-xl bg-[#1c2120] text-white font-mont font-semibold text-xs hover:bg-black transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Ver modalidades de trabajo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-3 rounded-xl bg-[#fed767] text-[#1c2120] font-mont font-bold text-xs hover:bg-[#fed458] transition-colors cursor-pointer"
            >
              Reservar reunión online
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillars with Organic Asymmetrical Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mi Visión */}
        <div className="p-6 sm:p-7 rounded-[2.8rem_1.4rem_3rem_1.8rem] bg-white border border-[#d9d1c5] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
              Filosofía
            </span>
            <h3 className="font-mont font-bold text-xl text-[#1c2120]">
              Mi visión
            </h3>
            <p className="text-xs sm:text-sm text-[#1c2120]/80 leading-relaxed font-normal">
              Creo en un <strong>diseño cercano</strong>. El diseño de interiores es una herramienta para vivir y trabajar mejor... en espacios que realmente acompañen a las personas en su rutina diaria sin rigideces.
            </p>
          </div>
          <div className="pt-4 border-t border-[#d9d1c5]/50">
            <p className="font-hand text-lg text-[#1c2120]">
              Cercano, funcional y real.
            </p>
          </div>
        </div>

        {/* Mi Recorrido */}
        <div className="p-6 sm:p-7 rounded-[2.8rem_1.4rem_3rem_1.8rem] bg-white border border-[#d9d1c5] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
              Formación & Experiencia
            </span>
            <h3 className="font-mont font-bold text-xl text-[#1c2120]">
              Mi recorrido
            </h3>
            <p className="text-xs sm:text-sm text-[#1c2120]/80 leading-relaxed font-normal">
              Soy <strong>Licenciada en Diseño de Interiores</strong> (Universidad de Morón, 2013). Trabajé en proyectos muy diversos: mobiliario de autor, diseño textil, locales comerciales, estudios musicales y viviendas particulares.
            </p>
          </div>
          <div className="pt-4 border-t border-[#d9d1c5]/50">
            <p className="text-[11px] font-mont font-bold text-[#1c2120]/70">
              Universidad de Morón · 2013 — Presente
            </p>
          </div>
        </div>

        {/* Mi Forma de Diseñar */}
        <div className="p-6 sm:p-7 rounded-[2.8rem_1.4rem_3rem_1.8rem] bg-white border border-[#d9d1c5] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fed767]/30 flex items-center justify-center text-[#1c2120]">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-mont font-bold text-[#1c2120]/50 uppercase tracking-wider">
              Método
            </span>
            <h3 className="font-mont font-bold text-xl text-[#1c2120]">
              Mi forma de diseñar
            </h3>
            <p className="text-xs sm:text-sm text-[#1c2120]/80 leading-relaxed font-normal">
              No empiezo preguntándome qué estilo tiene un espacio. <strong>Empiezo entendiendo cómo se vive</strong>. Después llegan la distribución, la iluminación, los materiales, el mobiliario y cada decisión técnica.
            </p>
          </div>
          <div className="pt-4 border-t border-[#d9d1c5]/50">
            <p className="font-hand text-lg text-[#1c2120]">
              Natural de habitar.
            </p>
          </div>
        </div>
      </div>

      {/* Frase Cierre de Marca con Avatar y Contenedor Orgánico */}
      <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[3.5rem_2rem_3.8rem_2.2rem] border-2 border-[#d9d1c5] text-center space-y-6 relative overflow-hidden">
        <p className="font-mont font-semibold text-lg sm:text-xl text-[#1c2120] max-w-2xl mx-auto leading-relaxed">
          “Cada proyecto representa una búsqueda distinta, pero todos parten del mismo lugar: diseñar espacios con intención. Y es ahí donde terminan siendo eso que tanto buscamos: únicos, con identidad propia y pensados para quienes los habitan.”
        </p>

        <div className="flex items-center justify-center gap-3">
          <img
            src="/src/assets/images/euge_avatar_talking_1790777128105.jpg"
            alt="Euge"
            className="w-12 h-12 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
            referrerPolicy="no-referrer"
          />
          <p className="font-hand text-3xl text-[#1c2120]">
            Escribime y lo hacemos realidad ;)
          </p>
        </div>

        {/* Contact links */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mont font-semibold text-[#1c2120]">
          <a
            href="https://instagram.com/metodo.casa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-black hover:underline"
          >
            <Instagram className="w-4 h-4 text-[#1c2120]" />
            <span>@metodo.casa</span>
          </a>

          <a
            href="mailto:metodocasa.mc@gmail.com"
            className="flex items-center gap-1.5 hover:text-black hover:underline"
          >
            <Mail className="w-4 h-4 text-[#1c2120]" />
            <span>metodocasa.mc@gmail.com</span>
          </a>

          <a
            href="https://wa.me/5491123910626"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-black hover:underline"
          >
            <Phone className="w-4 h-4 text-[#1c2120]" />
            <span>+54 9 11 2391 0626</span>
          </a>

          <div className="flex items-center gap-1.5 text-[#1c2120]/70">
            <MapPin className="w-4 h-4" />
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>
      </div>
    </div>
  );
};
