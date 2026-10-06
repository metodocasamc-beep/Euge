import { Project, User, StudioSettings, StyleReference, FunnelAbandonmentEvent } from '../src/types';
import { addCalendarDays, addBusinessDays, getNowInArgentina } from '../src/utils/dateUtils';

const now = getNowInArgentina();

export const INITIAL_SETTINGS: StudioSettings = {
  servicePrices: {
    asesoria: {
      basePriceARS: 110000,
      turnaroundHours: 72,
      minNoticeHours: 72,
      durationMinutes: 60,
    },
    diseno_integral: {
      basePriceARS: 290000,
      pricePerM2ARS: 10000,
      turnaroundBusinessDays: 5,
      revisionBusinessDays: 10,
    },
    carpeta_tecnica: {
      basePriceARS: 275000,
      turnaroundBusinessDays: 10,
      revisionBusinessDays: 10,
    },
    muebles_medida: {
      basePriceARS: 110000,
      turnaroundBusinessDays: 7,
    },
  },
  formExpirationHours: 72,
  maxReschedulesAllowed: 2,
  minRescheduleNoticeHours: 24,
  creditBenefitCalendarDays: 30,
  googleReviewUrl: 'https://g.page/r/metodo-casa-buenos-aires/review',
  eugeWhatsApp: '+54 9 11 2391 0626',
  eugeEmail: 'metodocasa.mc@gmail.com',
  mercadoPagoPaymentUrl: 'https://mpago.la/2G1hKj9', // Link para pago en hasta 3 cuotas
  bankDetails: {
    bankName: 'Banco Santander Argentina',
    holderName: 'Eugenia Demarco — Método CASA',
    cuit: '27-38491029-4',
    alias: 'METODO.CASA.MC',
    cbu: '0720234588000039201948',
  },
  termsCurrentVersion: 'v2.4 (Septiembre 2026)',
  termsFullText: `TÉRMINOS Y CONDICIONES DE CONTRATACIÓN — MÉTODO CASA

1. OBJETO Y ALCANCE
Método CASA presta servicios profesionales de asesoramiento y diseño de interiores en modalidad online. La propuesta busca resolver funcionalidad, circulación, estilo y habitabilidad cotidiana de acuerdo a los requerimientos informados por el cliente.

2. CONDICIÓN DE PAGO
La prestación de cualquier servicio se inicia una vez acreditado el 100% del valor total acordado. Las opciones habilitadas son Transferencia Bancaria Directa (sin comisión) o Tarjeta en hasta 3 cuotas a través de Mercado Pago.

3. FORMULARIO DE DIAGNÓSTICO Y ANTECEDENTES
Una vez efectivizado el pago, el cliente dispone de un plazo de hasta 72 horas para remitir el formulario completo de diagnóstico con medidas, fotografías del espacio y referencias. La demora en la entrega del formulario posterga automáticamente los plazos de entrega del estudio.

4. REUNIONES VIRTUALES (MEET) Y REPROGRAMACIONES
Las reuniones de Asesoría tienen una duración máxima de 60 minutos con 15 minutos de tolerancia para el ingreso. Las reprogramaciones deben realizarse con un mínimo de 24 horas de anticipación a través de la plataforma, con un tope máximo de dos (2) reprogramaciones por contratación. Pasado el límite o transcurridos los 15 minutos de tolerancia sin aviso, la sesión se considerará realizada.

5. BENEFICIO DE CRÉDITO DE ASESORÍA A DISEÑO INTEGRAL
Si el cliente contrata un servicio de Diseño Integral dentro de los treinta (30) días corridos contados desde la fecha de entrega del dossier de Asesoría, se reconocerá el 100% del importe abonado en la Asesoría como pago a cuenta del Diseño Integral. Vencidos los 30 días corridos, el beneficio expira de pleno derecho sin posibilidad de prórroga.

6. INSTANCIA DE MODIFICACIONES EN DISEÑO INTEGRAL
El servicio de Diseño Integral incluye una (1) única instancia consolidada de devoluciones y ajustes. El cliente dispone de diez (10) días hábiles posteriores a la entrega del dossier PDF para remitir sus observaciones y comentarios a través del portal. Transcurrido dicho plazo sin observaciones, el diseño se considerará formalmente aprobado.

7. PROPIEDAD INTELECTUAL Y ENTREGABLES
Los dossiers PDF, planos y videos de recorrido explicativo entregados son de autoría de Método CASA, cediéndose al cliente la licencia de uso personal para la materialización de su vivienda.`,
  spacesCatalog: [
    {
      id: 'living',
      name: 'Living',
      category: 'social',
      defaultM2: 20,
      basePriceARS: 175000,
      horasDisenoIntegral: 15,
      horasCarpetaTecnica: 10,
      description: 'Zonificación de relax, sillones, iluminación escenográfica y mueble de TV/guardado.'
    },
    {
      id: 'comedor',
      name: 'Comedor',
      category: 'social',
      defaultM2: 14,
      basePriceARS: 135000,
      horasDisenoIntegral: 12,
      horasCarpetaTecnica: 8,
      description: 'Dimensionamiento de mesa, circulación cómoda, iluminación puntual y vajillero.'
    },
    {
      id: 'cocina',
      name: 'Cocina',
      category: 'humedo',
      defaultM2: 12,
      basePriceARS: 245000,
      horasDisenoIntegral: 24,
      horasCarpetaTecnica: 18,
      description: 'Triángulo de trabajo, mesadas, bajo mesada y alacenas al milímetro con tomas y artefactos.'
    },
    {
      id: 'dormitorio_principal',
      name: 'Dormitorio Principal / Suite',
      category: 'privado',
      defaultM2: 18,
      basePriceARS: 180000,
      horasDisenoIntegral: 16,
      horasCarpetaTecnica: 12,
      description: 'Cama, respaldar, mesas de luz, placard/vestidor y clima de descanso ordenado.'
    },
    {
      id: 'dormitorio_secundario',
      name: 'Dormitorio Secundario / Infantil',
      category: 'privado',
      defaultM2: 12,
      basePriceARS: 150000,
      horasDisenoIntegral: 14,
      horasCarpetaTecnica: 10,
      description: 'Camas funcionales, área de estudio y guardado de juguetes/ropa.'
    },
    {
      id: 'bano',
      name: 'Baño / Toilette',
      category: 'humedo',
      defaultM2: 5,
      basePriceARS: 195000,
      horasDisenoIntegral: 18,
      horasCarpetaTecnica: 14,
      description: 'Vanitory a medida, mampara, despieces de revestimientos y griferías precisas.'
    },
    {
      id: 'balcon',
      name: 'Balcón / Terraza',
      category: 'exterior',
      defaultM2: 8,
      basePriceARS: 120000,
      horasDisenoIntegral: 10,
      horasCarpetaTecnica: 6,
      description: 'Mobiliario para intemperie, vegetación, macetas, iluminación exterior y relax.'
    },
    {
      id: 'jardin_invierno',
      name: 'Jardín de Invierno',
      category: 'exterior',
      defaultM2: 12,
      basePriceARS: 145000,
      horasDisenoIntegral: 14,
      horasCarpetaTecnica: 8,
      description: 'Espacio vidriado, control lumínico/térmico, rincón verde y rincón de lectura.'
    },
    {
      id: 'quincho',
      name: 'Quincho / Espacio Parrilla',
      category: 'social',
      defaultM2: 24,
      basePriceARS: 210000,
      horasDisenoIntegral: 18,
      horasCarpetaTecnica: 12,
      description: 'Mesa comunitaria, guardado para asado, barra, mesada con bacha y áreas de guardado.'
    },
    {
      id: 'home_office',
      name: 'Home Office / Estudio',
      category: 'privado',
      defaultM2: 10,
      basePriceARS: 130000,
      horasDisenoIntegral: 12,
      horasCarpetaTecnica: 8,
      description: 'Escritorio ergonómico, pasacables, bibliotecas y fondo profesional para videollamadas.'
    },
    {
      id: 'lavadero',
      name: 'Lavadero',
      category: 'humedo',
      defaultM2: 5,
      basePriceARS: 110000,
      horasDisenoIntegral: 10,
      horasCarpetaTecnica: 8,
      description: 'Ocultamiento de lavarropas, tender extensible, bacha y despensa para limpieza.'
    },
    {
      id: 'recibidor',
      name: 'Recibidor / Hall / Pasillo',
      category: 'social',
      defaultM2: 6,
      basePriceARS: 95000,
      horasDisenoIntegral: 8,
      horasCarpetaTecnica: 6,
      description: 'Descalzador, perchas, espejo y bienvenida organizada sin saturar el paso.'
    },
    {
      id: 'monoambiente',
      name: 'Monoambiente (Espacio Único)',
      category: 'especial',
      defaultM2: 32,
      basePriceARS: 310000,
      horasDisenoIntegral: 28,
      horasCarpetaTecnica: 20,
      description: 'Multifunción absoluta: divisores livianos, cama rebatible o zonificada y guardado total.'
    }
  ],
  googleSheetsConfig: {
    connected: true,
    spreadsheetName: 'CALCULO VALORES DE SERVICIOS Método Casa',
    sheetName: '$ BASE - Detalle HS x ESPACIO',
    spreadsheetId: '',
    lastSyncedAt: 'Sincronización inicial preconfigurada'
  },
  discounts: {
    transferenciaPercent: 20,
    packMultiServicePercent: 8
  }
};

