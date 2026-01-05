
export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export enum AppTab {
  Dashboard = 'dashboard',
  Syllabus = 'syllabus',
  Simulado = 'simulado',
  AIStudy = 'aistudy',
  Imaging = 'imaging',
  LiveAudio = 'liveaudio',
  Maps = 'maps',
  MediaGen = 'mediagen'
}

export interface SearchResult {
  title: string;
  uri: string;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  thinking?: string;
}

export interface UserStats {
  globalPosition: number;
  totalCandidatos: number;
  avgTimePerQuestion: number; // em segundos
  criticalGaps: { subject: string; score: number }[];
}
