
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';

const AnatomyAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Remove data prefix
      const base64 = image.split(',')[1];
      const result = await analyzeImage(base64, "Identifique as estruturas anatômicas nesta imagem radiográfica e explique as possíveis patologias ou pontos de atenção para um técnico em radiologia.");
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysis("Erro ao analisar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="mb-6">
          <h3 className="text-lg font-bold">Analisador de Imagens Radiológicas</h3>
          <p className="text-sm text-gray-500">Envie um raio-x ou diagrama para que a IA ajude na identificação anatômica.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
              {image ? (
                <>
                  <img src={image} className="w-full h-full object-contain" alt="Preview" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400">
                  <i className="fas fa-file-upload text-4xl"></i>
                  <span>Clique para selecionar imagem</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
            </div>
            {image && !analysis && (
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-microscope mr-2"></i>}
                Analisar Estruturas
              </button>
            )}
          </div>

          {analysis && (
            <div className="flex-1 bg-gray-50 p-6 rounded-2xl border overflow-y-auto max-h-[500px]">
              <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                <i className="fas fa-clipboard-check text-green-500"></i>
                Relatório de Análise IA
              </h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
              <button 
                onClick={() => setAnalysis(null)}
                className="mt-6 text-indigo-600 text-xs font-bold uppercase hover:underline"
              >
                Nova Análise
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex gap-4 items-start">
        <i className="fas fa-triangle-exclamation text-yellow-600 text-xl mt-1"></i>
        <p className="text-xs text-yellow-800 leading-relaxed">
          <strong>Aviso Importante:</strong> Esta ferramenta é apenas para fins educacionais e auxílio em estudos para o concurso. 
          Não deve ser utilizada para diagnósticos clínicos reais. Siga sempre as orientações do médico radiologista responsável.
        </p>
      </div>
    </div>
  );
};

export default AnatomyAnalyzer;
