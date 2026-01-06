
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { Message, Question, SearchResult } from "../types";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error("VITE_GEMINI_API_KEY não encontrada");
  }

  return new GoogleGenAI({ apiKey });
};

const checkOnline = () => {
  if (!navigator.onLine) {
    throw new Error("Você está offline. Esta funcionalidade requer internet.");
  }
};

export const searchExamInfo = async (query: string) => {
  checkOnline();
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Pesquise informações oficiais e atualizadas sobre o Edital 2025 da Prefeitura de Eusébio/CE para Técnico em Radiologia (Banca Consulpam). Query: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const rawSources: SearchResult[] = groundingChunks
    .map((chunk: any) => ({
      title: chunk.web?.title || 'Fonte de Informação',
      uri: chunk.web?.uri
    }))
    .filter((s: any) => s.uri);

  // Remove duplicidade de links usando um Map (chave: URI)
  const uniqueSources = Array.from(
    new Map(rawSources.map(item => [item.uri, item])).values()
  );

  return {
    text: response.text,
    sources: uniqueSources
  };
};

export const fetchSimuladoQuestions = async (count: number = 20, mode: string = 'completo', specificSubject?: string): Promise<Question[]> => {
  checkOnline();
  const ai = getAI();
  
  let distributionPrompt = "";
  switch (mode) {
    case 'materia_unica':
      distributionPrompt = `FOCO TOTAL na matéria: ${specificSubject}. Todas as questões devem ser deste tema.`;
      break;
    case 'zbs_par':
      distributionPrompt = `FOCO EM PAR COMPLEMENTAR: Divida as questões entre as matérias mais cobradas (Ex: Anatomia + Posicionamento).`;
      break;
    case 'gaps':
      distributionPrompt = `FOCO EM CORREÇÃO DE GAPS: Gere questões dos temas mais complexos e com maior taxa de erro: Física Radiológica e Legislação RDC 611/2022.`;
      break;
    case 'aleatorio':
      distributionPrompt = `ESCOLHA ALEATÓRIA: Misture temas de forma imprevisível entre gerais e específicos.`;
      break;
    default:
      distributionPrompt = `DISTRIBUIÇÃO OFICIAL EDITAL: 25% Português, 15% Matemática/RL, 10% Gerais, 50% Específicos.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Atue como um especialista em concursos da banca CONSULPAM. 
    Gere um simulado com exatamente ${count} questões para o cargo de Técnico em Radiologia (Concurso Eusébio 2025).
    
    MODALIDADE: ${distributionPrompt}
    
    ESTILO: Questões diretas, com 4 alternativas (A, B, C, D) conforme o padrão Consulpam. 
    As justificativas (explanation) devem ser didáticas e profundas.
    
    Retorne em JSON estrito.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            subject: { type: Type.STRING },
            text: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "subject", "text", "options", "correctIndex", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
};



export const analyzeImage = async (base64Data: string, prompt: string) => {
  checkOnline();
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const generateStudyImage = async (prompt: string, size: "1K" | "2K" | "4K", aspectRatio: string) => {
  checkOnline();
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Diagrama médico educativo para radiologia: ${prompt}` }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size as any
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateStudyVideo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
  checkOnline();
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Explicação visual técnica de radiologia: ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const findStudyCenters = async (lat: number, lng: number) => {
  checkOnline();
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Encontre locais de prova da banca Consulpam, hospitais públicos ou centros de estudo no Eusébio/CE.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const rawPlaces = groundingChunks.map((chunk: any) => ({
    title: chunk.maps?.title || 'Local de Interesse',
    uri: chunk.maps?.uri
  })).filter((p: any) => p.uri);

  // Remove duplicidade de links nos mapas também
  const uniquePlaces = Array.from(
    new Map(rawPlaces.map(item => [item.uri, item])).values()
  );

  return { text: response.text, places: uniquePlaces };
};
// ✅ Chat via backend seguro (Vercel)
// Aceita string OU array de mensagens
export async function chatWithThinking(input: string | Message[]): Promise<string> {
  const prompt =
    typeof input === "string"
      ? input
      : input
          .map((m) => {
            const partsText = (m.parts || [])
              .map((p: any) => (typeof p === "string" ? p : p?.text ?? ""))
              .join(" ");
            // ✅ aqui tem crase (template string)
            return `${m.role}: ${partsText}`;
          })
          .join("\n");

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json().catch(() => ({} as any));

  if (!response.ok) {
    throw new Error(data?.error || Erro ao chamar API Gemini (HTTP ${response.status}));
  }

  return data.text || "";
}
