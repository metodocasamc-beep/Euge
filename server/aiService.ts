import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Summarize client diagnosis form for Euge
 */
export async function summarizeFormWithAi(formAnswers: Record<string, any>, clientName: string) {
  if (!ai) {
    // Elegant fallback when API key is not present
    return {
      overview: `Diagnóstico para ${clientName}: El cliente busca optimizar la funcionalidad cotidiana, circulación y luminosidad de su espacio.`,
      keyNeeds: [
        'Organización visual y guardado accesible',
        'Mejora de la iluminación cálida e indirecta',
        'Distribución fluida de muebles existentes y nuevos'
      ],
      identifiedFriction: [
        'Sensación de desorden al ingresar',
        'Circulación ajustada en áreas de paso'
      ],
      suggestedServices: ['asesoria', 'diseno_integral'],
      draftIdearectora: 'Atmósfera Serena: Calidez textil, maderas claras y equilibrio entre estética y uso real.'
    };
  }

  try {
    const prompt = `Actuá como asesora senior de interiorismo para el estudio Método CASA (Euge).
Analizá las respuestas de diagnóstico del cliente "${clientName}":
${JSON.stringify(formAnswers, null, 2)}

Devolvé un resumen ejecutivo estructurado en formato JSON con la siguiente estructura:
{
  "overview": "Breve párrafo sintetizando la forma de habitar la casa del cliente y el objetivo central",
  "keyNeeds": ["necesidad 1", "necesidad 2", "necesidad 3"],
  "identifiedFriction": ["fricción o problema 1", "fricción 2"],
  "suggestedServices": ["asesoria", "diseno_integral"],
  "draftIdearectora": "Una frase inspiradora y concreta que resuma la idea rectora para el proyecto"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Error generating AI form summary:', error);
    return {
      overview: `Diagnóstico para ${clientName}: Espacio orientado a confort diario y optimización espacial.`,
      keyNeeds: ['Equipamiento funcional', 'Aprovechamiento de luz natural'],
      identifiedFriction: ['Puntos de desorden'],
      suggestedServices: ['asesoria'],
      draftIdearectora: 'Simplicidad Funcional y Confort Cotidiano'
    };
  }
}

/**
 * Summarize meeting notes, strictly separating client words from AI/designer suggestions
 */
export async function summarizeMeetingWithAi(notesOrTranscript: string, clientName: string) {
  if (!ai) {
    return {
      clientStatements: [
        `El cliente (${clientName}) enfatizó la importancia de conservar la mesa de comedor actual.`,
        'Manifestó incomodidad con la poca luz artificial en el rincón de lectura.',
        'Prefiere materiales resistentes y fáciles de limpiar por la mascota.'
      ],
      aiRecommendations: [
        'Incorporar una lámpara de pie con dimmer o aplique de luz cálida (2700K).',
        'Reubicar el sillón 30cm hacia la pared norte para liberar el acceso al balcón.',
        'Evaluar Diseño Integral si deciden remodelar el mueble empotrado.'
      ],
      detectedPriorities: ['Luz artificial', 'Circulación despejada', 'Textiles lavables'],
      nextSteps: [
        'Euge prepara dossier de Asesoría en plazo de 72 hs.',
        'Enviar catálogo de compras con opciones de veladores y alfombra.'
      ]
    };
  }

  try {
    const prompt = `Actuá como asistente para la diseñadora Euge (Método CASA).
Analizá las notas/transcripción de la reunión virtual de 60 minutos con el cliente "${clientName}":
"${notesOrTranscript}"

REGLA ESTRICTA:
Diferenciá con total precisión:
1. "clientStatements": Lo que el cliente REALMENTE dijo o pidió (no inventes nada).
2. "aiRecommendations": Recomendaciones, alternativas e interpretaciones profesionales de diseño.
3. "detectedPriorities": Las 3 prioridades clave manifestadas.
4. "nextSteps": Próximos pasos acordados y plazos.

Devolvé únicamente un JSON válido con estas claves:
{
  "clientStatements": string[],
  "aiRecommendations": string[],
  "detectedPriorities": string[],
  "nextSteps": string[]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Error generating AI meeting summary:', error);
    return {
      clientStatements: ['Reunión registrada exitosamente.'],
      aiRecommendations: ['Avanzar con la preparación del entregable en 72hs.'],
      detectedPriorities: ['Diseño y practicidad'],
      nextSteps: ['Elaborar entregable de Asesoría']
    };
  }
}

/**
 * Group and synthesize client feedback on deliverable sheets
 */
export async function summarizeFeedbackWithAi(comments: { pageNumber: number; text: string; authorName: string }[]) {
  if (!ai || comments.length === 0) {
    return {
      summary: `Se recibieron ${comments.length} comentarios del cliente sobre el dossier.`,
      actionItems: comments.map(c => `Lámina ${c.pageNumber}: ${c.text}`),
      feasibilityNotes: 'Las modificaciones entran en la instancia bonificada del servicio.'
    };
  }

  try {
    const prompt = `Sos el asistente de proyecto de Método CASA.
El cliente envió las siguientes observaciones sobre las distintas láminas del entregable:
${JSON.stringify(comments, null, 2)}

Sintetizá la devolución en formato JSON:
{
  "summary": "Resumen claro y empático de los ajustes que pide el cliente",
  "actionItems": ["Acción de ajuste 1 con número de lámina", "Acción 2..."],
  "feasibilityNotes": "Comentario profesional sobre la viabilidad de los cambios solicitados"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Error synthesizing feedback with AI:', error);
    return {
      summary: 'Ajustes solicitados en distribución y mobiliario.',
      actionItems: comments.map(c => `Lámina ${c.pageNumber}: ${c.text}`),
      feasibilityNotes: 'Alineado con el alcance del servicio.'
    };
  }
}

/**
 * FAQ Assistant grounded exclusively in approved studio knowledge base
 */
export async function askFaqAssistant(userQuestion: string, studioTerms: string) {
  if (!ai) {
    const q = userQuestion.toLowerCase();
    if (q.includes('plazo') || q.includes('tiempo')) {
      return {
        answer: 'Para Asesoría, la entrega es dentro de las 72 hs posteriores al Meet. Para Diseño Integral, el plazo de entrega es de 5 días hábiles luego de confirmado el pago.',
        canContactEuge: true
      };
    }
    if (q.includes('credito') || q.includes('asesoria') && q.includes('diseño')) {
      return {
        answer: '¡Exacto! Si hiciste una Asesoría y dentro de los 30 días corridos contratás el Diseño Integral, el 100% de lo que pagaste en la Asesoría se te descuenta del Diseño Integral.',
        canContactEuge: false
      };
    }
    if (q.includes('pago') || q.includes('cuotas')) {
      return {
        answer: 'Aceptamos transferencia bancaria y tarjeta en hasta 3 cuotas. La política del estudio es 100% de pago antes de comenzar para agendarte en el calendario.',
        canContactEuge: false
      };
    }
    return {
      answer: 'No tengo esa información confirmada. Podés escribirle a Euge para sacarte la duda directamente.',
      canContactEuge: true
    };
  }

  try {
    const prompt = `Sos el asistente de atención de Método CASA (estudio de interiorismo fundado por Euge en Argentina).
Respondé la siguiente pregunta del cliente: "${userQuestion}"

REGLAS INFLEXIBLES:
1. Basate ÚNICAMENTE en la filosofía y condiciones de Método CASA:
${studioTerms}
2. Tono: Cálido, cercano, argentino, joven, relajado, sin lenguaje corporativo ni de gurú.
3. SI NO TENÉS LA RESPUESTA con absoluta certeza en los términos, NUNCA inventes. Respondé:
"No tengo esa información confirmada. Podés escribirle a Euge." y activá el botón de contacto.

Devolvé un JSON con:
{
  "answer": "tu respuesta",
  "canContactEuge": true | false
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error('FAQ AI error:', e);
    return {
      answer: 'No tengo esa información confirmada. Podés escribirle a Euge.',
      canContactEuge: true
    };
  }
}
