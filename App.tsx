
import React, { useState } from 'react';
import Layout from './components/Layout';
import ExamInfo from './components/ExamInfo';
import Syllabus from './components/Syllabus';
import StudyChat from './components/StudyChat';
import AnatomyAnalyzer from './components/AnatomyAnalyzer';
import LiveSession from './components/LiveSession';
import ExamMaps from './components/ExamMaps';
import MediaGenerator from './components/MediaGenerator';
import Simulado from './components/Simulado';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Dashboard);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Dashboard:
        return <ExamInfo />;
      case AppTab.Syllabus:
        return <Syllabus />;
      case AppTab.Simulado:
        return <Simulado />;
      case AppTab.AIStudy:
        return <div className="p-6 h-full"><StudyChat /></div>;
      case AppTab.Imaging:
        return <div className="p-6 max-w-6xl mx-auto"><AnatomyAnalyzer /></div>;
      case AppTab.LiveAudio:
        return <div className="p-6 h-full"><LiveSession /></div>;
      case AppTab.Maps:
        return <div className="p-6 max-w-6xl mx-auto"><ExamMaps /></div>;
      case AppTab.MediaGen:
        return <div className="p-6 max-w-6xl mx-auto"><MediaGenerator /></div>;
      default:
        return <ExamInfo />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
