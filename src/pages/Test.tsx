import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { QUESTIONS, PART1_END, calculatePaeiType, type PaeiType } from '../data/paeiQuestions'
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

function ScoreBars({ scores, total }: { scores: Record<PaeiType, number>; total: number }) {
  return (
    <div className="w-full max-w-xs bg-white rounded-2xl border border-[#E8E4DC] p-4 mb-8 space-y-2">
      {(['P', 'A', 'E', 'I'] as PaeiType[]).map((type) => (
        <div key={type} className="flex items-center gap-3">
          <span className="w-5 text-sm font-bold text-[#9E8B45]">{type}</span>
          <div className="flex-1 h-2 bg-[#F0EDE6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9E8B45] rounded-full transition-all"
              style={{ width: `${(scores[type] / total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-[#6B6560] w-6 text-right">{scores[type]}</span>
        </div>
      ))}
    </div>
  )
}

function Part1ResultScreen({
  personalityType,
  scores,
  saveError,
  onContinue,
  onFinish,
}: {
  personalityType: string
  scores: Record<PaeiType, number>
  saveError?: string
  onContinue: () => void
  onFinish: () => void
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

      <ScoreBars scores={scores} total={PART1_END} />

      {saveError && (
        <p className="text-xs text-red-500 max-w-xs mb-4">
          Ошибка сохранения: {saveError}
        </p>
      )}

      <button
        onClick={onContinue}
        className="w-full max-w-xs py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors mb-3"
      >
        Узнать стиль в отношениях →
      </button>
      <button
        onClick={onFinish}
        className="w-full max-w-xs py-3.5 rounded-xl border border-[#E8E4DC] text-[#6B6560] font-semibold text-sm hover:border-[#9E8B45] transition-colors"
      >
        Открыть мой профиль
      </button>
    </div>
  )
}

function Part2ResultScreen({
  relationshipStyle,
  scores,
  saveError,
  onFinish,
}: {
  relationshipStyle: string
  scores: Record<PaeiType, number>
  saveError?: string
  onFinish: () => void
}) {
  const dominant = (['P', 'A', 'E', 'I'] as PaeiType[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  )

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="w-20 h-20 rounded-full bg-[#9E8B45]/10 flex items-center justify-center mb-6">
        <span className="text-3xl">💞</span>
      </div>

      <p className="text-sm text-[#6B6560] mb-1">Ваш стиль в отношениях</p>
      <h1 className="text-5xl font-bold text-[#9E8B45] tracking-widest mb-2">
        {relationshipStyle}
      </h1>
      <p className="text-base font-semibold text-[#1A1918] mb-6">
        {TYPE_LABELS[dominant]}
      </p>

      <ScoreBars scores={scores} total={QUESTIONS.length - PART1_END} />

      {saveError && (
        <p className="text-xs text-red-500 max-w-xs mb-4">
          Ошибка сохранения: {saveError}
        </p>
      )}

      <button
        onClick={onFinish}
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
  const { setPersonalityTypeDirect, setRelationshipStyleDirect } = useStage()

  const [currentQ, setCurrentQ] = useState(0)
  const [rankings, setRankings] = useState<number[]>([0, 0, 0, 0])
  const [allAnswers, setAllAnswers] = useState<(PaeiType | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  )
  const [part1Result, setPart1Result] = useState<{
    personalityType: string
    scores: Record<PaeiType, number>
    saveError?: string
  } | null>(null)
  const [part2Result, setPart2Result] = useState<{
    relationshipStyle: string
    scores: Record<PaeiType, number>
    saveError?: string
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

    if (currentQ === PART1_END - 1) {
      finishPart1(updated.slice(0, PART1_END) as PaeiType[])
    } else if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
      setRankings([0, 0, 0, 0])
    } else {
      finishPart2(updated.slice(PART1_END) as PaeiType[])
    }
  }

  async function finishPart1(answers: PaeiType[]) {
    const scores: Record<PaeiType, number> = { P: 0, A: 0, E: 0, I: 0 }
    for (const type of answers) scores[type]++
    const personalityType = calculatePaeiType(scores, PART1_END)

    setPersonalityTypeDirect(personalityType)

    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id ?? user?.id
    if (uid) localStorage.setItem(`relada_pt_${uid}`, personalityType)

    setPart1Result({ personalityType, scores })

    if (uid) {
      const { error } = await supabase
        .from('profiles')
        .update({ personality_type: personalityType })
        .eq('id', uid)
      if (error) {
        const { error: e2 } = await supabase
          .from('profiles')
          .upsert({ id: uid, personality_type: personalityType })
        if (e2) setPart1Result((prev) => prev ? { ...prev, saveError: e2.message } : prev)
      }
    }
  }

  async function finishPart2(answers: PaeiType[]) {
    const scores: Record<PaeiType, number> = { P: 0, A: 0, E: 0, I: 0 }
    for (const type of answers) scores[type]++
    const relationshipStyle = calculatePaeiType(scores, QUESTIONS.length - PART1_END)

    setRelationshipStyleDirect(relationshipStyle)

    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id ?? user?.id
    if (uid) localStorage.setItem(`relada_rs_${uid}`, relationshipStyle)

    setPart2Result({ relationshipStyle, scores })

    if (uid) {
      const { error } = await supabase
        .from('profiles')
        .update({ relationship_style: relationshipStyle })
        .eq('id', uid)
      if (error) {
        const { error: e2 } = await supabase
          .from('profiles')
          .upsert({ id: uid, relationship_style: relationshipStyle })
        if (e2) setPart2Result((prev) => prev ? { ...prev, saveError: e2.message } : prev)
      }
    }
  }

  function handleContinueToPart2() {
    setPart1Result(null)
    setCurrentQ(PART1_END)
    setRankings([0, 0, 0, 0])
  }

  const allRanked = rankings.every((r) => r > 0)
  const progress = (currentQ / QUESTIONS.length) * 100
  const isPart1Last = currentQ === PART1_END - 1
  const isPart2Last = currentQ === QUESTIONS.length - 1
  const isInPart2 = currentQ >= PART1_END

  if (part1Result) {
    return (
      <Part1ResultScreen
        personalityType={part1Result.personalityType}
        scores={part1Result.scores}
        saveError={part1Result.saveError}
        onContinue={handleContinueToPart2}
        onFinish={() => navigate('/about-me')}
      />
    )
  }

  if (part2Result) {
    return (
      <Part2ResultScreen
        relationshipStyle={part2Result.relationshipStyle}
        scores={part2Result.scores}
        saveError={part2Result.saveError}
        onFinish={() => navigate('/about-me')}
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
                {isInPart2 ? 'Стиль в отношениях · ' : 'Тип личности · '}
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
            {isPart1Last ? 'Завершить часть 1' : isPart2Last ? 'Завершить тест' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  )
}