// Only 1 Admin + 1 Client example as requested by user
export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Euge (Método CASA)',
    email: 'admin@metodocasa.com',
    phone: '+54 9 11 5821-4920',
    role: 'admin',
    avatarUrl: '/src/assets/images/hero_interior_warm_1790705518861.jpg',
  },
  {
    id: 'user_martina',
    name: 'Martina Gómez',
    email: 'martina@gmail.com',
    phone: '+54 9 11 4092-1188',
    role: 'client',
  }
];

export const INITIAL_STYLE_REFERENCES: StyleReference[] = [
  {
    id: 'style_1',
    title: 'Cálido Minimalista & Maderas Claras',
    category: 'Estilo Global',
    imageUrl: '/src/assets/images/hero_interior_warm_1790705518861.jpg',
    description: 'Roble claro, lino lavado, paredes tiza, luz natural difusa, sensación de calma y orden visual.',
    tags: ['Lino', 'Roble Claro', 'Calma', 'Neutros'],
  },
  {
    id: 'style_2',
    title: 'Texturas Táctiles & Terracotas Suaves',
    category: 'Paleta & Materiales',
    imageUrl: '/src/assets/images/moodboard_living_sample_1790705529895.jpg',
    description: 'Cerámicos artesanales, travertino rústico, toques de terracota desaturada y verde oliva.',
    tags: ['Terracota', 'Travertino', 'Texturas', 'Tierra'],
  },
  {
    id: 'style_3',
    title: 'Distribución Funcional & Circulación Fluida',
    category: 'Zonificación',
    imageUrl: '/src/assets/images/sample_floorplan_render_1790705541634.jpg',
    description: 'Muebles bajos para no cortar la luz, separación visual sutil entre living y comedor, guardado oculto.',
    tags: ['Circulación', 'Luz Natural', 'Guardado', 'Espacios Integrados'],
  },
  {
    id: 'style_4',
    title: 'Detalles Curados & Iluminación Indirecta',
    category: 'Iluminación & Objetos',
    imageUrl: '/src/assets/images/deliverable_preview_sample_1790705553160.jpg',
    description: 'Lámparas de papel de arroz, apliques de bronce mate, cuadros enmarcados en madera natural y libros.',
    tags: ['Luz Cálida', 'Arte', 'Bronce', 'Acogedor'],
  }
];

