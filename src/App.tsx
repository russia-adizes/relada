import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StageProvider } from './contexts/StageContext'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Index from './pages/Index'
import AboutMe from './pages/AboutMe'
import Partner from './pages/Partner'
import Practice from './pages/Practice'
import Methodology from './pages/Methodology'

export default function App() {
  return (
    <StageProvider>
      <BrowserRouter>
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
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StageProvider>
  )
}
