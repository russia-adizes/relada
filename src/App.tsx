import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StageProvider } from './contexts/StageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Index from './pages/Index'
import AboutMe from './pages/AboutMe'
import Partner from './pages/Partner'
import Practice from './pages/Practice'
import Methodology from './pages/Methodology'
import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <div className="text-[#6B6560] text-sm">Загрузка...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Auth />} />
      </Routes>
    )
  }

  return (
    <StageProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </StageProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}
