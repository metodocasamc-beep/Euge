import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db';
import { summarizeFormWithAi, summarizeMeetingWithAi, summarizeFeedbackWithAi, askFaqAssistant } from './server/aiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Helper middleware to extract user context from headers
  const getUserContext = (req: express.Request) => {
    const userId = (req.headers['x-user-id'] as string) || 'user_martina';
    const role = (req.headers['x-user-role'] as string) || 'client';
    return { userId, role };
  };

  // API ROUTES
  
  // Users / Auth
  app.get('/api/users', (req, res) => {
    res.json(db.getUsers());
  });

  app.post('/api/users/register', (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }
    const user = db.createUser(name, email, phone);
    res.json(user);
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.getSettings());
  });

  app.patch('/api/settings', (req, res) => {
    const { role } = getUserContext(req);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Solo Euge (ADMIN) puede modificar las configuraciones.' });
    }
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Styles Catalog
  app.get('/api/styles', (req, res) => {
    res.json(db.getStyleReferences());
  });

  // Projects
  app.get('/api/projects', (req, res) => {
    const { userId, role } = getUserContext(req);
    const projects = db.getProjects(userId, role);
    res.json(projects);
  });

  app.get('/api/projects/:id', (req, res) => {
    const { userId, role } = getUserContext(req);
    try {
      const project = db.getProjectById(req.params.id, userId, role);
      if (!project) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }
      res.json(project);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  app.post('/api/projects', (req, res) => {
    const { userId } = getUserContext(req);
    const user = db.getUserById(userId);
    const project = db.createProject({
      ...req.body,
      clientId: req.body.clientId || userId,
      clientName: req.body.clientName || user?.name || 'Cliente',
      clientEmail: req.body.clientEmail || user?.email || '',
      clientPhone: req.body.clientPhone || user?.phone || '',
    }, user?.name || 'Cliente');
    res.json(project);
  });

  app.patch('/api/projects/:id', (req, res) => {
    const { userId, role } = getUserContext(req);
    const user = db.getUserById(userId);
    try {
      const updated = db.updateProject(req.params.id, req.body, userId, role, user?.name || 'Euge');
      res.json(updated);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message });
    }
  });

  // Reschedule appointment
  app.post('/api/projects/:id/reschedule', (req, res) => {
    const { userId, role } = getUserContext(req);
    const { newDate, newTime, reason } = req.body;
    try {
      const project = db.rescheduleAppointment(req.params.id, newDate, newTime, reason, userId, role);
      res.json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Form Progress & Submission
  app.post('/api/projects/:id/form', (req, res) => {
    const { userId, role } = getUserContext(req);
    const { answers, selectedStyles, customInspirations, uploadedPlans, uploadedPhotos, isFinalSubmission } = req.body;
    try {
      const project = db.saveFormProgress(
        req.params.id,
        answers,
        selectedStyles,
        customInspirations,
        uploadedPlans,
        uploadedPhotos,
        Boolean(isFinalSubmission),
        userId,
        role
      );
      res.json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Comments on Deliverable
  app.post('/api/projects/:id/comments', (req, res) => {
    const { userId, role } = getUserContext(req);
    const user = db.getUserById(userId);
    const { pageNumber, text } = req.body;
    try {
      const comment = db.addComment(
        req.params.id,
        pageNumber,
        text,
        user?.name || 'Usuario',
        role === 'client',
        userId,
        role
      );
      res.json(comment);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Publish external deliverable (PDF & Video de recorrido)
  app.post('/api/projects/:id/deliverable', (req, res) => {
    const { userId, role } = getUserContext(req);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Solo Euge (ADMIN) puede subir entregables.' });
    }
    try {
      const project = db.addDeliverable(req.params.id, req.body, userId, role);
      res.json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Consolidated Feedback Submission (10 Business Days Rule)
  app.post('/api/projects/:id/feedback', (req, res) => {
    const { userId, role } = getUserContext(req);
    const { deliverableVersion, clientNotes } = req.body;
    try {
      const modRequest = db.submitModificationReturn(
        req.params.id,
        deliverableVersion,
        clientNotes,
        userId,
        role
      );
      res.json(modRequest);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Apply Asesoría Credit towards Diseño Integral
  app.post('/api/projects/:id/apply-credit', (req, res) => {
    const { userId, role } = getUserContext(req);
    const { roomsCount, squareMeters } = req.body;
    try {
      const newProject = db.applyCreditToNewDesignProject(
        req.params.id,
        roomsCount || 1,
        squareMeters || 25,
        userId,
        role
      );
      res.json(newProject);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Post-Service Survey
  app.post('/api/projects/:id/survey', (req, res) => {
    const { userId, role } = getUserContext(req);
    try {
      const project = db.getProjectById(req.params.id, userId, role);
      if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

      project.survey = {
        submittedAt: new Date().toISOString(),
        ratingScore: req.body.ratingScore || 5,
        metExpectations: req.body.metExpectations || '',
        savedTime: req.body.savedTime || '',
        mostValuablePart: req.body.mostValuablePart || '',
        experienceNotes: req.body.experienceNotes || '',
        publicTestimonialAllowed: Boolean(req.body.publicTestimonialAllowed),
        audioTestimonialUrl: req.body.audioTestimonialUrl
      };

      project.activityHistory.unshift({
        id: `act_${Date.now()}`,
        date: new Date().toISOString(),
        title: 'Encuesta de satisfacción enviada',
        description: `Calificación: ${project.survey.ratingScore}/5 puntos.`,
        actor: project.clientName,
        category: 'devolucion',
        isPublicForClient: true
      });

      db.updateProject(project.id, { survey: project.survey, activityHistory: project.activityHistory }, userId, role);
      res.json(project);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Abandonment & Funnel Tracking
  app.post('/api/abandonment', (req, res) => {
    const event = db.recordAbandonment(req.body);
    res.json(event);
  });

  app.get('/api/abandonment', (req, res) => {
    const { role } = getUserContext(req);
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    res.json(db.getAbandonmentEvents());
  });

  // AI ENDPOINTS
  app.post('/api/ai/summarize-form', async (req, res) => {
    const { formAnswers, clientName } = req.body;
    const summary = await summarizeFormWithAi(formAnswers || {}, clientName || 'Cliente');
    res.json(summary);
  });

  app.post('/api/ai/summarize-meeting', async (req, res) => {
    const { notesOrTranscript, clientName } = req.body;
    const summary = await summarizeMeetingWithAi(notesOrTranscript || '', clientName || 'Cliente');
    res.json(summary);
  });

  app.post('/api/ai/summarize-feedback', async (req, res) => {
    const { comments } = req.body;
    const summary = await summarizeFeedbackWithAi(comments || []);
    res.json(summary);
  });

  app.post('/api/ai/faq', async (req, res) => {
    const { question } = req.body;
    const settings = db.getSettings();
    const answer = await askFaqAssistant(question || '', settings.termsFullText);
    res.json(answer);
  });

  // Development vs Production serving
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Método CASA server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
