import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "nodejs",
};

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function readJson(req: VercelRequest): Promise<any> {
  if (req.body) return req.body;

  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST em /api/gemini" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY não configurada no Vercel",
    });
  }

  try {
    const body = await readJson(req);
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Campo 'prompt' é obrigatório",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
  model: "gemini-1.5-flash",
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ],
});

// Forma robusta de obter o texto (funciona em mais versões do SDK)
const text =
  (result as any).text ??
  (result as any).response?.text?.() ??
  (result as any).candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
  "";

return res.status(200).json({
  ok: true,
  text,
});
  } catch (err: any) {
    return res.status(500).json({
      error: "Erro ao chamar o Gemini",
      details: err?.message ?? String(err),
    });
  }
}
