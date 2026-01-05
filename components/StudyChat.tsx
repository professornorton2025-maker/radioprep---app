
import React, { useState, useRef, useEffect } from 'react';
import { chatWithThinking } from '../services/geminiService';
import { Message } from '../types';

const StudyChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: 'Olá, futuro concursado! Eu sou o Mentor RadioPrep. Estou pronto para aprofundar qualquer tema do edital Consulpam 2025. O que vamos estudar agora?' }] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithThinking([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || 'Desculpe, tive um problema ao processar seu raciocínio. Pode repetir?' }] }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Erro de conexão com a base de conhecimentos do Mentor.' }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
                }`}>
                  <i className={`fas ${msg.role === 'user' ? 'fa-user' : 'fa-brain'}`}></i>
                </div>
                <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-6 py-4 rounded-[2rem] shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.parts[0].text}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[90%]">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center text-indigo-600 animate-pulse">
                  <i className="fas fa-microchip"></i>
                </div>
                <div className="bg-white border border-indigo-100 px-6 py-4 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Mentor está raciocinando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Como diferenciar o efeito Compton do Efeito Fotoelétrico para a prova?"
              className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none text-sm transition-all shadow-inner pr-20"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 bg-indigo-600 text-white w-14 h-14 rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center disabled:opacity-50 active:scale-90"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase tracking-widest">
            Alimentado por Gemini 3 Pro - Modelo de Raciocínio Complexo
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyChat;
