
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

const LiveSession: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      let nextStartTime = 0;
      const sources = new Set<AudioBufferSourceNode>();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const binary = atob(audioData);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              
              const int16 = new Int16Array(bytes.buffer);
              const buffer = outputCtx.createBuffer(1, int16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < int16.length; i++) channelData[i] = int16[i] / 32768.0;

              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              
              nextStartTime = Math.max(nextStartTime, outputCtx.currentTime);
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sources.add(source);
              source.onended = () => sources.delete(source);
            }

            if (msg.serverContent?.interrupted) {
              sources.forEach(s => s.stop());
              sources.clear();
              nextStartTime = 0;
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "Você é um mentor de voz. Ajude o aluno a memorizar técnicas de radiologia através de um diálogo rápido e interativo.",
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
      <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-indigo-600 scale-110 shadow-2xl' : 'bg-indigo-100'}`}>
        <i className={`fas fa-microphone-lines text-6xl ${isActive ? 'text-white' : 'text-indigo-600'}`}></i>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-indigo-900">Sessão de Estudos em Voz</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          Converse em tempo real com seu tutor. Pergunte sobre posicionamentos ou proteção radiológica sem usar o teclado.
        </p>
      </div>

      <button
        onClick={isActive ? stopSession : startSession}
        className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all ${isActive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
      >
        {isActive ? 'Encerrar Sessão' : 'Iniciar Conversa'}
      </button>

      {isActive && (
        <div className="flex gap-2">
          <div className="w-2 h-8 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
          <div className="w-2 h-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        </div>
      )}
    </div>
  );
};

export default LiveSession;
