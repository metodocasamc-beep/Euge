import React, { useState } from 'react';
import { Project, User, StudioSettings } from '../types';
import { formatARS, formatFriendlyDate, getRemainingTimeString } from '../utils/dateUtils';
import { Sparkles, Calendar, Clock, ArrowRight, FileText, CheckCircle2, Video, MessageSquare, AlertCircle, ExternalLink, Star, UserCircle2, Mail, Phone, Eye } from 'lucide-react';
import { api } from '../services/api';
import { Logo } from './Logo';

interface ClientDashboardProps {
  currentUser: User;
  projects: Project[];
  settings: StudioSettings;
  onOpenForm: (project: Project) => void;
  onOpenAppointment: (project: Project) => void;
  onOpenDeliverables: (project: Project) => void;
  onNavigateBooking: () => void;
  onProjectRefreshed: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  projects,
  settings,
  onOpenForm,
  onOpenAppointment,
  onOpenDeliverables,
  onNavigateBooking,
  onProjectRefreshed,
}) => {
  const isGuest = !currentUser || currentUser.id === 'guest' || !currentUser.email;
  const activeProject = projects[0]; // Active isolated project for this client

  // Onboarding input state if guest
  const [onboardName, setOnboardName] = useState('');
  const [onboardEmail, setOnboardEmail] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardError, setOnboardError] = useState<string | null>(null);

  // Credit redemption state (Flujo B)
  const [isRedeemingCredit, setIsRedeemingCredit] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  // Survey state
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [surveyScore, setSurveyScore] = useState(5);
  const [surveyExperience, setSurveyExperience] = useState('');
  const [surveyTestimonialAllowed, setSurveyTestimonialAllowed] = useState(true);

  // Timeline step definitions
  const timelineSteps = [
    { key: 'info', label: '1. Información' },
    { key: 'reserva', label: '2. Reserva' },
    { key: 'pago', label: '3. Pago' },
    { key: 'formulario', label: '4. Formulario' },
    { key: 'analisis', label: '5. Análisis' },
    { key: 'meet', label: '6. Meet' },
    { key: 'desarrollo', label: '7. Desarrollo' },
    { key: 'entrega', label: '8. Entrega' },
    { key: 'modificaciones', label: '9. Modificaciones' },
    { key: 'proximo', label: '10. Próximo Servicio' },
  ];

  const getStepState = (stepKey: string, project?: Project) => {
    if (!project) return 'pendiente';
    const status = project.status;

    switch (stepKey) {
      case 'info':
      case 'reserva':
      case 'pago':
        return 'completado';
      case 'formulario':
        if (project.formProgress?.isLocked) return 'completado';
        if (status === 'formulario_pendiente') return 'actual';
        return 'pendiente';
      case 'analisis':
        if (['analisis_previo', 'formulario_completo'].includes(status)) return 'actual';
        if (['asesoria_agendada', 'asesoria_realizada', 'asesoria_entregada', 'diseno_en_proceso', 'diseno_entregado', 'diseno_confirmado'].includes(status)) return 'completado';
        return 'pendiente';
      case 'meet':
        if (project.appointment?.status === 'completada' || ['asesoria_realizada', 'asesoria_entregada', 'diseno_en_proceso', 'diseno_entregado', 'diseno_confirmado'].includes(status)) return 'completado';
        if (status === 'asesoria_agendada') return 'actual';
        return 'pendiente';
      case 'desarrollo':
        if (['asesoria_en_preparacion', 'diseno_en_proceso', 'modificaciones_en_proceso'].includes(status)) return 'actual';
        if (['asesoria_entregada', 'diseno_entregado', 'diseno_confirmado'].includes(status)) return 'completado';
        return 'pendiente';
      case 'entrega':
        if (['asesoria_entregada', 'diseno_entregado', 'diseno_confirmado'].includes(status)) return 'completado';
        return 'pendiente';
      case 'modificaciones':
        if (project.serviceType === 'asesoria') return 'no_aplica';
        if (status === 'devolucion_pendiente' || status === 'modificaciones_en_proceso') return 'actual';
        if (status === 'diseno_confirmado') return 'completado';
        return 'bloqueado';
      case 'proximo':
        if (status === 'asesoria_entregada' || status === 'diseno_confirmado') return 'actual';
        return 'pendiente';
      default:
        return 'pendiente';
    }
  };

  const handleApplyCredit = async (originalProjectId: string) => {
    setIsRedeemingCredit(true);
    try {
      const newProj = await api.applyAsesoriaCredit(originalProjectId, 1, 25);
      setRedeemSuccess(`¡Beneficio aplicado con éxito! Se creó tu nuevo proyecto de Diseño Integral con $${newProj.quote?.creditApplied.toLocaleString('es-AR')} ARS bonificados.`);
      onProjectRefreshed();
    } catch (err: any) {
      alert(err.message || 'Error al aplicar el crédito');
    } finally {
      setIsRedeemingCredit(false);
    }
  };

  const handleSendSurvey = async () => {
    if (!activeProject) return;
    try {
      await api.submitSurvey(activeProject.id, {
        ratingScore: surveyScore,
        experienceNotes: surveyExperience,
        publicTestimonialAllowed: surveyTestimonialAllowed,
      });
      setShowSurveyModal(false);
      onProjectRefreshed();
    } catch (err: any) {
      alert(err.message || 'Error al enviar encuesta');
    }
  };

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardError(null);
    if (!onboardEmail.trim()) {
      setOnboardError('Por favor ingresá tu correo electrónico.');
      return;
    }

    setOnboardLoading(true);
    try {
      const users = await api.getUsers();
      let matched = users.find(u => u.email.toLowerCase() === onboardEmail.trim().toLowerCase());
      if (!matched) {
        if (!onboardName.trim()) {
          setOnboardError('Ingresá tu nombre para abrir tu espacio.');
          setOnboardLoading(false);
          return;
        }
        matched = await api.registerUser(onboardName.trim(), onboardEmail.trim(), onboardPhone.trim());
      }
      api.setCurrentUser(matched);
      onProjectRefreshed();
    } catch (err: any) {
      setOnboardError(err.message || 'Error al abrir tu espacio');
    } finally {
      setOnboardLoading(false);
    }
  };

  const handleSampleClientLoad = async () => {
    const users = await api.getUsers();
    const sample = users.find(u => u.id === 'user_martina') || {
      id: 'user_martina',
      name: 'Martina Gómez',
      email: 'martina@gmail.com',
      role: 'client' as const
    };
    api.setCurrentUser(sample);
    onProjectRefreshed();
  };

  // PRIMER PASO: Pantalla de Bienvenida y Llegada del Cliente si no está identificado
  if (isGuest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-10">
        {/* Brand Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <Logo variant="badge" size="lg" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#fed767]/30 border border-[#fed767] text-[11px] font-bold text-[#1c2120] uppercase tracking-wider">
            Bienvenidox a tu Portal de Diseño
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#1c2120] leading-tight">
            Método CASA no ordena tu vida.<br />
            <span className="text-[#1c2120]/80 font-normal">Diseña el espacio para que tus días puedan vivirse mejor.</span>
          </h1>

          {/* Caveat Handwritten Note */}
          <div className="p-4 rounded-2xl bg-[#ffffff] border border-[#d9d1c5] shadow-xs max-w-xl mx-auto transform -rotate-0.5">
            <p className="font-hand text-xl sm:text-2xl text-[#1c2120] leading-snug">
              «Che, pará. ¿Y si el problema no es que sos desordenadx, sino que tu casa te lo está haciendo difícil? Tomemos unos mates y veámoslo juntos.»
            </p>
            <span className="block text-right text-xs font-semibold text-[#1c2120]/60 mt-1">
              — Euge, Lic. en Diseño de Interiores
            </span>
          </div>
        </div>

        {/* First Step Card: Arrival & Initial Details */}
        <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 sm:p-10 shadow-sm max-w-xl mx-auto space-y-6">
          <div className="border-b border-[#d9d1c5] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/60">
              Paso 1 · Tu Llegada
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#1c2120] mt-0.5">
              Iniciá tu Espacio Privado
            </h2>
            <p className="text-xs text-[#1c2120]/75 mt-1 leading-relaxed">
              Completá tus datos iniciales para acceder a tu portal confidencial. Acá vas a gestionar tu proyecto, reservar tu reunión de asesoría, subir tus fotos y medidas, y descargar tus láminas PDF.
            </p>
          </div>

          {onboardError && (
            <div className="p-3 bg-amber-50 border border-[#fed767] text-[#1c2120] rounded-xl text-xs font-medium">
              {onboardError}
            </div>
          )}

          <form onSubmit={handleQuickRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">
                Tu Nombre y Apellido
              </label>
              <div className="relative">
                <UserCircle2 className="w-4 h-4 text-[#1c2120]/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="ej: Sofía Rossi"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">
                Tu Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#1c2120]/40 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={onboardEmail}
                  onChange={(e) => setOnboardEmail(e.target.value)}
                  placeholder="ejemplo@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                />
              </div>
              <span className="text-[10px] text-[#1c2120]/50 mt-1 block">
                Te enviaremos los accesos de tus reuniones por Meet y avisos de entrega acá.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">
                WhatsApp / Teléfono (opcional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#1c2120]/40 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={onboardPhone}
                  onChange={(e) => setOnboardPhone(e.target.value)}
                  placeholder="+54 9 11 5821-4920"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={onboardLoading}
              className="w-full py-3.5 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50 mt-3"
            >
              <span>{onboardLoading ? 'Preparando tu espacio...' : 'Abrir Mi Espacio Privado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Exemplar Project Shortcut (Only 1 example) */}
          <div className="pt-4 border-t border-[#d9d1c5]/80 space-y-2">
            <button
              type="button"
              onClick={handleSampleClientLoad}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#d9d1c5] hover:border-[#1c2120] bg-[#FAF8F5] hover:bg-[#ece7df]/40 transition-colors flex items-center justify-center gap-2 text-xs text-[#1c2120] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#1c2120]/70" />
              <span className="font-semibold">Ver proyecto de muestra real (Martina Gómez)</span>
            </button>
            <p className="text-center text-[11px] text-[#1c2120]/60">
              Explorá cómo se ve un proyecto terminado con láminas PDF, planos de zonificación y devoluciones.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // CLIENT HAS LOGGED IN BUT NO PROJECTS YET
  if (!activeProject) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#fed767]/30 border border-[#fed767] text-[11px] font-bold text-[#1c2120] uppercase tracking-wider mb-2">
            Espacio Privado
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1c2120]">
            ¡Hola, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-sm md:text-base text-[#1c2120]/75 max-w-lg mx-auto mt-2 leading-relaxed">
            Este es tu espacio exclusivo y privado dentro de Método CASA. Aún no tenés ningún proyecto o asesoría activa registrada con {currentUser.email}.
          </p>
        </div>

        {/* Caveat note from Euge with circular avatar + decontracted organic shape */}
        <div className="p-4 sm:p-5 rounded-[2.5rem_1.4rem_2.8rem_1.2rem] bg-white border border-[#d9d1c5] shadow-xs max-w-lg mx-auto flex items-center gap-3.5 text-left">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
              alt="Euge"
              className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/60 block mb-0.5">Consejo de Euge:</span>
            <p className="font-hand text-xl text-[#1c2120] leading-snug">
              «No necesitás reformar toda la casa de un tirón. Podemos empezar por el ambiente que más te molesta o destrabar la distribución.»
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white rounded-3xl border border-[#d9d1c5] text-left space-y-5 max-w-xl mx-auto shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/60">
            ¿Cómo te gustaría avanzar?
          </div>
          <div className="space-y-3 text-xs text-[#1c2120]/85">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5]/60">
              <span className="w-6 h-6 rounded-full bg-[#fed767] flex items-center justify-center font-bold text-xs text-[#1c2120] shrink-0">1</span>
              <div>
                <strong className="text-sm text-[#1c2120]">Reservá tu Asesoría Online (60 min):</strong>
                <p className="text-xs text-[#1c2120]/70 mt-0.5">Elegí fecha y horario con anticipación mínima de 72 hs. Te entregamos un dossier PDF con ideas y recomendaciones.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5]/60">
              <span className="w-6 h-6 rounded-full bg-[#fed767] flex items-center justify-center font-bold text-xs text-[#1c2120] shrink-0">2</span>
              <div>
                <strong className="text-sm text-[#1c2120]">Calculá el presupuesto de tu espacio:</strong>
                <p className="text-xs text-[#1c2120]/70 mt-0.5">Ingresá los ambientes y medidas en nuestra calculadora con precios transparentes y envíatelo por WhatsApp.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#d9d1c5] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onNavigateBooking}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              Reservar Asesoría Online
            </button>
            <button
              onClick={() => window.location.hash = 'calc'}
              className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-[#1c2120] hover:bg-[#FAF8F5] border border-[#d9d1c5] rounded-xl transition-colors cursor-pointer"
            >
              Calcular Proyecto
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE PROJECT VIEW FOR LOGGED IN CLIENT
  const creditBenefit = activeProject.creditBenefit;
  const isCreditValid = creditBenefit && !creditBenefit.isUsed && !creditBenefit.isExpired;
  const creditTimeLeft = isCreditValid ? getRemainingTimeString(creditBenefit.expiresAt) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome header with brand tone */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/60">
            Portal Privado de Cliente
          </span>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1c2120] mt-1">
            Hola, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm md:text-base text-[#1c2120]/75 mt-1">
            Este es tu espacio exclusivo dentro de Método CASA. Acá vas a encontrar siempre dónde estamos, qué hicimos y qué toca hacer ahora.
          </p>
        </div>

        {/* Playful Caveat Badge with Euge avatar */}
        <div className="p-3 bg-[#ffffff] rounded-[2rem_1rem_2.2rem_1.2rem] border border-[#d9d1c5] shadow-xs flex items-center gap-3 hidden md:flex">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/euge_avatar_smile_1790777108056.jpg"
              alt="Euge"
              className="w-9 h-9 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="text-left">
            <span className="font-hand text-lg text-[#1c2120] block leading-none">
              «Todo avance cuenta, paso a paso.»
            </span>
            <span className="text-[10px] text-[#1c2120]/50 font-sans font-medium">— Euge</span>
          </div>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <span>{redeemSuccess}</span>
          <button onClick={() => setRedeemSuccess(null)} className="font-semibold underline ml-4 cursor-pointer">
            Cerrar
          </button>
        </div>
      )}

      {/* Hero Card: TU PROYECTO */}
      <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#d9d1c5]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#1c2120]/50 tracking-wider">
              Tu Proyecto Activo
            </span>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1c2120] mt-0.5">
              {activeProject.title}
            </h2>
            <div className="text-xs text-[#1c2120]/60 mt-0.5 font-medium">
              {activeProject.spacesSummary} ({activeProject.squareMeters} m²)
            </div>
          </div>

          <div className="self-start sm:self-center px-3.5 py-1.5 rounded-full bg-[#fed767]/30 border border-[#fed767] text-xs font-bold text-[#1c2120]">
            {activeProject.currentStepLabel}
          </div>
        </div>

        {/* Current State & Next Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#1c2120]/50">
                Estado Actual
              </div>
              <div className="text-base font-semibold text-[#1c2120] mt-0.5">
                {activeProject.currentStepLabel}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase font-bold text-[#1c2120] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fed767]" />
                <span>Ahora te toca a vos:</span>
              </div>
              <div className="text-sm font-medium text-[#1c2120] mt-0.5 leading-snug">
                {activeProject.nextActionLabel}
              </div>
              {activeProject.nextActionDeadline && (
                <div className="text-xs text-[#1c2120]/60 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1c2120]/40" />
                  <span>
                    Fecha límite sugerida: {formatFriendlyDate(activeProject.nextActionDeadline)} ({activeProject.deadlineType === 'habiles' ? 'Días hábiles' : 'Días corridos'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contextual Action Button */}
          <div className="flex flex-col sm:items-end justify-center gap-3">
            {activeProject.status === 'formulario_pendiente' && (
              <button
                onClick={() => onOpenForm(activeProject)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span>Completar Formulario de Diagnóstico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeProject.status === 'asesoria_agendada' && (
              <div className="w-full sm:w-auto space-y-2">
                <button
                  onClick={() => onOpenAppointment(activeProject)}
                  className="w-full px-6 py-3.5 rounded-xl bg-[#1c2120] hover:bg-[#2a3130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Video className="w-4 h-4 text-[#fed767]" />
                  <span>Ver Datos del Meet y Calendario</span>
                </button>
                <div className="text-[11px] text-[#1c2120]/60 text-right">
                  Día: {activeProject.appointment?.date} · {activeProject.appointment?.time} hs
                </div>
              </div>
            )}

            {['asesoria_entregada', 'diseno_entregado', 'devolucion_pendiente'].includes(activeProject.status) && (
              <button
                onClick={() => onOpenDeliverables(activeProject)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <FileText className="w-4 h-4" />
                <span>Ver Láminas PDF y Video de Recorrido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {activeProject.status === 'diseno_confirmado' && (
              <button
                onClick={() => onOpenDeliverables(activeProject)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1c2120] hover:bg-[#2a3130] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#fed767]" />
                <span>Descargar Dossier Final Aprobado</span>
              </button>
            )}
          </div>
        </div>

        {/* 10-Step Interactive Timeline */}
        <div className="pt-6 border-t border-[#d9d1c5]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/60 mb-3">
            Hoja de Ruta del Proyecto
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {timelineSteps.map((step) => {
              const state = getStepState(step.key, activeProject);
              return (
                <div
                  key={step.key}
                  className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                    state === 'completado'
                      ? 'bg-[#ffffff] border-[#fed767] text-[#1c2120] font-semibold'
                      : state === 'actual'
                      ? 'bg-[#fed767] text-[#1c2120] font-bold shadow-xs'
                      : state === 'no_aplica'
                      ? 'bg-[#FAF8F5] border-[#d9d1c5]/40 text-[#1c2120]/30 line-through'
                      : 'bg-[#FAF8F5] border-[#d9d1c5]/60 text-[#1c2120]/50'
                  }`}
                >
                  <div className="truncate">{step.label}</div>
                  <div className="text-[10px] mt-0.5">
                    {state === 'completado' && '✓ Listo'}
                    {state === 'actual' && '● En curso'}
                    {state === 'pendiente' && 'Por hacer'}
                    {state === 'no_aplica' && 'N/A'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Credit Benefit Promotion (Flujo B) */}
      {isCreditValid && creditBenefit && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#fed767]/20 border border-[#fed767] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]">
              Beneficio Exclusivo Método CASA
            </span>
            <h3 className="text-xl font-heading font-bold text-[#1c2120]">
              Tenés {formatARS(creditBenefit.amount)} a favor para tu Diseño Integral
            </h3>
            <p className="text-xs text-[#1c2120]/80 max-w-xl leading-relaxed">
              Como realizaste tu Asesoría hace menos de 30 días corridos, se te bonifica el 100% de lo que abonaste al contratar tu proyecto completo.
            </p>
            <div className="text-xs font-semibold text-[#1c2120] pt-1">
              ⏳ Vence en: {creditTimeLeft?.daysRemaining} días, {creditTimeLeft?.hoursRemaining} hs (Fecha límite: {formatFriendlyDate(creditBenefit.expiresAt)})
            </div>
          </div>

          <button
            onClick={() => handleApplyCredit(activeProject.id)}
            disabled={isRedeemingCredit}
            className="px-6 py-3 rounded-xl bg-[#1c2120] text-white text-xs font-bold hover:bg-[#2a3130] transition-colors cursor-pointer shadow-xs whitespace-nowrap disabled:opacity-50"
          >
            {isRedeemingCredit ? 'Aplicando...' : 'Aprovechar Crédito y Diseñar'}
          </button>
        </div>
      )}

      {/* Access to Submodules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Formulario de Diagnóstico */}
        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d9d1c5] shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] flex items-center justify-center text-[#1c2120]">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-base text-[#1c2120]">
              Diagnóstico del Espacio
            </h4>
            <p className="text-xs text-[#1c2120]/70 leading-relaxed">
              {activeProject.formProgress?.isLocked
                ? 'Formulario enviado y analizado por Euge. Medidas y fotos cargadas.'
                : 'Cargá fotos de tu espacio, medidas y seleccioná tus estilos preferidos.'}
            </p>
          </div>
          <button
            onClick={() => onOpenForm(activeProject)}
            className="text-xs font-bold text-[#1c2120] hover:underline flex items-center gap-1 cursor-pointer pt-2"
          >
            <span>{activeProject.formProgress?.isLocked ? 'Ver respuestas enviadas' : 'Completar diagnóstico'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
          </button>
        </div>

        {/* Card 2: Reunión Virtual Meet */}
        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d9d1c5] shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] flex items-center justify-center text-[#1c2120]">
              <Video className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-base text-[#1c2120]">
              Reunión por Google Meet
            </h4>
            <p className="text-xs text-[#1c2120]/70 leading-relaxed">
              Reunión de 60 minutos con Euge. Accedé al enlace directo y gestioná reprogramaciones si lo necesitás.
            </p>
          </div>
          <button
            onClick={() => onOpenAppointment(activeProject)}
            className="text-xs font-bold text-[#1c2120] hover:underline flex items-center gap-1 cursor-pointer pt-2"
          >
            <span>Ver detalles y link</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
          </button>
        </div>

        {/* Card 3: Láminas y Entregables */}
        <div className="bg-[#ffffff] p-6 rounded-2xl border border-[#d9d1c5] shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] flex items-center justify-center text-[#1c2120]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-base text-[#1c2120]">
              Láminas & Entregables PDF
            </h4>
            <p className="text-xs text-[#1c2120]/70 leading-relaxed">
              Visualizá tu dossier, descargá el PDF de alta resolución, mirá el video de recorrido y enviá tus comentarios.
            </p>
          </div>
          <button
            onClick={() => onOpenDeliverables(activeProject)}
            className="text-xs font-bold text-[#1c2120] hover:underline flex items-center gap-1 cursor-pointer pt-2"
          >
            <span>Abrir visor de láminas</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#fed767]" />
          </button>
        </div>
      </div>
    </div>
  );
};
