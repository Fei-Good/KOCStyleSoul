import { useState } from 'react'
import './SettingsPage.css'

export default function SettingsPage() {
  const [url, setUrl] = useState('https://space.bilibili.com/example')
  const [freq, setFreq] = useState('weekly')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">设置</h1>
        <p className="settings-sub">管理你的 B 站主页绑定与 AI 更新偏好</p>
      </div>

      {/* ── Account Section ── */}
      <div className="settings-section">
        <div className="section-title-row">
          <span className="section-icon">🔗</span>
          <h2 className="settings-section-title">主页绑定</h2>
        </div>

        <div className="settings-card">
          <div className="bound-status">
            <div className="bound-platform">
              <div className="platform-icon bili">B</div>
              <div>
                <p className="platform-name">哔哩哔哩</p>
                <p className="platform-status">
                  <span className="status-dot" />
                  已绑定
                </p>
              </div>
            </div>
            <button className="unbind-btn">解绑</button>
          </div>

          <div className="url-field-wrap">
            <label className="field-label">主页链接</label>
            <input
              className="url-field"
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://space.bilibili.com/..."
            />
            <p className="field-hint">绑定后 AI 将持续解析你的主页内容，更新风格 DNA</p>
          </div>
        </div>

        {/* ── Coming Soon Platforms ── */}
        <div className="coming-soon-row">
          {['抖音', '小红书', '视频号'].map(p => (
            <div key={p} className="coming-card">
              <span className="coming-name">{p}</span>
              <span className="coming-badge">二期上线</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Update Frequency ── */}
      <div className="settings-section">
        <div className="section-title-row">
          <span className="section-icon">🔄</span>
          <h2 className="settings-section-title">DNA 更新频率</h2>
        </div>

        <div className="settings-card">
          <div className="freq-options">
            {[
              { value: 'daily',   label: '每日',   desc: '最新鲜的分析，适合高频发布' },
              { value: 'weekly',  label: '每周',   desc: '均衡精度与性能，推荐' },
              { value: 'manual',  label: '手动',   desc: '完全由你掌控更新节奏' },
            ].map(opt => (
              <div
                key={opt.value}
                className={`freq-option${freq === opt.value ? ' freq-option--active' : ''}`}
                onClick={() => setFreq(opt.value)}
              >
                <div className="freq-radio">
                  {freq === opt.value && <div className="freq-radio-dot" />}
                </div>
                <div>
                  <p className="freq-label">{opt.label}</p>
                  <p className="freq-desc">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notification ── */}
      <div className="settings-section">
        <div className="section-title-row">
          <span className="section-icon">🔔</span>
          <h2 className="settings-section-title">通知偏好</h2>
        </div>

        <div className="settings-card">
          {[
            { label: 'DNA 更新完成通知', desc: '分析完成后提醒你查看最新图谱', enabled: true },
            { label: '每日选题推送',     desc: '每天 08:30 推送专属选题建议', enabled: true },
            { label: '热榜异常提醒',     desc: '出现与你 DNA 高匹配度热点时通知', enabled: false },
          ].map(item => (
            <div key={item.label} className="notif-row">
              <div>
                <p className="notif-label">{item.label}</p>
                <p className="notif-desc">{item.desc}</p>
              </div>
              <button
                className={`toggle-btn${item.enabled ? ' toggle-btn--on' : ''}`}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Export ── */}
      <div className="settings-section">
        <div className="section-title-row">
          <span className="section-icon">📤</span>
          <h2 className="settings-section-title">数据导出</h2>
        </div>

        <div className="settings-card export-card">
          <div className="export-item">
            <div>
              <p className="export-label">技能卡库</p>
              <p className="export-desc">JSON 格式，供剪辑 Agent / 脚本 Agent 调用</p>
            </div>
            <button className="export-btn">导出 JSON</button>
          </div>
          <div className="export-divider" />
          <div className="export-item">
            <div>
              <p className="export-label">风格 DNA 报告</p>
              <p className="export-desc">Markdown 格式，包含雷达图数据与洞察</p>
            </div>
            <button className="export-btn">导出 MD</button>
          </div>
        </div>
      </div>

      {/* ── Save ── */}
      <div className="settings-save-row">
        <button
          className={`save-btn${saved ? ' save-btn--saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ 已保存' : '保存设置'}
        </button>
      </div>
    </div>
  )
}
