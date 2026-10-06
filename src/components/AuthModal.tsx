import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { X, Lock, ArrowRight, UserCircle2, Mail, Phone, Eye } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLoggedIn: (user: User) => void;
  initialMode?: 'client' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserLoggedIn,
  initialMode = 'client',
}) => {
  const [mode, setMode] = useState<'client' | 'admin'>(initialMode);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleClientAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!clientEmail.trim()) {
      setErrorMsg('Por favor ingresá tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      const users = await api.getUsers();
      let matched = users.find(u => u.email.toLowerCase() === clientEmail.trim().toLowerCase());
      
      if (!matched) {
        if (!clientName.trim()) {
          setErrorMsg('Es tu primera vez ingresando. Por favor completá tu nombre para crear tu espacio.');
          setIsLoading(false);
          return;
        }
        // Register new client
        matched = await api.registerUser(clientName.trim(), clientEmail.trim(), clientPhone.trim());
      }

      onUserLoggedIn(matched);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al ingresar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Euge admin access code (PIN or keyword)
    const pin = adminPin.trim().toLowerCase();
    if (pin === 'euge' || pin === '1234' || pin === 'metodocasa' || pin === 'admin') {
      const users = await api.getUsers();
      const admin = users.find(u => u.role === 'admin') || {
        id: 'user_admin',
        name: 'Euge (Método CASA)',
        email: 'admin@metodocasa.com',
        role: 'admin' as const
      };
      onUserLoggedIn(admin);
      onClose();
    } else {
      setErrorMsg('Código o contraseña incorrecta para el panel de administración.');
    }
  };

  const handleQuickSampleAccess = async () => {
    setIsLoading(true);
    try {
      const users = await api.getUsers();
      const sampleClient = users.find(u => u.id === 'user_martina') || {
        id: 'user_martina',
        name: 'Martina Gómez',
        email: 'martina@gmail.com',
        role: 'client' as const
      };
      onUserLoggedIn(sampleClient);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c2120]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl border border-[#d9d1c5] max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-[#FAF8F5] border-b border-[#d9d1c5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="badge" size="sm" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 tracking-wider">
                {mode === 'client' ? 'Portal Privado de Cliente' : 'Acceso Exclusivo Euge'}
              </span>
              <h3 className="text-xl font-bold font-heading text-[#1c2120]">
                {mode === 'client' ? 'Ingresá a tu Espacio' : 'Panel de Administración'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#1c2120]/50 hover:text-[#1c2120] hover:bg-[#d9d1c5]/30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {mode === 'client' ? (
            <form onSubmit={handleClientAccess} className="space-y-4">
              <p className="text-xs text-[#1c2120]/75 leading-relaxed">
                Ingresá tus datos para acceder a tu proyecto activo, ver tus entregables o continuar completando tu diagnóstico. Cada cliente accede a su espacio propio y confidencial.
              </p>

              {errorMsg && (
                <div className="p-3 bg-amber-50 border border-[#fed767] text-[#1c2120] rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1c2120] mb-1">
                  Tu Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#1c2120]/40 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="ejemplo@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2120] mb-1">
                  Tu Nombre Completo
                </label>
                <div className="relative">
                  <UserCircle2 className="w-4 h-4 text-[#1c2120]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="ej: Sofía Rossi"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                  />
                </div>
                <p className="text-[10px] text-[#1c2120]/50 mt-1">
                  (Si ya tenías un proyecto previo, podés ingresar solo con tu email).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1c2120] mb-1">
                  WhatsApp / Teléfono (opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#1c2120]/40 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Ingresando...' : 'Acceder a Mi Espacio'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleQuickSampleAccess}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#d9d1c5] hover:border-[#1c2120]/40 bg-[#FAF8F5] hover:bg-[#ece7df]/40 transition-colors flex items-center justify-center gap-2 text-xs text-[#1c2120] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1c2120]/60" />
                  <span className="font-semibold">Ver proyecto de muestra (Martina Gómez)</span>
                </button>
                <span className="block text-center text-[11px] text-[#1c2120]/50 mt-1">
                  Mirá cómo luce un proyecto real con láminas, planos y devoluciones.
                </span>
              </div>

              <div className="pt-4 border-t border-[#d9d1c5] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('admin');
                    setErrorMsg(null);
                  }}
                  className="text-[11px] text-[#1c2120]/50 hover:text-[#1c2120] transition-colors cursor-pointer"
                >
                  ¿Sos Euge? Ingresar al panel administrativo
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminAccess} className="space-y-4">
              <p className="text-xs text-[#1c2120]/75 leading-relaxed">
                Ingresá la clave de acceso de Método CASA para gestionar proyectos, actualizar estados y subir láminas y videos.
              </p>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1c2120] mb-1">
                  Clave de Acceso Euge
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1c2120]/40 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Clave (ej: euge, 1234 o metodocasa)"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                  />
                </div>
                <p className="text-[10px] text-[#1c2120]/50 mt-1">
                  Clave de demostración rápida: <span className="font-mono font-semibold">1234</span> o <span className="font-mono font-semibold">euge</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
              >
                <span>Ingresar como Euge</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-[#d9d1c5] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('client');
                    setErrorMsg(null);
                  }}
                  className="text-[11px] text-[#1c2120]/50 hover:text-[#1c2120] transition-colors cursor-pointer"
                >
                  ← Volver al acceso para clientes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
