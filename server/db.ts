import fs from 'fs';
import path from 'path';
import { Project, User, StudioSettings, StyleReference, FunnelAbandonmentEvent, ClientComment, ModificationRequest, DeliverableVersion } from '../src/types';
import { INITIAL_PROJECTS, INITIAL_SETTINGS, INITIAL_USERS, INITIAL_STYLE_REFERENCES, INITIAL_ABANDONMENT_EVENTS } from './mockData';
import { canRescheduleAppointment, isAtLeastNoticeHoursAhead, getNowInArgentina, addCalendarDays, addBusinessDays } from '../src/utils/dateUtils';

interface DatabaseSchema {
  users: User[];
  projects: Project[];
  settings: StudioSettings;
  styleReferences: StyleReference[];
  abandonmentEvents: FunnelAbandonmentEvent[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error reading store.json, initializing from defaults', e);
    }

    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      projects: INITIAL_PROJECTS,
      settings: INITIAL_SETTINGS,
      styleReferences: INITIAL_STYLE_REFERENCES,
      abandonmentEvents: INITIAL_ABANDONMENT_EVENTS,
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving store.json', e);
    }
  }

  // USERS
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  createUser(name: string, email: string, phone = ''): User {
    const existing = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role: 'client'
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // PROJECTS with STRICT CLIENT ISOLATION
  getProjects(userId: string, role: string): Project[] {
    if (role === 'admin') {
      return this.data.projects;
    }
    // Strict client isolation: client only sees their own projects
    return this.data.projects.filter(p => p.clientId === userId);
  }

  getProjectById(projectId: string, userId: string, role: string): Project | null {
    const project = this.data.projects.find(p => p.id === projectId);
    if (!project) return null;

    if (role !== 'admin' && project.clientId !== userId) {
      // Permission denied
      const error: any = new Error('Acceso no autorizado: No podés ver proyectos pertenecientes a otro cliente.');
      error.status = 403;
      throw error;
    }
    return project;
  }

  createProject(projectData: Partial<Project>, actorName = 'Sistema'): Project {
    const id = projectData.id || `proj_${Date.now()}`;
    const nowIso = getNowInArgentina().toISOString();

    const newProject: Project = {
      id,
      clientId: projectData.clientId || 'user_guest',
      clientName: projectData.clientName || 'Cliente',
      clientEmail: projectData.clientEmail || '',
      clientPhone: projectData.clientPhone || '',
      serviceType: projectData.serviceType || 'asesoria',
      title: projectData.title || 'Nuevo Proyecto de Interiorismo',
      spacesSummary: projectData.spacesSummary || 'Espacio por definir',
      squareMeters: projectData.squareMeters || 20,
      status: projectData.status || 'pendiente_pago',
      currentStepLabel: projectData.currentStepLabel || 'Inicio del proceso',
      nextActionLabel: projectData.nextActionLabel || 'Completar pago',
      nextActionRole: projectData.nextActionRole || 'client',
      createdAt: nowIso,
      updatedAt: nowIso,
      quote: projectData.quote,
      payment: projectData.payment,
      appointment: projectData.appointment,
      formProgress: projectData.formProgress,
      deliverables: projectData.deliverables || [],
      currentVersionIndex: projectData.currentVersionIndex ?? -1,
      comments: projectData.comments || [],
      modificationRequests: projectData.modificationRequests || [],
      internalTasks: projectData.internalTasks || [
        { id: `t_${Date.now()}_1`, title: 'Verificar acreditación de pago', isCompleted: false },
        { id: `t_${Date.now()}_2`, title: 'Enviar formulario de diagnóstico', isCompleted: false },
      ],
      internalNotes: projectData.internalNotes || [],
      estimatedHours: projectData.estimatedHours || 15,
      loggedHours: 0,
      activityHistory: [
        {
          id: `act_${Date.now()}`,
          date: nowIso,
          title: 'Proyecto creado',
          description: `Se inició el proceso para ${projectData.title}`,
          actor: actorName,
          category: 'reserva',
          isPublicForClient: true
        }
      ]
    };

    this.data.projects.unshift(newProject);
    this.saveData();
    return newProject;
  }

  updateProject(projectId: string, updateData: Partial<Project>, userId: string, role: string, actorName = 'Euge'): Project {
    const project = this.getProjectById(projectId, userId, role);
    if (!project) throw new Error('Proyecto no encontrado');

    const index = this.data.projects.findIndex(p => p.id === projectId);
    const updated = {
      ...project,
      ...updateData,
      updatedAt: getNowInArgentina().toISOString()
    };

    this.data.projects[index] = updated;
    this.saveData();
    return updated;
  }

  // APPOINTMENT RESCHEDULING (Reglas de negocio: min 24h aviso, max 2 veces, nueva fecha min 72h)
  rescheduleAppointment(projectId: string, newDate: string, newTime: string, reason = '', userId: string, role: string): Project {
    const project = this.getProjectById(projectId, userId, role);
    if (!project || !project.appointment) throw new Error('No existe una cita activa para este proyecto');

    const appointment = project.appointment;

    // Regla 1: Máximo 2 reprogramaciones
    if (appointment.rescheduledCount >= this.data.settings.maxReschedulesAllowed) {
      throw new Error(`Se ha alcanzado el límite máximo de ${this.data.settings.maxReschedulesAllowed} reprogramaciones permitidas.`);
    }

    // Regla 2: Mínimo 24 horas de anticipación respecto al horario original
    const rescheduleCheck = canRescheduleAppointment(appointment.date, appointment.time, this.data.settings.minRescheduleNoticeHours);
    if (!rescheduleCheck.allowed && role !== 'admin') {
      throw new Error(rescheduleCheck.reason || 'No es posible reprogramar con menos de 24 horas de anticipación.');
    }

    // Regla 3: La nueva fecha debe ser al menos 72h a futuro
    if (!isAtLeastNoticeHoursAhead(newDate, newTime, this.data.settings.servicePrices.asesoria.minNoticeHours) && role !== 'admin') {
      throw new Error(`La nueva fecha seleccionada debe contar con un mínimo de ${this.data.settings.servicePrices.asesoria.minNoticeHours} horas de anticipación.`);
    }

    const previousDate = appointment.date;
    const previousTime = appointment.time;

    appointment.rescheduleHistory.push({
      previousDate,
      previousTime,
      newDate,
      newTime,
      reason,
      timestamp: getNowInArgentina().toISOString()
    });

    appointment.date = newDate;
    appointment.time = newTime;
    appointment.rescheduledCount += 1;
    appointment.status = 'reprogramada';

    // Activity log
    project.activityHistory.unshift({
      id: `act_${Date.now()}`,
      date: getNowInArgentina().toISOString(),
      title: 'Reunión reprogramada',
      description: `Se movió del ${previousDate} ${previousTime} hs al ${newDate} ${newTime} hs. Motivo: ${reason || 'Solicitud del cliente'}.`,
      actor: project.clientName,
      category: 'meet',
      isPublicForClient: true
    });

    this.saveData();
    return project;
  }

  // FORM PROGRESS & AUTOSAVE
  saveFormProgress(projectId: string, answers: Record<string, any>, selectedStyles: string[], customInspirations: any[], uploadedPlans: any[], uploadedPhotos: any[], isFinalSubmission: boolean, userId: string, role: string): Project {
    const project = this.getProjectById(projectId, userId, role);
    if (!project) throw new Error('Proyecto no encontrado');

    const nowIso = getNowInArgentina().toISOString();

    if (!project.formProgress) {
      project.formProgress = {
        startedAt: nowIso,
        expiresAt: addCalendarDays(getNowInArgentina(), 3).toISOString(),
        isLocked: false,
        percentage: 0,
        lastSavedAt: nowIso,
        answers: {},
        selectedStyles: [],
        customInspirations: [],
        uploadedPlans: [],
        uploadedPhotos: [],
      };
    }

    if (project.formProgress.isLocked && !isFinalSubmission && role !== 'admin') {
      throw new Error('El formulario ya fue enviado y se encuentra bloqueado para edición.');
    }

    project.formProgress.answers = { ...project.formProgress.answers, ...answers };
    project.formProgress.selectedStyles = selectedStyles || project.formProgress.selectedStyles;
    project.formProgress.customInspirations = customInspirations || project.formProgress.customInspirations;
    project.formProgress.uploadedPlans = uploadedPlans || project.formProgress.uploadedPlans;
    project.formProgress.uploadedPhotos = uploadedPhotos || project.formProgress.uploadedPhotos;
    project.formProgress.lastSavedAt = nowIso;

    // Calculate approximate percentage
    const keys = Object.keys(project.formProgress.answers);
    const pct = Math.min(100, Math.round((keys.length / 5) * 100));
    project.formProgress.percentage = pct;

    if (isFinalSubmission) {
      project.formProgress.isLocked = true;
      project.formProgress.submittedAt = nowIso;
      project.formProgress.percentage = 100;
      project.status = 'formulario_completo';
      project.currentStepLabel = 'Formulario completado';
      project.nextActionLabel = 'Análisis previo del estudio y preparación del Meet';
      project.nextActionRole = 'admin';

      // Internal task for Euge
      project.internalTasks.unshift({
        id: `t_${Date.now()}`,
        title: 'Análisis previo: revisar respuestas, fotos y planos cargados',
        isCompleted: false,
        estimatedHours: project.squareMeters <= 16 ? 1 : (project.squareMeters <= 30 ? 1.5 : 2)
      });

      project.activityHistory.unshift({
        id: `act_${Date.now()}`,
        date: nowIso,
        title: 'Formulario de diagnóstico enviado',
        description: 'El cliente envió las respuestas y fotos de su espacio.',
        actor: project.clientName,
        category: 'formulario',
        isPublicForClient: true
      });
    }

    this.saveData();
    return project;
  }

  // ADD COMMENT TO DELIVERABLE PAGE
  addComment(projectId: string, pageNumber: number, text: string, authorName: string, isClient: boolean, userId: string, role: string): ClientComment {
    const project = this.getProjectById(projectId, userId, role);
    if (!project) throw new Error('Proyecto no encontrado');

    const newComment: ClientComment = {
      id: `comm_${Date.now()}`,
      pageNumber,
      authorName,
      isClient,
      text,
      createdAt: getNowInArgentina().toISOString(),
      status: 'pendiente'
    };

    if (!project.comments) {
      project.comments = [];
    }
    project.comments.push(newComment);
    this.saveData();
    return newComment;
  }

  // PUBLISH EXTERNAL DELIVERABLE (PDF & VIDEO DE RECORRIDO SUBIDO POR EUGE)
  addDeliverable(projectId: string, deliverableData: Partial<DeliverableVersion>, userId: string, role: string): Project {
    const project = this.getProjectById(projectId, userId, role);
    if (!project) throw new Error('Proyecto no encontrado');

    const now = getNowInArgentina();
    const version = deliverableData.version || `${project.deliverables.length + 1}.0`;
    const newDeliverable: DeliverableVersion = {
      version,
      deliveredAt: now.toISOString(),
      title: deliverableData.title || `Dossier de ${project.serviceType === 'asesoria' ? 'Asesoría' : 'Diseño'} v${version}`,
      description: deliverableData.description || 'Dossier en PDF y video explicativo de recorrido preparado por Euge.',
      pdfDownloadUrl: deliverableData.pdfDownloadUrl || '/src/assets/images/deliverable_preview_sample_1790705553160.jpg',
      pdfFileName: deliverableData.pdfFileName || `Dossier_${project.clientName.replace(/\s+/g, '_')}_v${version}.pdf`,
      videoRecorridoUrl: deliverableData.videoRecorridoUrl,
      videoTitle: deliverableData.videoTitle || 'Video de recorrido explicativo de la propuesta',
      feedbackDeadline: addBusinessDays(now, 10).toISOString(),
      feedbackDeadlineType: 'habiles',
      isLockedForFeedback: false,
    };

    project.deliverables.push(newDeliverable);
    project.currentVersionIndex = project.deliverables.length - 1;
    project.status = project.serviceType === 'asesoria' ? 'asesoria_entregada' : 'diseno_entregado';
    project.currentStepLabel = 'Entregable Disponible';
    project.nextActionLabel = project.serviceType === 'asesoria'
      ? 'Revisá tu dossier en PDF y video explicativo de Euge'
      : 'Revisá tu dossier en PDF y video de recorrido. Tenés 10 días hábiles para enviar tu devolución.';
    project.nextActionDeadline = newDeliverable.feedbackDeadline;
    project.deadlineType = 'habiles';

    // Si es Asesoría, activar el beneficio de crédito de 30 días corridos
    if (project.serviceType === 'asesoria') {
      project.creditBenefit = {
        originalProjectId: project.id,
        originalServiceName: 'Asesoría Online',
        amount: project.payment?.amount || 140000,
        grantedAt: now.toISOString(),
        expiresAt: addCalendarDays(now, this.data.settings.creditBenefitCalendarDays || 30).toISOString(),
        isExpired: false,
        isUsed: false
      };
    }

    project.activityHistory.unshift({
      id: `act_${Date.now()}`,
      date: now.toISOString(),
      title: `Entregable v${version} publicado`,
      description: `Euge subió el dossier PDF y video de recorrido para ${project.title}.`,
      actor: 'Euge',
      category: 'entrega',
      isPublicForClient: true
    });

    this.saveData();
    return project;
  }

  // SUBMIT CONSOLIDATED RETURN (10 Días Hábiles)
  submitModificationReturn(projectId: string, deliverableVersion: string, clientNotes = '', userId: string, role: string): ModificationRequest {
    const project = this.getProjectById(projectId, userId, role);
    if (!project) throw new Error('Proyecto no encontrado');

    const currentDeliverable = project.deliverables.find(d => d.version === deliverableVersion);
    if (!currentDeliverable) throw new Error('Versión de entregable no encontrada');

    // Regla de plazo de 10 días hábiles
    const now = getNowInArgentina();
    const deadline = new Date(currentDeliverable.feedbackDeadline);
    if (now.getTime() > deadline.getTime() && role !== 'admin') {
      throw new Error(`El plazo de 10 días hábiles para enviar devoluciones finalizó el ${currentDeliverable.feedbackDeadline}. Contactá a Euge para habilitar una extensión.`);
    }

    if (currentDeliverable.isLockedForFeedback && role !== 'admin') {
      throw new Error('La devolución ya fue formalizada anteriormente. El estudio cuenta con una (1) instancia de modificaciones.');
    }

    const modRequest: ModificationRequest = {
      id: `mod_${Date.now()}`,
      submittedAt: now.toISOString(),
      deliverableVersion,
      summaryText: `Devolución formalizada por el cliente para la versión ${deliverableVersion}.`,
      clientNotes,
      status: 'recibida'
    };

    project.modificationRequests.push(modRequest);
    currentDeliverable.isLockedForFeedback = true;
    currentDeliverable.feedbackSubmittedAt = now.toISOString();

    project.status = 'modificaciones_en_proceso';
    project.currentStepLabel = 'Modificaciones en proceso';
    project.nextActionLabel = 'Euge está aplicando tus devoluciones en la versión 2.0 (plazo: 5 días hábiles)';
    project.nextActionRole = 'admin';
    project.nextActionDeadline = addBusinessDays(now, 5).toISOString();
    project.deadlineType = 'habiles';

    // Add internal task
    project.internalTasks.unshift({
      id: `t_mod_${Date.now()}`,
      title: `Aplicar modificaciones solicitadas por el cliente en v${deliverableVersion}`,
      isCompleted: false,
      estimatedHours: 8
    });

    project.activityHistory.unshift({
      id: `act_${Date.now()}`,
      date: now.toISOString(),
      title: 'Devolución enviada por el cliente',
      description: `Se formalizó la instancia de modificaciones para la versión ${deliverableVersion}. Plazo de entrega de ajustes: 5 días hábiles.`,
      actor: project.clientName,
      category: 'devolucion',
      isPublicForClient: true
    });

    this.saveData();
    return modRequest;
  }

  // APPLY ASESORÍA CREDIT (100% Dentro de 30 días corridos)
  applyCreditToNewDesignProject(originalProjectId: string, roomsCount: number, squareMeters: number, userId: string, role: string): Project {
    const originalProject = this.getProjectById(originalProjectId, userId, role);
    if (!originalProject || !originalProject.creditBenefit) {
      throw new Error('El proyecto seleccionado no cuenta con un beneficio de crédito de Asesoría.');
    }

    const credit = originalProject.creditBenefit;
    if (credit.isUsed) {
      throw new Error('Este crédito ya fue utilizado en otro proyecto.');
    }

    const now = getNowInArgentina();
    const expiry = new Date(credit.expiresAt);
    if (now.getTime() > expiry.getTime()) {
      throw new Error('El beneficio de aplicar el 100% de la Asesoría ha expirado (plazo máximo: 30 días corridos desde la entrega).');
    }

    // Calculate base price for Diseño Integral
    const base = this.data.settings.servicePrices.diseno_integral.basePriceARS;
    const m2Price = this.data.settings.servicePrices.diseno_integral.pricePerM2ARS;
    const calculatedGross = base + (squareMeters * m2Price);
    const creditAmount = credit.amount; // 140.000 ARS
    const netAmount = Math.max(0, calculatedGross - creditAmount);

    const newProject = this.createProject({
      clientId: originalProject.clientId,
      clientName: originalProject.clientName,
      clientEmail: originalProject.clientEmail,
      clientPhone: originalProject.clientPhone,
      serviceType: 'diseno_integral',
      title: `Diseño Integral — ${originalProject.spacesSummary}`,
      spacesSummary: originalProject.spacesSummary,
      squareMeters,
      status: 'diseno_cotizado',
      currentStepLabel: 'Presupuesto con Crédito de Asesoría',
      nextActionLabel: 'Aceptá el presupuesto y confirmá el pago para comenzar el diseño',
      nextActionRole: 'client',
      quote: {
        id: `quo_${Date.now()}`,
        createdAt: now.toISOString(),
        serviceType: 'diseno_integral',
        roomsCount,
        roomTypes: [originalProject.spacesSummary],
        totalSquareMeters: squareMeters,
        hasIntegratedRooms: true,
        baseAmount: calculatedGross,
        creditApplied: creditAmount,
        finalAmount: netAmount,
        status: 'enviada',
        expiresAt: addCalendarDays(now, 10).toISOString()
      },
      payment: {
        id: `pay_${Date.now()}`,
        amount: netAmount,
        currency: 'ARS',
        method: 'transferencia',
        status: 'pendiente',
        paidAt: '',
        termsAccepted: false,
        termsVersion: this.data.settings.termsCurrentVersion,
        termsAcceptedAt: '',
        appliedCreditAmount: creditAmount
      },
      internalNotes: [
        `Proyecto derivado de Asesoría previa (${originalProject.id}). Se descontó el crédito de $${creditAmount} ARS.`
      ]
    }, originalProject.clientName);

    // Mark credit as used
    credit.isUsed = true;
    credit.usedInProjectId = newProject.id;
    this.saveData();

    return newProject;
  }

  // SETTINGS
  getSettings(): StudioSettings {
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<StudioSettings>): StudioSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
    return this.data.settings;
  }

  // STYLE REFERENCES
  getStyleReferences(): StyleReference[] {
    return this.data.styleReferences;
  }

  // ABANDONMENT / FUNNEL TRACKING
  recordAbandonment(data: Partial<FunnelAbandonmentEvent>): FunnelAbandonmentEvent {
    const event: FunnelAbandonmentEvent = {
      id: `ab_${Date.now()}`,
      name: data.name,
      email: data.email,
      stage: data.stage || 'cotizacion',
      serviceType: data.serviceType || 'asesoria',
      squareMeters: data.squareMeters,
      abandonedAt: getNowInArgentina().toISOString(),
      recovered: false,
      notes: data.notes
    };
    this.data.abandonmentEvents.unshift(event);
    this.saveData();
    return event;
  }

  getAbandonmentEvents(): FunnelAbandonmentEvent[] {
    return this.data.abandonmentEvents;
  }
}

export const db = new DatabaseStore();
