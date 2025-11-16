import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import TopNavBar from '../components/TopNavBar'
import HistoryPanel from '../components/HistoryPanel'

export default function HistoryPage() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const resetApp = useAppStore((state) => state.reset)
  const syncSessionsFromFirebase = useAppStore((state) => state.syncSessionsFromFirebase)
  const user = useAuthStore((state) => state.user)
  const qaData = useAppStore((state) => state.qaData)
  const currentSessionId = useAppStore((state) => state.currentSessionId)
  const navigate = useNavigate()

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event) => setIsDesktop(event.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Sync history when user logs in or page loads
  useEffect(() => {
    if (user?.uid) {
      syncSessionsFromFirebase()
    }
  }, [user?.uid, syncSessionsFromFirebase])

  const handleHomeClick = () => {
    resetApp()
    navigate('/')
  }

  const handleBackClick = () => {
    // Don't reset or enter review mode - just navigate back to continue where they left off
    // The current session state should already be preserved in the store
    navigate('/')
  }

  // Show back button if user is in learning mode
  const showBackButton = qaData || currentSessionId

  return (
    <div className="min-h-screen w-full bg-[#1A1A1A] text-pink-100 flex flex-col overflow-hidden">
      <TopNavBar 
        isDesktop={isDesktop}
        onHomeClick={handleHomeClick}
        onHistoryToggle={() => {}}
        isHistoryOpen={false}
      />
      {showBackButton && (
        <div className="px-6 py-3 border-b border-pink-500/30">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 inline-flex items-center justify-center gap-2"
            style={{
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              border: '1px solid #FF4081',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Learning
          </button>
        </div>
      )}
      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          <HistoryPanel />
        </div>
      </main>
    </div>
  )
}
