import React from 'react';

export interface EugeAvatarProps {
  variant?: 'smile' | 'thinking' | 'talking';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export const EugeAvatar: React.FC<EugeAvatarProps> = ({
  variant = 'smile',
  size = 'md',
  showBadge = true,
  className = ''
}) => {
  const images = {
    smile: '/src/assets/images/euge_avatar_smile_1790777108056.jpg',
    thinking: '/src/assets/images/euge_avatar_thinking_1790777118394.jpg',
    talking: '/src/assets/images/euge_avatar_talking_1790777128105.jpg'
  };

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const badgeSizes = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 bottom-0 right-0',
    md: 'w-3 h-3 bottom-0 right-0',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
    xl: 'w-4 h-4 bottom-1 right-1'
  };

  return (
    <div className={`relative inline-block shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src={images[variant]}
        alt="Euge Demarco"
        className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-[#fed767]/70"
        referrerPolicy="no-referrer"
      />
      {showBadge && (
        <span 
          className={`absolute rounded-full bg-emerald-500 ring-2 ring-white ${badgeSizes[size]}`} 
          title="Euge online"
        />
      )}
    </div>
  );
};
