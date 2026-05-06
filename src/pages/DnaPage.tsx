import { useState, useEffect } from 'react'
import { mockDNA } from '../data/mock'
import './DnaPage.css'

const DNA_COLORS = [
  'var(--color-dna-1)',
  'var(--color-dna-2)',
  'var(--color-dna-3)',
  'var(--color-dna-4)',
  'var(--color-dna-5)',
]

const COMPETITION_COLOR: Record<string, string> = {
  '高': 'var(--color-primary)',
  '中等': 'var(--color-yellow-dk)',
  '蓝海': 'var(--color-green)',
}

// ── 双线雷达图 ──
function RadarChart({ dimensions }: { dimensions: typeof mockDNA.dimensions }) {
  const size = 280
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 40
  const n = dimensions.length

  const angleOf = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  })

  const gridPath = (level: number) => {
    const pts = dimensions.map((_, i) => {
      const { x, y } = toXY(angleOf(i), r * level)
      return `${x},${y}`
    })
    return `M ${pts.join(' L ')} Z`
  }

  const buildPath = (getValue: (d: typeof dimensions[0]) => number) => {
    const pts = dimensions.map((d, i) => {
      const { x, y } = toXY(angleOf(i), r * (getValue(d) / 100))
      return `${x},${y}`
    })
    return `M ${pts.join(' L ')} Z`
  }

  const myPoints = dimensions.map((d, i) => toXY(angleOf(i), r * (d.score / 100)))
  const avgPoints = dimensions.map((d, i) => toXY(angleOf(i), r * (d.avg / 100)))

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg">
      {/* Grid */}
      {gridLevels.map(level => (
        <path
          key={level}
          d={gridPath(level)}
          fill="none"
          stroke="rgba(26,26,26,0.07)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const { x, y } = toXY(angleOf(i), r)
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(26,26,26,0.07)"
            strokeWidth="1"
          />
        )
      })}

      {/* 赛道均值参考区域 */}
      <path
        d={buildPath(d => d.avg)}
        fill="rgba(201,160,32,0.10)"
        stroke="var(--color-yellow-dk)"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />

      {/* 我的风格区域 */}
      <path
        d={buildPath(d => d.score)}
        fill="rgba(232,82,58,0.12)"
        stroke="var(--color-primary)"
        strokeWidth="2"
      />

      {/* 均值点 */}
      {avgPoints.map((pt, i) => (
        <circle
          key={`avg-${i}`}
          cx={pt.x} cy={pt.y} r={3}
          fill="var(--color-yellow-dk)"
          stroke="var(--color-white)"
          strokeWidth="1.5"
        />
      ))}

      {/* 我的点 */}
      {myPoints.map((pt, i) => (
        <circle
          key={`my-${i}`}
          cx={pt.x} cy={pt.y} r={5}
          fill={DNA_COLORS[i]}
          stroke="var(--color-white)"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {dimensions.map((d, i) => {
        const angle = angleOf(i)
        const labelR = r + 22
        const { x, y } = toXY(angle, labelR)
        return (
          <text
            key={i}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={DNA_COLORS[i]}
            fontSize="11"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
          >
            {d.label}
          </text>
        )
      })}

      <circle cx={cx} cy={cy} r={3} fill="rgba(26,26,26,0.15)" />
    </svg>
  )
}

// ── 趋势折线迷你图 ──
function TrendSparkline({
  history,
  dimKey,
  color,
}: {
  history: typeof mockDNA.history
  dimKey: string
  color: string
}) {
  const w = 80
  const h = 36
  const vals = history.map(h => h.scores[dimKey as keyof typeof h.scores])
  const min = Math.min(...vals) - 5
  const max = Math.max(...vals) + 5
  const toX = (i: number) => (i / (vals.length - 1)) * w
  const toY = (v: number) => h - ((v - min) / (max - min)) * h
  const d = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="spark-svg" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {vals.map((v, i) => (
        <circle
          key={i}
          cx={toX(i)} cy={toY(v)}
          r={i === vals.length - 1 ? 3 : 2}
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

// ── 主页面 ──
export default function DnaPage() {
  const [animating, setAnimating] = useState(true)
  const [activeDim, setActiveDim] = useState<number | null>(null)
  const [copiedTag, setCopiedTag] = useState<string | null>(null)
  const [trackEditing, setTrackEditing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 800)
    return () => clearTimeout(t)
  }, [])

  const copyTag = (tag: string) => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopiedTag(tag)
      setTimeout(() => setCopiedTag(null), 1500)
    })
  }

  const { track, dimensions, tags, history, historyTrends, insight } = mockDNA

  return (
    <div className="dna-page">

      {/* ── 顶部平台 Tab ── */}
      <div className="platform-tabs">
        <button className="platform-tab platform-tab--active">
          <span className="platform-tab-icon">📺</span>
          B站
          <span className="platform-tab-badge">已绑定</span>
        </button>
        <button className="platform-tab platform-tab--future" disabled>
          <span className="platform-tab-icon">🎵</span>
          抖音
          <span className="platform-tab-badge platform-tab-badge--soon">二期</span>
        </button>
        <button className="platform-tab platform-tab--future" disabled>
          <span className="platform-tab-icon">📔</span>
          小红书
          <span className="platform-tab-badge platform-tab-badge--soon">二期</span>
        </button>
        <button className="platform-tab platform-tab--future" disabled>
          <span className="platform-tab-icon">📹</span>
          视频号
          <span className="platform-tab-badge platform-tab-badge--soon">二期</span>
        </button>
      </div>

      {/* ── Header ── */}
      <div className="dna-header">
        <div>
          <h1 className="dna-title">我的风格 DNA</h1>
          <p className="dna-sub">基于 B站主页历史内容持续分析，每周自动更新</p>
        </div>
        <div className="dna-header-right">
          <span className="update-label">上次更新：3天前</span>
          <button className="update-btn">
            {animating ? '分析中…' : '↺ 立即更新'}
          </button>
        </div>
      </div>

      {/* ── ① 赛道定位卡 ── */}
      <div className="dna-card track-card">
        <div className="track-card-header">
          <span className="track-card-label">赛道定位</span>
          <button
            className="track-edit-btn"
            onClick={() => setTrackEditing(!trackEditing)}
          >
            {trackEditing ? '✓ 完成' : '修正'}
          </button>
        </div>

        <div className="track-pills">
          <div className="track-pill track-pill--platform">
            <span className="track-pill-key">平台</span>
            <span className="track-pill-val">{track.platform}</span>
            <span className="track-bound-dot" />
          </div>
          <span className="track-sep">›</span>
          <div className="track-pill">
            <span className="track-pill-key">主赛道</span>
            <span className="track-pill-val">{track.mainTrack}</span>
          </div>
          <span className="track-sep">›</span>
          <div className="track-pill">
            <span className="track-pill-key">子赛道</span>
            <span className="track-pill-val">{track.subTrack}</span>
          </div>
        </div>

        <div className="track-meta">
          <div className="track-meta-item">
            <span className="track-meta-key">赛道角色</span>
            <span className="track-meta-val track-meta-val--role">{track.role}</span>
          </div>
          <div className="track-meta-item">
            <span className="track-meta-key">竞争密度</span>
            <span
              className="track-meta-val"
              style={{ color: COMPETITION_COLOR[track.competitionLevel] }}
            >
              {track.competitionLevel}（{track.competitionDesc}）
            </span>
          </div>
        </div>

        {trackEditing && (
          <p className="track-edit-hint">AI 识别结果可手动修正，修正后将重新校准风格分析。</p>
        )}
      </div>

      <div className="dna-grid">
        {/* ── ② 风格雷达卡 ── */}
        <div className="dna-card dna-radar-card">
          <div className="radar-legend">
            <div className="radar-legend-item">
              <span className="radar-legend-line radar-legend-line--mine" />
              <span>你的风格</span>
            </div>
            <div className="radar-legend-item">
              <span className="radar-legend-line radar-legend-line--avg" />
              <span>赛道均值</span>
            </div>
          </div>

          <div className="radar-wrap">
            <RadarChart dimensions={dimensions} />
            <div className="radar-scan" />
          </div>

          {/* ③ 核心标签云 */}
          <div className="dna-tags">
            {tags.map(tag => (
              <button
                key={tag}
                className={`dna-tag${copiedTag === tag ? ' dna-tag--copied' : ''}`}
                onClick={() => copyTag(tag)}
                title="点击复制标签"
              >
                {copiedTag === tag ? '✓ 已复制' : tag}
              </button>
            ))}
          </div>
          <p className="tag-copy-hint">点击标签可一键复制，供随心搭自动携带上下文</p>

          <p className="dna-insight">
            <span className="insight-icon">✦</span>
            {insight}
          </p>
        </div>

        {/* ── ④ 维度解读（可下钻）── */}
        <div className="dna-dims-wrap">
          {dimensions.map((d, i) => (
            <div
              key={d.key}
              className={`dim-card${activeDim === i ? ' dim-card--active' : ''}`}
              onClick={() => setActiveDim(activeDim === i ? null : i)}
              style={{ '--dim-color': DNA_COLORS[i] } as React.CSSProperties}
            >
              <div className="dim-top">
                <div className="dim-label-row">
                  <span className="dim-dot" />
                  <span className="dim-label">{d.label}</span>
                  <span className="dim-desc">{d.desc}</span>
                </div>
                <div className="dim-score-row">
                  <span className="dim-vs">
                    <span className="dim-score">{d.score}</span>
                    <span className="dim-avg-label">均值 {d.avg}</span>
                  </span>
                  <span className="dim-expand-icon">{activeDim === i ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* 双线进度条 */}
              <div className="dim-track">
                <div className="dim-bar" style={{ width: `${d.score}%` }} />
                <div
                  className="dim-avg-mark"
                  style={{ left: `${d.avg}%` }}
                  title={`赛道均值 ${d.avg}`}
                />
              </div>
              <div className="dim-range-row">
                <span className="range-start">{d.range[0]}</span>
                <span className="range-end">{d.range[1]}</span>
              </div>

              {/* 下钻详情 */}
              {activeDim === i && (
                <div className="dim-detail" onClick={e => e.stopPropagation()}>
                  <div className="dim-submetrics">
                    {d.subMetrics.map(m => (
                      <div key={m.label} className="submetric-row">
                        <span className="submetric-label">{m.label}</span>
                        <div className="submetric-vals">
                          <span className={`submetric-val${m.higher ? ' submetric-val--higher' : ' submetric-val--lower'}`}>
                            {m.value}
                          </span>
                          <span className="submetric-avg">{m.avgValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dim-conclusion">
                    <p className="dim-conclusion-text">{d.conclusion}</p>
                    <p className="dim-suggestion">
                      <span className="suggestion-icon">→</span>
                      {d.suggestion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ⑤ 历史趋势 ── */}
      <div className="dna-card dna-trend-card">
        <h2 className="card-title">近3次更新趋势</h2>

        <div className="trend-sparklines">
          {dimensions.map((d, i) => (
            <div key={d.key} className="spark-item">
              <div className="spark-header">
                <span className="spark-dot" style={{ background: DNA_COLORS[i] }} />
                <span className="spark-label">{d.label}</span>
                <span className="spark-scores">
                  {history.map(h => h.scores[d.key as keyof typeof h.scores]).join(' → ')}
                </span>
              </div>
              <TrendSparkline history={history} dimKey={d.key} color={DNA_COLORS[i]} />
            </div>
          ))}
        </div>

        <div className="trend-dates">
          {history.map(h => (
            <span key={h.date} className="trend-date">{h.date}</span>
          ))}
        </div>

        <div className="trend-insights">
          {historyTrends.map((t, i) => (
            <div key={i} className="trend-insight-row">
              <span className="trend-insight-dot" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
