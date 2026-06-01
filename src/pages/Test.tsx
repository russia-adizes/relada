import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, GripVertical, Download } from 'lucide-react'
import { generateReport } from '../utils/generateReport'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { QUESTIONS, PART1_END, calculatePaeiType, type PaeiType, type Answer } from '../data/paeiQuestions'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useStage } from '../contexts/StageContext'
import PricingSheet from '../components/PricingSheet'

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

function SortableAnswerCard({ answer, rank }: { answer: Answer; rank: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: answer.text,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
      }}
      className={[
        'w-full bg-white rounded-xl border px-4 py-3.5 flex items-center gap-3 select-none',
        rank === 1 ? 'border-[#9E8B45] shadow-sm' : 'border-[#E8E4DC]',
        isDragging ? 'shadow-lg' : '',
      ].join(' ')}
    >
      <div
        className={[
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
          rank === 1
            ? 'bg-[#9E8B45] text-white'
            : 'bg-[#9E8B45]/15 text-[#9E8B45]',
        ].join(' ')}
      >
        {rank}
      </div>
      <span className="text-sm leading-snug text-[#1A1918] font-medium flex-1">
        {answer.text}
      </span>
      <div
        {...attributes}
        {...listeners}
        className="text-[#C8BA8A] hover:text-[#9E8B45] cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
      >
        <GripVertical size={18} />
      </div>
    </div>
  )
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
  accessLevel,
  userName,
  onContinue,
  onFinish,
}: {
  personalityType: string
  scores: Record<PaeiType, number>
  saveError?: string
  accessLevel: string
  userName?: string
  onContinue: () => void
  onFinish: () => void
}) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const dominant = (['P', 'A', 'E', 'I'] as PaeiType[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  )

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center px-4 py-10 text-center">
      {showUpgrade && <PricingSheet onClose={() => setShowUpgrade(false)} upgradeOnly />}

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

      {accessLevel === 'full' ? (
        <>
          <div className="w-full max-w-xs bg-[#9E8B45]/10 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm font-semibold text-[#1A1918]">🔓 Вторая часть открыта</p>
            <p className="text-xs text-[#6B6560] mt-1">Узнайте свой стиль в отношениях прямо сейчас.</p>
          </div>
          <button onClick={onContinue} className="w-full max-w-xs py-3.5 rounded-xl bg-[#9E8B45] text-white font-semibold text-sm hover:bg-[#8A7A3A] transition-colors mb-3">
            Пройти часть 2 →
          </button>
        </>
      ) : (
        <>
          <div className="w-full max-w-xs border border-[#E8E4DC] rounded-xl p-4 mb-4 text-left space-y-1">
            <p className="text-sm font-semibold text-[#1A1918]">Хотите узнать больше?</p>
            <p className="text-xs text-[#6B6560]">Откройте вторую часть — стиль в отношениях и совместимость с партнёром.</p>
            <button onClick={() => setShowUpgrade(true)} className="text-sm text-[#9E8B45] font-semibold mt-1 hover:opacity-80">
              Открыть за 700 ₽ →
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => generateReport({ part: 1, resultType: personalityType, scores, total: PART1_END, userName })}
        className="w-full max-w-xs py-3 rounded-xl border border-[#9E8B45] text-[#9E8B45] font-semibold text-sm hover:bg-[#9E8B45]/5 transition-colors flex items-center justify-center gap-2 mb-3"
      >
        <Download size={15} />
        Скачать отчёт PDF
      </button>
      <button onClick={onFinish} className="w-full max-w-xs py-3.5 rounded-xl border border-[#E8E4DC] text-[#6B6560] font-semibold text-sm hover:border-[#9E8B45] transition-colors">
        Открыть мой профиль
      </button>
    </div>
  )
}

function Part2ResultScreen({
  relationshipStyle,
  scores,
  saveError,
  userName,
  onFinish,
}: {
  relationshipStyle: string
  scores: Record<PaeiType, number>
  saveError?: string
  userName?: string
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
        onClick={() => generateReport({ part: 2, resultType: relationshipStyle, scores, total: QUESTIONS.length - PART1_END, userName })}
        className="w-full max-w-xs py-3 rounded-xl border border-[#9E8B45] text-[#9E8B45] font-semibold text-sm hover:bg-[#9E8B45]/5 transition-colors flex items-center justify-center gap-2 mb-3"
      >
        <Download size={15} />
        Скачать отчёт PDF
      </button>
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
  const location = useLocation()
  const { user } = useAuth()
  const { setPersonalityTypeDirect, setRelationshipStyleDirect, accessLevel } = useStage()

  const startPart = (location.state as { startPart?: number } | null)?.startPart ?? 1
  const startIndex = startPart === 2 ? PART1_END : 0

  const [currentQ, setCurrentQ] = useState(startIndex)
  const [orderedAnswers, setOrderedAnswers] = useState<Answer[]>(
    () => shuffleArray(QUESTIONS[startIndex].answers, startIndex + 1)
  )
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setOrderedAnswers((items) => {
      const oldIndex = items.findIndex((a) => a.text === active.id)
      const newIndex = items.findIndex((a) => a.text === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  function handleNext() {
    const topAnswer = orderedAnswers[0]
    const updated = [...allAnswers]
    updated[currentQ] = topAnswer.type
    setAllAnswers(updated)

    if (currentQ === PART1_END - 1) {
      finishPart1(updated.slice(0, PART1_END) as PaeiType[])
    } else if (currentQ < QUESTIONS.length - 1) {
      const nextQ = currentQ + 1
      setCurrentQ(nextQ)
      setOrderedAnswers(shuffleArray(QUESTIONS[nextQ].answers, nextQ + 1))
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
    localStorage.setItem('relada_scores1', JSON.stringify(scores))

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
    localStorage.setItem('relada_scores2', JSON.stringify(scores))

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
    setOrderedAnswers(shuffleArray(QUESTIONS[PART1_END].answers, PART1_END + 1))
  }

  const question = QUESTIONS[currentQ]
  const progress = (currentQ / QUESTIONS.length) * 100
  const isPart1Last = currentQ === PART1_END - 1
  const isPart2Last = currentQ === QUESTIONS.length - 1
  const isInPart2 = currentQ >= PART1_END

  const userName = user?.user_metadata?.name || user?.email

  if (part1Result) {
    return (
      <Part1ResultScreen
        personalityType={part1Result.personalityType}
        scores={part1Result.scores}
        saveError={part1Result.saveError}
        accessLevel={accessLevel}
        userName={userName}
        onContinue={handleContinueToPart2}
        onFinish={() => navigate('/')}
      />
    )
  }

  if (part2Result) {
    return (
      <Part2ResultScreen
        relationshipStyle={part2Result.relationshipStyle}
        scores={part2Result.scores}
        saveError={part2Result.saveError}
        userName={userName}
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={orderedAnswers.map((a) => a.text)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {orderedAnswers.map((answer, index) => (
                <SortableAnswerCard key={answer.text} answer={answer} rank={index + 1} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <p className="text-xs text-[#6B6560] text-center">
          Перетащите варианты: сверху — самый подходящий, снизу — наименее
        </p>
      </div>

      {/* Bottom action */}
      <div className="sticky bottom-0 bg-white border-t border-[#E8E4DC] px-4 py-4">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all bg-[#9E8B45] text-white hover:bg-[#8A7A3A]"
          >
            {isPart1Last ? 'Завершить часть 1' : isPart2Last ? 'Завершить тест' : 'Далее →'}
          </button>
        </div>
      </div>
    </div>
  )
}
