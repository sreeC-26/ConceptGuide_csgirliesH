import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HistoryPage from './pages/HistoryPage'
import GoalsPage from './pages/GoalsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import { useGoalsStore } from './store/useGoalsStore'

function App() {
  const syncSessionsFromFirebase = useAppStore((state) => state.syncSessionsFromFirebase)
  const fetchGoals = useGoalsStore((state) => state.fetchGoals)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user?.uid) {
      console.log('[App] User logged in, syncing data from Firebase...')
      syncSessionsFromFirebase()
      fetchGoals(true) // Force refresh from Firebase
    }
  }, [user?.uid]) // Removed function refs to avoid potential issues

  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  )
}

export default App
