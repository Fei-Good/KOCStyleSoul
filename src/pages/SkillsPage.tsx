import { useState } from 'react'
import { mockSkills } from '../data/mock'
import './SkillsPage.css'

const TYPES = ['全部', '选题', '开场', '结构', '封面', '互动', '结尾']
const STATUSES = ['全部', '已收藏', '已实践', '待尝试']

const STATUS_MAP: Record<string, string> = {
  saved: '已收藏',
  practiced: '已实践',
  pending: '待尝试',
}

const STATUS_CLASS: Record<string, string> = {
  saved: 'status--saved',
  practiced: 'status--practiced',
  pending: 'status--pending',
}

const STARS = (n: number) => Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('')

export default function SkillsPage() {
  const [activeType, setActiveType] = useState('全部')
  const [activeStatus, setActiveStatus] = useState('全部')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [addUrl, setAddUrl] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = mockSkills.filter(s => {
    const typeOk = activeType === '全部' || s.type === activeType
    const statusOk = activeStatus === '全部' || STATUS_MAP[s.status] === activeStatus
    return typeOk && statusOk
  })

  return (
    <div className="skills-page">
      {/* ── Header ── */}
      <div className="skills-header">
        <div>
          <h1 className="skills-title">技能卡库</h1>
          <p className="skills-sub">从优质博主身上提取可复用的内容创作技巧</p>
        </div>
        <button
          className="add-btn"
          onClick={() => setShowAdd(!showAdd)}
        >
          + 添加博主
        </button>
      </div>

      {/* ── Add Panel ── */}
      {showAdd && (
        <div className="add-panel">
          <div className="add-panel-inner">
            <p className="add-label">粘贴 B 站博主主页或视频链接</p>
            <div className="add-input-row">
              <input
                className="add-input"
                type="text"
                placeholder="https://space.bilibili.com/..."
                value={addUrl}
                onChange={e => setAddUrl(e.target.value)}
              />
              <button className="add-submit">
                AI 解析 →
              </button>
            </div>
            <p className="add-hint">解析完成后将自动生成技能卡并加入知识库</p>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="skills-filters">
        <div className="filter-group">
          <span className="filter-group-label">类型</span>
          <div className="filter-row">
            {TYPES.map(t => (
              <button
                key={t}
                className={`filter-chip${activeType === t ? ' filter-chip--active' : ''}`}
                onClick={() => setActiveType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-group-label">状态</span>
          <div className="filter-row">
            {STATUSES.map(s => (
              <button
                key={s}
                className={`filter-chip${activeStatus === s ? ' filter-chip--active' : ''}`}
                onClick={() => setActiveStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="skills-stats">
        <div className="stat-item">
          <span className="stat-n">{mockSkills.length}</span>
          <span className="stat-l">总技能卡</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-n">{mockSkills.filter(s => s.status === 'practiced').length}</span>
          <span className="stat-l">已实践</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-n">{mockSkills.filter(s => s.match >= 4).length}</span>
          <span className="stat-l">高度匹配</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-n">3</span>
          <span className="stat-l">来源博主</span>
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div className="skills-grid">
        {filtered.map(skill => (
          <div
            key={skill.id}
            className={`skill-card${expandedId === skill.id ? ' skill-card--expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === skill.id ? null : skill.id)}
          >
            <div className="skill-card-header">
              <div className="skill-icon-type">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-type-badge">{skill.type}卡</span>
              </div>
              <span className={`skill-status ${STATUS_CLASS[skill.status]}`}>
                {STATUS_MAP[skill.status]}
              </span>
            </div>

            <h3 className="skill-name">{skill.name}</h3>
            <p className="skill-source">来源：{skill.source}</p>

            <div className="skill-match">
              <span className="match-label">与你的 DNA 兼容度</span>
              <span className="match-stars">{STARS(skill.match)}</span>
              <span className="match-text">
                {skill.match >= 4 ? '高度匹配' : skill.match === 3 ? '较好匹配' : '部分匹配'}
              </span>
            </div>

            {expandedId === skill.id && (
              <div className="skill-detail">
                <div className="detail-block">
                  <p className="detail-label">核心套路</p>
                  <p className="detail-template">{skill.template}</p>
                </div>

                <div className="detail-block">
                  <p className="detail-label">典型案例</p>
                  {skill.cases.map(c => (
                    <p key={c} className="detail-case">· {c}</p>
                  ))}
                </div>

                <div className="skill-tags">
                  {skill.tags.map(t => (
                    <span key={t} className="skill-tag">#{t}</span>
                  ))}
                </div>

                <div className="skill-actions">
                  <button className="action-btn action-btn--primary">
                    导出 →
                  </button>
                  <button className="action-btn action-btn--secondary">
                    {skill.status === 'practiced' ? '✓ 已实践' : '标记已实践'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🃏</span>
          <p>暂无符合条件的技能卡</p>
        </div>
      )}
    </div>
  )
}
