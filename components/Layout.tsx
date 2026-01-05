
import React, { useState, useEffect } from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const menuItems = [
    { id: AppTab.Dashboard, icon: 'fa-chart-line', label: 'Painel' },
    { id: AppTab.Syllabus, icon: 'fa-book-bookmark', label: 'Conteúdo' },
    { id: AppTab.Simulado, icon: 'fa-file-signature', label: 'Simulado' },
    { id: AppTab.AIStudy, icon: 'fa-brain', label: 'Mentor IA' },
    { id: AppTab.Imaging, icon: 'fa-x-ray', label: 'Analisador' },
    { id: AppTab.LiveAudio, icon: 'fa-microphone', label: 'Live Voz' },
    { id: AppTab.MediaGen, icon: 'fa-wand-magic-sparkles', label: 'Visual' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter">
            <i className="fas fa-radiation text-yellow-400"></i>
            RADIOPREP
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Eusébio 2025</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-indigo-600 shadow-lg shadow-indigo-900/20' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Chave de Status de Conexão */}
        <div className="p-4 mx-4 mb-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Chave de Conectividade</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-rose-500'}`}></div>
              <span className={`text-[11px] font-black uppercase tracking-tighter ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <i className={`fas ${isOnline ? 'fa-globe' : 'fa-plug-circle-xmark'} text-xs ${isOnline ? 'text-emerald-500/50' : 'text-rose-500/50'}`}></i>
          </div>
          <p className="text-[8px] text-slate-500 mt-2 font-medium leading-tight">
            {isOnline ? 'Recursos de IA e busca ativos.' : 'Apenas recursos locais disponíveis.'}
          </p>
        </div>

        <div className="p-4 bg-slate-950 text-[10px] text-slate-500 text-center font-bold">
          Banca Consulpam • Versão 2.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            {/* Indicador Mobile de Offline */}
            {!isOnline && (
              <div className="md:hidden flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase border border-rose-200">
                <i className="fas fa-wifi-slash"></i>
                Offline
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase">
              <span className={`w-2 h-2 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'} rounded-full`}></span>
              <span className={isOnline ? 'text-emerald-600' : 'text-rose-500'}>
                {isOnline ? 'Sincronizado' : 'Modo Local'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
              <i className="fas fa-user-gear"></i>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto relative">
          {!isOnline && (activeTab === AppTab.AIStudy || activeTab === AppTab.Imaging || activeTab === AppTab.LiveAudio) && (
            <div className="absolute inset-0 z-50 bg-slate-50/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-3xl mb-6">
                <i className="fas fa-cloud-bolt"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Recurso Indisponível Offline</h3>
              <p className="text-slate-500 max-w-xs text-sm">
                As ferramentas de Inteligência Artificial requerem uma conexão ativa com a internet. 
                Você ainda pode acessar seu **Edital** e **Simulados** salvos!
              </p>
              <button 
                onClick={() => setActiveTab(AppTab.Dashboard)}
                className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm"
              >
                Voltar ao Painel
              </button>
            </div>
          )}
          {children}
          
          {/* Botão de Ajuda Flutuante (Tutor) */}
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-xl hover:scale-110 transition-transform z-50 group">
            <i className="fas fa-question"></i>
            <span className="absolute right-16 bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Tira-Dúvidas Online
            </span>
          </button>
        </section>

        {/* Mobile Nav */}
        <nav className="md:hidden flex bg-white border-t px-2 py-2 overflow-x-auto justify-between shadow-2xl shrink-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 min-w-[56px] rounded-xl ${
                activeTab === item.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'
              }`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="text-[9px] mt-1 font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
