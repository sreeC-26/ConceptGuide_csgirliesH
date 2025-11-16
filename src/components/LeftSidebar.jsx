import { useMemo } from 'react';
import HistoryPanel from './HistoryPanel';

const sidebarBaseStyles = {
  backgroundColor: '#1A1A1A',
};

const collapsedWidth = '56px';
const expandedWidth = '320px';

const toggleButtonCommonClasses = 'flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:ring-offset-2 focus:ring-offset-[#1A1A1A]';
const toggleIconClasses = 'w-6 h-6';

export default function LeftSidebar({ isOpen, isDesktop, onToggle }) {
  const containerStyle = useMemo(() => ({
    ...sidebarBaseStyles,
    width: isDesktop ? (isOpen ? expandedWidth : collapsedWidth) : '100%',
    transition: 'width 0.3s ease-in-out',
  }), [isDesktop, isOpen]);

  if (!isDesktop) {
    return (
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: expandedWidth, ...sidebarBaseStyles }}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b border-pink-500/30">
            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              History
            </h2>
            <button
              onClick={onToggle}
              className={`${toggleButtonCommonClasses} rounded-full p-2 text-pink-300 hover:text-pink-100`}
              aria-label="Close history sidebar"
            >
              <svg className={toggleIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            <HistoryPanel />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`relative h-full border-r border-pink-500/30 ${isOpen ? 'shadow-[rgba(255,64,129,0.2)_0px_15px_30px_-15px]' : ''}`}
      style={containerStyle}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-pink-500/30 px-4 py-3">
          <h2 className={`text-lg font-semibold text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            History
          </h2>
          <button
            onClick={onToggle}
            className={`${toggleButtonCommonClasses} h-10 w-10 rounded-full border border-pink-500/40 bg-[#252525] text-pink-300 hover:text-pink-100`}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse history sidebar' : 'Expand history sidebar'}
          >
            <svg className={toggleIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              )}
            </svg>
          </button>
        </header>

        <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="h-full overflow-y-auto pr-1">
            <HistoryPanel />
          </div>
        </div>
      </div>
    </aside>
  );
}
