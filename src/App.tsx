import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { StageProvider } from './contexts/StageContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Index from './pages/Index'
import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword'
import Settings from './pages/Settings'
import Test from './pages/Test'
import Admin from './pages/Admin'

function AppLayout() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const isTestPage = location.pathname === '/test'
  const isAdminPage = location.pathname === '/admin'

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

  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    )
  }

  return (
    <StageProvider>
      <div className="min-h-screen bg-white">
        {!isTestPage && <Header />}
        {!isTestPage && <Navigation />}
        <main className={isTestPage ? '' : 'max-w-3xl mx-auto px-4 py-6'}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/test" element={<Test />} />
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
