import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './OnboardingPage.css'

const PLATFORMS = [
  { id: 'wechat',      name: '微信',  icon: '💬', color: 'green',  placeholder: 'https://mp.weixin.qq.com/s/...' },
  { id: 'bilibili',    name: 'B站',  icon: '📺', color: 'blue',   placeholder: 'https://space.bilibili.com/123456' },
  { id: 'xiaohongshu', name: '小红书', icon: '📕', color: 'red',   placeholder: 'https://www.xiaohongshu.com/user/abc' },
  { id: 'douyin',      name: '抖音', icon: '🎵', color: 'purple', placeholder: 'https://www.douyin.com/user/xyz' },
]

const MOCK_PROFILES: Record<string, { name: string; fans: string; posts: string; avgView: string; tags: string[] }> = {
  wechat:       { name: 'gaopengfei',  fans: '3.1万', posts: '62',  avgView: '1.2万', tags: ['科技', '成长', '干货'] },
  bilibili:     { name: 'gaopengfei',  fans: '2.3万', posts: '47',  avgView: '8600',  tags: ['科技', '成长', '效率工具'] },
  xiaohongshu:  { name: 'pengfei.g',   fans: '1.1万', posts: '89',  avgView: '3200',  tags: ['职场', '干货', '创作'] },
  douyin:       { name: '@gpf_vlog',   fans: '5.7万', posts: '132', avgView: '2.4万', tags: ['生活', '知识', '成长'] },
}

const DNA_STEPS = [
  '正在抓取主页内容…',
  '分析近 30 篇作品…',
  '提取叙事风格特征…',
  '计算情绪频率分布…',
  '生成风格 DNA 指纹…',
  '匹配专属技能卡库…',
]

