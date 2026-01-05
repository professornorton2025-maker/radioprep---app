
import React, { useState, useEffect } from 'react';
import { searchExamInfo } from '../services/geminiService';
import { SearchResult } from '../types';

interface MetricCardProps {
  label: string;
  value: string | number;
  explanation: string;
  icon: string;
  colorClass: string;
  subValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, explanation, icon, colorClass, subValue }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div 
      onClick={() => setShowInfo(!showInfo)}
      className={`relative h-32 cursor-pointer transition-all duration-500 preserve-3d ${showInfo ? '[transform:rotateX(180deg)]' : ''}`}
    >
      {/* Lado Frontal (Métrica) */}
      <div className={`absolute inset-0 backface-hidden bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 ${showInfo ? 'pointer-events-none' : ''}`}>
        <div className={`w-16 h-16 ${colorClass} rounded-3xl flex items-center justify-center text-white text-2xl shadow-inner`}>
          <i className={`fas ${icon}`}></i>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
          <h4 className="text-2xl font-black text-slate-800">
            {value} {subValue && <span className="text-xs text-slate-400 font-medium">{subValue}</span>}
          </h4>
          <p className="text-[9px] text-indigo-500 font-bold mt-1 uppercase animate-pulse">Clique para detalhes</p>
        </div>
      </div>

      {/* Lado Verso (Explicação) */}
      <div className={`absolute inset-0 backface-hidden [transform:rotateX(180deg)] bg-slate-900 p-6 rounded-[2rem] shadow-xl flex items-center justify-center text-center`}>
        <p className="text-xs text-slate-200 font-medium leading-relaxed italic px-2">
          {explanation}
        </p>
      </div>
    </div>
  );
};

const ExamInfo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ text: string; sources: SearchResult[] } | null>(null);

  const performance = {
    precision: "78%",
    avgTime: "42s",
    criticalGap: "Física Radiológica",
    eusébioRank: "128º",
    totalCandidates: 6500
  };

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const result = await searchExamInfo('Concurso Eusébio 2025 Edital Consulpam Radiologia');
        setData(result);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    handleSearch();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>

      {/* Interactive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Precisão Global"
          value={performance.precision}
          explanation="Esta é sua assertividade total em questões de radiologia. Representa o percentual de acertos acumulado em todos os seus treinos na plataforma."
          icon="fa-bullseye"
          colorClass="bg-indigo-600"
        />
        
        <MetricCard 
          label="Tempo Médio"
          value={performance.avgTime}
          explanation="Média de tempo gasto por questão. Monitorar este dado é vital para garantir que você complete a prova da Consulpam dentro do tempo regulamentar."
          icon="fa-stopwatch"
          colorClass="bg-emerald-500"
        />

        <MetricCard 
          label="Gaps Críticos"
          value={performance.criticalGap}
          explanation="Temas do edital onde seu desempenho está abaixo do esperado. O sistema identifica automaticamente estas fraquezas para você reforçar o estudo."
          icon="fa-triangle-exclamation"
          colorClass="bg-rose-500"
        />

        <MetricCard 
          label="Posição Eusébio"
          value={performance.eusébioRank}
          subValue={`de ${performance.totalCandidates}`}
          explanation="Sua colocação estimada no ranking de simulados específicos para o cargo de Técnico em Radiologia da Prefeitura de Eusébio."
          icon="fa-ranking-star"
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Info Edital */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <i className="fas fa-file-contract text-indigo-500"></i>
            Radar de Edital (IA)
          </h3>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-full w-full"></div>
              <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
            </div>
          ) : data && (
            <div className="prose prose-slate max-w-none">
              <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                {data.text}
              </div>
            </div>
          )}
        </div>

        {/* Próximos Passos */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-black mb-2 tracking-tight">Focar em {performance.criticalGap}?</h4>
              <p className="text-indigo-100 text-sm mb-6 max-w-xs">Sua precisão neste tema está abaixo da média. Vamos resolver 10 questões agora?</p>
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform active:scale-95">
                REFORÇAR TEMA
              </button>
            </div>
            <i className="fas fa-radiation absolute -right-4 -bottom-4 text-9xl text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700"></i>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fontes Oficiais</h4>
            <div className="space-y-3">
              {data?.sources.map((s, i) => (
                <a key={i} href={s.uri} target="_blank" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-link text-indigo-400"></i>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{s.title}</span>
                  </div>
                  <i className="fas fa-chevron-right text-slate-300 group-hover:text-indigo-500"></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInfo;
