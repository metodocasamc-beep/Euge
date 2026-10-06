import React, { useState, useEffect } from 'react';
import { StudioSettings } from '../types';
import { 
  Save, 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  FileSpreadsheet, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  DollarSign, 
  Clock, 
  Info,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { 
  signInWithGoogleSheets, 
  fetchPricesFromGoogleSheets, 
  getGoogleAccessToken, 
  signOutGoogle 
} from '../services/googleSheetsService';
import { DEFAULT_SPACES_CATALOG, SpaceConfig } from '../utils/pricingEngine';

interface SettingsViewProps {
  settings: StudioSettings;
  onSettingsUpdated: (updated: StudioSettings) => void;
  onBackToDashboard: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsUpdated,
  onBackToDashboard,
}) => {
  const [formData, setFormData] = useState<StudioSettings>({
    ...settings,
    spacesCatalog: settings.spacesCatalog && settings.spacesCatalog.length > 0 
      ? settings.spacesCatalog 
      : DEFAULT_SPACES_CATALOG,
    googleSheetsConfig: settings.googleSheetsConfig || {
      connected: false,
      spreadsheetName: 'CALCULO VALORES DE SERVICIOS Método Casa',
      sheetName: '$ BASE - Detalle HS x ESPACIO',
      spreadsheetId: '',
      lastSyncedAt: 'No sincronizado aún'
    },
    discounts: settings.discounts || {
      transferenciaPercent: 20,
      packMultiServicePercent: 8
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Google Sheets Sync State
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(Boolean(getGoogleAccessToken()));
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [syncErrorMsg, setSyncErrorMsg] = useState<string | null>(null);
  const [customSheetId, setCustomSheetId] = useState(formData.googleSheetsConfig?.spreadsheetId || '');

  const handleGoogleConnect = async () => {
    try {
      setSyncErrorMsg(null);
      const res = await signInWithGoogleSheets();
      setIsGoogleLoggedIn(true);
      setSyncStatusMsg(`Conectado a Google con la cuenta: ${res.user.email}`);
    } catch (err: any) {
      setSyncErrorMsg(err.message || 'Error al iniciar sesión con Google.');
    }
  };

  const handleSyncSheets = async () => {
    setIsSyncingSheets(true);
    setSyncStatusMsg(null);
    setSyncErrorMsg(null);

    try {
      if (!isGoogleLoggedIn && !getGoogleAccessToken()) {
        await handleGoogleConnect();
      }

      const syncResult = await fetchPricesFromGoogleSheets(customSheetId.trim() || undefined);
      
      const updatedConfig = {
        connected: true,
        spreadsheetName: syncResult.spreadsheetName,
        sheetName: syncResult.sheetName,
        spreadsheetId: syncResult.spreadsheetId,
        lastSyncedAt: new Date().toLocaleString('es-AR')
      };

      const newFormData = {
        ...formData,
        spacesCatalog: syncResult.spacesParsed,
        googleSheetsConfig: updatedConfig
      };

      setFormData(newFormData);
      setSyncStatusMsg(`¡Planilla sincronizada con éxito! Se importaron ${syncResult.spacesParsed.length} ambientes y horas desde "${syncResult.sheetName}".`);
      
      // Auto-save settings in database
      const saved = await api.updateSettings(newFormData);
      onSettingsUpdated(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSyncErrorMsg(err.message || 'No se pudo sincronizar la planilla. Verificá permisos o ID.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateSettings(formData);
      onSettingsUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSpaceField = (index: number, field: keyof SpaceConfig, value: any) => {
    const list = [...(formData.spacesCatalog || DEFAULT_SPACES_CATALOG)];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, spacesCatalog: list });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d1c5]">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-[#1c2120]/70 hover:text-[#1c2120] flex items-center gap-1.5 mb-2 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al panel</span>
          </button>
          <h1 className="text-3xl font-heading font-extrabold text-[#1c2120]">
            Configurar Precios & Términos
          </h1>
          <p className="text-xs text-[#1c2120]/75 mt-1">
            Vinculá tu planilla de Google Sheets, modificá horas por espacio, reglas de integración y formas de pago.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Cambios guardados con éxito</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECCIÓN 1: VINCULACIÓN CON GOOGLE SHEETS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#1c2120] shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d9d1c5] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-700">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-[#1c2120]">
                  1. Planilla de Precios Google Sheets
                </h2>
                <p className="text-xs text-[#1c2120]/70">
                  Documento vinculado: <strong className="text-[#1c2120]">CALCULO VALORES DE SERVICIOS Método Casa</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isGoogleLoggedIn ? (
                <button
                  type="button"
                  onClick={handleGoogleConnect}
                  className="px-4 py-2.5 rounded-xl border border-[#d9d1c5] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#1c2120] flex items-center gap-2 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Conectar con Google</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Google conectado</span>
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOutGoogle();
                      setIsGoogleLoggedIn(false);
                    }}
                    className="text-[10px] text-[#1c2120]/60 hover:underline cursor-pointer"
                  >
                    Desconectar
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleSyncSheets}
                disabled={isSyncingSheets}
                className="px-4 py-2.5 rounded-xl bg-[#1c2120] hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#fed767] ${isSyncingSheets ? 'animate-spin' : ''}`} />
                <span>{isSyncingSheets ? 'Sincronizando...' : 'Sincronizar Planilla'}</span>
              </button>
            </div>
          </div>

          {/* Estado de sincronización & Info de la Hoja */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5]">
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 block mb-1">Nombre del Archivo</span>
              <span className="text-xs font-bold text-[#1c2120]">CALCULO VALORES DE SERVICIOS Método Casa</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5]">
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 block mb-1">Pestaña / Hoja Vinculada</span>
              <span className="text-xs font-bold text-emerald-800 font-mono">$ BASE - Detalle HS x ESPACIO</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#d9d1c5]">
              <span className="text-[10px] uppercase font-bold text-[#1c2120]/60 block mb-1">Última Sincronización</span>
              <span className="text-xs font-semibold text-[#1c2120]/80">
                {formData.googleSheetsConfig?.lastSyncedAt || 'Planilla base precargada'}
              </span>
            </div>
          </div>

          {/* Opcional: Link o ID directo */}
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-700 shrink-0" />
                <span>¿Es seguro https://gen-lang-client-0079379163.firebaseapp.com?</span>
              </div>
              <p className="text-[11px] text-blue-800">
                <strong>Sí, es 100% seguro.</strong> Es el dominio oficial de Google Cloud / Firebase creado específicamente para tu aplicación Método CASA para autenticarte de forma segura con tu cuenta de Google.
              </p>
              <p className="text-[11px] text-blue-800">
                <strong>Método directo sin popups:</strong> También podés simplemente <strong>pegar el enlace de tu planilla acá abajo</strong> (asegurándote de que esté compartida con "Cualquiera con el enlace puede ver") y presionar <strong>"Sincronizar Planilla"</strong>.
              </p>
            </div>

            <label className="block text-xs font-bold text-[#1c2120] mb-1">
              Enlace o ID de tu Google Sheet:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSheetId}
                onChange={(e) => {
                  setCustomSheetId(e.target.value);
                  setFormData({
                    ...formData,
                    googleSheetsConfig: {
                      ...(formData.googleSheetsConfig as any),
                      spreadsheetId: e.target.value
                    }
                  });
                }}
                placeholder="Pegá aquí el enlace de tu planilla (ej: https://docs.google.com/spreadsheets/d/...)"
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] font-mono text-[#1c2120]"
              />
            </div>
          </div>

          {syncStatusMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {syncErrorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{syncErrorMsg}</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  El sistema utiliza automáticamente el catálogo base de Euge mientras conectás tu cuenta.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: CATÁLOGO DE AMBIENTES, HORAS Y VALORES BASE */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#d9d1c5] space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#d9d1c5] pb-3">
            <div>
              <h2 className="text-lg font-heading font-bold text-[#1c2120]">
                2. Detalle de Horas & Valores Base por Espacio
              </h2>
              <p className="text-xs text-[#1c2120]/70 mt-0.5">
                Datos de la hoja <em>"$ BASE - Detalle HS x ESPACIO"</em>: horas de Diseño Integral y Carpeta Técnica calculadas para cada ambiente.
              </p>
            </div>
            <span className="text-xs font-bold text-[#1c2120] bg-[#f2ece4] px-3 py-1 rounded-full">
              {formData.spacesCatalog?.length || 0} ambientes configurados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]">
                  <th className="py-2.5 px-3 font-mont font-bold">Ambiente</th>
                  <th className="py-2.5 px-3 font-mont font-bold">M² Ref.</th>
                  <th className="py-2.5 px-3 font-mont font-bold">Hs. Diseño</th>
                  <th className="py-2.5 px-3 font-mont font-bold">Hs. Carpeta</th>
                  <th className="py-2.5 px-3 font-mont font-bold">Hs. Totales</th>
                  <th className="py-2.5 px-3 font-mont font-bold">Valor Base (ARS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9d1c5]/60 font-sans">
                {(formData.spacesCatalog || DEFAULT_SPACES_CATALOG).map((sp, idx) => {
                  const totalHs = (Number(sp.horasDisenoIntegral) || 0) + (Number(sp.horasCarpetaTecnica) || 0);
                  return (
                    <tr key={sp.id || idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#1c2120]">
                        <input
                          type="text"
                          value={sp.name}
                          onChange={(e) => updateSpaceField(idx, 'name', e.target.value)}
                          className="w-full bg-transparent border-0 font-semibold text-[#1c2120] focus:ring-1 focus:ring-[#1c2120] rounded px-1"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={sp.defaultM2}
                          onChange={(e) => updateSpaceField(idx, 'defaultM2', Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-xs rounded border border-[#d9d1c5] bg-white font-mono"
                        />
                        <span className="text-[10px] text-[#1c2120]/50 ml-1">m²</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={sp.horasDisenoIntegral}
                          onChange={(e) => updateSpaceField(idx, 'horasDisenoIntegral', Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-xs rounded border border-[#d9d1c5] bg-white font-mono text-center font-bold text-[#1c2120]"
                        />
                        <span className="text-[10px] text-[#1c2120]/50 ml-1">hs</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={sp.horasCarpetaTecnica}
                          onChange={(e) => updateSpaceField(idx, 'horasCarpetaTecnica', Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-xs rounded border border-[#d9d1c5] bg-white font-mono text-center font-bold text-[#1c2120]"
                        />
                        <span className="text-[10px] text-[#1c2120]/50 ml-1">hs</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#1c2120]">
                        <span className="px-2 py-0.5 rounded bg-[#fed767]/30 text-[#1c2120] font-mono">
                          {totalHs} hs
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center">
                          <span className="text-[10px] text-[#1c2120]/60 mr-1">$</span>
                          <input
                            type="number"
                            value={sp.basePriceARS}
                            onChange={(e) => updateSpaceField(idx, 'basePriceARS', Number(e.target.value))}
                            className="w-28 px-1.5 py-1 text-xs rounded border border-[#d9d1c5] bg-white font-mono font-bold text-[#1c2120]"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN 3: REGLAS COMERCIALES, ESPACIOS INTEGRADOS Y DESCUENTOS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#d9d1c5] space-y-6 shadow-xs">
          <h2 className="text-lg font-heading font-bold text-[#1c2120] border-b border-[#d9d1c5] pb-3">
            3. Reglas de Ambientes Integrados, Packs y Medios de Pago
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reglas de integración */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-3">
              <span className="font-mont font-bold text-xs uppercase tracking-wider text-[#1c2120] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#fed767]" />
                <span>Reglas de Espacios Integrados</span>
              </span>
              <ul className="text-xs text-[#1c2120]/80 space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Grupo de 2 espacios:</strong> Suma $ de ambos y resta el <strong>50% del más económico</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Grupo de 3 espacios:</strong> Suma $ de todos y resta el <strong>50% del más económico + 25% del siguiente</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Grupo de 4+ o Monoambiente:</strong> Resta el <strong>50% del más económico + 25% de los dos siguientes</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Descuentos de pago y packs */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-4">
              <span className="font-mont font-bold text-xs uppercase tracking-wider text-[#1c2120] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Descuentos Automáticos</span>
              </span>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c2120] mb-1">
                    Descuento por Transferencia Bancaria (% OFF)
                  </label>
                  <input
                    type="number"
                    value={formData.discounts?.transferenciaPercent ?? 20}
                    onChange={(e) => setFormData({
                      ...formData,
                      discounts: {
                        ...(formData.discounts || { packMultiServicePercent: 8, transferenciaPercent: 20 }),
                        transferenciaPercent: Number(e.target.value)
                      }
                    })}
                    className="w-24 px-3 py-1.5 text-xs rounded-xl border border-[#d9d1c5] bg-white font-mono font-bold text-[#1c2120]"
                  />
                  <span className="text-[11px] text-[#1c2120]/60 ml-2">Por defecto: 20% OFF directo</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c2120] mb-1">
                    PRECIO ESPECIAL x PACK (Multi-servicio % OFF)
                  </label>
                  <input
                    type="number"
                    value={formData.discounts?.packMultiServicePercent ?? 8}
                    onChange={(e) => setFormData({
                      ...formData,
                      discounts: {
                        ...(formData.discounts || { packMultiServicePercent: 8, transferenciaPercent: 20 }),
                        packMultiServicePercent: Number(e.target.value)
                      }
                    })}
                    className="w-24 px-3 py-1.5 text-xs rounded-xl border border-[#d9d1c5] bg-white font-mono font-bold text-[#1c2120]"
                  />
                  <span className="text-[11px] text-[#1c2120]/60 ml-2">Por defecto: 8% OFF (ej. Diseño + Carpeta)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regla de Asesoría y Reinversión */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#d9d1c5] space-y-2">
            <span className="text-xs font-bold text-[#1c2120] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#fed767]" />
              <span>Garantía de Reinversión de Asesoría en Diseño Integral</span>
            </span>
            <p className="text-xs text-[#1c2120]/80 leading-relaxed">
              La asesoría vale lo mismo para cualquier ambiente (ajusta solo por m² y vale por 1 espacio). Cada cliente que contrata asesoría recibe un <strong>Código Exclusivo de Reinversión</strong> para acreditar el 100% de lo abonado en caso de avanzar hacia Diseño Integral.
            </p>
          </div>
        </div>

        {/* SECCIÓN 4: DATOS BANCARIOS */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#d9d1c5] space-y-6 shadow-xs">
          <h2 className="text-lg font-heading font-bold text-[#1c2120] border-b border-[#d9d1c5] pb-3">
            4. Datos Bancarios para Transferencias
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">Banco</label>
              <input
                type="text"
                value={formData.bankDetails.bankName}
                onChange={(e) => setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">Titular</label>
              <input
                type="text"
                value={formData.bankDetails.holderName}
                onChange={(e) => setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, holderName: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] text-[#1c2120]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">Alias (copiable)</label>
              <input
                type="text"
                value={formData.bankDetails.alias}
                onChange={(e) => setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, alias: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] font-mono text-[#1c2120]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">CBU (copiable)</label>
              <input
                type="text"
                value={formData.bankDetails.cbu}
                onChange={(e) => setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, cbu: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] font-mono text-[#1c2120]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1c2120] mb-1">CUIT (copiable)</label>
              <input
                type="text"
                value={formData.bankDetails.cuit}
                onChange={(e) => setFormData({
                  ...formData,
                  bankDetails: { ...formData.bankDetails, cuit: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#d9d1c5] bg-[#FAF8F5] font-mono text-[#1c2120]"
              />
            </div>
          </div>
        </div>

        {/* Botón de Guardado General */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 text-xs font-bold text-[#1c2120] bg-[#fed767] hover:bg-[#f2c94c] rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
