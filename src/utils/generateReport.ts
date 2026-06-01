import { getInsight } from '../data/paeiInsights'
import { type PaeiType } from '../data/paeiQuestions'

const TYPE_LABELS: Record<string, string> = {
  P: 'Производитель',
  A: 'Администратор',
  E: 'Предприниматель',
  I: 'Интегратор',
}

export interface ReportData {
  userName?: string
  part: 1 | 2
  resultType: string
  scores: Record<PaeiType, number>
  total: number
}

function getDominantLabel(resultType: string, scores: Record<PaeiType, number>): string {
  const dominant = (['P', 'A', 'E', 'I'] as PaeiType[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  )
  return TYPE_LABELS[dominant] || resultType
}

function scoreBar(value: number, total: number): string {
  const pct = Math.round((value / total) * 100)
  return `
    <div class="score-row">
      <span class="score-label">${value > 0 ? (['P','A','E','I'].find((_, i) => i === Object.values({ P: 0, A: 1, E: 2, I: 3 })[i]) || '') : ''}</span>
      <div class="score-bar-track">
        <div class="score-bar-fill" style="width:${pct}%"></div>
      </div>
      <span class="score-num">${value}</span>
    </div>`
}

export function generateReport(data: ReportData) {
  const insight = getInsight(data.resultType)
  const dominantLabel = getDominantLabel(data.resultType, data.scores)
  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  const partTitle = data.part === 1 ? 'Тип личности' : 'Стиль в отношениях'
  const partSubtitle = data.part === 1 ? 'Часть 1 · Личностный профиль' : 'Часть 2 · Профиль в отношениях'

  const scoreRows = (['P', 'A', 'E', 'I'] as PaeiType[]).map((type) => {
    const pct = Math.round((data.scores[type] / data.total) * 100)
    return `
      <div class="score-row">
        <span class="score-label">${type}</span>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${pct}%"></div>
        </div>
        <span class="score-num">${data.scores[type]}</span>
      </div>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>РЕЛАДА — Персональный отчёт</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #1A1918;
      background: #fff;
      padding: 48px 56px;
      max-width: 800px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 1.6;
    }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #9E8B45; }
    .logo { font-size: 26px; font-weight: 800; letter-spacing: 0.12em; color: #9E8B45; text-transform: uppercase; }
    .header-right { text-align: right; }
    .header-right .part-subtitle { font-size: 11px; color: #9E8B45; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 4px; }
    .header-right .date { font-size: 12px; color: #6B6560; }
    .header-right .user-name { font-size: 14px; font-weight: 600; color: #1A1918; margin-top: 2px; }

    /* Result block */
    .result-block { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 36px; padding: 28px; background: #FAF8F4; border-radius: 16px; border-left: 4px solid #9E8B45; }
    .result-type { font-size: 72px; font-weight: 900; color: #9E8B45; letter-spacing: 0.1em; line-height: 1; }
    .result-info {}
    .result-label { font-size: 11px; color: #6B6560; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .result-name { font-size: 22px; font-weight: 700; color: #1A1918; margin-bottom: 6px; }
    .result-part { font-size: 13px; color: #6B6560; }

    /* Scores */
    .section { margin-bottom: 32px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9E8B45; margin-bottom: 14px; }
    .score-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
    .score-label { width: 16px; font-weight: 700; font-size: 13px; color: #9E8B45; flex-shrink: 0; }
    .score-bar-track { flex: 1; height: 8px; background: #F0EDE6; border-radius: 4px; overflow: hidden; }
    .score-bar-fill { height: 100%; background: #9E8B45; border-radius: 4px; }
    .score-num { width: 24px; text-align: right; font-size: 13px; color: #6B6560; flex-shrink: 0; }

    /* Description */
    .description-text { font-size: 14px; color: #3A3633; line-height: 1.7; margin-bottom: 10px; }

    /* Lists */
    .list { list-style: none; padding: 0; }
    .list li { padding: 8px 0 8px 20px; position: relative; border-bottom: 1px solid #F0EDE6; font-size: 13px; color: #3A3633; line-height: 1.5; }
    .list li:last-child { border-bottom: none; }
    .list li::before { content: '—'; position: absolute; left: 0; color: #9E8B45; font-weight: 700; }

    /* Two columns */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

    /* Footer */
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #E8E4DC; display: flex; justify-content: space-between; align-items: center; }
    .footer-logo { font-size: 13px; font-weight: 700; color: #9E8B45; letter-spacing: 0.1em; }
    .footer-note { font-size: 11px; color: #9B9691; }

    @media print {
      body { padding: 32px 40px; }
      .two-col { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="logo">РЕЛАДА</div>
    <div class="header-right">
      <div class="part-subtitle">${partSubtitle}</div>
      ${data.userName ? `<div class="user-name">${data.userName}</div>` : ''}
      <div class="date">${date}</div>
    </div>
  </div>

  <div class="result-block">
    <div class="result-type">${data.resultType}</div>
    <div class="result-info">
      <div class="result-label">${partTitle}</div>
      <div class="result-name">${dominantLabel}</div>
      <div class="result-part">На основе методологии Адизеса (PAEI)</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Распределение баллов</div>
    ${scoreRows}
  </div>

  <div class="section">
    <div class="section-title">Ваш профиль</div>
    ${insight.short.map((s) => `<p class="description-text">${s}</p>`).join('')}
  </div>

  <div class="two-col">
    <div class="section">
      <div class="section-title">Сильные стороны</div>
      <ul class="list">
        ${insight.strengths.map((s) => `<li>${s}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <div class="section-title">Что вызывает перегрузку</div>
      <ul class="list">
        ${insight.overload.map((s) => `<li>${s}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="footer">
    <div class="footer-logo">РЕЛАДА</div>
    <div class="footer-note">relada.vercel.app · Персональный отчёт по методологии PAEI</div>
  </div>

</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 600)
}
