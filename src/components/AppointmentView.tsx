import React, { useState } from 'react';
import { Project, StudioSettings } from '../types';
import { formatFriendlyDate, canRescheduleAppointment, addCalendarDays, getNowInArgentina } from '../utils/dateUtils';
import { Video, Calendar, Clock, RefreshCw, AlertCircle, Check, Bell, ExternalLink, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

interface AppointmentViewProps {
  project: Project;
  settings: StudioSettings;
  onAppointmentUpdated: (updatedProject: Project) => void;
  onBackToDashboard: () => void;
}

export const AppointmentView: React.FC<AppointmentViewProps> = ({
  project,
  settings,
  onAppointmentUpdated,
  onBackToDashboard,
}) => {
  const appointment = project.appointment;
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('16:00');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!appointment) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-heading font-bold text-[#1c2120]">No hay una reunión agendada</h2>
        <button onClick={onBackToDashboard} className="mt-4 text-xs font-bold text-[#1c2120] underline">
          Volver a Mi Espacio
        </button>
      </div>
    );
  }

  const rescheduleCheck = canRescheduleAppointment(
    appointment.date,
    appointment.time,
    settings.minRescheduleNoticeHours || 24
  );

  const minNoticeHours = settings.servicePrices.asesoria.minNoticeHours || 72;
  const minAllowedDate = addCalendarDays(getNowInArgentina(), Math.ceil(minNoticeHours / 24));
  const minAllowedDateString = minAllowedDate.toISOString().split('T')[0];

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const updated = await api.rescheduleAppointment(project.id, newDate, newTime, reason);
      onAppointmentUpdated(updated);
      setShowRescheduleModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo reprogramar la reunión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createGoogleCalendarUrl = () => {
    const startIso = `${appointment.date.replace(/-/g, '')}T${appointment.time.replace(':', '')}00`;
    const [h, m] = appointment.time.split(':').map(Number);
    const endH = String(h + 1).padStart(2, '0');
    const endIso = `${appointment.date.replace(/-/g, '')}T${endH}${String(m).padStart(2, '0')}00`;
    const title = encodeURIComponent(`Asesoría Método CASA con Euge — ${project.spacesSummary}`);
    const details = encodeURIComponent(`Enlace de Google Meet: ${appointment.meetUrl}\nProyecto: ${project.title}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${encodeURIComponent(appointment.meetUrl)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={onBackToDashboard}
        className="text-xs text-[#1c2120]/70 hover:text-[#1c2120] flex items-center gap-1.5 mb-6 cursor-pointer font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver a Mi Espacio</span>
      </button>

      <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 md:p-10 shadow-sm space-y-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/60">
            Reunión de Asesoría Virtual
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1c2120] mt-1">
            Encuentro por Google Meet con Euge
          </h1>
          <p className="text-xs md:text-sm text-[#1c2120]/75 mt-1 leading-relaxed">
            Una sesión de 60 minutos mano a mano para ordenar ideas, resolver dudas y definir el rumbo funcional y estético de tu espacio.
          </p>
        </div>

        {/* Caveat note */}
        <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] shadow-xs">
          <span className="font-hand text-xl text-[#1c2120]">
            «Una diseñadora que sabe, observa y tiene algo para decir; pero te lo cuenta tomando un mate.»
          </span>
        </div>

        {/* Date and Meet Card */}
        <div className="p-6 rounded-2xl bg-[#fed767]/20 border border-[#fed767] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/60">
              Fecha & Hora Confirmada
            </div>
            <div className="text-xl font-heading font-extrabold text-[#1c2120]">
              {formatFriendlyDate(appointment.date)} a las {appointment.time} hs
            </div>
            <div className="text-xs text-[#1c2120]/70">
              Duración: {appointment.durationMinutes} minutos · Tolerancia: 15 minutos
            </div>
          </div>

          <a
            href={appointment.meetUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1c2120] text-white hover:bg-[#2a3130] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Video className="w-4 h-4 text-[#fed767]" />
            <span>Unirse al Meet</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/60" />
          </a>
        </div>

        {/* Action Buttons: Add to Calendar & Reschedule */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-3 text-xs font-bold text-[#1c2120] hover:bg-[#FAF8F5] border border-[#d9d1c5] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#1c2120]/70" />
            <span>Agregar a Google Calendar</span>
          </a>

          <button
            onClick={() => setShowRescheduleModal(true)}
            className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-[#1c2120] hover:bg-[#FAF8F5] border border-[#d9d1c5] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1c2120]/70" />
            <span>Reprogramar fecha</span>
          </button>
        </div>

        {/* Reschedule Rules & Tolerance */}
        <div className="border-t border-[#d9d1c5] pt-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/70">
            Pautas del Encuentro
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1c2120]/80">
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5]/60">
              <strong>Tolerancia de ingreso:</strong> Se espera un máximo de 15 minutos. Pasado ese tiempo sin aviso, la sesión se considerará computada.
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5]/60">
              <strong>Reprogramaciones:</strong> Hasta 2 veces por contratación, avisando con mínimo 24 hs de anticipación a través del portal.
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-[#1c2120]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#d9d1c5]">
              <h3 className="text-lg font-heading font-bold text-[#1c2120]">
                Reprogramar Asesoría
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-[#1c2120]/50 hover:text-[#1c2120] text-sm"
              >
                ✕
              </button>
            </div>

            {!rescheduleCheck.allowed ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-1">
                <strong>No es posible reprogramar de forma automática:</strong>
                <p>{rescheduleCheck.reason}</p>
                <p className="mt-2 text-[11px] text-[#1c2120]/70">
                  Si tenés una emergencia de fuerza mayor, escribinos a hola@metodocasa.com.ar.
                </p>
              </div>
            ) : appointment.rescheduledCount >= (settings.maxReschedulesAllowed || 2) ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-1">
                <strong>Límite de reprogramaciones alcanzado:</strong>
                <p>Ya realizaste las {settings.maxReschedulesAllowed} reprogramaciones permitidas.</p>
              </div>
            ) : (
              <form onSubmit={handleReschedule} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-[#1c2120] mb-1">
                    Nueva fecha del Meet
                  </label>
                  <input
                    type="date"
                    required
                    min={minAllowedDateString}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1c2120] mb-1">
                    Nuevo horario
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                  >
                    {['10:00', '11:30', '14:00', '15:30', '17:00', '18:30'].map(t => (
                      <option key={t} value={t}>{t} hs</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1c2120] mb-1">
                    Motivo de la reprogramación
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contanos brevemente por qué necesitás mover la fecha..."
                    className="w-full p-2.5 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#d9d1c5]">
                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(false)}
                    className="px-4 py-2 text-[#1c2120]/70 hover:text-[#1c2120] font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Reprogramando...' : 'Confirmar Nueva Fecha'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
