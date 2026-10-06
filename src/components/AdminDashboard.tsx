import React, { useState } from 'react';
import { Project, ProjectStatus, StudioSettings, FunnelAbandonmentEvent } from '../types';
import { formatARS, formatFriendlyDate, getRemainingTimeString } from '../utils/dateUtils';
import { Filter, Clock, CheckSquare, Sparkles, MessageSquare, Plus, FileText, ArrowRight, Save, UserCheck, AlertTriangle, ChevronRight, Video, Upload, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

interface AdminDashboardProps {
  projects: Project[];
  settings: StudioSettings;
  abandonments: FunnelAbandonmentEvent[];
  onProjectUpdated: (updatedProject: Project) => void;
  onNavigateSettings: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  settings,
  abandonments,
  onProjectUpdated,
  onNavigateSettings,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'checklist' | 'time' | 'ai' | 'notes' | 'crm'>('checklist');

  // Time logging
  const [newLogHours, setNewLogHours] = useState<number>(1);

  // New Note
  const [newNoteText, setNewNoteText] = useState<string>('');

  // AI draft states
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiType, setAiType] = useState<string>('');
  const [meetingTranscriptInput, setMeetingTranscriptInput] = useState<string>('');

  // Publish Deliverable modal state
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [delivTitle, setDelivTitle] = useState<string>('');
  const [delivVersion, setDelivVersion] = useState<string>('1.0');
  const [delivPdfUrl, setDelivPdfUrl] = useState<string>('');
  const [delivVideoUrl, setDelivVideoUrl] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Filters
  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === 'todos') return true;
    if (selectedFilter === 'formulario_pendiente') return p.status === 'formulario_pendiente';
    if (selectedFilter === 'meet_proximo') return p.status === 'asesoria_agendada';
    if (selectedFilter === 'analisis') return ['analisis_previo', 'formulario_completo'].includes(p.status);
    if (selectedFilter === 'asesoria') return p.serviceType === 'asesoria';
    if (selectedFilter === 'diseno') return p.serviceType === 'diseno_integral';
    if (selectedFilter === 'modificacion') return p.status === 'devolucion_pendiente' || p.status === 'modificaciones_en_proceso';
    if (selectedFilter === 'finalizados') return p.status === 'finalizado' || p.status === 'diseno_confirmado';
    return true;
  });

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!currentProject) return;
    try {
      const updated = await api.updateProject(currentProject.id, {
        status: newStatus,
        currentStepLabel: newStatus.replace(/_/g, ' ').toUpperCase(),
      });
      onProjectUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!currentProject) return;
    const tasks = currentProject.internalTasks.map(t => {
      if (t.id === taskId) {
        return { ...t, isCompleted: !t.isCompleted, completedAt: !t.isCompleted ? new Date().toISOString() : undefined };
      }
      return t;
    });

    const updated = await api.updateProject(currentProject.id, { internalTasks: tasks });
    onProjectUpdated(updated);
  };

  const handleLogHours = async () => {
    if (!currentProject || !newLogHours) return;
    const total = (currentProject.loggedHours || 0) + Number(newLogHours);
    const updated = await api.updateProject(currentProject.id, { loggedHours: total });
    onProjectUpdated(updated);
    setNewLogHours(1);
  };

  const handleAddNote = async () => {
    if (!currentProject || !newNoteText.trim()) return;
    const notes = [newNoteText.trim(), ...(currentProject.internalNotes || [])];
    const updated = await api.updateProject(currentProject.id, { internalNotes: notes });
    onProjectUpdated(updated);
    setNewNoteText('');
  };

  // AI Helpers
  const runAiSummarizeForm = async () => {
    if (!currentProject?.formProgress) {
      alert('El cliente aún no ha completado el formulario');
      return;
    }
    setAiLoading(true);
    setAiType('form');
    try {
      const res = await api.summarizeForm(currentProject.formProgress.answers, currentProject.clientName);
      setAiResult(res);
    } finally {
      setAiLoading(false);
    }
  };

  const runAiSummarizeMeeting = async () => {
    if (!meetingTranscriptInput.trim()) {
      alert('Ingresá las notas o transcripción de la reunión');
      return;
    }
    setAiLoading(true);
    setAiType('meet');
    try {
      const res = await api.summarizeMeeting(meetingTranscriptInput, currentProject.clientName);
      setAiResult(res);
    } finally {
      setAiLoading(false);
    }
  };

  const runAiSummarizeFeedback = async () => {
    if (!currentProject?.comments || currentProject.comments.length === 0) {
      alert('No hay comentarios de devolución cargados por el cliente');
      return;
    }
    setAiLoading(true);
    setAiType('feedback');
    try {
      const res = await api.summarizeFeedback(currentProject.comments);
      setAiResult(res);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiIdeaRectoraToNotes = async () => {
    if (!aiResult?.draftIdearectora || !currentProject) return;
    const note = `[IDEA RECTORA IA REVISADA POR EUGE]: ${aiResult.draftIdearectora}`;
    const notes = [note, ...(currentProject.internalNotes || [])];
    const updated = await api.updateProject(currentProject.id, { internalNotes: notes });
    onProjectUpdated(updated);
    alert('Idea rectora incorporada a las notas internas del proyecto.');
  };

  const handlePublishDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    setIsPublishing(true);
    try {
      const updated = await api.publishDeliverable(currentProject.id, {
        title: delivTitle || `Dossier de ${currentProject.serviceType === 'asesoria' ? 'Asesoría' : 'Diseño'} v${delivVersion}`,
        version: delivVersion || '1.0',
        pdfDownloadUrl: delivPdfUrl || '/src/assets/images/deliverable_preview_sample_1790705553160.jpg',
        videoRecorridoUrl: delivVideoUrl || undefined,
        videoTitle: 'Video de recorrido explicativo de la propuesta',
      });
      onProjectUpdated(updated);
      setShowPublishModal(false);
      setDelivTitle('');
      setDelivPdfUrl('');
      setDelivVideoUrl('');
      alert('¡Entregable publicado exitosamente! El cliente ya puede descargarlo desde su espacio privado.');
    } catch (err: any) {
      alert(err.message || 'Error al publicar entregable');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#d9d1c5]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1c2120] bg-[#fed767] px-2.5 py-0.5 rounded-full">
              ADMIN EXCLUSIVO
            </span>
            <span className="text-xs text-[#1c2120]/40">·</span>
            <span className="text-xs font-bold text-[#1c2120]/70">Panel Interno de Euge</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-[#1c2120] mt-1">
            Gestión de Proyectos & Entregables
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
              activeTab === 'crm' ? 'bg-[#1c2120] text-white border-[#1c2120]' : 'bg-white border-[#d9d1c5] text-[#1c2120] hover:bg-[#FAF8F5]'
            }`}
          >
            Embudo & Abandonos ({abandonments.length})
          </button>

          <button
            onClick={onNavigateSettings}
            className="px-4 py-2.5 text-xs font-bold text-[#1c2120] bg-white border border-[#d9d1c5] hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
          >
            Configurar Precios & Términos
          </button>
        </div>
      </div>

      {activeTab === 'crm' ? (
        /* CRM / Funnel View */
        <div className="bg-white rounded-3xl border border-[#d9d1c5] p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-[#1c2120]">
                Registro de Embudo y Leads
              </h2>
              <p className="text-xs text-[#1c2120]/60 mt-0.5">
                Seguimiento de personas que calcularon un valor o solicitaron resumen por WhatsApp.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('checklist')}
              className="text-xs font-bold text-[#1c2120] underline cursor-pointer"
            >
              ← Volver a proyectos
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#d9d1c5]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#d9d1c5] text-[#1c2120]/70 font-bold">
                <tr>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Etapa</th>
                  <th className="py-3 px-4">Servicio & m²</th>
                  <th className="py-3 px-4">Detalle / Notas</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9d1c5]/60 text-[#1c2120]/80">
                {abandonments.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#FAF8F5]/50">
                    <td className="py-3 px-4 text-[#1c2120]/50">{formatFriendlyDate(ev.abandonedAt)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1c2120]">{ev.name || 'Sin nombre'}</div>
                      <div className="text-[11px] text-[#1c2120]/60">{ev.email || 'Sin email'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-[#fed767]/30 text-[#1c2120] border border-[#fed767] text-[10px] font-bold">
                        {ev.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="capitalize font-semibold">{ev.serviceType.replace('_', ' ')}</div>
                      {ev.squareMeters && <div className="text-[10px] text-[#1c2120]/50">{ev.squareMeters} m²</div>}
                    </td>
                    <td className="py-3 px-4 text-[11px] max-w-xs">{ev.notes || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      {ev.email && (
                        <a
                          href={`mailto:${ev.email}?subject=Método%20CASA%20—%20Tu%20proyecto%20de%20interiorismo`}
                          className="text-xs text-[#1c2120] hover:underline font-bold"
                        >
                          Escribir
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Multi-column layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Projects Filter & List */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#d9d1c5] p-5 shadow-xs space-y-4">
            <div className="space-y-1.5 pb-3 border-b border-[#d9d1c5]">
              <div className="text-[11px] uppercase font-bold text-[#1c2120]/50">
                Filtrar Proyectos
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'formulario_pendiente', label: 'Form. pendiente' },
                  { id: 'meet_proximo', label: 'Meet próximo' },
                  { id: 'analisis', label: 'En análisis' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedFilter === f.id
                        ? 'bg-[#fed767] text-[#1c2120]'
                        : 'bg-[#FAF8F5] text-[#1c2120]/60 hover:text-[#1c2120]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    currentProject?.id === p.id
                      ? 'border-[#1c2120] bg-[#fed767]/20 shadow-xs'
                      : 'border-[#d9d1c5] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1c2120]">{p.clientName}</span>
                    <span className="text-[10px] font-semibold text-[#1c2120]/60 capitalize">{p.serviceType.replace('_', ' ')}</span>
                  </div>
                  <div className="text-xs text-[#1c2120]/80 truncate mt-0.5">{p.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-[#1c2120]/50 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#d9d1c5] text-[10px] font-semibold text-[#1c2120]">
                      {p.currentStepLabel}
                    </span>
                    <span>{formatFriendlyDate(p.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Project Detail Panel */}
          {currentProject && (
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#d9d1c5] p-6 md:p-8 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d9d1c5]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1c2120] uppercase tracking-wider">
                      {currentProject.clientName}
                    </span>
                    <span className="text-xs text-[#1c2120]/40">·</span>
                    <span className="text-xs text-[#1c2120]/60">{currentProject.clientEmail}</span>
                  </div>
                  <h2 className="text-xl font-heading font-extrabold text-[#1c2120] mt-0.5">
                    {currentProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Publicar / Subir Láminas PDF</span>
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5] space-y-2">
                <label className="block text-xs font-bold text-[#1c2120]">
                  Estado del Proyecto:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'formulario_pendiente',
                    'formulario_completo',
                    'analisis_previo',
                    'asesoria_agendada',
                    'asesoria_en_preparacion',
                    'asesoria_entregada',
                    'diseno_en_proceso',
                    'diseno_entregado',
                    'devolucion_pendiente',
                    'modificaciones_en_proceso',
                    'diseno_confirmado',
                    'finalizado'
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st as ProjectStatus)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        currentProject.status === st
                          ? 'bg-[#1c2120] text-white border-[#1c2120]'
                          : 'bg-white border-[#d9d1c5] text-[#1c2120]/70 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtabs for Euge: Checklist, Time, AI Helper, Notes */}
              <div className="flex border-b border-[#d9d1c5] gap-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'checklist' ? 'border-b-2 border-[#fed767] text-[#1c2120]' : 'text-[#1c2120]/50'
                  }`}
                >
                  Checklist Interno ({currentProject.internalTasks?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('time')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'time' ? 'border-b-2 border-[#fed767] text-[#1c2120]' : 'text-[#1c2120]/50'
                  }`}
                >
                  Horas Dedicadas ({currentProject.loggedHours || 0} hs)
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'ai' ? 'border-b-2 border-[#fed767] text-[#1c2120]' : 'text-[#1c2120]/50'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#fed767]" />
                  <span>Asistente IA para Euge</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 transition-colors cursor-pointer ${
                    activeTab === 'notes' ? 'border-b-2 border-[#fed767] text-[#1c2120]' : 'text-[#1c2120]/50'
                  }`}
                >
                  Notas Privadas ({currentProject.internalNotes?.length || 0})
                </button>
              </div>

              {/* Tab 1: Checklist */}
              {activeTab === 'checklist' && (
                <div className="space-y-3">
                  {(currentProject.internalTasks || []).map((t) => (
                    <label key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] cursor-pointer hover:bg-white text-xs">
                      <input
                        type="checkbox"
                        checked={t.isCompleted}
                        onChange={() => handleToggleTask(t.id)}
                        className="rounded border-[#d9d1c5] text-[#1c2120] focus:ring-[#fed767]"
                      />
                      <span className={t.isCompleted ? 'line-through text-[#1c2120]/50' : 'font-semibold text-[#1c2120]'}>
                        {t.title}
                      </span>
                      {t.completedAt && (
                        <span className="text-[10px] text-emerald-700 ml-auto">
                          Completado el {formatFriendlyDate(t.completedAt)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* Tab 2: Time tracking */}
              {activeTab === 'time' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#1c2120]/60">Total de horas registradas:</div>
                      <div className="text-2xl font-mono font-bold text-[#1c2120]">{currentProject.loggedHours || 0} hs</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={newLogHours}
                        onChange={(e) => setNewLogHours(Number(e.target.value))}
                        className="w-20 px-2 py-1.5 text-xs rounded-xl border border-[#d9d1c5] bg-white font-mono"
                      />
                      <button
                        onClick={handleLogHours}
                        className="px-4 py-1.5 rounded-xl bg-[#1c2120] text-white text-xs font-bold hover:bg-[#2a3130] cursor-pointer"
                      >
                        + Sumar Horas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: AI Assistant for Euge */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={runAiSummarizeForm}
                      disabled={aiLoading}
                      className="px-3.5 py-2 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {aiLoading && aiType === 'form' ? 'Sintetizando...' : 'Sintetizar Diagnóstico con IA'}
                    </button>
                    <button
                      onClick={runAiSummarizeFeedback}
                      disabled={aiLoading}
                      className="px-3.5 py-2 rounded-xl bg-[#1c2120] hover:bg-[#2a3130] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {aiLoading && aiType === 'feedback' ? 'Analizando...' : 'Clasificar Devolución del Cliente'}
                    </button>
                  </div>

                  {aiResult && (
                    <div className="p-4 rounded-2xl bg-[#fed767]/20 border border-[#fed767] space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1c2120]">Borrador Asistido por Gemini:</span>
                        <button
                          onClick={applyAiIdeaRectoraToNotes}
                          className="text-[11px] font-bold text-[#1c2120] underline cursor-pointer"
                        >
                          Guardar en Notas de Euge
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-[#1c2120]/85 bg-white/80 p-3 rounded-xl border border-[#fed767]">
                        {JSON.stringify(aiResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Private Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Escribir nota interna privada de Euge..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-5 py-2 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-xl cursor-pointer"
                    >
                      Guardar nota
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(currentProject.internalNotes || []).map((note, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] text-xs text-[#1c2120]">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal for Euge to publish deliverable (Laminas PDF & Video de Recorrido externos) */}
      {showPublishModal && currentProject && (
        <div className="fixed inset-0 z-50 bg-[#1c2120]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#d9d1c5] max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 tracking-wider">
                Publicar Entregable de Estudio
              </span>
              <h3 className="text-xl font-heading font-extrabold text-[#1c2120]">
                Subir Láminas PDF & Video de Recorrido
              </h3>
              <p className="text-xs text-[#1c2120]/75 mt-0.5">
                Para {currentProject.clientName} ({currentProject.title}). Los entregables se diseñan externamente por Euge y se publican acá para el cliente.
              </p>
            </div>

            <form onSubmit={handlePublishDeliverable} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1c2120] mb-1">
                  Título del Dossier
                </label>
                <input
                  type="text"
                  required
                  value={delivTitle}
                  onChange={(e) => setDelivTitle(e.target.value)}
                  placeholder={`Dossier de ${currentProject.serviceType === 'asesoria' ? 'Asesoría' : 'Diseño'} v${delivVersion}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1c2120] mb-1">
                    Versión
                  </label>
                  <input
                    type="text"
                    required
                    value={delivVersion}
                    onChange={(e) => setDelivVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] font-mono text-[#1c2120]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1c2120] mb-1">
                    Plazo de Devolución
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#d9d1c5] text-[#1c2120]/70 font-semibold">
                    10 días hábiles
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1c2120] mb-1">
                  URL del Archivo PDF de Láminas (Google Drive, Dropbox, Cloud, etc.)
                </label>
                <input
                  type="text"
                  value={delivPdfUrl}
                  onChange={(e) => setDelivPdfUrl(e.target.value)}
                  placeholder="https://drive.google.com/... o /archivo.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                />
                <span className="text-[10px] text-[#1c2120]/50 mt-1 block">
                  (Si lo dejás vacío, utilizará la lámina modelo del estudio).
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#1c2120] mb-1">
                  URL del Video de Recorrido Explicativo (Loom, YouTube, Vimeo, Drive)
                </label>
                <input
                  type="url"
                  value={delivVideoUrl}
                  onChange={(e) => setDelivVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/... o https://loom.com/share/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d9d1c5]">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2.5 rounded-xl text-[#1c2120]/70 hover:text-[#1c2120] font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isPublishing ? 'Publicando...' : 'Publicar y Habilitar en Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
