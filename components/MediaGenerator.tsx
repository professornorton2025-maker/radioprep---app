
import React, { useState } from 'react';
import { generateStudyImage, generateStudyVideo } from '../services/geminiService';

const MediaGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspect, setAspect] = useState<string>("16:9");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      if (mediaType === 'image') {
        const url = await generateStudyImage(prompt, size, aspect);
        setResult(url);
      } else {
        const url = await generateStudyVideo(prompt, aspect as '16:9' | '9:16');
        setResult(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h3 className="text-lg font-bold mb-2">Criador de Auxílios Visuais</h3>
        <p className="text-sm text-gray-500 mb-6">Gere diagramas, ilustrações ou vídeos educativos para facilitar o aprendizado.</p>

        <div className="space-y-4">
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setMediaType('image')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${mediaType === 'image' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            >
              Imagem (Nano Banana Pro)
            </button>
            <button
              onClick={() => setMediaType('video')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${mediaType === 'video' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
            >
              Vídeo (Veo 3)
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            placeholder="Ex: Ilustração anatômica detalhada do posicionamento para incidência de Perfil de Tórax..."
          />

          <div className="grid grid-cols-2 gap-4">
            {mediaType === 'image' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Qualidade</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(e.target.value as any)}
                  className="w-full p-2 border rounded-lg text-sm"
                >
                  <option value="1K">1K (Padrão)</option>
                  <option value="2K">2K (Alta Definição)</option>
                  <option value="4K">4K (Ultra HD)</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Proporção</label>
              <select 
                value={aspect} 
                onChange={(e) => setAspect(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              >
                <option value="1:1">1:1 (Quadrado)</option>
                <option value="4:3">4:3 (Clássico)</option>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="9:16">9:16 (Vertical)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                {mediaType === 'video' ? 'Processando Vídeo (Pode levar 2min)...' : 'Gerando...'}
              </span>
            ) : (
              `Gerar ${mediaType === 'image' ? 'Imagem' : 'Vídeo'}`
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-4 rounded-2xl shadow-lg border">
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            {mediaType === 'image' ? (
              <img src={result} className="w-full h-full object-contain" alt="IA Generated" />
            ) : (
              <video src={result} controls className="w-full h-full" />
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">Gerado pela IA para auxílio no estudo</span>
            <a 
              href={result} 
              download={`radio-prep-${Date.now()}`}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1"
            >
              <i className="fas fa-download"></i> Baixar
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGenerator;
