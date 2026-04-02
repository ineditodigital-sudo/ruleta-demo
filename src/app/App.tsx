import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { TotemView } from '@/app/views/TotemView';
import { AdminView } from '@/app/views/AdminView';
import { DemoView } from '@/app/views/DemoView';
import { DataMigration } from '@/app/components/DataMigration';

// Wrapper component for TotemView that scales it to full screen
const TotemWrapper = () => {
  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-white">
      <div 
        style={{
          width: '1080px',
          height: '1920px',
          transform: 'scale(var(--totem-scale))',
          transformOrigin: 'center center',
        }}
        className="totem-container"
      >
        <TotemView />
      </div>
      <style>{`
        :root {
          --totem-scale: min(100vw / 1080, 100vh / 1920);
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <DataMigration />
        <Routes>
          <Route path="/" element={<Navigate to="/totem" replace />} />
          <Route path="/totem" element={<TotemWrapper />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/demo" element={<DemoView />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}