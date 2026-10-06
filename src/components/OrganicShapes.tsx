import React from 'react';

// Círculo garabateado / trazo a mano alzada en color amarillo (#fed767), idéntico a la imagen de referencia
export const ScribbleCircle: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 text-[#fed767]' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 48,15 C 70,12 88,28 89,49 C 90,70 73,88 51,89 C 28,90 12,74 13,52 C 14,29 32,14 55,13 C 78,12 89,32 87,55 C 85,76 68,88 47,87 C 29,86 16,70 17,50 C 18,34 32,20 50,18" />
  </svg>
);

// Arco orgánico con remate asimétrico y curvo (figura izquierda de la referencia)
export const OrganicArchShape: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`relative rounded-t-[4rem] sm:rounded-t-[5.5rem] rounded-b-[2rem] sm:rounded-b-[2.8rem] bg-white border border-[#d9d1c5]/60 shadow-sm ${className}`}>
    {children}
  </div>
);

// Contenedor orgánico apaisado decontracturado (figura derecha de la referencia)
export const OrganicPillCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`relative rounded-[2.5rem_1.4rem_3rem_1.6rem] sm:rounded-[3.5rem_2rem_4rem_2.2rem] bg-white border border-[#d9d1c5]/70 shadow-xs ${className}`}>
    {children}
  </div>
);

// Burbuja orgánica tipo mensaje personal de Euge
export const EugeSpeechBubble: React.FC<{
  children: React.ReactNode;
  className?: string;
  avatarVariant?: 'smile' | 'thinking' | 'talking';
  authorSubtitle?: string;
}> = ({
  children,
  className = '',
  avatarVariant = 'smile',
  authorSubtitle = 'Lic. en Diseño de Interiores'
}) => (
  <div className={`relative p-4 sm:p-5 rounded-[2.2rem_1.2rem_2.4rem_1rem] bg-[#ffffff] border border-[#d9d1c5] shadow-xs flex items-start gap-3.5 ${className}`}>
    <div className="relative shrink-0">
      <img
        src={
          avatarVariant === 'thinking' 
            ? '/src/assets/images/euge_avatar_thinking_1790777118394.jpg'
            : avatarVariant === 'talking'
            ? '/src/assets/images/euge_avatar_talking_1790777128105.jpg'
            : '/src/assets/images/euge_avatar_smile_1790777108056.jpg'
        }
        alt="Euge Demarco"
        className="w-12 h-12 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-[#fed767]"
        referrerPolicy="no-referrer"
      />
      <span 
        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" 
        title="Euge online"
      />
    </div>

    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-mont font-bold text-xs text-[#1c2120]">Euge</span>
        <span className="text-[10px] text-[#1c2120]/60 font-mont">· {authorSubtitle}</span>
      </div>
      <div className="text-xs sm:text-sm text-[#1c2120]/90 leading-relaxed font-normal">
        {children}
      </div>
    </div>
  </div>
);
