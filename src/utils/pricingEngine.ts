import { ServiceType } from '../types';

export interface SpaceConfig {
  id: string;
  name: string;
  category: 'social' | 'privado' | 'humedo' | 'exterior' | 'especial';
  defaultM2: number;
  basePriceARS: number;
  horasDisenoIntegral: number;
  horasCarpetaTecnica: number;
  description: string;
}

export interface SelectedSpaceItem {
  instanceId: string;
  spaceId: string;
  name: string;
  squareMeters: number;
  integratedGroupId?: string | null; // ID del grupo si está integrado con otro
}

export interface IntegratedGroup {
  id: string;
  name: string;
  isMonoambiente?: boolean;
}

export interface SpaceHourBreakdown {
  name: string;
  squareMeters: number;
  horasDisenoIntegral: number;
  horasCarpetaTecnica: number;
  horasTotales: number;
  basePrice: number;
  groupName?: string;
}

export interface PricingCalculationResult {
  services: ServiceType[];
  selectedSpaces: SelectedSpaceItem[];
  spaceBreakdown: SpaceHourBreakdown[];
  totalSquareMeters: number;
  totalHorasDiseno: number;
  totalHorasCarpeta: number;
  totalHoras: number;
  
  // Desglose económico
  subtotalBruto: number;
  descuentoEspaciosIntegrados: number;
  detalleDescuentosIntegrados: {
    groupName: string;
    spacesCount: number;
    discountAmount: number;
    description: string;
  }[];
  subtotalEspacios: number;
  
  // Pack multi-servicio
  aplicaPackDescuento: boolean;
  descuentoPackPorcentaje: number; // 8%
  descuentoPackMonto: number;
  
  // Crédito de asesoría previa (reinversión)
  creditoAsesoriaAplicado: number;
  codigoReinversion?: string;
  
  // Totales
  montoTotalBase: number;
  
  // Modos de pago
  pagoCuotas: {
    cantidadCuotas: number; // 3
    valorPorCuota: number;
    total: number;
  };
  pagoTransferencia: {
    porcentajeDescuento: number; // 20%
    montoAhorro: number;
    totalConDescuento: number;
  };
}

// Catálogo completo de ambientes según la planilla "$ BASE - Detalle HS x ESPACIO"
export const DEFAULT_SPACES_CATALOG: SpaceConfig[] = [
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
];

// Presets de combinaciones comunes
export const COMMON_INTEGRATED_PRESETS = [
  { label: 'Cocina + Comedor', spaceIds: ['cocina', 'comedor'] },
  { label: 'Living + Cocina', spaceIds: ['living', 'cocina'] },
  { label: 'Living + Comedor + Cocina', spaceIds: ['living', 'comedor', 'cocina'] },
  { label: 'Dormitorio + Vestidor', spaceIds: ['dormitorio_principal', 'recibidor'] },
  { label: 'Quincho + Galería', spaceIds: ['quincho', 'balcon'] }
];

