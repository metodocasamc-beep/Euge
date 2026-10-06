import React, { useState } from 'react';
import { StudioSettings, User, ServiceType, Project } from '../types';
import { formatARS, getNowInArgentina, addCalendarDays, formatFriendlyDate, isAtLeastNoticeHoursAhead } from '../utils/dateUtils';
import { Calendar as CalendarIcon, Clock, CreditCard, ShieldCheck, Check, ArrowRight, Copy, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

interface BookingViewProps {
  settings: StudioSettings;
  currentUser: User;
  preselectedData?: {
    serviceType: ServiceType;
    roomsCount: number;
    squareMeters: number;
    roomTypes: string[];
    estimatedAmount: number;
  };
  onBookingConfirmed: (newProject: Project) => void;
  onOpenTerms: () => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  settings,
  currentUser,
  preselectedData,
  onBookingConfirmed,
  onOpenTerms,
}) => {
  const minNoticeHours = settings.servicePrices.asesoria.minNoticeHours || 72;
  const minValidDate = addCalendarDays(getNowInArgentina(), Math.ceil(minNoticeHours / 24));
  const minDateString = minValidDate.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(minDateString);
  const [selectedTime, setSelectedTime] = useState<string>('16:00');
  const [spacesSummary, setSpacesSummary] = useState<string>(
    preselectedData?.roomTypes?.join(', ') || 'Living-Comedor integrado'
  );
  const [squareMeters, setSquareMeters] = useState<number>(preselectedData?.squareMeters || 25);
  const [clientNotes, setClientNotes] = useState<string>('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'cuotas'>('transferencia');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bookingConfirmedProject, setBookingConfirmedProject] = useState<Project | null>(null);

  const priceARS = preselectedData?.estimatedAmount || settings.servicePrices.asesoria.basePriceARS;

  const availableHours = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30'];

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankField(fieldName);
    setTimeout(() => setCopiedBankField(null), 3000);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Rule: Must be at least 72 hours notice
    if (!isAtLeastNoticeHoursAhead(selectedDate, selectedTime, minNoticeHours)) {
      setValidationError(`Las reservas deben realizarse con al menos ${minNoticeHours} horas de anticipación para que Euge prepare el análisis.`);
      return;
    }

    if (!termsAccepted) {
      setValidationError('Es obligatorio aceptar los Términos y Condiciones para avanzar.');
      return;
    }

    setIsProcessing(true);
    try {
      const nowIso = getNowInArgentina().toISOString();

      const selectedServiceType = preselectedData?.serviceType || 'asesoria';
      const serviceTitle = selectedServiceType === 'asesoria' ? 'Asesoría Online' :
        selectedServiceType === 'diseno_integral' ? 'Diseño Integral 3D' :
        selectedServiceType === 'carpeta_tecnica' ? 'Carpeta Técnica' : 'Muebles a Medida';

      const newProject = await api.createProject({
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        clientPhone: currentUser.phone,
        serviceType: selectedServiceType,
        title: `${serviceTitle} — ${spacesSummary}`,
        spacesSummary,
        squareMeters,
        status: 'asesoria_agendada',
        currentStepLabel: 'Meet Agendado',
        nextActionLabel: 'Completar el formulario de diagnóstico en las próximas 72 hs',
        nextActionRole: 'client',
        nextActionDeadline: addCalendarDays(getNowInArgentina(), 3).toISOString(),
        deadlineType: 'corridos',
        payment: {
          id: `pay_${Date.now()}`,
          amount: priceARS,
          currency: 'ARS',
          method: paymentMethod,
          status: 'confirmado',
          paidAt: nowIso,
          termsAccepted: true,
          termsVersion: settings.termsCurrentVersion,
          termsAcceptedAt: nowIso,
          receiptNumber: `REC-${Date.now().toString().slice(-6)}`
        },
        appointment: {
          id: `apt_${Date.now()}`,
          date: selectedDate,
          time: selectedTime,
          durationMinutes: settings.servicePrices.asesoria.durationMinutes || 60,
          meetUrl: 'https://meet.google.com/cas-euge-mtg',
          rescheduledCount: 0,
          status: 'agendada',
          rescheduleHistory: []
        },
        formProgress: {
          startedAt: nowIso,
          expiresAt: addCalendarDays(getNowInArgentina(), 3).toISOString(),
          isLocked: false,
          percentage: 0,
          lastSavedAt: nowIso,
          answers: {},
          selectedStyles: [],
          customInspirations: [],
          uploadedPlans: [],
          uploadedPhotos: []
        }
      });

      setBookingConfirmedProject(newProject);
    } catch (err: any) {
      setValidationError(err.message || 'Error al procesar la reserva');
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingConfirmedProject) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-8 md:p-10 shadow-sm text-center">
          <div className="w-16 h-16 bg-[#fed767] text-[#1c2120] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/60">
            ¡Reserva Confirmada!
          </span>
          <h1 className="text-3xl font-heading font-extrabold text-[#1c2120] mt-1 mb-2">
            ¡Listo! Tu Asesoría está reservada.
          </h1>
          <p className="text-sm text-[#1c2120]/75 max-w-lg mx-auto mb-6">
            Te enviamos los accesos y detalles a <strong>{currentUser.email}</strong>. Tu lugar exclusivo en la agenda de Euge ya está asegurado.
          </p>

          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#d9d1c5] text-left text-xs space-y-3 mb-6">
            <div className="flex justify-between py-1 border-b border-[#d9d1c5]/60">
              <span className="text-[#1c2120]/60">Servicio</span>
              <span className="font-bold text-[#1c2120]">Asesoría Online (60 min)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d9d1c5]/60">
              <span className="text-[#1c2120]/60">Día y Hora</span>
              <span className="font-bold text-[#1c2120]">
                {formatFriendlyDate(selectedDate)} a las {selectedTime} hs
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d9d1c5]/60">
              <span className="text-[#1c2120]/60">Plataforma</span>
              <a
                href="https://meet.google.com/cas-euge-mtg"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#1c2120] underline flex items-center gap-1"
              >
                <span>Google Meet (Enlace directo)</span>
                <ExternalLink className="w-3 h-3 text-[#fed767]" />
              </a>
            </div>
            <div className="flex justify-between py-1 border-b border-[#d9d1c5]/60">
              <span className="text-[#1c2120]/60">Tolerancia de ingreso</span>
              <span className="font-semibold text-[#1c2120]">15 minutos</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#1c2120]/60">Política de reprogramación</span>
              <span className="text-[#1c2120]/80 text-right">Hasta 2 veces con 24 hs de anticipación</span>
            </div>
          </div>

          <div className="p-4 bg-[#fed767]/20 rounded-2xl border border-[#fed767] mb-6 text-left space-y-1">
            <h3 className="text-xs font-bold text-[#1c2120] uppercase tracking-wider">
              Próximo paso imprescindible
            </h3>
            <p className="text-xs text-[#1c2120]/80 leading-relaxed">
              Para que la reunión rinda al máximo, <strong>completá tu Formulario de Diagnóstico</strong> en las próximas 72 horas. Allí vas a poder subir fotos de tu espacio, medidas y seleccionar tus estilos favoritos.
            </p>
          </div>

          <button
            onClick={() => onBookingConfirmed(bookingConfirmedProject)}
            className="w-full py-4 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <span>Ir al Formulario de Diagnóstico Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mb-8 space-y-2">
        <div className="inline-block px-3 py-1 rounded-full bg-[#fed767]/30 border border-[#fed767] text-[11px] font-bold text-[#1c2120] uppercase tracking-wider">
          Agenda Exclusiva
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1c2120]">
          Reservar Asesoría Online
        </h1>
        <p className="text-sm md:text-base text-[#1c2120]/75 leading-relaxed">
          Encuentro virtual de 60 minutos con Euge por Google Meet para destrabar dudas puntuales, revisar distribución, iluminación o materiales. Incluye entrega de dossier PDF posterior.
        </p>

        {/* Caveat handwritten note */}
        <div className="p-3 bg-white rounded-xl border border-[#d9d1c5] shadow-xs inline-block mt-1">
          <span className="font-hand text-lg text-[#1c2120]">
            «Pedimos 72 hs de anticipación para que nos de tiempo de mirar tus fotos y medidas antes de encontrarnos.»
          </span>
        </div>
      </div>

      {validationError && (
        <div className="mb-6 p-4 bg-amber-50 border border-[#fed767] text-[#1c2120] rounded-2xl text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-[#1c2120] shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details, Date, Time, Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Space Summary */}
          <div className="bg-[#ffffff] p-6 rounded-3xl border border-[#d9d1c5] shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1c2120]/70">
              1. Espacio a resolver
            </label>
            <div>
              <input
                type="text"
                required
                value={spacesSummary}
                onChange={(e) => setSpacesSummary(e.target.value)}
                placeholder="ej: Living-Comedor y balcón integrado"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120] focus:outline-none focus:border-[#1c2120]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1c2120]/70 mb-1">
                ¿Qué te gustaría charlar con Euge en la sesión? (Opcional)
              </label>
              <textarea
                rows={2}
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="ej: No sabemos cómo ubicar la mesa sin tapar la circulación, o queremos renovar colores..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120] focus:outline-none focus:border-[#1c2120]"
              />
            </div>
          </div>

          {/* Step 2: Date & Time Picker */}
          <div className="bg-[#ffffff] p-6 rounded-3xl border border-[#d9d1c5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/70 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#1c2120]" />
                2. Elegí fecha y horario
              </label>
              <span className="text-[11px] text-[#1c2120]/60 font-medium">
                Mínimo 72 hs previas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1c2120] mb-1">
                  Fecha del Meet
                </label>
                <input
                  type="date"
                  required
                  min={minDateString}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120] focus:outline-none focus:border-[#1c2120]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1c2120] mb-1">
                  Horario de inicio
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {availableHours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setSelectedTime(hour)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        selectedTime === hour
                          ? 'bg-[#1c2120] text-white border-[#1c2120]'
                          : 'bg-[#FAF8F5] border-[#d9d1c5] text-[#1c2120]/70 hover:bg-[#ece7df]'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Options (Transferencia con CBU/Alias/CUIT copiables + Tarjeta 3 cuotas) */}
          <div className="bg-[#ffffff] p-6 rounded-3xl border border-[#d9d1c5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/70 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#1c2120]" />
                3. Forma de pago (100% al reservar)
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pago Seguro
              </span>
            </div>

            {/* Toggle buttons between Transfer and Card */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'transferencia'
                    ? 'border-[#1c2120] bg-[#fed767]/20 font-bold shadow-xs'
                    : 'border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]/70 hover:bg-[#ece7df]'
                }`}
              >
                <div className="text-xs font-bold text-[#1c2120]">Transferencia Bancaria</div>
                <div className="text-[10px] text-emerald-800 font-semibold mt-0.5">CBU / Alias / CUIT</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cuotas')}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'cuotas'
                    ? 'border-[#1c2120] bg-[#fed767]/20 font-bold shadow-xs'
                    : 'border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]/70 hover:bg-[#ece7df]'
                }`}
              >
                <div className="text-xs font-bold text-[#1c2120]">Tarjeta en hasta 3 cuotas</div>
                <div className="text-[10px] text-[#1c2120]/70 font-semibold mt-0.5">Mercado Pago</div>
              </button>
            </div>

            {/* Transfer Details Card with Copiable CBU, ALIAS and CUIT */}
            {paymentMethod === 'transferencia' ? (
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] text-xs space-y-2.5">
                <div className="font-bold text-[#1c2120] flex items-center justify-between pb-1 border-b border-[#d9d1c5]/60">
                  <span>Datos bancarios Método CASA:</span>
                  <span className="text-[11px] font-medium text-[#1c2120]/60">{settings.bankDetails.bankName}</span>
                </div>

                {/* Copiable Alias */}
                <div className="flex items-center justify-between py-1 border-b border-[#d9d1c5]/40">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#1c2120]/50 uppercase tracking-wider font-bold block">Alias</span>
                    <span className="font-bold text-[#1c2120] font-mono text-sm">{settings.bankDetails.alias}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.bankDetails.alias, 'alias')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ffffff] hover:bg-[#fed767] border border-[#d9d1c5] text-xs font-bold text-[#1c2120] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedBankField === 'alias' ? '¡Copiado!' : 'Copiar Alias'}</span>
                  </button>
                </div>

                {/* Copiable CBU */}
                <div className="flex items-center justify-between py-1 border-b border-[#d9d1c5]/40">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#1c2120]/50 uppercase tracking-wider font-bold block">CBU</span>
                    <span className="font-mono text-xs text-[#1c2120] font-semibold">{settings.bankDetails.cbu}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.bankDetails.cbu, 'cbu')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ffffff] hover:bg-[#fed767] border border-[#d9d1c5] text-xs font-bold text-[#1c2120] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedBankField === 'cbu' ? '¡Copiado!' : 'Copiar CBU'}</span>
                  </button>
                </div>

                {/* Copiable CUIT */}
                <div className="flex items-center justify-between py-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#1c2120]/50 uppercase tracking-wider font-bold block">CUIT / Titular</span>
                    <span className="font-mono text-xs text-[#1c2120] font-semibold">{settings.bankDetails.cuit}</span>
                    <span className="block text-[11px] text-[#1c2120]/60">Titular: {settings.bankDetails.holderName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.bankDetails.cuit, 'cuit')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ffffff] hover:bg-[#fed767] border border-[#d9d1c5] text-xs font-bold text-[#1c2120] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedBankField === 'cuit' ? '¡Copiado!' : 'Copiar CUIT'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] text-xs space-y-3">
                <div className="flex items-center justify-between font-bold text-[#1c2120]">
                  <span>Tarjeta en hasta 3 cuotas</span>
                  <span className="text-xs bg-[#fed767] text-[#1c2120] px-2 py-0.5 rounded-full font-bold">Mercado Pago</span>
                </div>
                <p className="text-xs text-[#1c2120]/75 leading-relaxed">
                  Podés abonar con tarjeta de crédito o débito a través de la pasarela oficial de Mercado Pago en 1, 2 o 3 cuotas fijas.
                </p>
                <div className="p-3 bg-[#ffffff] rounded-xl border border-[#d9d1c5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#1c2120]/50 uppercase font-bold block">Enlace de cobro</span>
                    <span className="text-xs font-semibold text-[#1c2120]">Link oficial de Mercado Pago Método CASA</span>
                  </div>
                  <span className="text-xs font-bold text-[#1c2120]">3 cuotas de {formatARS(Math.round(priceARS / 3))}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Summary, Terms & Pay Button */}
        <div className="lg:col-span-5 bg-[#ffffff] p-6 md:p-8 rounded-3xl border-2 border-[#1c2120] sticky top-24 space-y-6 shadow-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#1c2120]/60 font-bold">
              Resumen de Reserva
            </div>
            {paymentMethod === 'transferencia' ? (
              <div>
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1c2120] mt-1">
                  {formatARS(Math.round(priceARS * 0.80))}
                </div>
                <div className="text-xs text-emerald-800 font-bold mt-0.5">
                  ✓ 20% OFF por Transferencia (Ahorrás {formatARS(Math.round(priceARS * 0.20))})
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl sm:text-4xl font-heading font-extrabold text-[#1c2120] mt-1">
                  3 x {formatARS(Math.round(priceARS / 3))}
                </div>
                <div className="text-xs text-[#1c2120]/60 mt-0.5 font-medium">
                  Total financiado: {formatARS(priceARS)} en 3 cuotas fijas
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-xs text-[#1c2120]/80 border-y border-[#d9d1c5] py-4">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span className="font-bold text-[#1c2120]">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-semibold text-[#1c2120] truncate max-w-[180px]">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha seleccionada:</span>
              <span className="font-bold text-[#1c2120]">
                {formatFriendlyDate(selectedDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Horario del Meet:</span>
              <span className="font-bold text-[#1c2120]">{selectedTime} hs</span>
            </div>
            <div className="flex justify-between">
              <span>Medio de pago:</span>
              <span className="font-bold text-[#1c2120]">
                {paymentMethod === 'transferencia' ? 'Transferencia (20% OFF)' : 'Hasta 3 cuotas'}
              </span>
            </div>
          </div>

          {/* Benefit Reminder */}
          <div className="p-3.5 bg-[#fed767]/20 rounded-2xl border border-[#fed767] text-xs text-[#1c2120] leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#1c2120]" />
              <span>Garantía de Reinversión al 100%:</span>
            </div>
            <p className="text-[11px] text-[#1c2120]/90">
              Si luego de nuestra charla o al recibir tu dossier decidís avanzar con Diseño Integral, se te reinvierte el 100% de lo abonado con un código exclusivo.
            </p>
          </div>

          {/* Terms Acceptance */}
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-[#1c2120] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#d9d1c5] text-[#1c2120] focus:ring-[#fed767]"
              />
              <span>
                Acepto los{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="font-bold text-[#1c2120] underline cursor-pointer inline"
                >
                  Términos y Condiciones del Servicio
                </button>{' '}
                (versión {settings.termsCurrentVersion}).
              </span>
            </label>
            <p className="text-[10px] text-[#1c2120]/50">
              Registramos fecha, hora, usuario ({currentUser.name}) y versión aceptada.
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
          >
            <span>{isProcessing ? 'Confirmando...' : 'Confirmar Reserva y Pago'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
