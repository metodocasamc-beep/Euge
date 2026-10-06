import React, { useState, useEffect } from 'react';
import { User, Project, StudioSettings, StyleReference, FunnelAbandonmentEvent, ServiceType } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { DiagnosticView } from './components/DiagnosticView';
import { AboutView } from './components/AboutView';
import { PortfolioView } from './components/PortfolioView';
import { DigitalGuidesView } from './components/DigitalGuidesView';
import { CalculatorView } from './components/CalculatorView';
import { BookingView } from './components/BookingView';
import { ClientDashboard } from './components/ClientDashboard';
import { FormView } from './components/FormView';
import { AppointmentView } from './components/AppointmentView';
import { DeliverablesView } from './components/DeliverablesView';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsView } from './components/SettingsView';
import { FaqModal } from './components/FaqModal';
import { TermsModal } from './components/TermsModal';
import { AuthModal } from './components/AuthModal';
import { Logo } from './components/Logo';
import { INITIAL_SETTINGS } from '../server/mockData';
import { Lock, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const u = api.getCurrentUser();
    return u && u.id !== 'guest' && u.email ? u : null;
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<StudioSettings>(INITIAL_SETTINGS);
  const [styles, setStyles] = useState<StyleReference[]>([]);
  const [abandonments, setAbandonments] = useState<FunnelAbandonmentEvent[]>([]);

  // Navigation: default is 'inicio' for general public visitors; if client logs in, goes to 'dashboard'
  const [currentView, setCurrentView] = useState<string>('inicio');
  const [activeProjectForSubView, setActiveProjectForSubView] = useState<Project | null>(null);

  // Preselected data passed from calculator or services to booking
  const [preselectedBookingData, setPreselectedBookingData] = useState<{
    serviceType: ServiceType;
    roomsCount: number;
    squareMeters: number;
    roomTypes: string[];
    estimatedAmount: number;
  } | undefined>(undefined);

  // Modals
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'client' | 'admin'>('client');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [usersData, settingsData, stylesData] = await Promise.all([
        api.getUsers(),
        api.getSettings(),
        api.getStyles(),
      ]);
      setAllUsers(usersData);
      setSettings(settingsData);
      setStyles(stylesData);

      const user = api.getCurrentUser();
      if (user && user.id !== 'guest' && user.email) {
        setCurrentUser(user);
        const projData = await api.getProjects();
        setProjects(projData);

        if (user.role === 'admin') {
          const abData = await api.getAbandonments();
          setAbandonments(abData);
        }
      } else {
        setCurrentUser(null);
        setProjects([]);
      }
    } catch (err) {
      console.error('Error loading initial data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUserLoggedIn = async (user: User) => {
    api.setCurrentUser(user);
    setCurrentUser(user);
    setIsLoading(true);

    try {
      const projData = await api.getProjects();
      setProjects(projData);

      if (user.role === 'admin') {
        const abData = await api.getAbandonments();
        setAbandonments(abData);
        setCurrentView('admin');
      } else {
        setCurrentView('dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Invitado',
      email: '',
      role: 'client'
    };
    api.setCurrentUser(guestUser);
    setCurrentUser(null);
    setProjects([]);
    setCurrentView('inicio');
  };

  const handleAdvanceToBookingFromCalc = (calcData: {
    serviceType: ServiceType;
    roomsCount: number;
    squareMeters: number;
    roomTypes: string[];
    estimatedAmount: number;
  }) => {
    setPreselectedBookingData(calcData);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingDirect = (serviceType: ServiceType = 'asesoria') => {
    setPreselectedBookingData({
      serviceType,
      roomsCount: 1,
      squareMeters: 25,
      roomTypes: ['Living-Comedor'],
      estimatedAmount: settings.servicePrices[serviceType]?.basePriceARS || 110000
    });
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (newProj: Project) => {
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectForSubView(newProj);
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectUpdated = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (activeProjectForSubView?.id === updated.id) {
      setActiveProjectForSubView(updated);
    }
  };

  if (isLoading && projects.length === 0 && currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center space-y-4 flex flex-col items-center">
          <Logo variant="badge" size="lg" />
          <p className="text-xs font-mont font-bold uppercase tracking-wider text-[#1c2120]/50">
            Cargando tu espacio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1c2120]">
      {/* Top Bar with Three-Zone Contract */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard' && (!currentUser || currentUser.id === 'guest' || !currentUser.email)) {
            setAuthModalMode('client');
            setIsAuthModalOpen(true);
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode || 'client');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenFaq={() => setIsFaqOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* Vista Inicio (Manifiesto & Concepto Canva) */}
        {currentView === 'inicio' && (
          <HomeView
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={handleOpenBookingDirect}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => {
              setAuthModalMode('client');
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {/* Vista Servicios Online */}
        {currentView === 'servicios' && (
          <ServicesView
            settings={settings}
            onSelectService={(service) => handleOpenBookingDirect(service)}
            onCalculateService={(service) => {
              setPreselectedBookingData({
                serviceType: service,
                roomsCount: 1,
                squareMeters: 25,
                roomTypes: ['Living-Comedor'],
                estimatedAmount: settings.servicePrices[service]?.basePriceARS || 110000
              });
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDiagnostic={() => {
              setCurrentView('diagnostico');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Vista Diagnóstico interactivo "¿Cuál es tu caso?" */}
        {currentView === 'diagnostico' && (
          <DiagnosticView
            onOpenBooking={(service) => handleOpenBookingDirect(service)}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateServices={() => {
              setCurrentView('servicios');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Vista Sobre Mí (Euge Demarco) */}
        {currentView === 'sobre-mi' && (
          <AboutView
            onNavigateServices={() => {
              setCurrentView('servicios');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBooking={() => handleOpenBookingDirect('asesoria')}
          />
        )}

        {/* Vista Portfolio */}
        {currentView === 'portfolio' && (
          <PortfolioView
            onOpenBooking={() => handleOpenBookingDirect('diseno_integral')}
            onOpenCalculator={() => {
              setCurrentView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Vista Guías Digitales */}
        {currentView === 'guias' && (
          <DigitalGuidesView
            onNavigateServices={() => {
              setCurrentView('servicios');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Mi Espacio / Dashboard Privado del Cliente */}
        {currentView === 'dashboard' && (
          <ClientDashboard
            currentUser={currentUser || { id: 'guest', name: 'Invitado', email: '', role: 'client' }}
            projects={projects}
            settings={settings}
            onOpenForm={(proj) => {
              setActiveProjectForSubView(proj);
              setCurrentView('form');
            }}
            onOpenAppointment={(proj) => {
              setActiveProjectForSubView(proj);
              setCurrentView('appointment');
            }}
            onOpenDeliverables={(proj) => {
              setActiveProjectForSubView(proj);
              setCurrentView('deliverables');
            }}
            onNavigateBooking={() => setCurrentView('booking')}
            onProjectRefreshed={loadData}
          />
        )}

        {/* Calculadora de Presupuestos */}
        {currentView === 'calculator' && (
          <CalculatorView
            settings={settings}
            onAdvanceToBooking={handleAdvanceToBookingFromCalc}
          />
        )}

        {/* Reserva y Pagos */}
        {currentView === 'booking' && (
          <BookingView
            settings={settings}
            currentUser={currentUser || { id: 'guest', name: 'Cliente', email: '', role: 'client' }}
            preselectedData={preselectedBookingData}
            onBookingConfirmed={handleBookingConfirmed}
            onOpenTerms={() => setIsTermsOpen(true)}
          />
        )}

        {/* Sub-vistas de proyecto del cliente */}
        {currentView === 'form' && activeProjectForSubView && (
          <FormView
            project={activeProjectForSubView}
            styles={styles}
            onFormSaved={handleProjectUpdated}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'appointment' && activeProjectForSubView && (
          <AppointmentView
            project={activeProjectForSubView}
            settings={settings}
            onAppointmentUpdated={handleProjectUpdated}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'deliverables' && activeProjectForSubView && (
          <DeliverablesView
            project={activeProjectForSubView}
            onProjectUpdated={handleProjectUpdated}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* Panel Administrativo Euge */}
        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            projects={projects}
            settings={settings}
            abandonments={abandonments}
            onProjectUpdated={handleProjectUpdated}
            onNavigateSettings={() => setCurrentView('settings')}
          />
        )}

        {currentView === 'settings' && currentUser?.role === 'admin' && (
          <SettingsView
            settings={settings}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            onBackToDashboard={() => setCurrentView('admin')}
          />
        )}
      </main>

      {/* Official Footer with Contacts and Social Media */}
      <footer className="border-t border-[#d9d1c5] bg-[#ffffff] pt-12 pb-8 px-4 text-xs text-[#1c2120]/75">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Columna Marca & Identidad */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <Logo variant="badge" size="sm" />
                <div>
                  <span className="font-mont font-extrabold text-base text-[#1c2120] block">MÉTODO CASA</span>
                  <span className="text-[11px] text-[#1c2120]/60">Diseño Interior + Organización · Euge Demarco</span>
                </div>
              </div>
              <p className="text-xs text-[#1c2120]/80 max-w-sm font-normal">
                Diseño espacios que se adaptan a tu forma de vivirlos. La estética aparece, pero como consecuencia. Modalidad 100% online.
              </p>
              <p className="font-hand text-xl text-[#1c2120] pt-1">
                “Escribime y lo hacemos realidad ;)”
              </p>
            </div>

            {/* Columna Navegación */}
            <div className="md:col-span-3 space-y-2">
              <span className="font-mont font-bold text-xs uppercase tracking-wider text-[#1c2120] block mb-2">
                Navegación
              </span>
              <ul className="space-y-1.5 font-medium">
                <li>
                  <button onClick={() => setCurrentView('inicio')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Inicio & Manifiesto
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('servicios')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Mis Servicios Online
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('diagnostico')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    ¿Cuál es tu caso?
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('sobre-mi')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Sobre Mí (Euge Demarco)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('portfolio')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Portfolio de Proyectos
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('guias')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Guías Digitales
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('calculator')} className="hover:text-[#1c2120] hover:underline cursor-pointer">
                    Calculadora de Presupuestos
                  </button>
                </li>
              </ul>
            </div>

            {/* Columna Contacto Oficial */}
            <div className="md:col-span-4 space-y-3">
              <span className="font-mont font-bold text-xs uppercase tracking-wider text-[#1c2120] block mb-2">
                Contacto Oficial
              </span>
              <div className="space-y-2 font-medium">
                <a
                  href="https://instagram.com/metodo.casa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#1c2120] hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>@metodo.casa</span>
                </a>
                <a
                  href="mailto:metodocasa.mc@gmail.com"
                  className="flex items-center gap-2 hover:text-[#1c2120] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>metodocasa.mc@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/5491123910626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#1c2120] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1c2120]" />
                  <span>+54 9 11 2391 0626</span>
                </a>
                <div className="flex items-center gap-2 text-[#1c2120]/70">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
          </div>

          {/* Línea inferior de copyright y accesos legales/admin */}
          <div className="pt-6 border-t border-[#d9d1c5]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              <span>© {new Date().getFullYear()} Método CASA — Todos los derechos reservados. Lic. Eugenia Demarco.</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-[#1c2120] underline cursor-pointer"
              >
                Términos y Condiciones
              </button>
              <button
                onClick={() => setIsFaqOpen(true)}
                className="hover:text-[#1c2120] underline cursor-pointer"
              >
                Preguntas Frecuentes
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('admin');
                  setIsAuthModalOpen(true);
                }}
                className="hover:text-[#1c2120] flex items-center gap-1 cursor-pointer transition-colors"
                title="Acceso exclusivo administración"
              >
                <Lock className="w-3 h-3 text-[#1c2120]/40" />
                <span>Acceso Euge (Admin)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        settings={settings}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        settings={settings}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onUserLoggedIn={handleUserLoggedIn}
      />
    </div>
  );
}

export default App;