type Step = 'welcome' | 'platform' | 'input' | 'analyzing' | 'done'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('welcome')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [dnaProgress, setDnaProgress] = useState(0)
  const [dnaStepIdx, setDnaStepIdx] = useState(0)

  // 用第一个选中的平台做 mock 展示
  const platform = PLATFORMS.find(p => p.id === selectedPlatforms[0])
  const profile = selectedPlatforms[0] ? MOCK_PROFILES[selectedPlatforms[0]] : null

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleStartAnalyze = () => {
    setStep('analyzing')
    setDnaProgress(0)
    setDnaStepIdx(0)
    let idx = 0
    const interval = setInterval(() => {
      idx++
      setDnaStepIdx(Math.min(idx, DNA_STEPS.length - 1))
      setDnaProgress(Math.min(Math.round((idx / DNA_STEPS.length) * 100), 100))
      if (idx >= DNA_STEPS.length) {
        clearInterval(interval)
        setTimeout(() => setStep('done'), 500)
      }
    }, 600)
  }

  const handleEnter = () => {
    localStorage.setItem('onboarding_done', '1')
    navigate('/home', { replace: true })
  }

  return (
    <div className="onboard">
      <div className="ob-bg">
        <div className="ob-dot-grid" />
        <div className="ob-blob ob-blob--1" />
        <div className="ob-blob ob-blob--2" />
        <div className="ob-blob ob-blob--3" />
      </div>

      <div className="ob-frame">

        {/* ════ welcome ════ */}
        {step === 'welcome' && (
          <div className="ob-card ob-card--welcome">
            <div className="ob-mascot-wrap">
              <FoxLarge />
            </div>
            <p className="ob-eyebrow">欢迎使用</p>
            <h1 className="ob-hero-title">StyleSoul</h1>
            <p className="ob-tagline">
              你的专属 KOC 内容成长工作台<br />
              <strong>解析风格 DNA，让每条内容都更像你</strong>
            </p>
            <div className="ob-features">
              {[
                { icon: '🐾', text: '提取你的创作风格 DNA' },
                { icon: '📚', text: '从顶级博主身上学可复用技能卡' },
                { icon: '🎲', text: '随心搭积木，生成内容创作包' },
              ].map(f => (
                <div key={f.text} className="ob-feature-row">
                  <span className="ob-feature-icon">{f.icon}</span>
                  <span className="ob-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
            <button className="ob-btn ob-btn--primary ob-btn--lg" onClick={() => setStep('platform')}>
              开始分析我的风格 →
            </button>
            <button className="ob-skip" onClick={handleEnter}>已有账号？直接进入工作台</button>
          </div>
        )}

        {/* ════ platform ════ */}
        {step === 'platform' && (
          <div className="ob-card">
            <StepDots current={1} total={3} />
            <h2 className="ob-card-title">选择你的主创平台</h2>
            <p className="ob-card-sub">可多选，我们将分析你的主页内容，提取创作风格特征</p>
            <div className="ob-platform-grid">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  className={`ob-plat-card ob-plat-card--${p.color}${selectedPlatforms.includes(p.id) ? ' ob-plat-card--active' : ''}`}
                  onClick={() => togglePlatform(p.id)}
                >
                  <span className="ob-plat-icon">{p.icon}</span>
                  <span className="ob-plat-name">{p.name}</span>
                  {selectedPlatforms.includes(p.id) && <span className="ob-plat-check">✓</span>}
                </button>
              ))}
            </div>
            {selectedPlatforms.length > 0 && (
              <p className="ob-plat-hint">
                已选 <strong>{selectedPlatforms.length}</strong> 个平台：
                {selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.name).join('、')}
              </p>
            )}
            <div className="ob-actions">
              <button className="ob-btn ob-btn--ghost" onClick={() => setStep('welcome')}>← 返回</button>
              <button
                className={`ob-btn ob-btn--primary${selectedPlatforms.length > 0 ? '' : ' ob-btn--disabled'}`}
                disabled={selectedPlatforms.length === 0}
                onClick={() => setStep('input')}
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ════ input ════ */}
        {step === 'input' && platform && (
          <div className="ob-card">
            <StepDots current={2} total={3} />
            <h2 className="ob-card-title">粘贴你的主页链接</h2>
            <p className="ob-card-sub">将你的 {platform.name} 主页 URL 粘贴到下方</p>

            <div className={`ob-url-box ob-url-box--${platform.color}`}>
              <span className="ob-url-icon">{platform.icon}</span>
              <input
                className="ob-url-input"
                placeholder={platform.placeholder}
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                autoFocus
              />
              {inputUrl && (
                <button className="ob-url-clear" onClick={() => setInputUrl('')}>✕</button>
              )}
            </div>

            <div className="ob-demo-hint">
              <span className="ob-demo-tag">💡 演示模式</span>
              <span className="ob-demo-text">无需真实链接，点击下方按钮即可体验完整流程</span>
              <button className="ob-demo-fill" onClick={() => setInputUrl(platform.placeholder)}>
                填入示例链接
              </button>
            </div>

            <div className="ob-actions">
              <button className="ob-btn ob-btn--ghost" onClick={() => setStep('platform')}>← 返回</button>
              <button
                className={`ob-btn ob-btn--primary${inputUrl ? '' : ' ob-btn--disabled'}`}
                disabled={!inputUrl}
                onClick={handleStartAnalyze}
              >
                开始解析 ✦
              </button>
            </div>
          </div>
        )}

        {/* ════ analyzing ════ */}
        {step === 'analyzing' && platform && (
          <div className="ob-card ob-card--analyzing">
            <div className="ob-analyzing-fox">
              <FoxAnalyzing />
            </div>
            <h2 className="ob-card-title">正在提取你的风格 DNA…</h2>
            <p className="ob-card-sub">AI 正在分析你在 {platform.name} 的创作模式</p>
            <div className="ob-progress-row">
              <div className="ob-progress-bar">
                <div className="ob-progress-fill" style={{ width: `${dnaProgress}%` }} />
              </div>
              <span className="ob-progress-num">{dnaProgress}%</span>
            </div>
            <div className="ob-dna-steps-list">
              {DNA_STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`ob-dna-step${i < dnaStepIdx ? ' ob-dna-step--done' : i === dnaStepIdx ? ' ob-dna-step--active' : ''}`}
                >
                  <span className="ob-dna-dot">
                    {i < dnaStepIdx ? '✓' : i === dnaStepIdx ? '◉' : '○'}
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ done ════ */}
        {step === 'done' && profile && platform && (
          <div className="ob-card ob-card--done">
            <div className="ob-done-badge">✦ 解析完成</div>
            <h2 className="ob-card-title">你的风格 DNA 已生成！</h2>

            <div className="ob-profile-card">
              <div className="ob-profile-avatar">{profile.name[0].toUpperCase()}</div>
              <div className="ob-profile-info">
                <p className="ob-profile-name">{profile.name}</p>
                <p className="ob-profile-plat">{platform.icon} {platform.name}</p>
              </div>
              <div className="ob-profile-stats">
                <div className="ob-pstat"><strong>{profile.fans}</strong><span>粉丝</span></div>
                <div className="ob-pstat"><strong>{profile.posts}</strong><span>作品</span></div>
                <div className="ob-pstat"><strong>{profile.avgView}</strong><span>均播</span></div>
              </div>
            </div>

            <div className="ob-dna-result">
              <p className="ob-dna-result-label">提取到的风格标签</p>
              <div className="ob-dna-tags">
                {profile.tags.map(tag => (
                  <span key={tag} className="ob-dna-tag">{tag}</span>
                ))}
                <span className="ob-dna-tag ob-dna-tag--star">🐾 DNA 已锁定</span>
              </div>
            </div>

            <div className="ob-dna-bars">
              {[
                { label: '叙事节奏', score: 72, color: '#e8523a' },
                { label: '情绪频率', score: 58, color: '#8b7fc7' },
                { label: '视觉指纹', score: 85, color: '#4a9b6f' },
              ].map(d => (
                <div key={d.label} className="ob-bar-row">
                  <span className="ob-bar-label">{d.label}</span>
                  <div className="ob-bar-track">
                    <div className="ob-bar-fill" style={{ width: `${d.score}%`, background: d.color }} />
                  </div>
                  <span className="ob-bar-num">{d.score}</span>
                </div>
              ))}
            </div>

            <button className="ob-btn ob-btn--primary ob-btn--lg ob-btn--enter" onClick={handleEnter}>
              进入我的工作台 →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="ob-step-dots">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`ob-step-dot${i + 1 === current ? ' ob-step-dot--active' : i + 1 < current ? ' ob-step-dot--done' : ''}`}
        />
      ))}
      <span className="ob-step-label">{current} / {total}</span>
    </div>
  )
}