export function calculateProjectPricing(params: {
  services: ServiceType[];
  spaces: SelectedSpaceItem[];
  groups?: IntegratedGroup[];
  hasAsesoriaCredit?: boolean;
  asesoriaCreditAmount?: number;
  catalog?: SpaceConfig[];
}): PricingCalculationResult {
  const catalog = params.catalog || DEFAULT_SPACES_CATALOG;
  const services: ServiceType[] = params.services.length > 0 ? params.services : ['diseno_integral'];
  const groups = params.groups || [];
  
  // Regla especial de Asesoría:
  // "La asesoría vale lo mismo sea el espacio que sea. Cambia solo por m2. Vale por 1 espacio."
  const isOnlyAsesoria = services.length === 1 && services.includes('asesoria');

  // Si es solo asesoría, la regla de Euge dice:
  // "La asesoría vale lo mismo sea el espacio que sea. Cambia solo x m2. Vale x 1 espacio."
  if (isOnlyAsesoria) {
    const totalM2 = params.spaces.reduce((acc, s) => acc + (s.squareMeters || 15), 0) || 20;
    // Base asesoría fija $110.000 hasta 30m2, luego leve proporcional
    const baseAsesoria = 110000;
    const extraM2 = totalM2 > 30 ? (totalM2 - 30) * 1500 : 0;
    const finalAmount = baseAsesoria + extraM2;

    const transferDisc = Math.round(finalAmount * 0.20);
    const cuotaVal = Math.round(finalAmount / 3);

    return {
      services: ['asesoria'],
      selectedSpaces: params.spaces,
      spaceBreakdown: params.spaces.map(s => ({
        name: s.name,
        squareMeters: s.squareMeters,
        horasDisenoIntegral: 0,
        horasCarpetaTecnica: 0,
        horasTotales: 3, // 1h reunión + 2h confección de dossier
        basePrice: finalAmount
      })),
      totalSquareMeters: totalM2,
      totalHorasDiseno: 0,
      totalHorasCarpeta: 0,
      totalHoras: 3,
      subtotalBruto: finalAmount,
      descuentoEspaciosIntegrados: 0,
      detalleDescuentosIntegrados: [],
      subtotalEspacios: finalAmount,
      aplicaPackDescuento: false,
      descuentoPackPorcentaje: 0,
      descuentoPackMonto: 0,
      creditoAsesoriaAplicado: 0,
      codigoReinversion: `REINVIERTE-${Math.floor(100000 + Math.random() * 900000)}`,
      montoTotalBase: finalAmount,
      pagoCuotas: {
        cantidadCuotas: 3,
        valorPorCuota: cuotaVal,
        total: finalAmount
      },
      pagoTransferencia: {
        porcentajeDescuento: 20,
        montoAhorro: transferDisc,
        totalConDescuento: finalAmount - transferDisc
      }
    };
  }

  // Desglose de cada espacio individual
  const spaceItemsWithCost = params.spaces.map(space => {
    const config = catalog.find(c => c.id === space.spaceId) || {
      id: space.spaceId,
      name: space.name,
      category: 'social' as const,
      defaultM2: 15,
      basePriceARS: 150000,
      horasDisenoIntegral: 14,
      horasCarpetaTecnica: 10,
      description: ''
    };

    // Factor según servicios seleccionados:
    // Si incluye Diseño Integral y/o Carpeta Técnica
    let horasDiseno = 0;
    let horasCarpeta = 0;
    let serviceCostMultiplier = 0;

    if (services.includes('diseno_integral')) {
      horasDiseno = config.horasDisenoIntegral;
      serviceCostMultiplier += 1.0;
    }
    if (services.includes('carpeta_tecnica')) {
      horasCarpeta = config.horasCarpetaTecnica;
      // Carpeta técnica suma un 65% sobre la base de diseño si se pide aislada o combinada
      serviceCostMultiplier += 0.65;
    }
    if (services.includes('muebles_medida')) {
      serviceCostMultiplier += 0.40;
    }
    if (serviceCostMultiplier === 0) {
      serviceCostMultiplier = 1.0;
      horasDiseno = config.horasDisenoIntegral;
    }

    // Costo del espacio ajustado por m2: base + adicional si excede el tamaño medio
    const m2Difference = Math.max(0, space.squareMeters - config.defaultM2);
    const m2AdicionalCost = m2Difference * 6500;
    const singleSpaceCost = Math.round((config.basePriceARS * serviceCostMultiplier) + m2AdicionalCost);

    return {
      instanceId: space.instanceId,
      spaceId: space.spaceId,
      name: space.name,
      squareMeters: space.squareMeters,
      integratedGroupId: space.integratedGroupId,
      cost: singleSpaceCost,
      horasDiseno,
      horasCarpeta,
      horasTotales: horasDiseno + horasCarpeta
    };
  });

  // Agrupación y descuentos por integración
  // Reglas solicitadas por Euge:
  // - Si el grupo contiene 2 espacios: sumar los $ de ambos y restar el 50% del espacio más económico.
  // - Si el grupo contiene 3 espacios: sumar los $ de todos y restar el 50% del espacio más económico + 25% del siguiente en precio más bajo.
  // - Si el grupo contiene 4 espacios o más o es un monoambiente: sumar los $ de todos y restar el 50% del más económico + 25% de los 2 siguientes en precio más bajo.
  let descuentoEspaciosIntegrados = 0;
  const detalleDescuentosIntegrados: PricingCalculationResult['detalleDescuentosIntegrados'] = [];

  // Mapear por grupos
  const groupedSpaces: Record<string, typeof spaceItemsWithCost> = {};
  const ungroupedSpaces: typeof spaceItemsWithCost = [];

  spaceItemsWithCost.forEach(item => {
    if (item.integratedGroupId) {
      if (!groupedSpaces[item.integratedGroupId]) {
        groupedSpaces[item.integratedGroupId] = [];
      }
      groupedSpaces[item.integratedGroupId].push(item);
    } else {
      ungroupedSpaces.push(item);
    }
  });

  // Procesar cada grupo integrado
  Object.entries(groupedSpaces).forEach(([groupId, itemsInGroup]) => {
    const groupDef = groups.find(g => g.id === groupId);
    const groupName = groupDef?.name || `Ambiente Integrado (${itemsInGroup.map(i => i.name).join(' + ')})`;
    const count = itemsInGroup.length;
    const isMonoambiente = groupDef?.isMonoambiente || itemsInGroup.some(i => i.spaceId === 'monoambiente');

    // Ordenar de menor a mayor precio para aplicar el descuento al más económico
    const sortedByPrice = [...itemsInGroup].sort((a, b) => a.cost - b.cost);

    let groupDiscount = 0;
    let descExpl = '';

    if (count === 2 && !isMonoambiente) {
      // 50% del más económico
      const lowest = sortedByPrice[0];
      groupDiscount = Math.round(lowest.cost * 0.50);
      descExpl = `50% OFF en ${lowest.name} (el espacio más económico del grupo de 2)`;
    } else if (count === 3 && !isMonoambiente) {
      // 50% del más económico + 25% del siguiente
      const lowest = sortedByPrice[0];
      const secondLowest = sortedByPrice[1];
      const d1 = Math.round(lowest.cost * 0.50);
      const d2 = Math.round(secondLowest.cost * 0.25);
      groupDiscount = d1 + d2;
      descExpl = `50% OFF en ${lowest.name} + 25% OFF en ${secondLowest.name}`;
    } else if (count >= 4 || isMonoambiente) {
      // 50% del más económico + 25% de los 2 siguientes
      const lowest = sortedByPrice[0];
      const secondLowest = sortedByPrice[1] || lowest;
      const thirdLowest = sortedByPrice[2] || secondLowest;
      const d1 = Math.round(lowest.cost * 0.50);
      const d2 = Math.round(secondLowest.cost * 0.25);
      const d3 = Math.round(thirdLowest.cost * 0.25);
      groupDiscount = d1 + d2 + d3;
      descExpl = `50% OFF en ${lowest.name} + 25% OFF en ${secondLowest.name} y ${thirdLowest.name}`;
    }

    descuentoEspaciosIntegrados += groupDiscount;
    if (groupDiscount > 0) {
      detalleDescuentosIntegrados.push({
        groupName,
        spacesCount: count,
        discountAmount: groupDiscount,
        description: descExpl
      });
    }
  });

  const subtotalBruto = spaceItemsWithCost.reduce((sum, item) => sum + item.cost, 0);
  const subtotalEspacios = Math.max(0, subtotalBruto - descuentoEspaciosIntegrados);

  // Regla de PACK MULTI-SERVICIO:
  // "El 8% aplica SOLO si se suman DISEÑO INTEGRAL + CARPETA TECNICA."
  const isPack = services.includes('diseno_integral') && services.includes('carpeta_tecnica');
  const descuentoPackPorcentaje = isPack ? 8 : 0;
  const descuentoPackMonto = isPack ? Math.round(subtotalEspacios * 0.08) : 0;

  // Crédito de asesoría previa (reinversión):
  let creditoAsesoria = 0;
  if (params.hasAsesoriaCredit && services.includes('diseno_integral')) {
    creditoAsesoria = params.asesoriaCreditAmount || 110000;
  }

  const montoTotalBase = Math.max(0, subtotalEspacios - descuentoPackMonto - creditoAsesoria);

  // Formas de pago solicitadas:
  // "Si pagan por transferencia, tienen un 20% OFF. Sino pueden pagar en 3 cuotas (indicar total y valor de cada cuota)."
  const montoAhorroTransfer = Math.round(montoTotalBase * 0.20);
  const totalTransferencia = montoTotalBase - montoAhorroTransfer;
  const valorCuota = Math.round(montoTotalBase / 3);

  // Totales de horas
  const totalHorasDiseno = spaceItemsWithCost.reduce((sum, i) => sum + i.horasDiseno, 0);
  const totalHorasCarpeta = spaceItemsWithCost.reduce((sum, i) => sum + i.horasCarpeta, 0);
  const totalHoras = totalHorasDiseno + totalHorasCarpeta;
  const totalSquareMeters = params.spaces.reduce((sum, i) => sum + (i.squareMeters || 0), 0);

  return {
    services,
    selectedSpaces: params.spaces,
    spaceBreakdown: spaceItemsWithCost.map(i => ({
      name: i.name,
      squareMeters: i.squareMeters,
      horasDisenoIntegral: i.horasDiseno,
      horasCarpetaTecnica: i.horasCarpeta,
      horasTotales: i.horasTotales,
      basePrice: i.cost,
      groupName: i.integratedGroupId ? (groups.find(g => g.id === i.integratedGroupId)?.name || 'Integrado') : undefined
    })),
    totalSquareMeters,
    totalHorasDiseno,
    totalHorasCarpeta,
    totalHoras,
    subtotalBruto,
    descuentoEspaciosIntegrados,
    detalleDescuentosIntegrados,
    subtotalEspacios,
    aplicaPackDescuento: isPack,
    descuentoPackPorcentaje,
    descuentoPackMonto,
    creditoAsesoriaAplicado: creditoAsesoria,
    codigoReinversion: `REINVIERTE-${Math.floor(100000 + Math.random() * 900000)}`,
    montoTotalBase,
    pagoCuotas: {
      cantidadCuotas: 3,
      valorPorCuota: valorCuota,
      total: montoTotalBase
    },
    pagoTransferencia: {
      porcentajeDescuento: 20,
      montoAhorro: montoAhorroTransfer,
      totalConDescuento: totalTransferencia
    }
  };
}
