import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

type Stage = 1 | 2 | 3 | 4

interface StageContextValue {
  stage: Stage
  setStage: (stage: Stage) => void
  userName: string
  personalityType: string
  userEmail: string
  refreshProfile: () => Promise<void>
  setPersonalityTypeDirect: (type: string) => void
}

const StageContext = createContext<StageContextValue | null>(null)

export function StageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [stage, setStageState] = useState<Stage>(1)
  const [userName, setUserName] = useState('')
  const [personalityType, setPersonalityType] = useState('')

  async function refreshProfile() {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .select('name, personality_type, stage')
      .eq('id', user.id)
      .maybeSingle()
    console.log('[refreshProfile] user.id:', user.id, 'data:', data, 'error:', error)
    const cached = localStorage.getItem(`relada_pt_${user.id}`)
    if (data) {
      if (data.name) setUserName(data.name)
      if (data.personality_type) {
        setPersonalityType(data.personality_type)
        localStorage.setItem(`relada_pt_${user.id}`, data.personality_type)
      } else if (cached) {
        // Profile row exists but personality_type is null — use localStorage
        setPersonalityType(cached)
      }
      if (data.stage) setStageState(data.stage as Stage)
    } else if (cached) {
      setPersonalityType(cached)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [user])

  async function setStage(newStage: Stage) {
    setStageState(newStage)
    if (user) {
      await supabase
        .from('profiles')
        .update({ stage: newStage })
        .eq('id', user.id)
    }
  }

  const value: StageContextValue = {
    stage,
    setStage,
    userName: userName || user?.email?.split('@')[0] || '',
    personalityType,
    userEmail: user?.email || '',
    refreshProfile,
    setPersonalityTypeDirect: setPersonalityType,
  }

  return (
    <StageContext.Provider value={value}>
      {children}
    </StageContext.Provider>
  )
}

export function useStage() {
  const ctx = useContext(StageContext)
  if (!ctx) throw new Error('useStage must be used within StageProvider')
  return ctx
}
