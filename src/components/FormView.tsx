import React, { useState, useEffect } from 'react';
import { Project, StyleReference } from '../types';
import { getRemainingTimeString, formatFriendlyDate } from '../utils/dateUtils';
import { Clock, Save, CheckCircle2, ArrowRight, ArrowLeft, Upload, Image, Sparkles, Check, FileText } from 'lucide-react';
import { api } from '../services/api';

interface FormViewProps {
  project: Project;
  styles: StyleReference[];
  onFormSaved: (updatedProject: Project) => void;
  onBackToDashboard: () => void;
}

export const FormView: React.FC<FormViewProps> = ({
  project,
  styles,
  onFormSaved,
  onBackToDashboard,
}) => {
  const formProgress = project.formProgress || {
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    isLocked: false,
    percentage: 0,
    lastSavedAt: new Date().toISOString(),
    answers: {},
    selectedStyles: [],
    customInspirations: [],
    uploadedPlans: [],
    uploadedPhotos: [],
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, any>>(formProgress.answers || {});
  const [selectedStyles, setSelectedStyles] = useState<string[]>(formProgress.selectedStyles || []);
  const [customInspirations, setCustomInspirations] = useState<any[]>(formProgress.customInspirations || []);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>(formProgress.uploadedPhotos || []);
  const [uploadedPlans, setUploadedPlans] = useState<any[]>(formProgress.uploadedPlans || []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time remaining
  const remainingTime = getRemainingTimeString(formProgress.expiresAt);

  const toggleStyle = (id: string) => {
    if (formProgress.isLocked) return;
    if (selectedStyles.includes(id)) {
      setSelectedStyles(selectedStyles.filter(s => s !== id));
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

  // Autosave trigger
  const triggerSave = async (isFinal = false) => {
    setIsSaving(true);
    try {
      const updated = await api.saveFormProgress(project.id, {
        answers,
        selectedStyles,
        customInspirations,
        uploadedPlans,
        uploadedPhotos,
        isFinalSubmission: isFinal,
      });
      onFormSaved(updated);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
      return updated;
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updated = await triggerSave(true);
      if (updated) {
        setIsReviewMode(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample photo upload simulator
  const handleAddSamplePhoto = () => {
    if (formProgress.isLocked) return;
    const newPh = {
      id: `ph_${Date.now()}`,
      name: `foto_espacio_${uploadedPhotos.length + 1}.jpg`,
      room: project.spacesSummary || 'Espacio principal',
      url: '/src/assets/images/hero_interior_warm_1790705518861.jpg'
    };
    setUploadedPhotos([...uploadedPhotos, newPh]);
  };

  const handleAddSamplePlan = () => {
    if (formProgress.isLocked) return;
    const newPlan = {
      id: `pl_${Date.now()}`,
      name: `croquis_medidas_${project.clientName.replace(/\s+/g, '_')}.pdf`,
      size: '1.2 MB',
      url: '#'
    };
    setUploadedPlans([...uploadedPlans, newPlan]);
  };

  if (formProgress.isLocked) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-[#2C2926]/10 p-8 shadow-xs text-center">
          <div className="w-12 h-12 bg-[#F4EFEB] text-[#68735C] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase font-semibold text-[#68735C] tracking-wider">
            Formulario Entregado
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#2C2926] mt-2 mb-3">
            Tus respuestas ya están en manos de Euge.
          </h1>
          <p className="text-xs md:text-sm text-[#2C2926]/70 max-w-md mx-auto mb-6">
            El formulario se encuentra bloqueado para que el estudio pueda realizar el análisis previo sin modificaciones.
          </p>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#2C2926]/10 text-left text-xs space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-[#2C2926]/60">Fecha de envío:</span>
              <span className="font-medium text-[#2C2926]">{formatFriendlyDate(formProgress.submittedAt || new Date().toISOString(), true)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2C2926]/60">Estilos seleccionados:</span>
              <span className="font-medium text-[#2C2926]">{selectedStyles.length} referencias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#2C2926]/60">Fotos cargadas:</span>
              <span className="font-medium text-[#2C2926]">{uploadedPhotos.length} fotos</span>
            </div>
          </div>

          <button
            onClick={onBackToDashboard}
            className="px-6 py-2.5 text-xs font-medium text-white bg-[#2C2926] hover:bg-[#1A1816] rounded-xl transition-colors cursor-pointer"
          >
            Volver a Mi Espacio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Bar with countdown & autosave */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#2C2926]/10">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-[#2C2926]/60 hover:text-[#2C2926] flex items-center gap-1 mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Mi Espacio</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-serif text-[#2C2926]">
            Diagnóstico de tu Espacio
          </h1>
          <p className="text-xs text-[#2C2926]/70 mt-0.5">
            "Tomate tu tiempo. Esta parte es importante para entender cómo vivís tu casa."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4EFEB] text-xs text-[#2C2926] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#B86B52]" />
            <span>{remainingTime.text}</span>
          </div>

          <button
            onClick={() => triggerSave(false)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2C2926]/15 bg-white text-xs font-medium text-[#2C2926] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#2C2926]/70" />
            <span>{isSaving ? 'Guardando...' : saveSuccessMsg ? '✓ Guardado' : 'Guardar borrador'}</span>
          </button>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, label: 'Rutinas' },
          { num: 2, label: 'El Espacio' },
          { num: 3, label: 'Estilos & PDF' },
          { num: 4, label: 'Presupuesto' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => {
              setCurrentStep(s.num);
              setIsReviewMode(false);
            }}
            className={`py-2 px-1 text-center border-b-2 text-xs transition-colors cursor-pointer ${
              currentStep === s.num && !isReviewMode
                ? 'border-[#B86B52] font-semibold text-[#2C2926]'
                : 'border-transparent text-[#2C2926]/50 hover:text-[#2C2926]'
            }`}
          >
            <span className="hidden sm:inline">Paso {s.num}: </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Content Form Steps */}
      {!isReviewMode ? (
        <div className="bg-white rounded-2xl border border-[#2C2926]/10 p-6 md:p-8 shadow-xs space-y-6">
          {/* STEP 1: RUTINAS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-serif text-[#2C2926]">
                  1. Tu Casa & Tus Rutinas
                </h2>
                <p className="text-xs text-[#2C2926]/70 mt-1">
                  Queremos saber quiénes habitan el espacio y qué sucede habitualmente a lo largo del día.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2926] mb-1.5">
                  ¿Quiénes viven en la casa? (Mascotas, edades de convivientes, si hacen home office)
                </label>
                <textarea
                  rows={3}
                  value={answers.livingRoutine || ''}
                  onChange={(e) => setAnswers({ ...answers, livingRoutine: e.target.value })}
                  placeholder="Ej: Somos 2 personas y una perra. Trabajamos 3 días en casa y nos gusta invitar amigos los fines de semana..."
                  className="w-full p-3 text-xs rounded-xl border border-[#2C2926]/20 bg-[#FAF8F5] focus:outline-none focus:border-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2926] mb-1.5">
                  ¿Qué es lo que hoy más te molesta o no funciona en este espacio?
                </label>
                <textarea
                  rows={3}
                  value={answers.mainPainPoints || ''}
                  onChange={(e) => setAnswers({ ...answers, mainPainPoints: e.target.value })}
                  placeholder="Ej: Falta lugar para dejar mochilas al entrar, la mesa de comedor tapa el paso y la luz de noche es muy blanca..."
                  className="w-full p-3 text-xs rounded-xl border border-[#2C2926]/20 bg-[#FAF8F5] focus:outline-none focus:border-[#2C2926]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2926] mb-1.5">
                  Mobiliario u objetos existentes que querés conservar sí o sí:
                </label>
                <input
                  type="text"
                  value={answers.existingFurniture || ''}
                  onChange={(e) => setAnswers({ ...answers, existingFurniture: e.target.value })}
                  placeholder="Ej: Sillón de 3 cuerpos gris, mesa ratona de madera heredada."
                  className="w-full p-3 text-xs rounded-xl border border-[#2C2926]/20 bg-[#FAF8F5] focus:outline-none focus:border-[#2C2926]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: EL ESPACIO, MEDIDAS Y FOTOS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-serif text-[#2C2926]">
                  2. El Espacio a Transformar
                </h2>
                <p className="text-xs text-[#2C2926]/70 mt-1">
                  Subí fotos sacadas desde las 4 esquinas del ambiente y cualquier plano o croquis con medidas que tengas a mano.
                </p>
              </div>

              {/* Photos upload area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#2C2926]">
                    Fotos actuales del ambiente ({uploadedPhotos.length} cargadas)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="text-xs text-[#B86B52] hover:underline font-medium cursor-pointer"
                  >
                    + Cargar foto de prueba
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {uploadedPhotos.map((ph, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-[#2C2926]/10 aspect-4/3 group">
                      <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-[10px] text-white">
                        {ph.room}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="border-2 border-dashed border-[#2C2926]/20 rounded-xl aspect-4/3 flex flex-col items-center justify-center p-3 text-center hover:bg-[#FAF8F5] transition-colors cursor-pointer text-[#2C2926]/60"
                  >
                    <Image className="w-5 h-5 mb-1" />
                    <span className="text-[11px]">Subir foto</span>
                  </button>
                </div>
              </div>

              {/* Plans upload area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#2C2926]">
                    Planos o croquis en servilleta con medidas ({uploadedPlans.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSamplePlan}
                    className="text-xs text-[#B86B52] hover:underline font-medium cursor-pointer"
                  >
                    + Cargar croquis / plano
                  </button>
                </div>

                <div className="space-y-2">
                  {uploadedPlans.map((pl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#2C2926]/10 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#B86B52]" />
                        <span className="font-medium text-[#2C2926]">{pl.name}</span>
                        <span className="text-[10px] text-[#2C2926]/50">({pl.size})</span>
                      </div>
                      <span className="text-[11px] text-[#68735C]">Cargado</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PDF DE ESTILOS & REFERENCIAS INTERACTIVAS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-serif text-[#2C2926]">
                  3. Referencias Visuales & Estilos Favoritos
                </h2>
                <p className="text-xs text-[#2C2926]/70 mt-1">
                  Hacé clic en los estilos y paletas que más resuenen con vos. Euge los utilizará como punto de partida para tu moodboard.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styles.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <div
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`rounded-xl border overflow-hidden transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#B86B52] ring-2 ring-[#B86B52]/20 shadow-xs'
                          : 'border-[#2C2926]/10 hover:border-[#2C2926]/30'
                      }`}
                    >
                      <div className="aspect-16/9 relative overflow-hidden bg-[#FAF8F5]">
                        <img
                          src={style.imageUrl}
                          alt={style.title}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-[#B86B52] text-white p-1 rounded-full shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white">
                        <div className="text-[10px] uppercase font-semibold text-[#B86B52]">
                          {style.category}
                        </div>
                        <h4 className="text-xs font-semibold text-[#2C2926] mt-0.5">
                          {style.title}
                        </h4>
                        <p className="text-[11px] text-[#2C2926]/70 mt-1">
                          {style.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {style.tags.map((t, i) => (
                            <span key={i} className="text-[10px] text-[#2C2926]/60">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PRESUPUESTO & PRIORIDADES */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-serif text-[#2C2926]">
                  4. Presupuesto & Prioridades de Compra
                </h2>
                <p className="text-xs text-[#2C2926]/70 mt-1">
                  Esto nos permite sugerirte piezas que realmente puedas adquirir en los próximos meses, sin falsas expectativas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2926] mb-1.5">
                  Rango estimado de presupuesto para equipamiento y compras:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'bajo', label: 'Económico / Low-cost', sub: 'Muebles estándar y cambios cosméticos' },
                    { id: 'medio', label: 'Medio / Equilibrado', sub: 'Combinación de diseño con muebles accesibles' },
                    { id: 'alto', label: 'Inversión completa', sub: 'Maderas nobles, iluminación curada y muebles a medida' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setAnswers({ ...answers, budgetTier: b.id })}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                        answers.budgetTier === b.id
                          ? 'border-[#2C2926] bg-[#FAF8F5]'
                          : 'border-[#2C2926]/10 hover:border-[#2C2926]/30'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#2C2926]">{b.label}</div>
                      <div className="text-[10px] text-[#2C2926]/60 mt-0.5">{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2926] mb-1.5">
                  ¿Cuál sería la prioridad número 1 a resolver en el Meet?
                </label>
                <input
                  type="text"
                  value={answers.topPriority || ''}
                  onChange={(e) => setAnswers({ ...answers, topPriority: e.target.value })}
                  placeholder="Ej: Definir la ubicación del sillón y el color de las paredes..."
                  className="w-full p-3 text-xs rounded-xl border border-[#2C2926]/20 bg-[#FAF8F5] focus:outline-none focus:border-[#2C2926]"
                />
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#2C2926]/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-xs font-medium text-[#2C2926] hover:bg-[#FAF8F5] rounded-lg border border-[#2C2926]/15 transition-colors cursor-pointer"
              >
                Anterior
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  triggerSave(false);
                  setCurrentStep(currentStep + 1);
                }}
                className="px-5 py-2 text-xs font-medium text-white bg-[#2C2926] hover:bg-[#1A1816] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerSave(false);
                  setIsReviewMode(true);
                }}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#B86B52] hover:bg-[#98513B] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Revisar respuestas antes de enviar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Section 17: Review before submit */
        <div className="bg-white rounded-2xl border border-[#2C2926]/10 p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs uppercase font-semibold text-[#B86B52]">
              Antes de enviar
            </span>
            <h2 className="text-2xl font-serif text-[#2C2926] mt-1">
              Revisá tus respuestas con atención.
            </h2>
            <p className="text-xs text-[#2C2926]/70 mt-1">
              Al hacer clic en "Enviar formulario definitivo", las respuestas se bloquearán para que Euge comience a preparar el análisis previo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#2C2926]/10 space-y-3 text-xs">
            <div>
              <strong className="text-[#2C2926] block">Convivencia y Rutinas:</strong>
              <p className="text-[#2C2926]/80">{answers.livingRoutine || 'Sin completar'}</p>
            </div>
            <div>
              <strong className="text-[#2C2926] block">Puntos de Fricción actuales:</strong>
              <p className="text-[#2C2926]/80">{answers.mainPainPoints || 'Sin completar'}</p>
            </div>
            <div>
              <strong className="text-[#2C2926] block">Mobiliario a conservar:</strong>
              <p className="text-[#2C2926]/80">{answers.existingFurniture || 'Ninguno especificado'}</p>
            </div>
            <div>
              <strong className="text-[#2C2926] block">Estilos seleccionados:</strong>
              <p className="text-[#2C2926]/80">{selectedStyles.length} estilos elegidos del catálogo</p>
            </div>
            <div>
              <strong className="text-[#2C2926] block">Archivos adjuntados:</strong>
              <p className="text-[#2C2926]/80">{uploadedPhotos.length} fotos y {uploadedPlans.length} planos/croquis</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#2C2926]/10">
            <button
              type="button"
              onClick={() => setIsReviewMode(false)}
              className="px-4 py-2 text-xs font-medium text-[#2C2926] hover:bg-[#FAF8F5] rounded-lg border border-[#2C2926]/15 transition-colors cursor-pointer"
            >
              Volver a editar respuestas
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2C2926] hover:bg-[#1A1816] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Enviando y notificando a Euge...' : 'Confirmar y Enviar a Euge'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
