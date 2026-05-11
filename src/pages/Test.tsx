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

export default function Test() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refreshProfile } = useStage()

  const [currentQ, setCurrentQ] = useState(0)
  // rankings[i] = rank 1-4, or 0 = unranked
  const [rankings, setRankings] = useState<number[]>([0, 0, 0, 0])
  // allAnswers[questionIndex] = type of #1 ranked answer
  const [allAnswers, setAllAnswers] = useState<(PaeiType | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  )
  const [saving, setSaving] = useState(false)

  const question = QUESTIONS[currentQ]

  const shuffledAnswers = useMemo(
    () => shuffleArray(question.answers, currentQ + 1),
    [currentQ]
  )

  function handleCardClick(index: number) {
    const current = rankings[index]
    if (current > 0) {
      // Unrank: remove this rank and shift higher ranks down
      setRankings((prev) =>
        prev.map((r, i) => {
          if (i === index) return 0
          if (r > current) return r - 1
          return r
        })
      )
    } else {
      // Assign next rank
      const nextRank = Math.max(...rankings) + 1
      if (nextRank > 4) return
      setRankings((prev) => prev.map((r, i) => (i === index ? nextRank : r)))
    }
  }

  function handleNext() {
    // Find the answer ranked #1
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

  async function finishTest(answers: PaeiType[]) {
    setSaving(true)
    const scores: Record<PaeiType, number> = { P: 0, A: 0, E: 0, I: 0 }
    for (const type of answers) {
      scores[type]++
    }
    const personalityType = calculatePaeiType(scores)

    if (user) {
      await supabase
        .from('profiles')
        .update({ personality_type: personalityType })
        .eq('id', user.id)
      await refreshProfile()
    }

    navigate('/about-me', { state: { justFinishedTest: true, personalityType, scores } })
  }

  const allRanked = rankings.every((r) => r > 0)
  const progress = ((currentQ) / QUESTIONS.length) * 100

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
            disabled={!allRanked || saving}
            className={[
              'w-full py-3.5 rounded-xl font-semibold text-sm transition-all',
              allRanked && !saving
                ? 'bg-[#9E8B45] text-white hover:bg-[#8A7A3A]'
                : 'bg-[#E8E4DC] text-[#6B6560] cursor-not-allowed',
            ].join(' ')}
          >
            {saving
              ? 'Сохраняем...'
              : currentQ < QUESTIONS.length - 1
              ? 'Далее →'
              : 'Завершить тест'}
          </button>
        </div>
      </div>
    </div>
  )
}