// Only 1 representative project for the single client
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_martina_01',
    clientId: 'user_martina',
    clientName: 'Martina Gómez',
    clientEmail: 'martina@gmail.com',
    clientPhone: '+54 9 11 4092-1188',
    serviceType: 'asesoria',
    title: 'Asesoría Living-Comedor & Rincón de Trabajo',
    spacesSummary: 'Living-Comedor y Rincón de Home Office (28 m²)',
    squareMeters: 28,
    status: 'asesoria_agendada',
    currentStepLabel: 'Meet Agendado',
    nextActionLabel: 'Reunión virtual de 60 min por Google Meet con Euge',
    nextActionRole: 'client',
    nextActionDeadline: addCalendarDays(now, 3).toISOString(),
    deadlineType: 'corridos',
    createdAt: addCalendarDays(now, -2).toISOString(),
    updatedAt: now.toISOString(),
    payment: {
      id: 'pay_m01',
      amount: 140000,
      currency: 'ARS',
      method: 'transferencia',
      status: 'confirmado',
      paidAt: addCalendarDays(now, -2).toISOString(),
      termsAccepted: true,
      termsVersion: 'v2.4 (Septiembre 2026)',
      termsAcceptedAt: addCalendarDays(now, -2).toISOString(),
      receiptNumber: 'REC-2026-0891'
    },
    appointment: {
      id: 'apt_m01',
      date: addCalendarDays(now, 3).toISOString().split('T')[0],
      time: '16:00',
      durationMinutes: 60,
      meetUrl: 'https://meet.google.com/cas-euge-mtg',
      rescheduledCount: 0,
      status: 'agendada',
      rescheduleHistory: [],
      meetingNotes: 'Reunión programada. Martina completó el diagnóstico y subió fotos de su living.',
    },
    formProgress: {
      startedAt: addCalendarDays(now, -2).toISOString(),
      expiresAt: addCalendarDays(now, 1).toISOString(),
      isLocked: true,
      percentage: 100,
      lastSavedAt: addCalendarDays(now, -1).toISOString(),
      submittedAt: addCalendarDays(now, -1).toISOString(),
      answers: {
        livingRoutine: 'Vivimos 2 personas y una perra chica. Trabajamos híbrido 3 días por semana en casa.',
        mainPainPoints: 'El espacio se siente desordenado, falta lugar para apoyar cosas al entrar y la luz de la tarde es muy fuerte.',
        existingFurniture: 'Queremos mantener el sillón gris de 3 cuerpos y el mueble de la TV.',
        budgetRange: 'Medio, priorizando textiles, iluminación y una mesa de comedor funcional.',
      },
      selectedStyles: ['style_1', 'style_2'],
      customInspirations: [
        {
          id: 'insp_1',
          name: 'Biblioteca suspendida liviana',
          url: '/src/assets/images/moodboard_living_sample_1790705529895.jpg',
          comment: 'Nos gusta este tipo de estantes que no cargan la pared.'
        }
      ],
      uploadedPlans: [
        {
          id: 'plan_1',
          name: 'croquis_plano_martina_28m2.pdf',
          size: '1.4 MB',
          url: '#'
        }
      ],
      uploadedPhotos: [
        {
          id: 'ph_1',
          name: 'vista_desde_acceso.jpg',
          room: 'Living',
          url: '/src/assets/images/hero_interior_warm_1790705518861.jpg'
        }
      ],
      aiSummary: {
        overview: 'Pareja joven con mascota y home office frecuente. Priorizan calidez, orden al ingresar y resolver la circulación entre mesa y sillón.',
        keyNeeds: [
          'Sectorizar recibidor de forma ligera para llaves y calzado.',
          'Reacomodar comedor para aprovechar luz natural sin encandilar la pantalla.',
          'Incorporar textiles cálidos (cortinas de gasa o lino) y luz indirecta.'
        ],
        identifiedFriction: [
          'La luz del oeste satura la vista a la tarde.',
          'Cables visibles de la zona de trabajo.'
        ],
        suggestedServices: ['asesoria', 'diseno_integral'],
        draftIdearectora: 'Atmósfera Serena: Integración fluida con maderas claras, textiles respirables y puntos focales de luz cálida.'
      }
    },
    deliverables: [
      {
        version: '1.0',
        deliveredAt: addCalendarDays(now, -1).toISOString(),
        title: 'Dossier de Asesoría — Living & Comedor',
        description: 'Dossier integral en PDF con ideas de distribución, paleta de colores, catálogo de tiendas sugeridas y recomendaciones de iluminación.',
        pdfDownloadUrl: '/src/assets/images/deliverable_preview_sample_1790705553160.jpg',
        pdfFileName: 'Dossier_Asesoria_Martina_Gomez_v1.0.pdf',
        videoRecorridoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Link de video de recorrido
        videoTitle: 'Video Explicativo de Euge (Recorrido de la Propuesta)',
        feedbackDeadline: addBusinessDays(now, 10).toISOString(),
        feedbackDeadlineType: 'habiles'
      }
    ],
    currentVersionIndex: 0,
    modificationRequests: [],
    internalTasks: [
      { id: 't1', title: 'Pago 100% confirmado', isCompleted: true, completedAt: addCalendarDays(now, -2).toISOString() },
      { id: 't2', title: 'Formulario de diagnóstico recibido', isCompleted: true, completedAt: addCalendarDays(now, -1).toISOString() },
      { id: 't3', title: 'Análisis previo: evaluar medidas y fotos', isCompleted: true, completedAt: addCalendarDays(now, -1).toISOString(), estimatedHours: 1.5, actualHours: 1.2 },
      { id: 't4', title: 'Realizar Meet de 60 min', isCompleted: false },
      { id: 't5', title: 'Subir PDF del dossier y video de recorrido', isCompleted: false, estimatedHours: 15 },
    ],
    internalNotes: [
      'Cliente muy clara en lo que busca. Superficie de 28m² clasifica en rango intermedio (16-30m²). Tiempo estimado de análisis: 1.5h.'
    ],
    estimatedHours: 17.5,
    loggedHours: 1.2,
    activityHistory: [
      {
        id: 'act_1',
        date: addCalendarDays(now, -2).toISOString(),
        title: 'Pago confirmado',
        description: 'Se acreditó el 100% de la Asesoría ($140.000 ARS) por transferencia bancaria.',
        actor: 'Sistema',
        category: 'pago',
        isPublicForClient: true
      },
      {
        id: 'act_2',
        date: addCalendarDays(now, -2).toISOString(),
        title: 'Reserva confirmada',
        description: 'Reunión agendada para el ' + addCalendarDays(now, 3).toISOString().split('T')[0] + ' a las 16:00 hs.',
        actor: 'Martina Gómez',
        category: 'reserva',
        isPublicForClient: true
      },
      {
        id: 'act_3',
        date: addCalendarDays(now, -1).toISOString(),
        title: 'Formulario de diagnóstico enviado',
        description: 'Martina completó y envió todas las secciones del formulario.',
        actor: 'Martina Gómez',
        category: 'formulario',
        isPublicForClient: true
      }
    ]
  }
];

export const INITIAL_ABANDONMENT_EVENTS: FunnelAbandonmentEvent[] = [
  {
    id: 'ab_1',
    name: 'Florencia Paz',
    email: 'florencia@gmail.com',
    phone: '+54 9 11 5109-8832',
    stage: 'cotizacion',
    serviceType: 'asesoria',
    squareMeters: 32,
    abandonedAt: addCalendarDays(now, -1).toISOString(),
    recovered: false,
    notes: 'Cotizó Asesoría para monoambiente de 32 m² y solicitó resumen por WhatsApp.'
  }
];
