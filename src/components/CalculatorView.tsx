import React, { useState, useMemo } from 'react';
import { StudioSettings, ServiceType } from '../types';
import { formatARS } from '../utils/dateUtils';
import { 
  Check, 
  ArrowRight, 
  Share2, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Layers, 
  DollarSign, 
  CreditCard, 
  Info,
  Link2
} from 'lucide-react';
import { api } from '../services/api';
import { 
  DEFAULT_SPACES_CATALOG, 
  calculateProjectPricing, 
  SelectedSpaceItem, 
  IntegratedGroup,
  SpaceConfig 
} from '../utils/pricingEngine';

interface CalculatorViewProps {
  settings: StudioSettings;
  onAdvanceToBooking: (calcData: {
    serviceType: ServiceType;
    roomsCount: number;
    squareMeters: number;
    roomTypes: string[];
    estimatedAmount: number;
    selectedServices?: ServiceType[];
  }) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  settings,
  onAdvanceToBooking,
}) => {
  const catalog: SpaceConfig[] = settings.spacesCatalog && settings.spacesCatalog.length > 0 
    ? settings.spacesCatalog 
    : DEFAULT_SPACES_CATALOG;

  // Selected services (multi-select)
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['diseno_integral']);
  
  // Selected spaces list - default 2 clean spaces
  const [selectedSpaces, setSelectedSpaces] = useState<SelectedSpaceItem[]>([
    {
      instanceId: 'space_1',
      spaceId: 'living',
      name: 'Living',
      squareMeters: 20,
      integratedGroupId: 'group_1'
    },
    {
      instanceId: 'space_2',
      spaceId: 'comedor',
      name: 'Comedor',
      squareMeters: 14,
      integratedGroupId: 'group_1'
    }
  ]);

  // Integrated groups definition
  const [integratedGroups, setIntegratedGroups] = useState<IntegratedGroup[]>([
    { id: 'group_1', name: 'Ambiente Integrado' }
  ]);

  // Credit from previous asesoría
  const [hasAsesoriaCredit, setHasAsesoriaCredit] = useState(false);
  const [asesoriaCodeInput, setAsesoriaCodeInput] = useState('');
  const [creditCodeValidated, setCreditCodeValidated] = useState(false);

  // Send quote state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [selectedPaymentTab, setSelectedPaymentTab] = useState<'transferencia' | 'cuotas'>('transferencia');

  // Toggle service selection
  const toggleService = (srv: ServiceType) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // Add space directly from catalog
  const handleAddSpace = (spaceId: string) => {
    const spaceConfig = catalog.find(c => c.id === spaceId);
    if (!spaceConfig) return;

    const newSpace: SelectedSpaceItem = {
      instanceId: `space_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      spaceId: spaceConfig.id,
      name: spaceConfig.name,
      squareMeters: spaceConfig.defaultM2,
      integratedGroupId: null
    };

    setSelectedSpaces([...selectedSpaces, newSpace]);
  };

  // Remove space
  const handleRemoveSpace = (instanceId: string) => {
    if (selectedSpaces.length <= 1) return;
    setSelectedSpaces(selectedSpaces.filter(s => s.instanceId !== instanceId));
  };

  // Update space m2
  const handleUpdateM2 = (instanceId: string, m2: number) => {
    setSelectedSpaces(selectedSpaces.map(s => {
      if (s.instanceId === instanceId) {
        return { ...s, squareMeters: Math.max(1, m2) };
      }
      return s;
    }));
  };

  // Link / integrate a space with another selected space
  const handleLinkSpaceWithAnother = (instanceId: string, targetInstanceId: string | 'none') => {
    if (targetInstanceId === 'none') {
      // Unlink
      setSelectedSpaces(selectedSpaces.map(s => {
        if (s.instanceId === instanceId) {
          return { ...s, integratedGroupId: null };
        }
        return s;
      }));
      return;
    }

    const currentSpace = selectedSpaces.find(s => s.instanceId === instanceId);
    const targetSpace = selectedSpaces.find(s => s.instanceId === targetInstanceId);
    if (!currentSpace || !targetSpace) return;

    // Use existing group of target space or create a new group
    let groupId = targetSpace.integratedGroupId;
    if (!groupId) {
      groupId = `group_${Date.now()}`;
      const newGroup: IntegratedGroup = {
        id: groupId,
        name: `${targetSpace.name} + ${currentSpace.name}`
      };
      setIntegratedGroups(prev => [...prev, newGroup]);
    }

    setSelectedSpaces(selectedSpaces.map(s => {
      if (s.instanceId === instanceId || s.instanceId === targetInstanceId) {
        return { ...s, integratedGroupId: groupId };
      }
      return s;
    }));
  };

  // Validate Asesoría code
  const handleValidateCode = () => {
    if (asesoriaCodeInput.trim().toUpperCase().includes('REINVIERTE') || asesoriaCodeInput.trim().length >= 6) {
      setCreditCodeValidated(true);
      setHasAsesoriaCredit(true);
    } else {
      alert('Por favor ingresá un código válido de reinversión emitido en tu Asesoría previa.');
    }
  };

  // Calculation results
  const calculation = useMemo(() => {
    return calculateProjectPricing({
      services: selectedServices,
      spaces: selectedSpaces,
      groups: integratedGroups,
      hasAsesoriaCredit: hasAsesoriaCredit,
      asesoriaCreditAmount: settings.servicePrices?.asesoria?.basePriceARS || 110000,
      catalog
    });
  }, [selectedServices, selectedSpaces, integratedGroups, hasAsesoriaCredit, settings, catalog]);

  const isPackEligible = selectedServices.includes('diseno_integral') && selectedServices.includes('carpeta_tecnica');

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    const summaryText = `Cotización Método CASA:\n• Servicios: ${selectedServices.join(', ')}\n• Ambientes: ${selectedSpaces.map(s => s.name).join(', ')} (${calculation.totalSquareMeters} m²)\n• Transferencia 20% OFF: ${formatARS(calculation.pagoTransferencia.totalConDescuento)}\n• O en 3 cuotas de: ${formatARS(calculation.pagoCuotas.valorPorCuota)}`;

    await api.recordAbandonment({
      name: clientName || 'Interesado Calculadora',
      email: 'via_whatsapp@metodocasa.com',
      phone: clientPhone,
      stage: 'cotizacion',
      serviceType: selectedServices[0] || 'diseno_integral',
      squareMeters: calculation.totalSquareMeters,
      notes: summaryText
    });

    const summaryMsg = encodeURIComponent(
      `¡Hola Euge! Acabo de calcular mi proyecto en la calculadora de Método CASA:\n\n` +
      `• Servicios: ${selectedServices.map(s => s.replace('_', ' ').toUpperCase()).join(' + ')}\n` +
      `• Ambientes: ${selectedSpaces.map(s => `${s.name} (${s.squareMeters}m²)`).join(' + ')}\n` +
      `• Superficie total: ${calculation.totalSquareMeters} m²\n` +
      `• Transferencia (20% OFF): ${formatARS(calculation.pagoTransferencia.totalConDescuento)}\n` +
      `• O en 3 cuotas de: ${formatARS(calculation.pagoCuotas.valorPorCuota)} (Total: ${formatARS(calculation.pagoCuotas.total)})\n\n` +
      `Mi nombre es ${clientName || 'Cliente'}. Quisiera consultar disponibilidad para comenzar.`
    );
    window.open(`https://wa.me/${settings.eugeWhatsApp.replace(/[^0-9]/g, '')}?text=${summaryMsg}`, '_blank');
    setLeadSaved(true);
    setTimeout(() => setLeadSaved(false), 5000);
  };

  const handleShare = () => {
    const text = `Presupuesto estimado Método CASA:\nServicios: ${selectedServices.join(' + ')}\nAmbientes: ${selectedSpaces.map(s => s.name).join(' + ')} (${calculation.totalSquareMeters} m²)\nTransferencia 20% OFF: ${formatARS(calculation.pagoTransferencia.totalConDescuento)}\nO 3 cuotas de: ${formatARS(calculation.pagoCuotas.valorPorCuota)}\nCalculá el tuyo en: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fed767]/30 border border-[#fed767] text-[11px] font-bold text-[#1c2120] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#1c2120]" />
          <span>Calculadora Oficial & Transparente</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-[#1c2120] tracking-tight leading-tight">
          Calculá el valor exacto de tu proyecto.
        </h1>

        <p className="text-sm md:text-base text-[#1c2120]/80 leading-relaxed font-normal">
          Elegí los ambientes que querés diseñar, indicá los m² y si se encuentran integrados entre sí. El valor se calcula en tiempo real con <strong>20% OFF por transferencia</strong> o en <strong>3 cuotas fijas</strong>.
        </p>

        {/* Mensaje de Euge */}
        <div className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-white rounded-[2rem_1rem_2.2rem_1.2rem] border border-[#d9d1c5] shadow-xs max-w-2xl text-left">
          <div className="relative shrink-0">
            <img
              src="/src/assets/images/euge_avatar_talking_1790777128105.jpg"
              alt="Euge"
              className="w-12 h-12 rounded-full object-cover border-2 border-white ring-2 ring-[#fed767] shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <p className="font-hand text-lg sm:text-xl text-[#1c2120] leading-snug">
              “Muestro mis precios para que no sea una traba contactarme. Sabés cuánto cuesta y qué vas a recibir antes de escribirme.”
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DE SERVICIOS Y AMBIENTES */}
        <div className="lg:col-span-7 space-y-8">
          {/* PASO 1: SELECCIÓN DE SERVICIOS (8% OFF SOLO PARA DISEÑO INTEGRAL + CARPETA TÉCNICA) */}
          <div className="bg-white p-6 rounded-3xl border border-[#d9d1c5] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1c2120]">
                1. Seleccioná el o los servicios a contratar
              </label>
              {isPackEligible && (
                <span className="px-2.5 py-1 rounded-full bg-[#fed767] text-[#1c2120] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  ¡Pack Especial 8% OFF (Diseño + Carpeta)!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'diseno_integral' as ServiceType,
                  title: 'Diseño Integral / 3D',
                  desc: 'Propuesta 3D completa, zonificación, paleta de colores, catálogo de compras y video explicativo.',
                  badge: 'Servicio Principal'
                },
                {
                  id: 'carpeta_tecnica' as ServiceType,
                  title: 'Carpeta Técnica',
                  desc: 'Planos acotados milimétricos, replanteo eléctrico, tomas de luz y despieces para gremios.',
                  badge: 'Para reformas / obra'
                },
                {
                  id: 'asesoria' as ServiceType,
                  title: 'Asesoría Online (Meet + Dossier)',
                  desc: 'Reunión en vivo para destrabar dudas puntuales, revisar distribución y definir prioridades.',
                  badge: '100% Reinvertible'
                },
                {
                  id: 'muebles_medida' as ServiceType,
                  title: 'Diseño de Muebles a Medida',
                  desc: 'Muebles de TV, bibliotecas, vestidores o placards con planos listos para carpintero.',
                  badge: 'A medida'
                }
              ].map(srv => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => toggleService(srv.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1c2120] text-white border-[#1c2120] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#1c2120] border-[#d9d1c5] hover:border-[#1c2120]/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mont font-bold uppercase px-2 py-0.5 rounded ${
                          isSelected ? 'bg-[#fed767] text-[#1c2120]' : 'bg-[#f2ece4] text-[#1c2120]/70'
                        }`}>
                          {srv.badge}
                        </span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-[#fed767] border-[#fed767]' : 'border-[#d9d1c5]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-[#1c2120]" />}
                        </div>
                      </div>
                      <h4 className="font-mont font-bold text-sm leading-tight">{srv.title}</h4>
                      <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? 'text-white/80' : 'text-[#1c2120]/70'}`}>
                        {srv.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Aviso especial de Asesoría Reinvertible */}
            {selectedServices.includes('asesoria') && (
              <div className="p-3.5 rounded-2xl bg-[#fed767]/20 border border-[#fed767] text-xs text-[#1c2120] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#1c2120] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Regla de Asesoría:</strong> Vale lo mismo sea el ambiente que sea (ajusta sólo por m² y vale por 1 espacio). Además, <strong>se te reinvierte el 100%</strong> de lo abonado con un código exclusivo si luego decidís avanzar hacia Diseño Integral.
                </p>
              </div>
            )}
          </div>

          {/* PASO 2: AGREGAR AMBIENTE Y VINCULACIÓN ENTRE ESPACIOS */}
          <div className="bg-white p-6 rounded-3xl border border-[#d9d1c5] space-y-6 shadow-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1c2120]">
                2. Agregar ambiente a la cotización:
              </label>
              <p className="text-xs text-[#1c2120]/70 mt-0.5">
                Hacé clic en el espacio que querés sumar. Luego podés indicar sus m² y si se vincula con otro ambiente.
              </p>
            </div>

            {/* Botones para agregar ambiente */}
            <div className="flex flex-wrap gap-2">
              {catalog.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleAddSpace(cat.id)}
                  className="px-3.5 py-2 rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] hover:bg-[#fed767]/30 hover:border-[#1c2120] text-xs font-semibold text-[#1c2120] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#1c2120]/60" />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Lista de ambientes agregados con selector de vinculación */}
            <div className="space-y-4 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/60 block border-b border-[#d9d1c5]/60 pb-1">
                Tus ambientes seleccionados ({selectedSpaces.length}):
              </span>

              {selectedSpaces.map((item, idx) => {
                const isIntegrated = Boolean(item.integratedGroupId);
                // Other spaces available to link with
                const otherSpaces = selectedSpaces.filter(s => s.instanceId !== item.instanceId);

                return (
                  <div
                    key={item.instanceId}
                    className={`p-4 rounded-2xl border transition-all ${
                      isIntegrated 
                        ? 'bg-amber-50/50 border-amber-300' 
                        : 'bg-[#FAF8F5] border-[#d9d1c5]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Nombre y Número */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mont font-bold text-sm text-[#1c2120]">
                            {idx + 1}. {item.name}
                          </span>
                          {isIntegrated && (
                            <span className="px-2 py-0.5 rounded-md bg-[#fed767] text-[#1c2120] text-[10px] font-bold">
                              Integrado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Selector de m2 */}
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#d9d1c5]">
                          <span className="text-[11px] text-[#1c2120]/60 font-medium">Superficie:</span>
                          <input
                            type="number"
                            min="2"
                            max="300"
                            value={item.squareMeters}
                            onChange={(e) => handleUpdateM2(item.instanceId, Number(e.target.value))}
                            className="w-12 text-xs font-bold text-center text-[#1c2120] font-mono focus:outline-none"
                          />
                          <span className="text-[11px] font-bold text-[#1c2120]">m²</span>
                        </div>

                        {/* Eliminar ambiente */}
                        {selectedSpaces.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSpace(item.instanceId)}
                            className="p-1.5 text-[#1c2120]/40 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Quitar este ambiente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Selector de vinculación con otro espacio */}
                    {otherSpaces.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#d9d1c5]/60 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                        <span className="text-[#1c2120]/70 flex items-center gap-1 font-medium">
                          <Link2 className="w-3.5 h-3.5 text-[#1c2120]/50" />
                          ¿Se integra con otro espacio?
                        </span>
                        <select
                          value={
                            item.integratedGroupId 
                              ? (selectedSpaces.find(s => s.instanceId !== item.instanceId && s.integratedGroupId === item.integratedGroupId)?.instanceId || 'none')
                              : 'none'
                          }
                          onChange={(e) => handleLinkSpaceWithAnother(item.instanceId, e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-[#d9d1c5] bg-white text-xs font-semibold text-[#1c2120] focus:outline-none focus:border-[#1c2120]"
                        >
                          <option value="none">No, es un ambiente independiente</option>
                          {otherSpaces.map(os => (
                            <option key={os.instanceId} value={os.instanceId}>
                              Sí, integrado con {os.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 3: CRÉDITO DE ASESORÍA REINVERTIBLE */}
          <div className="bg-white p-6 rounded-3xl border border-[#d9d1c5] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#fed767]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1c2120]">
                  ¿Hiciste una Asesoría previa con Euge?
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAsesoriaCredit}
                  onChange={(e) => setHasAsesoriaCredit(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1c2120]"></div>
              </label>
            </div>

            {hasAsesoriaCredit && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>¡Garantía de reinversión activa!</strong> Si realizaste tu Asesoría Online, te descontamos el 100% de lo que pagaste (${formatARS(settings.servicePrices?.asesoria?.basePriceARS || 110000)}) como parte de pago del Diseño Integral.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={asesoriaCodeInput}
                    onChange={(e) => setAsesoriaCodeInput(e.target.value)}
                    placeholder="Ingresá tu código (ej: REINVIERTE-492019)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-emerald-300 bg-white font-mono uppercase text-[#1c2120]"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCode}
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: RESUMEN ECONÓMICO Y MEDIOS DE PAGO */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#ffffff] rounded-3xl border-2 border-[#1c2120] p-6 sm:p-7 shadow-md space-y-6">
            <div className="border-b border-[#d9d1c5] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1c2120]/60 block mb-1">
                Presupuesto Estimado
              </span>
              <h3 className="font-mont font-extrabold text-2xl text-[#1c2120]">
                Resumen de tu Cotización
              </h3>
              <p className="text-xs text-[#1c2120]/70 mt-1">
                {selectedSpaces.length} ambiente(s) · {calculation.totalSquareMeters} m² totales
              </p>
            </div>

            {/* Desglose numérico limpio sin detalles internos */}
            <div className="space-y-2.5 text-xs text-[#1c2120]/80">
              <div className="flex justify-between">
                <span>Subtotal por ambientes:</span>
                <span className="font-mono font-semibold">{formatARS(calculation.subtotalBruto)}</span>
              </div>

              {/* Descuento por varios ambientes (resumido como pidió Euge) */}
              {calculation.descuentoEspaciosIntegrados > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold py-1 border-y border-[#d9d1c5]/60">
                  <span>✓ Descuento por varios ambientes:</span>
                  <span className="font-mono">-{formatARS(calculation.descuentoEspaciosIntegrados)}</span>
                </div>
              )}

              {/* Descuento Pack 8% SOLO para Diseño + Carpeta */}
              {calculation.aplicaPackDescuento && (
                <div className="flex justify-between text-emerald-800 font-bold py-1">
                  <span>✓ Descuento Pack Diseño + Carpeta (8% OFF):</span>
                  <span className="font-mono">-{formatARS(calculation.descuentoPackMonto)}</span>
                </div>
              )}

              {/* Crédito de Asesoría */}
              {calculation.creditoAsesoriaAplicado > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold py-1">
                  <span>✓ Crédito Asesoría Bonificada:</span>
                  <span className="font-mono">-{formatARS(calculation.creditoAsesoriaAplicado)}</span>
                </div>
              )}
            </div>

            {/* TABS DE FORMAS DE PAGO (TRANSFERENCIA 20% OFF VS 3 CUOTAS) */}
            <div className="space-y-3 pt-2">
              <div className="flex rounded-2xl bg-[#f2ece4] p-1 border border-[#d9d1c5]">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('transferencia')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentTab === 'transferencia'
                      ? 'bg-[#1c2120] text-white shadow-xs'
                      : 'text-[#1c2120]/70 hover:text-[#1c2120]'
                  }`}
                >
                  Transferencia (20% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentTab('cuotas')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPaymentTab === 'cuotas'
                      ? 'bg-[#1c2120] text-white shadow-xs'
                      : 'text-[#1c2120]/70 hover:text-[#1c2120]'
                  }`}
                >
                  Hasta 3 Cuotas
                </button>
              </div>

              {selectedPaymentTab === 'transferencia' ? (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Total Abonando por Transferencia
                  </span>
                  <div className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120]">
                    {formatARS(calculation.pagoTransferencia.totalConDescuento)}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Ahorrás {formatARS(calculation.pagoTransferencia.montoAhorro)} (20% de descuento directo)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] text-center space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/70 block">
                    3 Cuotas fijas con Mercado Pago
                  </span>
                  <div className="font-mont font-extrabold text-3xl sm:text-4xl text-[#1c2120]">
                    3 x {formatARS(calculation.pagoCuotas.valorPorCuota)}
                  </div>
                  <p className="text-xs text-[#1c2120]/60">
                    Total financiado: {formatARS(calculation.pagoCuotas.total)} ARS
                  </p>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onAdvanceToBooking({
                  serviceType: selectedServices[0] || 'diseno_integral',
                  roomsCount: selectedSpaces.length,
                  squareMeters: calculation.totalSquareMeters,
                  roomTypes: selectedSpaces.map(s => s.name),
                  estimatedAmount: selectedPaymentTab === 'transferencia' 
                    ? calculation.pagoTransferencia.totalConDescuento 
                    : calculation.pagoCuotas.total,
                  selectedServices
                })}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#fed767] hover:bg-[#f2c94c] text-[#1c2120] font-mont font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <span>Avanzar a Reserva Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-2.5 px-4 rounded-xl border border-[#d9d1c5] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1c2120] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? '¡Enlace copiado al portapapeles!' : 'Compartir o guardar cotización'}</span>
              </button>
            </div>

            {/* Enviar presupuesto a WhatsApp */}
            <form onSubmit={handleSendQuote} className="pt-4 border-t border-[#d9d1c5] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1c2120]/70 block">
                ¿Querés recibirlo por WhatsApp o consultarme directo?
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120]"
                />

                <input
                  type="tel"
                  placeholder="Tu WhatsApp (ej: 11 2391 0626)"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] focus:outline-none focus:border-[#1c2120]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1c2120] hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#fed767]" />
                <span>Enviar cotización a mi WhatsApp</span>
              </button>

              {leadSaved && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Abriendo WhatsApp para que me escribas con todo listo!</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
