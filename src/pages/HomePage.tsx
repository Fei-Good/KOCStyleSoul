import { useState } from 'react'
import { mockTrending, mockTopics, mockBuilderCards, outputTypeMap } from '../data/mock'
import './HomePage.css'

const FILTERS = ['全部', '顶流爆款', '打工人', '情绪治愈']

// 根据选中的卡片组合生成内容创作包内容
function generatePackage(trendingItem: typeof mockTrending[0], selectedCards: string[]) {
  const cardMap: Record<string, { section: string; content: string }> = {
    topic: {
      section: '🪝 标题方向（来自选题卡）',
      content: `「你以为${trendingItem.title.split('：')[0]}只是趋势？其实它正在改变你的认知...」\n「为什么${trendingItem.tag}领域的人都在关注这件事」`,
    },
    narrative: {
      section: '📖 内容结构（来自叙事卡）',
      content: `开场：3秒悬念抛出 → 中段：3个案例递进\n结尾：反转 + 互动问题引导`,
    },
    speech: {
      section: '🎤 口播草稿（来自表达卡）',
      content: `"大家好，今天要聊一个很多人都搞错的事情...\n[主题切入] → [案例展开] → [行动引导]"`,
    },
    edit: {
      section: '🎬 剪辑节奏（来自剪辑卡）',
      content: `高能片段前置 · 情绪点配音效 · 字幕密集\n卡点节奏：每3-5秒一个视觉切换`,
    },
    ops: {
      section: '📊 运营建议（来自运营卡）',
      content: `最佳发布：工作日 12:00-13:00 或 20:00-22:00\n封面标签：#${trendingItem.tag} + 话题引流`,
    },
  }
  return selectedCards.map(id => {
    // 子卡 id 格式为 "parentId-N"，提取父卡类型
    const parentId = id.includes('-') ? id.split('-')[0] : id
    return cardMap[parentId]
  }).filter((v, i, arr) => v && arr.findIndex(x => x === v) === i)
}

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('全部')
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null)

  // 随心搭状态
  const [builderTrending, setBuilderTrending] = useState<number | null>(null)
  const [builderCards, setBuilderCards] = useState<string[]>([])
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [showPackage, setShowPackage] = useState(false)
  const [copied, setCopied] = useState(false)

  const filtered = activeFilter === '全部'
    ? mockTrending
    : mockTrending.filter(t => t.tag === activeFilter)

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
    if (canGenerate) setShowPackage(true)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const packageSections = selectedTrendingItem
    ? generatePackage(selectedTrendingItem, builderCards)
    : []

  return (
    <div className="home">
      {/* ── 融合 Hero + 内容选题随心搭 ── */}
      <section className="hero-builder-section">
        {/* 左侧：问候 + 数据摘要 */}
        <div className="hero-side">
          <div className="hero-bg" />
          <div className="hero-content">
            <p className="hero-date">今天 · 2026年5月6日 周三</p>
            <h1 className="hero-title">今天有什么想法💡？</h1>
            <p className="hero-sub">
              基于你的风格 DNA，为你筛选了 <strong>3个</strong> 专属选题方向
            </p>
            <div className="hero-stats">
              <div className="stat-pill">
                <span className="stat-num">97分</span>
                <span className="stat-lbl">最高匹配度</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">5条</span>
                <span className="stat-lbl">今日热点</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">2天前</span>
                <span className="stat-lbl">DNA更新</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧主体：内容选题随心搭（重点突出） */}
        <div className="builder-main">
          <div className="builder-header">
            <div className="builder-title-row">
              <span className="builder-dice">🎲</span>
              <h2 className="builder-title">内容选题随心搭</h2>
              <span className="builder-badge">积木创作</span>
            </div>
            <p className="builder-subtitle">选热点 × 配技能卡 → 生成你的内容创作包</p>
          </div>

          <div className="builder-body">
            {/* Step 1: 选热点 */}
            <div className="builder-step">
              <div className="builder-step-label">
                <span className="step-num">1</span>
                <span>选一个今日热点</span>
              </div>
              <div className="builder-trending-grid">
                {mockTrending.map(item => (
                  <button
                    key={item.id}
                    className={`builder-trend-card${builderTrending === item.id ? ' builder-trend-card--active' : ''}`}
                    onClick={() => { setBuilderTrending(item.id); setShowPackage(false) }}
                  >
                    <span className="btc-title">{item.title.length > 14 ? item.title.slice(0, 14) + '…' : item.title}</span>
                    <span className={`btc-heat ${item.heat >= 90 ? 'btc-heat--hot' : 'btc-heat--warm'}`}>
                      {item.heat >= 90 ? '🔥极热' : '📈上升'}
                    </span>
                    <span className="btc-tag">{item.tag}</span>
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
              <p className="builder-step-hint">点击卡片展开子技能，从中选择加入随心搭：</p>
              <div className="builder-cards-grid">
                {mockBuilderCards.map(card => {
                  const isExpanded = expandedCard === card.id
                  const selectedSubCount = card.subCards.filter(s => builderCards.includes(s.id)).length
                  return (
                    <div key={card.id} className={`builder-card-wrap${isExpanded ? ' builder-card-wrap--expanded' : ''}`}>
                      {/* 主卡 */}
                      <button
                        className={`builder-card builder-card--${card.color}${selectedSubCount > 0 ? ' builder-card--active' : ''}${isExpanded ? ' builder-card--open' : ''}`}
                        onClick={() => toggleExpandCard(card.id)}
                      >
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
            <button
              className={`builder-generate${canGenerate ? ' builder-generate--active' : ''}`}
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              ✨ 生成我的内容创作包
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
              </div>

              <div className="cp-sections">
                {packageSections.map((sec, i) => (
                  <div key={i} className="cp-section">
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
                <button className="cp-btn cp-btn--save">💾 存入方案库</button>
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
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="trending-list">
            {filtered.map((item) => (
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
              </div>
            ))}
          </div>
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
                    <button className="topic-action">开始创作 →</button>
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
