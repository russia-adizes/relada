import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

type Stage = 1 | 2 | 3 | 4
export type AccessLevel = 'none' | 'basic' | 'full'

interface StageContextValue {
  stage: Stage
  setStage: (stage: Stage) => void
  userName: string
  personalityType: string
  relationshipStyle: string
  userEmail: string
  accessLevel: AccessLevel
  setAccessLevel: (level: AccessLevel) => Promise<void>
  refreshProfile: () => Promise<void>
  setPersonalityTypeDirect: (type: string) => void
  setRelationshipStyleDirect: (type: string) => void
}

const StageContext = createContext<StageContextValue | null>(null)

export function StageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [stage, setStageState] = useState<Stage>(1)
  const [userName, setUserName] = useState('')
  const [personalityType, setPersonalityType] = useState('')
  const [relationshipStyle, setRelationshipStyle] = useState('')
  const [accessLevel, setAccessLevelState] = useState<AccessLevel>('none')

  async function refreshProfile() {
    if (!user) return

    if (user.id === 'local-user') {
      setUserName('Relada')
      const pt = localStorage.getItem(`relada_pt_${user.id}`) || ''
      const rs = localStorage.getItem(`relada_rs_${user.id}`) || ''
      setPersonalityType(pt)
      setRelationshipStyle(rs)
      setAccessLevelState(pt ? (rs ? 'full' : 'basic') : 'none')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data } = await supabase
      .from('profiles')
      .select('name, personality_type, relationship_style, stage, access_level')
      .eq('id', user.id)
      .maybeSingle()

    if (data) {
      if (data.name) setUserName(data.name)

      if (data.personality_type) {
        setPersonalityType(data.personality_type)
        localStorage.setItem(`relada_pt_${user.id}`, data.personality_type)
      } else {
        setPersonalityType('')
        localStorage.removeItem(`relada_pt_${user.id}`)
      }

      if (data.relationship_style) {
        setRelationshipStyle(data.relationship_style)
        localStorage.setItem(`relada_rs_${user.id}`, data.relationship_style)
      } else {
        setRelationshipStyle('')
        localStorage.removeItem(`relada_rs_${user.id}`)
      }

      if (data.stage) setStageState(data.stage as Stage)
      if (data.access_level) setAccessLevelState(data.access_level as AccessLevel)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [user])

  async function setStage(newStage: Stage) {
    setStageState(newStage)
    if (user && user.id !== 'local-user') {
      await supabase.from('profiles').update({ stage: newStage }).eq('id', user.id)
    }
  }

  async function setAccessLevel(level: AccessLevel) {
    setAccessLevelState(level)
    if (user && user.id !== 'local-user') {
      await supabase.from('profiles').update({ access_level: level }).eq('id', user.id)
    }
  }

  const value: StageContextValue = {
    stage,
    setStage,
    userName: userName || user?.email?.split('@')[0] || '',
    personalityType,
    relationshipStyle,
    userEmail: user?.email || '',
    accessLevel,
    setAccessLevel,
    refreshProfile,
    setPersonalityTypeDirect: setPersonalityType,
    setRelationshipStyleDirect: setRelationshipStyle,
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
