
import React, { useState, useEffect, useCallback } from 'react';
import { fetchSimuladoQuestions } from '../services/geminiService';
import { Question } from '../types';

const STORAGE_KEY = 'radioPrep_simulado_v2';

const SUBJECTS_LIST = [
  'Português',
  'Matemática e RL',
  'Conhecimentos Gerais',
  'Física Radiológica',
  'Proteção Radiológica',
  'Anatomia Radiológica',
  'Técnicas e Posicionamentos'
];

const Simulado: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(14400);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [isPickingSubject, setIsPickingSubject] = useState(false);

  // Verifica se há progresso salvo ao carregar o componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setHasSavedProgress(true);
      try {
        const data = JSON.parse(saved);
        setSelectedMode(data.selectedMode || 'Simulado anterior');
        setSelectedSubject(data.selectedSubject || null);
      } catch (e) {
        setHasSavedProgress(false);
      }
    }
  }, []);

  // Salva o progresso automaticamente sempre que houver mudanças relevantes
  useEffect(() => {
    if (isStarted && !isFinished && questions.length > 0) {
      const stateToSave = {
        questions,
        currentIdx,
        answers,
        timeLeft,
        selectedMode,
        selectedSubject,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [isStarted, isFinished, questions, currentIdx, answers, timeLeft, selectedMode, selectedSubject]);

  const fetchBatch = async (count: number, mode: string, subject?: string) => {
    try {
      const newQs = await fetchSimuladoQuestions(count, mode, subject || undefined);
      return newQs;
    } catch (err) {
      console.error("Error fetching batch", err);
      return [];
    }
  };

  const startExam = async (mode: string, resume = false, subject?: string) => {
    if (resume) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setQuestions(data.questions);
          setCurrentIdx(data.currentIdx);
          setAnswers(data.answers);
          setTimeLeft(data.timeLeft);
          setSelectedMode(data.selectedMode);
          setSelectedSubject(data.selectedSubject || null);
          setIsStarted(true);
          setIsFinished(false);
          return;
        } catch (e) {
          console.error("Erro ao retomar simulado", e);
          localStorage.removeItem(STORAGE_KEY);
          setHasSavedProgress(false);
        }
      }
    }

    setLoading(true);
    setSelectedMode(mode);
    const finalSubject = subject || null;
    setSelectedSubject(finalSubject);
    setIsPickingSubject(false);

    try {
      const initialQs = await fetchBatch(15, mode, finalSubject || undefined);
      setQuestions(initialQs);
      setIsStarted(true);
      setIsFinished(false);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeft(14400);
      
      // Load more in background if it's a full simulation
      if (mode === 'completo') {
        loadMoreInBackground(mode, finalSubject || undefined);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreInBackground = async (mode: string, subject?: string) => {
    setFetchingMore(true);
    const nextQs = await fetchBatch(20, mode, subject);
    setQuestions(prev => [...prev, ...nextQs]);
    setFetchingMore(false);
  };

  const finishExam = () => {
    if (window.confirm("Deseja realmente finalizar sua prova?")) {
      setIsFinished(true);
      setIsStarted(false);
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedProgress(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-6 font-black text-slate-800 uppercase tracking-tighter">
          Preparando: {selectedMode === 'materia_unica' ? selectedSubject : selectedMode}
        </p>
      </div>
    );
  }

  if (isFinished) {
    const correctCount = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0), 0);
    const scorePercentage = (correctCount / questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in zoom-in duration-300">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
           <div className="bg-slate-900 p-12 text-center text-white">
              <h2 className="text-4xl font-black mb-2">Resultado Final</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Modo: {selectedMode} {selectedSubject ? `(${selectedSubject})` : ''}</p>
           </div>
           
           <div className="p-12 text-center space-y-8">
              <div className="text-7xl font-black text-indigo-600">{Math.round(scorePercentage)}%</div>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Acertos</p>
                    <p className="text-xl font-black text-emerald-600">{correctCount}</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                    <p className="text-xl font-black text-indigo-600">{questions.length}</p>
                 </div>
              </div>
              <button onClick={() => { setIsFinished(false); setSelectedMode(null); setSelectedSubject(null); }} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">
                NOVO SIMULADO
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    const modes = [
      { id: 'materia_unica', label: 'Matéria Única', icon: 'fa-book', desc: 'Foque em uma disciplina específica.', color: 'bg-blue-500' },
      { id: 'zbs_par', label: 'Combinação ZBS', icon: 'fa-layer-group', desc: 'Duas matérias complementares.', color: 'bg-purple-500' },
      { id: 'aleatorio', label: 'IA: Aleatório', icon: 'fa-shuffle', desc: 'Mix surpresa de questões.', color: 'bg-orange-500' },
      { id: 'completo', label: 'Simulado Completo', icon: 'fa-file-invoice', desc: '40 questões estilo oficial.', color: 'bg-indigo-600' },
      { id: 'gaps', label: 'Correção de Gaps', icon: 'fa-triangle-exclamation', desc: 'Foco nos seus pontos fracos.', color: 'bg-red-500' },
    ];

    if (isPickingSubject) {
      return (
        <div className="max-w-5xl mx-auto py-12 px-8 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => setIsPickingSubject(false)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-50 transition-all"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Focar Disciplina</h2>
              <p className="text-slate-500 font-medium">Selecione a matéria para o seu treinamento intensivo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBJECTS_LIST.map((subj) => (
              <button
                key={subj}
                onClick={() => startExam('materia_unica', false, subj)}
                className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all active:scale-95 text-left"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h4 className="text-lg font-black text-slate-800">{subj}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Clique para iniciar</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto py-12 px-8 animate-in fade-in duration-500">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Escolha sua Modalidade</h2>
           <p className="text-slate-500 font-medium">Selecione o estilo de treinamento ideal para hoje.</p>
        </div>

        {/* Banner de Retomar Simulado */}
        {hasSavedProgress && (
          <div className="mb-12 p-8 bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-[2.5rem] shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md">
                <i className="fas fa-history"></i>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase italic">Você tem um simulado pendente!</h3>
                <p className="text-indigo-100 text-sm font-medium">Modalidade: {selectedMode} {selectedSubject ? `(${selectedSubject})` : ''} • Não perca seu progresso.</p>
              </div>
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => startExam('', true)}
                className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-transform active:scale-95"
               >
                 RETOMAR AGORA
               </button>
               <button 
                onClick={() => { if(window.confirm("Isso apagará seu progresso anterior. Continuar?")) { localStorage.removeItem(STORAGE_KEY); setHasSavedProgress(false); } }}
                className="bg-indigo-500/30 text-white px-6 py-3 rounded-2xl font-black text-sm border border-white/20 hover:bg-indigo-500/50 transition-all"
               >
                 DESCARTAR
               </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {modes.map((m) => (
             <button
               key={m.id}
               onClick={() => m.id === 'materia_unica' ? setIsPickingSubject(true) : startExam(m.id)}
               className="group text-left bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all active:scale-95"
             >
                <div className={`w-14 h-14 ${m.color} text-white rounded-2xl flex items-center justify-center text-xl mb-6 shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform`}>
                   <i className={`fas ${m.icon}`}></i>
                </div>
                <h4 className="text-lg font-black text-slate-800 mb-2">{m.label}</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">{m.desc}</p>
             </button>
           ))}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isAnswered = answers[currentIdx] !== undefined;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header Simulado */}
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">{currentIdx + 1}</div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedMode} {selectedSubject ? `• ${selectedSubject}` : ''}</p>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{currentQ?.subject || 'Carregando...'}</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="font-mono font-black text-xl text-red-500 bg-red-50 px-4 py-2 rounded-xl border border-red-100">{formatTime(timeLeft)}</div>
           <button onClick={finishExam} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">FINALIZAR</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-16">
        <div className="max-w-4xl mx-auto space-y-10">
          {!currentQ ? (
             <div className="text-center py-20 text-slate-400 font-bold">Carregando caderno de questões...</div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">{currentQ.text}</h2>
              <div className="grid gap-4">
                {currentQ.options.map((opt, i) => {
                  const isSelected = answers[currentIdx] === i;
                  const isCorrect = i === currentQ.correctIndex;
                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                      className={`w-full flex items-center p-6 rounded-3xl border-2 text-left transition-all ${
                        isSelected 
                          ? (isCorrect ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-red-500 bg-red-50 shadow-sm') 
                          : (isAnswered && isCorrect ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-white bg-white hover:border-slate-200')
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-6 shrink-0 ${
                        isSelected 
                          ? (isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')
                          : (isAnswered && isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400')
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-bold text-lg ${isSelected || (isAnswered && isCorrect) ? 'text-slate-800' : 'text-slate-600'}`}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-300">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center"><i className="fas fa-robot"></i></div>
                      <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Feedback do Mentor</h4>
                   </div>
                   <p className="text-indigo-800 font-medium leading-relaxed italic">{currentQ.explanation}</p>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
             <button 
              disabled={currentIdx === 0} 
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="px-8 py-3 bg-white text-slate-500 rounded-2xl font-black border border-slate-100 hover:bg-slate-50 disabled:opacity-30 transition-all"
             >
               ANTERIOR
             </button>
             <button 
              disabled={!isAnswered || currentIdx === questions.length - 1} 
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
             >
               PRÓXIMA <i className="fas fa-chevron-right ml-2"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulado;
