import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import DnaPage from './pages/DnaPage'
import SkillsPage from './pages/SkillsPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'

function RootRedirect() {
  const done = localStorage.getItem('onboarding_done')
  return <Navigate to={done ? '/home' : '/onboarding'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/" element={<AppShell />}>
          <Route index element={<RootRedirect />} />
          <Route path="home" element={<HomePage />} />
          <Route path="dna" element={<DnaPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
