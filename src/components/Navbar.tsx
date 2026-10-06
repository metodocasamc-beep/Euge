import React, { useState } from 'react';
import { User } from '../types';
import { LogOut, ShieldCheck, LogIn, Sparkles, Menu, X, UserCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'client' | 'admin') => void;
  onLogout: () => void;
  onOpenFaq: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenFaq,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';
  const isGuest = !currentUser || currentUser.id === 'guest' || !currentUser.email;

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#d9d1c5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Official Brand Logo & Wordmark */}
        <button
          onClick={() => handleNav('inicio')}
          className="hover:opacity-90 transition-opacity text-left cursor-pointer flex items-center gap-2"
        >
          <Logo variant="horizontal" size="md" />
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#1c2120]/80">
          <button
            onClick={() => handleNav('inicio')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'inicio' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            Inicio
            {currentView === 'inicio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('servicios')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'servicios' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            Servicios
            {currentView === 'servicios' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('diagnostico')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'diagnostico' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            ¿Cuál es tu caso?
            {currentView === 'diagnostico' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('sobre-mi')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'sobre-mi' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            Sobre Mí
            {currentView === 'sobre-mi' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('portfolio')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'portfolio' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            Portfolio
            {currentView === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('guias')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 ${
              currentView === 'guias' ? 'text-[#1c2120] font-bold' : ''
            }`}
          >
            Guías
            {currentView === 'guias' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#fed767] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNav('calculator')}
            className={`hover:text-[#1c2120] transition-colors cursor-pointer relative py-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#d9d1c5]/60 ${
              currentView === 'calculator' ? 'border-[#1c2120] text-[#1c2120]' : ''
            }`}
          >
            Calculadora
          </button>

          {/* ADMIN: Exclusivo para la administradora */}
          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`hover:text-[#1c2120] transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fed767]/40 border border-[#fed767] text-xs font-bold text-[#1c2120] ${
                currentView === 'admin' ? 'ring-2 ring-[#fed767]' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1c2120]" />
              <span>Panel Euge</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions & User State */}
        <div className="flex items-center gap-3">
          {/* Botón Mi Espacio / Usuario */}
          {!isGuest && currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d9d1c5] text-xs text-[#1c2120] transition-all cursor-pointer ${
                  currentView === 'dashboard' ? 'bg-[#fed767]/30 border-[#1c2120] font-bold' : 'bg-[#FAF8F5] hover:bg-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#fed767] flex items-center justify-center text-[10px] font-bold text-[#1c2120]">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="font-semibold max-w-[100px] truncate">{currentUser.name}</span>
                {isAdmin && (
                  <span className="text-[9px] bg-[#1c2120] text-[#fed767] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Admin</span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-[#1c2120]/50 hover:text-[#1c2120] hover:bg-[#d9d1c5]/30 rounded-lg transition-colors cursor-pointer"
                title="Cerrar sesión de este espacio"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('client')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#d9d1c5] bg-[#ffffff] hover:bg-[#FAF8F5] text-xs font-mont font-bold text-[#1c2120] transition-colors cursor-pointer shadow-xs"
            >
              <UserCircle2 className="w-3.5 h-3.5 text-[#1c2120]" />
              <span>Mi Espacio</span>
            </button>
          )}

          {/* Primary CTA: Reservar */}
          <button
            onClick={() => handleNav('booking')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-mont font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#fed458] shadow-xs hover:shadow rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reservar</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1c2120] hover:bg-[#f2ece4] rounded-xl transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#d9d1c5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-mont font-semibold text-[#1c2120]">
            <button
              onClick={() => handleNav('inicio')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'inicio' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNav('servicios')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'servicios' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Servicios
            </button>
            <button
              onClick={() => handleNav('diagnostico')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'diagnostico' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              ¿Cuál es tu caso?
            </button>
            <button
              onClick={() => handleNav('sobre-mi')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'sobre-mi' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Sobre Mí
            </button>
            <button
              onClick={() => handleNav('portfolio')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'portfolio' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Portfolio
            </button>
            <button
              onClick={() => handleNav('guias')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'guias' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Guías Digitales
            </button>
            <button
              onClick={() => handleNav('calculator')}
              className={`p-2.5 rounded-lg text-left ${currentView === 'calculator' ? 'bg-[#fed767]/30 font-bold' : 'hover:bg-[#FAF8F5]'}`}
            >
              Calculadora
            </button>
            <button
              onClick={() => handleNav('booking')}
              className="p-2.5 rounded-lg text-left bg-[#fed767] font-bold text-[#1c2120]"
            >
              Reservar Online
            </button>
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-[#d9d1c5]">
              <button
                onClick={() => handleNav('admin')}
                className="w-full p-2.5 rounded-lg bg-[#1c2120] text-white font-mont font-bold text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#fed767]" />
                <span>Panel Euge (Administración)</span>
              </button>
            </div>
          )}

          <div className="pt-2 flex justify-between items-center text-xs text-[#1c2120]/70">
            <button onClick={onOpenFaq} className="hover:underline">
              Preguntas Frecuentes
            </button>
            <span className="font-hand text-lg text-[#1c2120]">Método CASA</span>
          </div>
        </div>
      )}
    </header>
  );
};
