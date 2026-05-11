import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { QUESTIONS, calculatePaeiType, type PaeiType } from '../data/paeiQuestions'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useStage } from '../contexts/StageContext'

function shuffleArray<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * 2654435761 + i * 40503) % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const TYPE_LABELS: Record<string, string> = {
  P: 'Производитель',
  A: 'Администратор',
  E: 'Предприниматель',
  I: 'Интегратор',
}

function ResultScreen({
  personalityType,
  scores,
  onContinue,
}: {
  personalityType: string
  scores: Record<PaeiType, number>
  onContinue: () => void
}) {
  const dominant = (['P', 'A', 'E', 'I'] as PaeiType[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  )

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="w-20 h-20 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mb-6">
        <span className="text-3xl">🎯</span>
      </div>

      <p className="text-sm text-[#6B6560] mb-1">Ваш тип личности</p>
      <h1 className="text-5xl font-bold text-[#9E8B45] tracking-widest mb-2">
        {personalityType}
      </h1>
      <p className="text-base font-semibold text-[#1A1918] mb-6">
        {TYPE_LABELS[dominant]}
      </p>

      <div className="w-full max-w-xs bg-white rounded-2xl border border-[#E8E4DC] p-4 mb-8 space-y-2">
        {(['P', 'A', 'E', 'I'] as PaeiType[]).map((type) => (
          <div key={type} className="flex items-center gap-3">
            <span className="w-5 text-sm font-bold text-[#9E8B45]">{type}</span>
            <div className="flex-1 h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9E8B45] rounded-full transition-all"
                style={{ width: `${(scores[type] / 40) * 100}%` }}
              />
            </div>
            <span className="text-sm text-[#6B6560] w-6 text-right">{scores[type]}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-xs py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors"
      >
        Открыть мой профиль →
      </button>
    </div>
  )
}

export default function Test() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshProfile } = useStage()

  const [currentQ, setCurrentQ] = useState(0)
  const [rankings, setRankings] = useState<number[]>([0, 0, 0, 0])
  const [allAnswers, setAllAnswers] = useState<(PaeiType | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  )
  const [result, setResult] = useState<{
    personalityType: string
    scores: Record<PaeiType, number>
  } | null>(null)

  const question = QUESTIONS[currentQ]

  const shuffledAnswers = useMemo(
    () => shuffleArray(question.answers, currentQ + 1),
    [currentQ]
  )

  function handleCardClick(index: number) {
    const current = rankings[index]
    if (current > 0) {
      setRankings((prev) =>
        prev.map((r, i) => {
          if (i === index) return 0
          if (r > current) return r - 1
          return r
        })
      )
    } else {
      const nextRank = Math.max(...rankings) + 1
      if (nextRank > 4) return
      setRankings((prev) => prev.map((r, i) => (i === index ? nextRank : r)))
    }
  }

  function handleNext() {
    const rank1Index = rankings.findIndex((r) => r === 1)
    const topAnswer = shuffledAnswers[rank1Index]

    const updated = [...allAnswers]
    updated[currentQ] = topAnswer.type
    setAllAnswers(updated)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
      setRankings([0, 0, 0, 0])
    } else {
      finishTest(updated as PaeiType[])
    }
  }

  function finishTest(answers: PaeiType[]) {
    const scores: Record<PaeiType, number> = { P: 0, A: 0, E: 0, I: 0 }
    for (const type of answers) scores[type]++
    const personalityType = calculatePaeiType(scores)

    // Show result immediately, save in background
    setResult({ personalityType, scores })

    if (user) {
      supabase
        .from('profiles')
        .update({ personality_type: personalityType })
        .eq('id', user.id)
        .then(() => refreshProfile())
    }
  }

  async function handleContinue() {
    await refreshProfile()
    navigate('/about-me')
  }

  const allRanked = rankings.every((r) => r > 0)
  const progress = (currentQ / QUESTIONS.length) * 100

  if (result) {
    return (
      <ResultScreen
        personalityType={result.personalityType}
        scores={result.scores}
        onContinue={handleContinue}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E8E4DC] px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-[#6B6560] hover:text-[#1A1918] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B6560]">
                Вопрос {currentQ + 1} из {QUESTIONS.length}
              </span>
              <span className="text-xs text-[#6B6560]">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#9E8B45] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-5">
        <div>
          <p className="text-xs text-[#9E8B45] font-medium uppercase tracking-wide mb-2">
            Расположите от наиболее к наименее характерному
          </p>
          <h2 className="text-lg font-semibold text-[#1A1918] leading-snug">
            {question.text}
          </h2>
        </div>

        <div className="space-y-2">
          {shuffledAnswers.map((answer, index) => {
            const rank = rankings[index]
            const isRanked = rank > 0
            return (
              <button
                key={answer.text}
                onClick={() => handleCardClick(index)}
                className={[
                  'w-full text-left rounded-xl border px-4 py-3.5 flex items-center gap-3 transition-all duration-150',
                  isRanked
                    ? 'bg-white border-[#9E8B45] shadow-sm'
                    : 'bg-white border-[#E8E4DC] hover:border-[#C8BA8A]',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all',
                    isRanked
                      ? rank === 1
                        ? 'bg-[#9E8B45] text-white'
                        : 'bg-[#9E8B45]/15 text-[#9E8B45]'
                      : 'bg-[#F0EDE6] text-[#6B6560]',
                  ].join(' ')}
                >
                  {isRanked ? rank : ''}
                </div>
                <span
                  className={[
                    'text-sm leading-snug',
                    isRanked ? 'text-[#1A1918] font-medium' : 'text-[#6B6560]',
                  ].join(' ')}
                >
                  {answer.text}
                </span>
                {rank === 1 && (
                  <Check size={14} className="ml-auto text-[#9E8B45] flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-[#6B6560] text-center">
          Нажмите на варианты в порядке от подходящего к наименее подходящему
        </p>
      </div>

      {/* Bottom action */}
      <div className="sticky bottom-0 bg-white border-t border-[#E8E4DC] px-4 py-4">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!allRanked}
            className={[
              'w-full py-3.5 rounded-xl font-semibold text-sm transition-all',
              allRanked
                ? 'bg-[#9E8B45] text-white hover:bg-[#8A7A3A]'
                : 'bg-[#E8E4DC] text-[#6B6560] cursor-not-allowed',
            ].join(' ')}
          >
            {currentQ < QUESTIONS.length - 1 ? 'Далее →' : 'Завершить тест'}
          </button>
        </div>
      </div>
    </div>
  )
}
