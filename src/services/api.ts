import { Project, User, StudioSettings, StyleReference, FunnelAbandonmentEvent, ClientComment, ModificationRequest } from '../types';

class ApiService {
  private currentUser: User = {
    id: 'guest',
    name: 'Invitado',
    email: '',
    role: 'client'
  };

  setCurrentUser(user: User) {
    this.currentUser = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('metodocasa_user', JSON.stringify(user));
    }
  }

  getCurrentUser(): User {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('metodocasa_user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch {
          // keep current
        }
      }
    }
    return this.currentUser;
  }

  private getHeaders(): Record<string, string> {
    const user = this.getCurrentUser();
    return {
      'Content-Type': 'application/json',
      'x-user-id': user.id,
      'x-user-role': user.role
    };
  }

  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users', { credentials: 'same-origin' });
    return res.json();
  }

  async registerUser(name: string, email: string, phone = ''): Promise<User> {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, phone })
    });
    return res.json();
  }

  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects', {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Error al cargar proyectos');
    return res.json();
  }

  async getProjectById(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al obtener el proyecto');
    }
    return res.json();
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar proyecto');
    }
    return res.json();
  }

  async rescheduleAppointment(projectId: string, newDate: string, newTime: string, reason = ''): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/reschedule`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ newDate, newTime, reason })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'No se pudo reprogramar la cita');
    }
    return res.json();
  }

  async saveFormProgress(projectId: string, payload: {
    answers: Record<string, any>;
    selectedStyles: string[];
    customInspirations: any[];
    uploadedPlans: any[];
    uploadedPhotos: any[];
    isFinalSubmission: boolean;
  }): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/form`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al guardar el formulario');
    }
    return res.json();
  }

  async addDeliverableComment(projectId: string, pageNumber: number, text: string): Promise<ClientComment> {
    const res = await fetch(`/api/projects/${projectId}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pageNumber, text })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al guardar el comentario');
    }
    return res.json();
  }

  async publishDeliverable(projectId: string, deliverableData: {
    title: string;
    version: string;
    description?: string;
    pdfDownloadUrl: string;
    pdfFileName?: string;
    videoRecorridoUrl?: string;
    videoTitle?: string;
  }): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/deliverable`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(deliverableData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al publicar entregable');
    }
    return res.json();
  }

  async submitModificationReturn(projectId: string, deliverableVersion: string, clientNotes = ''): Promise<ModificationRequest> {
    const res = await fetch(`/api/projects/${projectId}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ deliverableVersion, clientNotes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al enviar la devolución');
    }
    return res.json();
  }

  async applyAsesoriaCredit(projectId: string, roomsCount: number, squareMeters: number): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/apply-credit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ roomsCount, squareMeters })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'No se pudo aplicar el crédito de asesoría');
    }
    return res.json();
  }

  async submitSurvey(projectId: string, surveyData: any): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}/survey`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(surveyData)
    });
    return res.json();
  }

  async getSettings(): Promise<StudioSettings> {
    const res = await fetch('/api/settings');
    return res.json();
  }

  async updateSettings(settings: Partial<StudioSettings>): Promise<StudioSettings> {
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(settings)
    });
    return res.json();
  }

  async getStyles(): Promise<StyleReference[]> {
    const res = await fetch('/api/styles');
    return res.json();
  }

  async recordAbandonment(data: Partial<FunnelAbandonmentEvent>): Promise<FunnelAbandonmentEvent> {
    const res = await fetch('/api/abandonment', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async getAbandonments(): Promise<FunnelAbandonmentEvent[]> {
    const res = await fetch('/api/abandonment', {
      headers: this.getHeaders()
    });
    return res.json();
  }

  // AI
  async summarizeForm(formAnswers: Record<string, any>, clientName: string) {
    const res = await fetch('/api/ai/summarize-form', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ formAnswers, clientName })
    });
    return res.json();
  }

  async summarizeMeeting(notesOrTranscript: string, clientName: string) {
    const res = await fetch('/api/ai/summarize-meeting', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ notesOrTranscript, clientName })
    });
    return res.json();
  }

  async summarizeFeedback(comments: any[]) {
    const res = await fetch('/api/ai/summarize-feedback', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ comments })
    });
    return res.json();
  }

  async askFaq(question: string) {
    const res = await fetch('/api/ai/faq', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ question })
    });
    return res.json();
  }
}

export const api = new ApiService();
