import React, { useState } from 'react';
import { Project, DeliverableVersion } from '../types';
import { formatFriendlyDate, getRemainingTimeString } from '../utils/dateUtils';
import { FileText, Download, Video, ExternalLink, Clock, Send, CheckCircle2, AlertTriangle, ArrowLeft, Upload, Paperclip, Eye, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface DeliverablesViewProps {
  project: Project;
  onProjectUpdated: (updated: Project) => void;
  onBackToDashboard: () => void;
}

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({
  project,
  onProjectUpdated,
  onBackToDashboard,
}) => {
  const deliverables = project.deliverables || [];
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(
    deliverables.length > 0 ? deliverables.length - 1 : 0
  );
  const [clientNotes, setClientNotes] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  if (deliverables.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#fed767]/30 border border-[#fed767] flex items-center justify-center mx-auto text-[#1c2120]">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-[#1c2120]">Láminas y Entregable en preparación</h2>
        <p className="text-xs md:text-sm text-[#1c2120]/75 max-w-md mx-auto leading-relaxed">
          Euge está trabajando en la planimetría, esquemas de distribución, selección de materiales y video explicativo de recorrido. En cuanto esté publicado lo vas a poder visualizar y descargar acá mismo.
        </p>

        {/* Caveat note from Euge with circular avatar + decontracted organic shape */}
        <div className="p-3.5 sm:p-4 bg-white rounded-[2rem_1rem_2.2rem_1.2rem] border border-[#d9d1c5] shadow-xs flex items-center gap-3.5 max-w-md mx-auto text-left">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/euge_avatar_talking_1790777128105.jpg"
              alt="Euge"
              className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <span className="text-[10px] font-mont font-bold uppercase tracking-wider text-[#1c2120]/60 block mb-0.5">Euge te cuenta:</span>
            <span className="font-hand text-lg text-[#1c2120] leading-snug block">
              «Cada lámina se diseña a medida de tu espacio real, resolviendo medidas, guardado y luz.»
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={onBackToDashboard}
            className="mt-2 px-6 py-3 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl cursor-pointer shadow-xs transition-colors"
          >
            Volver a Mi Espacio
          </button>
        </div>
      </div>
    );
  }

  const currentDeliverable = deliverables[selectedVersionIdx] || deliverables[0];
  const remainingDeadline = getRemainingTimeString(currentDeliverable.feedbackDeadline);
  const isExpired = remainingDeadline.isExpired;
  const isLocked = currentDeliverable.isLockedForFeedback;

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setReturnError(null);

    if (!clientNotes.trim()) {
      setReturnError('Escribí tus observaciones o comentarios antes de enviar la devolución.');
      return;
    }

    setIsSubmittingReturn(true);
    try {
      await api.submitModificationReturn(project.id, currentDeliverable.version, clientNotes);
      const updated = await api.getProjectById(project.id);
      onProjectUpdated(updated);
      setClientNotes('');
      setFeedbackSuccess(true);
    } catch (err: any) {
      setReturnError(err.message || 'No se pudo enviar la devolución.');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const handleAddSampleAttachment = () => {
    setAttachedFiles([...attachedFiles, `foto_referencia_devolucion_${attachedFiles.length + 1}.jpg`]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Version History */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d1c5]">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-[#1c2120]/70 hover:text-[#1c2120] flex items-center gap-1.5 mb-2 cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Mi Espacio</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1c2120]">
              {currentDeliverable.title}
            </h1>
            {deliverables.length > 1 && (
              <div className="flex items-center gap-1 bg-[#ffffff] p-1 rounded-xl border border-[#d9d1c5]">
                {deliverables.map((v, i) => (
                  <button
                    key={v.version}
                    onClick={() => setSelectedVersionIdx(i)}
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition-colors cursor-pointer ${
                      selectedVersionIdx === i ? 'bg-[#fed767] text-[#1c2120] shadow-2xs' : 'text-[#1c2120]/60 hover:text-[#1c2120]'
                    }`}
                  >
                    v{v.version}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-[#1c2120]/70 mt-1 font-medium">
            Entregado el {formatFriendlyDate(currentDeliverable.deliveredAt)} · Versión {currentDeliverable.version}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentDeliverable.pdfDownloadUrl}
            target="_blank"
            rel="noreferrer"
            download={currentDeliverable.pdfFileName || 'Dossier_Metodo_CASA.pdf'}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Dossier Completo (PDF)</span>
          </a>
        </div>
      </div>

      {/* Main Deliverables Grid: PDF Dossier & Video de Recorrido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Dossier & Laminas Preview Card */}
        <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c2120]/70">
                <FileText className="w-4 h-4 text-[#1c2120]" />
                <span>Láminas & Dossier PDF</span>
              </div>
              <span className="text-[10px] bg-[#FAF8F5] border border-[#d9d1c5] px-2 py-0.5 rounded-md font-mono text-[#1c2120]">
                {currentDeliverable.pdfFileName || 'dossier_final.pdf'}
              </span>
            </div>

            <h3 className="text-xl font-heading font-bold text-[#1c2120]">
              Láminas de Proyecto & Guía de Compras
            </h3>
            <p className="text-xs text-[#1c2120]/75 leading-relaxed">
              {currentDeliverable.description || 'Dossier integral en PDF con ideas de distribución, zonificación, paleta cromática, catálogo de mobiliario sugerido y plano acotado.'}
            </p>

            {/* Visual Sheet Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-[#d9d1c5] bg-[#FAF8F5] aspect-video flex items-center justify-center group shadow-2xs">
              <img
                src={currentDeliverable.pdfDownloadUrl || '/src/assets/images/deliverable_preview_sample_1790705553160.jpg'}
                alt="Vista previa láminas de interiorismo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#1c2120]/30 group-hover:bg-[#1c2120]/40 transition-colors flex items-center justify-center">
                <a
                  href={currentDeliverable.pdfDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#ffffff] text-[#1c2120] text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 hover:bg-[#fed767] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Abrir PDF en pantalla completa</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#1c2120]/60 border-t border-[#d9d1c5]/60">
            <span>Diseñado externamente por Euge</span>
            <span className="font-semibold text-[#1c2120]">PDF Alta Definición</span>
          </div>
        </div>

        {/* Video de Recorrido Explicativo Card */}
        <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c2120]/70">
                <Video className="w-4 h-4 text-[#1c2120]" />
                <span>Video de Recorrido</span>
              </div>
              <span className="text-[10px] bg-[#fed767]/30 border border-[#fed767] px-2 py-0.5 rounded-md font-bold text-[#1c2120]">
                Explicación de Euge
              </span>
            </div>

            <h3 className="text-xl font-heading font-bold text-[#1c2120]">
              {currentDeliverable.videoTitle || 'Recorrido en Video de la Propuesta'}
            </h3>
            <p className="text-xs text-[#1c2120]/75 leading-relaxed">
              Euge te cuenta en video cómo pensó cada rincón, el porqué de cada decisión de guardado y los materiales recomendados para que lo veas con total claridad.
            </p>

            {/* Video Box */}
            {currentDeliverable.videoRecorridoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#d9d1c5] bg-[#FAF8F5] aspect-video flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#fed767] text-[#1c2120] flex items-center justify-center mb-3 shadow-xs">
                  <Video className="w-6 h-6 ml-0.5" />
                </div>
                <div className="text-xs font-bold text-[#1c2120] max-w-xs">
                  Video explicativo de la propuesta subido por Euge
                </div>
                <a
                  href={currentDeliverable.videoRecorridoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 px-4 py-2 bg-[#1c2120] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#2a3130] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Ver Video en Reproductor Externo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d9d1c5] bg-[#FAF8F5] p-8 text-center text-xs text-[#1c2120]/60 space-y-1">
                <Video className="w-6 h-6 mx-auto text-[#1c2120]/40" />
                <p className="font-semibold text-[#1c2120]">Este entregable no incluye video de recorrido.</p>
                <p>La propuesta se explica en detalle dentro del dossier PDF.</p>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#1c2120]/60 border-t border-[#d9d1c5]/60">
            <span>Audio & Explicación paso a paso</span>
            <span className="font-semibold text-[#1c2120]">Método CASA</span>
          </div>
        </div>
      </div>

      {/* Instancia de Devolución & Feedback (10 Días Hábiles) */}
      <div className="bg-[#ffffff] rounded-3xl border border-[#d9d1c5] p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d9d1c5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c2120]/60">
                Instancia de Devoluciones y Ajustes
              </span>
              <span className="text-[10px] bg-[#fed767]/30 border border-[#fed767] px-2 py-0.5 rounded-full font-bold text-[#1c2120]">
                10 Días Hábiles
              </span>
            </div>
            <h3 className="text-xl font-heading font-bold text-[#1c2120] mt-0.5">
              Tu Devolución Consolidada
            </h3>
          </div>

          {/* Countdown badge */}
          <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            isExpired || isLocked
              ? 'bg-[#FAF8F5] border-[#d9d1c5] text-[#1c2120]/50'
              : 'bg-[#fed767]/20 border-[#fed767] text-[#1c2120]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {isLocked
                ? 'Devolución ya enviada'
                : isExpired
                ? 'Plazo de 10 días vencido'
                : `Tiempo restante: ${remainingDeadline.daysRemaining} días hábiles`}
            </span>
          </div>
        </div>

        {/* Caveat quote */}
        <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5]">
          <p className="font-hand text-lg text-[#1c2120] leading-snug">
            «Revisá las láminas con calma, probalo imaginándote viviendo ahí un martes a la tarde. Juntá todas tus dudas en esta instancia para que hagamos un ajuste integral.»
          </p>
        </div>

        {feedbackSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>¡Devolución enviada con éxito a Euge! La revisaremos para coordinar los ajustes.</span>
          </div>
        )}

        {isLocked ? (
          <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] text-xs text-[#1c2120]/80 space-y-2">
            <div className="font-bold text-[#1c2120] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Instancia de Devolución Enviada</span>
            </div>
            <p>
              Ya registraste tus comentarios para esta versión. Euge está analizando tus sugerencias para preparar la versión ajustada del dossier.
            </p>
          </div>
        ) : isExpired ? (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-[#1c2120] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Plazo de 10 días hábiles cumplido</span>
            </div>
            <p className="text-xs text-[#1c2120]/80">
              Conforme a los Términos del servicio, al transcurrir los 10 días hábiles sin observaciones consolidadas, la propuesta se considera formalmente aprobada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReturn} className="space-y-4">
            {returnError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium">
                {returnError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">
                Escribí todas tus observaciones consolidadas
              </label>
              <textarea
                rows={5}
                required
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="ej: En la lámina 3 nos encantó la distribución del sillón, pero quisiéramos evaluar si el mueble de la TV puede tener puertas ciegas en vez de estantes abiertos..."
                className="w-full p-4 text-xs rounded-2xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120] text-[#1c2120] leading-relaxed"
              />
            </div>

            {/* File Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1c2120]">
                  Archivos o capturas de referencia (opcional)
                </span>
                <button
                  type="button"
                  onClick={handleAddSampleAttachment}
                  className="text-xs font-bold text-[#1c2120] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5 text-[#fed767]" />
                  <span>Adjuntar referencia</span>
                </button>
              </div>

              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] text-xs font-mono text-[#1c2120] flex items-center gap-2">
                      <Paperclip className="w-3 h-3 text-[#1c2120]/40" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-[#1c2120]/60">
                Recordá que este servicio incluye una (1) instancia única consolidada de ajustes.
              </span>

              <button
                type="submit"
                disabled={isSubmittingReturn}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingReturn ? 'Enviando...' : 'Enviar Devolución a Euge'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
