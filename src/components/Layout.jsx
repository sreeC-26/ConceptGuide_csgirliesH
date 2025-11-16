import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CenterColumn from './CenterColumn';
import RightSidebar from './RightSidebar';
import TopNavBar from './TopNavBar';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Layout() {
  const [isDesktop, setIsDesktop] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const qaData = useAppStore((state) => state.qaData);
  const resetApp = useAppStore((state) => state.reset);
  const syncSessionsFromFirebase = useAppStore((state) => state.syncSessionsFromFirebase);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleMediaQueryChange = (event) => {
      setIsDesktop(event.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  // Sync history when user logs in
  useEffect(() => {
    if (user?.uid) {
      syncSessionsFromFirebase();
    }
  }, [user?.uid, syncSessionsFromFirebase]);

  const handleHomeClick = () => {
    resetApp();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen bg-[#1A1A1A] text-pink-100 flex flex-col overflow-hidden">
      <TopNavBar
        onHomeClick={handleHomeClick}
        onHistoryToggle={() => {}}
        isHistoryOpen={false}
        isDesktop={isDesktop}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Center Column - Takes remaining space */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CenterColumn />
        </main>

        {/* Right Sidebar - Only shows if not in Q&A mode */}
        {!qaData && <RightSidebar />}
      </div>
    </div>
  );
}
