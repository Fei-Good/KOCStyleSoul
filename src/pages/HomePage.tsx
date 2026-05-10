import { useState, useRef, useEffect } from 'react'
import { mockTrending, mockTopics, mockBuilderCards, outputTypeMap, mockDNA, mockIdeaSuggestions, mockIdeaPlaceholders, mockIdeaChips } from '../data/mock'
import './HomePage.css'

const FILTERS = ['全部', '顶流爆款', '打工人', '情绪治愈']

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const w = WEEKDAYS[date.getDay()]
  const h = date.getHours().toString().padStart(2, '0')
  const min = date.getMinutes().toString().padStart(2, '0')
  return `今天 · ${y}年${m}月${d}日 周${w} ${h}:${min}`
}

function MascotSvg({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="4,10 7,3 10,10" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="14,10 17,3 20,10" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="5.5,9.5 7,5 8.5,9.5" fill="#f9da72" />
      <polygon points="15.5,9.5 17,5 18.5,9.5" fill="#f9da72" />
      <ellipse cx="12" cy="14" rx="8" ry="7" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="12" cy="16" rx="4.5" ry="3.5" fill="#fdf0ed" />
      <circle cx="9.5" cy="13" r="1.2" fill="#1a1a1a" />
      <circle cx="14.5" cy="13" r="1.2" fill="#1a1a1a" />
      <circle cx="9.9" cy="12.6" r="0.4" fill="white" />
      <circle cx="14.9" cy="12.6" r="0.4" fill="white" />
      <ellipse cx="12" cy="16" rx="1" ry="0.7" fill="#c43d28" />
      <path d="M10.5 17 Q12 18.2 13.5 17" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const AI_REPLIES = [
  '好的，我来帮你分析一下这个方向！建议结合当下热点，从个人体验切入会更有共鸣感。',
  '这个想法很棒！可以试试"反转认知"的叙事结构，先抛出大众观点再给出意外角度。',
  '不错的切入点！我建议搭配「悬念钩子+数据佐证」的组合，完播率会更高。',
  '收到！这个话题适合用对比型内容结构，能帮你快速建立差异化认知。',
  '很有潜力的选题方向！可以从3个维度展开：情绪共鸣、实用价值、社交货币。',
]

// DNA 维度 → 主卡 ID 映射（得分 > 赛道均值 则推荐）
const DNA_CARD_MAP: Record<string, string> = {
  narrative: 'narrative',
  density: 'topic',
  visual: 'edit',
  language: 'speech',
  community: 'ops',
}

// 计算 DNA 推荐主卡 ID 集合
const dnaRecommendedCards = new Set(
  mockDNA.dimensions
    .filter(d => d.score > d.avg)
    .map(d => DNA_CARD_MAP[d.key])
    .filter(Boolean)
)

// 子卡级别差异化内容生成
function generatePackage(trendingItem: typeof mockTrending[0], selectedCards: string[]) {
  const subCardMap: Record<string, { section: string; content: string }> = {
    'topic-1': {
      section: '🪝 标题方向（反转认知选题法）',
      content: `「你以为${trendingItem.title}只是个梗，其实它正在改变一代人的认知方式」\n「为什么${trendingItem.tag}领域的人都在讨论这件事——答案出乎意料」`,
    },
    'topic-2': {
      section: '🪝 标题方向（数字化标题法）',
      content: `「关于"${trendingItem.title.slice(0, 6)}"，我整理了5个大多数人不知道的真相」\n「30天观察下来：这个趋势比你想象的更值得认真对待」`,
    },
    'topic-3': {
      section: '🪝 标题方向（痛点共情选题）',
      content: `「看到"${trendingItem.title}"的那一刻，我突然明白了什么叫做时代焦虑」\n「我也曾是其中一个——关于${trendingItem.desc.slice(0, 15)}的真实感受」`,
    },
    'narrative-1': {
      section: '📖 内容结构（悬念叙事结构）',
      content: `开场 0-15s：抛出反直觉问题 → "大家都以为……但其实……"\n中段 15-90s：3个案例递进，每个都比上一个更出乎意料\n结尾：反转收尾 + "你觉得这意味着什么？"互动钩子`,
    },
    'narrative-2': {
      section: '📖 内容结构（横评对比结构）',
      content: `开场：设定对比标准（谁 vs 谁，在什么维度下）\n中段：A方视角 → B方视角 → 意外的第三种可能\n结尾：我的真实结论 + 留一个未解之问`,
    },
    'narrative-3': {
      section: '📖 内容结构（故事化叙事）',
      content: `开场：第一人称切入，"那天我突然意识到……"\n中段：时间线推进，夹杂细节感知（对话/场景/情绪）\n结尾：回到开场的问题，给出一个不圆满但真实的答案`,
    },
    'speech-1': {
      section: '🎤 口播草稿（3秒悬念钩子）',
      content: `"等一下——你真的了解'${trendingItem.title.slice(0, 8)}'吗？"\n"三秒钟之后，你的看法可能会完全改变。"\n[接主体内容] → [行动引导：点个收藏，三天后看你还记得多少]`,
    },
    'speech-2': {
      section: '🎤 口播草稿（口语化脚本）',
      content: `"嗨，最近是不是也被这个话题刷屏了？"\n"我专门去研究了一下，发现了一个挺有意思的角度……"\n[轻松展开，像跟朋友聊天] → "你们遇到过这种情况吗？评论区告诉我"`,
    },
    'speech-3': {
      section: '🎤 口播草稿（金句密度提升）',
      content: `核心金句1：「${trendingItem.desc.slice(0, 20)}，这不是偶然」\n核心金句2：「你以为在看热闹，其实你就在热闹里」\n收尾金句：「真正的清醒，从知道自己不知道什么开始」`,
    },
    'edit-1': {
      section: '🎬 剪辑节奏（卡点节奏剪辑）',
      content: `3-5秒一切，关键词出现时叠加音效（嗖/咚）\n情绪高点配节奏感BGM，低点用环境音留白\n字幕：大字覆盖关键词，小字补充细节，双轨字幕增强信息密度`,
    },
    'edit-2': {
      section: '🎬 剪辑节奏（大字幕覆盖流）',
      content: `满屏字幕强化每一句核心话术（字号 ≥ 60pt）\n重点词加粗/变色，配合轻微震动效果\n关键数据用图表动画呈现，停留不少于1.5秒`,
    },
    'edit-3': {
      section: '🎬 剪辑节奏（高能片段前置）',
      content: `片头0-8s：放最精彩的一句话或最反转的一个画面\n"以上就是结论，接下来告诉你为什么——"\n完整内容用"下文揭秘"结构，利用期待感提升完播率`,
    },
    'ops-1': {
      section: '📊 运营建议（黄金时段发布）',
      content: `最佳发布：工作日 12:00-13:00 或 20:00-22:00\n周末首选：10:00-11:00（用户刷机高峰）\n封面标签：#${trendingItem.tag} + #${trendingItem.title.slice(0, 5)} + 品牌话题`,
    },
    'ops-2': {
      section: '📊 运营建议（评论区埋雷法）',
      content: `发布后第一条评论（置顶）：抛出争议性问题\n示例："${trendingItem.desc.slice(0, 20)}——你是哪一派？"\n引导站队型互动，降低回复门槛，激活算法推荐`,
    },
    'ops-3': {
      section: '📊 运营建议（话题标签组合）',
      content: `大话题：#${trendingItem.tag}（流量池）\n中话题：#${trendingItem.title.slice(0, 5)}相关（精准受众）\n品牌话题：#你的专属标签（沉淀私域）`,
    },
  }

  return selectedCards
    .map(id => subCardMap[id])
    .filter((v, i, arr) => v && arr.findIndex(x => x?.section === v.section) === i)
}

// localStorage 方案库
const PLANS_KEY = 'koc_plans'
interface SavedPlan {
  id: string
  timestamp: number
  trendingTitle: string
  cardCount: number
  sections: { section: string; content: string }[]
}
function loadPlans(): SavedPlan[] {
  try { return JSON.parse(localStorage.getItem(PLANS_KEY) || '[]') } catch { return [] }
}
function savePlan(plan: SavedPlan) {
  const plans = loadPlans()
  if (plans.length >= 20) plans.shift()
  localStorage.setItem(PLANS_KEY, JSON.stringify([...plans, plan]))
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('全部')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)
  const [trendPage, setTrendPage] = useState(1)
  const TREND_PAGE_SIZE = 5

  // 随心搭状态
  const [builderTrending, setBuilderTrending] = useState<number | null>(null)
  const [builderCards, setBuilderCards] = useState<string[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [showPackage, setShowPackage] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [planCount, setPlanCount] = useState(() => loadPlans().length)
  const [builderFilter, setBuilderFilter] = useState('全部')
  const [toastMsg, setToastMsg] = useState('')

  // 今日想法输入
  const [ideaText, setIdeaText] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // 实时时间
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  // 聊天记录
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [aiTyping, setAiTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, aiTyping])

  const handleChatSend = () => {
    const text = ideaText.trim()
    if (!text) return
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() }
    setChatMessages(prev => [...prev, userMsg])
    setIdeaText('')
    setShowSuggestions(false)
    setAiTyping(true)
    setTimeout(() => {
      const reply = AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)]
      const aiMsg: ChatMessage = { role: 'assistant', content: reply, timestamp: Date.now() }
      setChatMessages(prev => [...prev, aiMsg])
      setAiTyping(false)
    }, 800 + Math.random() * 700)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % mockIdeaPlaceholders.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const builderRef = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === '全部'
    ? mockTrending
    : mockTrending.filter(t => t.tag === activeFilter)

  const trendTotal = filtered.length
  const trendTotalPages = Math.ceil(trendTotal / TREND_PAGE_SIZE)
  const pagedTrending = filtered.slice((trendPage - 1) * TREND_PAGE_SIZE, trendPage * TREND_PAGE_SIZE)

  const filteredBuilderTrending = builderFilter === '全部'
    ? mockTrending
    : mockTrending.filter(t => t.tag === builderFilter)

  // 热点按匹配度降序排列
  const sortedBuilderTrending = [...filteredBuilderTrending].sort((a, b) => b.match - a.match)

  const toggleBuilderCard = (subId: string) => {
    setBuilderCards(prev =>
      prev.includes(subId) ? prev.filter(c => c !== subId) : [...prev, subId]
    )
    setShowPackage(false)
  }

  const toggleExpandCard = (cardId: string) => {
    setExpandedCard(prev => prev === cardId ? null : cardId)
  }

  const selectedTrendingItem = mockTrending.find(t => t.id === builderTrending)
  const cardCount = builderCards.length
  const outputInfo = cardCount > 0 ? outputTypeMap[Math.min(cardCount, 5)] : null
  const canGenerate = builderTrending !== null && builderCards.length > 0

  const handleGenerate = () => {
    if (!canGenerate) return
    setGenerating(true)
    setShowPackage(false)
    setTimeout(() => {
      setGenerating(false)
      setShowPackage(true)
    }, 1200)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    if (!selectedTrendingItem) return
    savePlan({
      id: Date.now().toString(),
      timestamp: Date.now(),
      trendingTitle: selectedTrendingItem.title,
      cardCount,
      sections: packageSections,
    })
    const newCount = loadPlans().length
    setPlanCount(newCount)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 2500)
  }

  // 点击推荐想法：填入文字 + 预选卡片
  const handleIdeaSuggestion = (s: typeof mockIdeaSuggestions[0]) => {
    setIdeaText(s.text)
    setBuilderCards(s.tags)
    setShowPackage(false)
    setShowSuggestions(false)
  }

  // 专属选题"开始创作"联动随心搭
  const handleTopicAction = (topic: typeof mockTopics[0]) => {
    setBuilderTrending(topic.trendingId)
    setBuilderCards(topic.subCardIds)
    setShowPackage(false)
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    showToast(`已为你预选 ${topic.subCardIds.length} 张技能卡，快去生成创作包吧！`)
  }

  // 热榜"一键带入随心搭"
  const handleTrendingInject = (id: number, title: string) => {
    setBuilderTrending(id)
    setShowPackage(false)
    setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    showToast(`已选定热点「${title.slice(0, 8)}…」，去搭配技能卡吧！`)
  }

  const packageSections = selectedTrendingItem
    ? generatePackage(selectedTrendingItem, builderCards)
    : []

  return (
    <div className="home">
      {/* Toast 通知 */}
      {toastMsg && (
        <div className="home-toast">
          <span>✅ {toastMsg}</span>
        </div>
      )}

      {/* ── 融合 Hero + 内容选题随心搭 ── */}
      <section className="hero-builder-section" ref={builderRef}>
        {/* 左侧：问候 + 数据摘要 / 聊天记录 */}
        <div className="hero-side">
          <div className="hero-bg" />
          <div className="hero-content">
            {chatMessages.length === 0 ? (
              <>
                <div className="hero-mascot"><MascotSvg size={40} /></div>
                <p className="hero-date">{formatDate(now)}</p>
                <h1 className="hero-title">今天有什么想法💡？</h1>
                <p className="hero-sub">
                  基于你的风格 DNA，为你筛选了 <strong>3个</strong> 专属选题方向
                </p>
                <div className="hero-stats">
                  <div
                    className="stat-pill stat-pill--clickable"
                    onClick={() => {
                      const best = [...mockTrending].sort((a, b) => b.match - a.match)[0]
                      handleTrendingInject(best.id, best.title)
                    }}
                  >
                    <span className="stat-num">97分</span>
                    <span className="stat-lbl">最高匹配</span>
                    <span className="stat-hint">点击选用↗</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-num">15条</span>
                    <span className="stat-lbl">今日热点</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-num">{planCount}个</span>
                    <span className="stat-lbl">已存方案</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="hero-chat">
                <div className="hero-chat-header">
                  <MascotSvg size={24} />
                  <span className="hero-chat-title">创作助手</span>
                  <span className="hero-chat-time">{formatDate(now)}</span>
                </div>
                <div className="hero-chat-list">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
                      {msg.role === 'assistant' && (
                        <span className="chat-avatar"><MascotSvg size={20} /></span>
                      )}
                      <div className="chat-bubble-content">
                        <p className="chat-bubble-text">{msg.content}</p>
                        <span className="chat-bubble-time">
                          {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {aiTyping && (
                    <div className="chat-bubble chat-bubble--assistant">
                      <span className="chat-avatar"><MascotSvg size={20} /></span>
                      <div className="chat-bubble-content">
                        <span className="chat-typing-dots">
                          <span /><span /><span />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧主体：内容选题随心搭 */}
        <div className="builder-main">
          <div className="builder-header">
            <div className="builder-title-row">
              <span className="builder-dice">🎲</span>
              <h2 className="builder-title">内容选题随心搭</h2>
              <span className="builder-badge">积木创作</span>
            </div>
            <p className="builder-subtitle">选热点 × 配技能卡 → 生成你的内容创作包</p>
          </div>

          {/* ── 今日想法输入区 ── */}
          <div className="idea-input-area">
            <div className="idea-input-label">
              <span className="idea-input-icon">💡</span>
              <span>今天有什么想法？</span>
              <span className="idea-input-hint">输入方向，AI 帮你选卡</span>
            </div>

            {/* 快捷短语 chips */}
            <div className="idea-chips-row">
              {mockIdeaChips.map(chip => (
                <button
                  key={chip.label}
                  className="idea-chip"
                  onClick={() => setIdeaText(prev => prev ? prev + chip.fill : chip.fill)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* 输入框 */}
            <div className="idea-input-wrap">
              <textarea
                className="idea-textarea"
                value={ideaText}
                onChange={e => { setIdeaText(e.target.value); setShowSuggestions(false) }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleChatSend()
                  }
                }}
                placeholder={mockIdeaPlaceholders[placeholderIdx]}
                rows={2}
              />
              {ideaText && (
                <button
                  className="idea-clear-btn"
                  onClick={() => { setIdeaText(''); setShowSuggestions(false) }}
                  title="清空"
                >×</button>
              )}
              <button
                className={`idea-send-btn${ideaText.trim() ? ' idea-send-btn--active' : ''}`}
                disabled={!ideaText.trim()}
                onClick={handleChatSend}
                title="发送"
              >↑</button>
            </div>

            {/* 推荐输入下拉 */}
            {showSuggestions && (
              <div className="idea-suggestions">
                <p className="idea-suggestions-label">💫 推荐想法</p>
                {mockIdeaSuggestions.map(s => (
                  <button
                    key={s.id}
                    className="idea-suggestion-item"
                    onMouseDown={() => handleIdeaSuggestion(s)}
                  >
                    <span className="suggestion-text">{s.text}</span>
                    <span className="suggestion-tags">
                      {s.tags.map(t => (
                        <span key={t} className="suggestion-tag">{t.split('-')[0]}</span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="builder-body">
            {/* Step 1: 选热点 */}
            <div className="builder-step">
              <div className="builder-step-label">
                <span className="step-num">1</span>
                <span>选一个今日热点</span>
                <span className="step-sub">按匹配度排列</span>
              </div>
              {/* 热点筛选 */}
              <div className="builder-filter-row">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`filter-chip filter-chip--sm${builderFilter === f ? ' filter-chip--active' : ''}`}
                    onClick={() => { setBuilderFilter(f); setShowPackage(false) }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="builder-trending-grid">
                {sortedBuilderTrending.map(item => (
                  <button
                    key={item.id}
                    className={`builder-trend-card${builderTrending === item.id ? ' builder-trend-card--active' : ''}${item.match >= 90 ? ' builder-trend-card--top' : ''}`}
                    onClick={() => { setBuilderTrending(item.id); setShowPackage(false) }}
                  >
                    {item.match >= 90 && builderTrending !== item.id && (
                      <span className="btc-recommend">★ 推荐</span>
                    )}
                    <span className="btc-title">{item.title.length > 12 ? item.title.slice(0, 12) + '…' : item.title}</span>
                    <span className={`btc-heat ${item.heat >= 90 ? 'btc-heat--hot' : 'btc-heat--warm'}`}>
                      {item.heat >= 90 ? '🔥极热' : '📈上升'}
                    </span>
                    <div className="btc-footer">
                      <span className="btc-tag">{item.tag}</span>
                      <span className="btc-match">★{item.match}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-divider" />

            {/* Step 2: 选技能卡 */}
            <div className="builder-step">
              <div className="builder-step-label">
                <span className="step-num">2</span>
                <span>搭配你的技能卡（可多选）</span>
              </div>

              {/* 快捷预设 */}
              <div className="builder-presets">
                <span className="presets-label">快捷预设：</span>
                <button
                  className="preset-btn"
                  onClick={() => { setBuilderCards(['topic-1', 'speech-1']); setShowPackage(false) }}
                >
                  ⚡ 极简版 <span className="preset-hint">→ 选题方向</span>
                </button>
                <button
                  className="preset-btn"
                  onClick={() => { setBuilderCards(['topic-1', 'narrative-1', 'speech-1']); setShowPackage(false) }}
                >
                  📋 完整版 <span className="preset-hint">→ 脚本草稿</span>
                </button>
                <button
                  className="preset-btn preset-btn--pro"
                  onClick={() => {
                    const dnaCards = mockBuilderCards.flatMap(c =>
                      dnaRecommendedCards.has(c.id) ? [c.subCards[0].id] : []
                    )
                    setBuilderCards(dnaCards)
                    setShowPackage(false)
                  }}
                >
                  🧬 DNA全套 <span className="preset-hint">→ 完整方案</span>
                </button>
              </div>

              <p className="builder-step-hint">或展开各卡片自定义选择：</p>
              <div className="builder-cards-grid">
                {mockBuilderCards.map(card => {
                  const isExpanded = expandedCard === card.id
                  const selectedSubCount = card.subCards.filter(s => builderCards.includes(s.id)).length
                  const isDnaRecommended = dnaRecommendedCards.has(card.id)
                  return (
                    <div key={card.id} className={`builder-card-wrap${isExpanded ? ' builder-card-wrap--expanded' : ''}`}>
                      <button
                        className={`builder-card builder-card--${card.color}${selectedSubCount > 0 ? ' builder-card--active' : ''}${isExpanded ? ' builder-card--open' : ''}`}
                        onClick={() => toggleExpandCard(card.id)}
                      >
                        {isDnaRecommended && (
                          <span className="bc-dna-badge">🧬</span>
                        )}
                        <span className="bc-icon">{card.icon}</span>
                        <span className="bc-name">{card.name}</span>
                        <span className="bc-desc">{card.desc}</span>
                        {selectedSubCount > 0 && (
                          <span className="bc-check">✓{selectedSubCount}</span>
                        )}
                        <span className="bc-arrow">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {/* 子卡面板 */}
                      {isExpanded && (
                        <div className="sub-cards-panel">
                          {card.subCards.map(sub => {
                            const subActive = builderCards.includes(sub.id)
                            return (
                              <button
                                key={sub.id}
                                className={`sub-card${subActive ? ' sub-card--active' : ''}`}
                                onClick={() => toggleBuilderCard(sub.id)}
                              >
                                <span className="sub-card-icon">{sub.icon}</span>
                                <div className="sub-card-body">
                                  <span className="sub-card-name">{sub.name}</span>
                                  <span className="sub-card-desc">{sub.desc}</span>
                                  <span className="sub-card-source">{sub.source}</span>
                                </div>
                                <span className="sub-card-check">{subActive ? '✓' : '+'}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {cardCount > 0 && (
                <div className="builder-combo-hint">
                  <span className="combo-label">
                    💡 当前组合：
                    {builderTrending
                      ? `「${selectedTrendingItem!.title.slice(0, 10)}…」`
                      : '未选热点'}
                    {' × '}
                    <strong>{cardCount}张卡</strong>
                  </span>
                  {outputInfo && (
                    <span className="combo-output">
                      预计输出：<em>{outputInfo.label}</em>
                      <span className={`combo-depth combo-depth--${outputInfo.depth === '轻量' ? 'light' : outputInfo.depth === '中等' ? 'mid' : 'full'}`}>
                        {outputInfo.depth}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="builder-footer">
            {ideaText && (
              <div className="builder-idea-summary">
                <span className="idea-summary-icon">💡</span>
                <span className="idea-summary-text">「{ideaText.length > 30 ? ideaText.slice(0, 30) + '…' : ideaText}」</span>
              </div>
            )}
            <button
              className={`builder-generate${canGenerate ? ' builder-generate--active' : ''}${generating ? ' builder-generate--loading' : ''}`}
              disabled={!canGenerate || generating}
              onClick={handleGenerate}
            >
              {generating ? '⏳ 生成中…' : '✨ 生成我的内容创作包'}
            </button>
          </div>

          {/* 内容创作包输出 */}
          {showPackage && selectedTrendingItem && (
            <div className="content-package">
              <div className="cp-header">
                <div className="cp-title-row">
                  <span className="cp-pkg-icon">📦</span>
                  <h3 className="cp-title">内容创作包</h3>
                </div>
                <p className="cp-meta">
                  热点：「{selectedTrendingItem.title.slice(0, 12)}…」× {cardCount}张技能卡
                  {outputInfo && <span className="cp-type"> → {outputInfo.label}</span>}
                </p>
                {ideaText && (
                  <p className="cp-idea-meta">💡 基于想法：「{ideaText.length > 40 ? ideaText.slice(0, 40) + '…' : ideaText}」</p>
                )}
              </div>

              <div className="cp-sections">
                {packageSections.map((sec, i) => (
                  <div
                    key={i}
                    className="cp-section"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <p className="cp-section-title">{sec.section}</p>
                    <p className="cp-section-body">{sec.content}</p>
                  </div>
                ))}
              </div>

              <div className="cp-actions">
                <button className="cp-btn cp-btn--copy" onClick={handleCopy}>
                  {copied ? '✅ 已复制' : '📋 复制创作包'}
                </button>
                <button className="cp-btn cp-btn--agent">🤖 发给剪辑 Agent</button>
                <button className="cp-btn cp-btn--save" onClick={handleSave}>
                  {saved ? `✅ 已存入(${planCount}个)` : '💾 存入方案库'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="home-grid">
        {/* ── Left: Trending ── */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">今日热榜</h2>
            <span className="section-badge">08:00 更新</span>
          </div>

          <div className="filter-row">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-chip${activeFilter === f ? ' filter-chip--active' : ''}`}
                onClick={() => { setActiveFilter(f); setTrendPage(1) }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="trending-list">
            {pagedTrending.map((item) => (
              <div key={item.id} className="trending-item">
                <div className="trending-rank">{item.rank}</div>
                <div className="trending-body">
                  <p className="trending-title">{item.title}</p>
                  <div className="trending-meta">
                    <span className="tag-chip">{item.tag}</span>
                    <span className="trending-heat">🔥 热度 {item.heat}</span>
                  </div>
                </div>
                <div className="trending-match">
                  <div
                    className="match-ring"
                    style={{ '--match': item.match } as React.CSSProperties}
                  >
                    <span className="match-num">{item.match}</span>
                  </div>
                  <span className="match-lbl">匹配</span>
                </div>
                <button
                  className="trending-inject-btn"
                  onClick={() => handleTrendingInject(item.id, item.title)}
                >
                  + 随心搭
                </button>
              </div>
            ))}
          </div>

          {trendTotalPages > 1 && (
            <div className="trend-pagination">
              <button
                className="trend-page-btn"
                disabled={trendPage === 1}
                onClick={() => setTrendPage(p => p - 1)}
              >
                ‹
              </button>
              {Array.from({ length: trendTotalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`trend-page-btn${trendPage === p ? ' trend-page-btn--active' : ''}`}
                  onClick={() => setTrendPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="trend-page-btn"
                disabled={trendPage === trendTotalPages}
                onClick={() => setTrendPage(p => p + 1)}
              >
                ›
              </button>
              <span className="trend-page-info">{(trendPage - 1) * TREND_PAGE_SIZE + 1}–{Math.min(trendPage * TREND_PAGE_SIZE, trendTotal)} / {trendTotal}条</span>
            </div>
          )}
        </section>

        {/* ── Right: Personalized Topics ── */}
        <section className="home-section">
          <div className="section-header">
            <h2 className="section-title">专属选题推荐</h2>
            <span className="section-badge badge-blue">AI 生成</span>
          </div>

          <div className="topics-list">
            {mockTopics.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card${selectedTopic === topic.id ? ' topic-card--selected' : ''}`}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              >
                <div className="topic-header">
                  <span className={`topic-tag topic-tag--${topic.tag === '精准推荐' ? 'blue' : topic.tag === '高潜力' ? 'green' : 'orange'}`}>
                    {topic.tag}
                  </span>
                  <span className="topic-score">{topic.score}分</span>
                </div>
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-reason">{topic.reason}</p>

                {selectedTopic === topic.id && (
                  <div className="topic-skills">
                    <p className="skills-label">推荐技能卡</p>
                    <div className="skills-chips">
                      {topic.skills.map(s => (
                        <span key={s} className="skill-ref">{s}</span>
                      ))}
                    </div>
                    <button
                      className="topic-action"
                      onClick={(e) => { e.stopPropagation(); handleTopicAction(topic) }}
                    >
                      🚀 一键预填随心搭 →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Guide Banner ── */}
          <div className="guide-banner">
            <div className="guide-icon">💡</div>
            <div className="guide-text">
              <strong>向第一位博主学习</strong>
              <p>添加喜欢的博主主页，提取他们的内容技巧</p>
            </div>
            <button className="guide-btn">去添加</button>
          </div>
        </section>
      </div>
    </div>
  )
}
