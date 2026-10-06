import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { SpaceConfig, DEFAULT_SPACES_CATALOG } from '../utils/pricingEngine';

// Initialize Firebase App only once
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

// In-memory token cache (NEVER in localStorage/sessionStorage as required)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const signInWithGoogleSheets = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google. Verificá que las ventanas emergentes no estén bloqueadas.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface SheetSyncResult {
  spreadsheetId: string;
  spreadsheetName: string;
  sheetName: string;
  spacesParsed: SpaceConfig[];
  rowCount: number;
  syncedAt: string;
}

/**
 * Extrae el Spreadsheet ID si el usuario pegó la URL completa de Google Sheets
 */
export function extractSpreadsheetId(urlOrId: string): string {
  const match = urlOrId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrId.trim();
}

/**
 * Busca en Google Drive o lee el documento de cálculo de valores
 * y extrae los datos de la hoja "$ BASE - Detalle HS x ESPACIO".
 */
export async function fetchPricesFromGoogleSheets(
  providedInput?: string
): Promise<SheetSyncResult> {
  const targetDocName = 'CALCULO VALORES DE SERVICIOS Método Casa';
  const targetSheetName = '$ BASE - Detalle HS x ESPACIO';
  let spreadsheetId = providedInput ? extractSpreadsheetId(providedInput) : undefined;
  const token = getGoogleAccessToken();

  // 1. Si no hay ID provisto y tenemos token, buscar por nombre en Drive
  if (!spreadsheetId && token) {
    try {
      const q = encodeURIComponent(`name contains 'CALCULO VALORES DE SERVICIOS' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
      const driveRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (driveRes.ok) {
        const driveData = await driveRes.json();
        if (driveData.files && driveData.files.length > 0) {
          spreadsheetId = driveData.files[0].id;
        }
      }
    } catch (err) {
      console.warn('Búsqueda por nombre en Drive:', err);
    }
  }

  // 2. Si hay ID o URL provista, intentar primero lectura directa por GVIZ (ideal si el enlace está compartido)
  if (spreadsheetId) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(targetSheetName)}`;
      const gvizRes = await fetch(gvizUrl);
      if (gvizRes.ok) {
        const csvText = await gvizRes.text();
        if (csvText && csvText.length > 50 && !csvText.includes('<!DOCTYPE html>')) {
          const parsedFromCsv = parseCsvRows(csvText);
          if (parsedFromCsv.length > 0) {
            return {
              spreadsheetId,
              spreadsheetName: targetDocName,
              sheetName: targetSheetName,
              spacesParsed: parsedFromCsv,
              rowCount: parsedFromCsv.length,
              syncedAt: new Date().toLocaleString('es-AR')
            };
          }
        }
      }
    } catch (gvizErr) {
      console.warn('Gviz read failed, trying authenticated Google Sheets API:', gvizErr);
    }
  }

  // 3. Si no funcionó gviz y tenemos token, leer vía Google Sheets API v4
  if (spreadsheetId && token) {
    const range = encodeURIComponent(`'${targetSheetName}'!A1:Z60`);
    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (sheetsRes.ok) {
      const sheetsData = await sheetsRes.json();
      const rows: any[][] = sheetsData.values || [];
      const parsed = parseSheetRows(rows);
      return {
        spreadsheetId,
        spreadsheetName: targetDocName,
        sheetName: targetSheetName,
        spacesParsed: parsed.length > 0 ? parsed : DEFAULT_SPACES_CATALOG,
        rowCount: rows.length,
        syncedAt: new Date().toLocaleString('es-AR')
      };
    }
  }

  // Si no se pudo de ninguna forma, informar con guía clara
  if (!spreadsheetId) {
    throw new Error(`Por favor pegá el link o ID de tu documento de Google Sheets "${targetDocName}" para sincronizarlo.`);
  }

  throw new Error(`No se pudo leer la hoja "${targetSheetName}". Asegurate de que la planilla tenga permisos de lectura ("Cualquiera con el vínculo puede ver") o iniciá sesión con Google.`);
}

function parseCsvRows(csvText: string): SpaceConfig[] {
  const lines = csvText.split('\n').filter(l => l.trim().length > 0);
  const rows = lines.map(line => {
    // Basic CSV split respecting quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null && matches.length < 15) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
    }
    return matches;
  });

  return parseSheetRows(rows);
}

function parseSheetRows(rows: any[][]): SpaceConfig[] {
  const parsedSpaces: SpaceConfig[] = [];

  rows.slice(1).forEach((row, idx) => {
    const spaceName = row[0]?.toString().trim();
    if (!spaceName || spaceName.toLowerCase().includes('total')) return;

    const basePriceRaw = row[1] || row[2] || row[3];
    const horasDisenoRaw = row[2] || row[3] || row[4];
    const horasCarpetaRaw = row[3] || row[4] || row[5];
    const m2Raw = row[4] || row[5] || 15;

    const basePrice = Number(String(basePriceRaw).replace(/[^0-9]/g, '')) || 150000;
    const horasDiseno = Number(String(horasDisenoRaw).replace(/[^0-9]/g, '')) || 14;
    const horasCarpeta = Number(String(horasCarpetaRaw).replace(/[^0-9]/g, '')) || 10;
    const defaultM2 = Number(String(m2Raw).replace(/[^0-9]/g, '')) || 15;

    const matchedDefault = DEFAULT_SPACES_CATALOG.find(
      d => d.name.toLowerCase() === spaceName.toLowerCase() || spaceName.toLowerCase().includes(d.id)
    );

    parsedSpaces.push({
      id: matchedDefault?.id || `espacio_custom_${idx}`,
      name: spaceName,
      category: matchedDefault?.category || 'social',
      defaultM2: defaultM2 || matchedDefault?.defaultM2 || 15,
      basePriceARS: basePrice || matchedDefault?.basePriceARS || 160000,
      horasDisenoIntegral: horasDiseno || matchedDefault?.horasDisenoIntegral || 14,
      horasCarpetaTecnica: horasCarpeta || matchedDefault?.horasCarpetaTecnica || 10,
      description: matchedDefault?.description || `Diseño y documentación técnica según planilla para ${spaceName}.`
    });
  });

  return parsedSpaces;
}