function FoxLarge() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,44 28,12 40,44" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="56,44 68,12 80,44" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="19,42 28,20 37,42" fill="#f9da72"/>
      <polygon points="59,42 68,20 77,42" fill="#f9da72"/>
      <ellipse cx="48" cy="60" rx="34" ry="28" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="48" cy="68" rx="20" ry="14" fill="#fdf0ed"/>
      <circle cx="38" cy="56" r="5" fill="#1a1a1a"/>
      <circle cx="58" cy="56" r="5" fill="#1a1a1a"/>
      <circle cx="39.5" cy="54.5" r="1.8" fill="white"/>
      <circle cx="59.5" cy="54.5" r="1.8" fill="white"/>
      <ellipse cx="48" cy="68" rx="4" ry="3" fill="#c43d28"/>
      <path d="M42 73 Q48 78 54 73" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <line x1="30" y1="60" x2="14" y2="56" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="64" x2="14" y2="64" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="66" y1="60" x2="82" y2="56" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="66" y1="64" x2="82" y2="64" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function FoxAnalyzing() {
  return (
    <svg width="80" height="80" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,44 28,12 40,44" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="56,44 68,12 80,44" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <polygon points="19,42 28,20 37,42" fill="#f9da72"/>
      <polygon points="59,42 68,20 77,42" fill="#f9da72"/>
      <ellipse cx="48" cy="60" rx="34" ry="28" fill="#e8523a" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="48" cy="68" rx="20" ry="14" fill="#fdf0ed"/>
      <path d="M34 54 Q38 50 42 54" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M54 54 Q58 50 62 54" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="48" cy="68" rx="4" ry="3" fill="#c43d28"/>
      <path d="M42 73 Q48 78 54 73" stroke="#1a1a1a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="76" cy="26" r="10" fill="white" stroke="#1a1a1a" strokeWidth="2.5"/>
      <circle cx="76" cy="26" r="6" fill="#eef4fc" stroke="#4a7fc1" strokeWidth="1.5"/>
      <line x1="83" y1="33" x2="90" y2="42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}
