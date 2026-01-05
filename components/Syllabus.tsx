
import React, { useState } from 'react';

const Syllabus: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const blockI = [
    { name: 'Português', questions: 1250, topics: ['Interpretação de texto', 'Gramática normativa', 'Concordância verbal/nominal', 'Regência', 'Crase'] },
    { name: 'Matemática e RL', questions: 840, topics: ['Regra de três', 'Porcentagem', 'Lógica sentencial', 'Conjuntos', 'Probabilidade'] },
    { name: 'Conhecimentos Gerais', questions: 420, topics: ['História de Eusébio', 'Geografia local', 'Atualidades 2024/2025'] },
  ];

  const blockII = [
    { name: 'Física Radiológica', questions: 980, topics: ['Produção de Raios-X', 'Efeito Photoelétrico', 'Efeito Compton', 'Atenuação'] },
    { name: 'Proteção Radiológica', questions: 760, topics: ['RDC 611/2022', 'Portaria 453', 'Dosimetria', 'Limites de dose'] },
    { name: 'Anatomia Radiológica', questions: 1100, topics: ['Esqueleto Apendicular', 'Tórax e Abdome', 'Crânio e Seios da Face'] },
    { name: 'Técnicas e Posicionamentos', questions: 1500, topics: ['Rotinas de Tórax', 'Incidências Especiais', 'Mamografia', 'Tomografia'] },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-500 relative">
      {/* Modal de Guia de Estudo */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-indigo-600 p-8 text-white relative">
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
              <h3 className="text-2xl font-black tracking-tighter uppercase">Estratégia Consulpam 2025</h3>
              <p className="text-indigo-100 text-sm font-medium">Metodologia de Aprovação Eusébio/CE</p>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <i className="fas fa-weight-hanging text-indigo-500 mb-3 block text-xl"></i>
                  <h4 className="font-black text-slate-800 text-sm uppercase mb-2">Peso das Matérias</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">As questões de <strong>Radiologia (Bloco II)</strong> possuem peso maior. Dedique 60% do seu tempo de estudo a elas.</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <i className="fas fa-repeat text-emerald-500 mb-3 block text-xl"></i>
                  <h4 className="font-black text-slate-800 text-sm uppercase mb-2">Ciclo de Questões</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">A Consulpam repete padrões de enunciados. Resolva ao menos 30 questões por dia no modo <strong>Simulado</strong>.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-sm uppercase flex items-center gap-2">
                  <i className="fas fa-check-circle text-indigo-600"></i>
                  Passo a Passo Recomendado
                </h4>
                <ol className="space-y-3">
                  <li className="flex gap-3 text-xs text-slate-600">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black shrink-0">1</span>
                    <span><strong>Diagnóstico:</strong> Use o botão "Estudar com IA" em cada matéria para entender o que você ainda não domina.</span>
                  </li>
                  <li className="flex gap-3 text-xs text-slate-600">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black shrink-0">2</span>
                    <span><strong>Reforço Visual:</strong> Use o <strong>Analisador de Imagem</strong> para memorizar anatomia radiológica, um tema recorrente na banca.</span>
                  </li>
                  <li className="flex gap-3 text-xs text-slate-600">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black shrink-0">3</span>
                    <span><strong>Simulação:</strong> Aos finais de semana, faça o <strong>Simulado Completo</strong> cronometrado (4 horas).</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-center">
              <button 
                onClick={() => setShowGuide(false)}
                className="bg-indigo-600 text-white px-12 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-indigo-700 transition-all"
              >
                ENTENDI, VAMOS ESTUDAR!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Tutoria */}
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex items-center gap-6">
        <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0">
          <i className="fas fa-graduation-cap"></i>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-indigo-900 uppercase">Como usar este Edital?</h4>
          <p className="text-xs text-indigo-700 font-medium">Clique em uma matéria para ver os tópicos cobrados e iniciar uma tutoria focada com a IA.</p>
        </div>
        <button 
          onClick={() => setShowGuide(true)}
          className="px-4 py-2 bg-white text-indigo-600 text-[10px] font-black uppercase rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Saber mais
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Bloco I */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">I</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Conhecimentos Gerais</h3>
          </div>
          <div className="space-y-3">
            {blockI.map((subject, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedSubject(subject.name === selectedSubject ? null : subject.name)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${
                  selectedSubject === subject.name ? 'border-indigo-500 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <i className={`fas ${subject.name.includes('Port') ? 'fa-font' : 'fa-calculator'}`}></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800">{subject.name}</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{subject.questions} questões no banco</span>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-down text-slate-300 transition-transform ${selectedSubject === subject.name ? 'rotate-180 text-indigo-500' : ''}`}></i>
                </div>

                {selectedSubject === subject.name && (
                  <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-2">
                      {subject.topics.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          {t}
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-indigo-50 text-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                      Estudar este módulo com IA
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bloco II */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">II</span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Específicos</h3>
          </div>
          <div className="space-y-3">
            {blockII.map((subject, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedSubject(subject.name === selectedSubject ? null : subject.name)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${
                  selectedSubject === subject.name ? 'border-indigo-500 bg-white shadow-xl' : 'border-slate-100 bg-white hover:border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400">
                      <i className="fas fa-radiation"></i>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800">{subject.name}</h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{subject.questions} questões no banco</span>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-down text-slate-300 transition-transform ${selectedSubject === subject.name ? 'rotate-180 text-indigo-500' : ''}`}></i>
                </div>

                {selectedSubject === subject.name && (
                  <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 gap-2">
                      {subject.topics.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          {t}
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all">
                      Abrir Mentoria Focada
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
