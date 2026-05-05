import React, { createContext, useContext, useState } from 'react'

type Stage = 1 | 2 | 3 | 4

interface StageContextValue {
  stage: Stage
  setStage: (stage: Stage) => void
  userName: string
  personalityType: string
  userEmail: string
}

const StageContext = createContext<StageContextValue | null>(null)

export function StageProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>(1)

  const value: StageContextValue = {
    stage,
    setStage,
    userName: 'Анна',
    personalityType: 'pAeI',
    userEmail: 'anna@mail.ru',
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
