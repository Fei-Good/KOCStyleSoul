import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import './AppShell.css'

const NAV_ITEMS = [
  { path: '/home',     icon: '🏠',  label: '工作台' },
  { path: '/dna',      icon: '🐾',  label: '我的 DNA' },
  { path: '/skills',   icon: '📚',  label: '技能卡库' },
  { path: '/settings', icon: '⚙️',  label: '设置' },
]

// Cute fox doodle — flat vector illustration mascot
const FoxMascot = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="4,10 7,3 10,10" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="14,10 17,3 20,10" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="5.5,9.5 7,5 8.5,9.5" fill="#f9da72"/>
    <polygon points="15.5,9.5 17,5 18.5,9.5" fill="#f9da72"/>
    <ellipse cx="12" cy="14" rx="8" ry="7" fill="#e8523a" stroke="#1a1a1a" strokeWidth="1.5"/>
    <ellipse cx="12" cy="16" rx="4.5" ry="3.5" fill="#fdf0ed"/>
    <circle cx="9.5" cy="13" r="1.2" fill="#1a1a1a"/>
    <circle cx="14.5" cy="13" r="1.2" fill="#1a1a1a"/>
    <circle cx="9.9" cy="12.6" r="0.4" fill="white"/>
    <circle cx="14.9" cy="12.6" r="0.4" fill="white"/>
    <ellipse cx="12" cy="16" rx="1" ry="0.7" fill="#c43d28"/>
    <path d="M10.5 17 Q12 18.2 13.5 17" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
)

export default function AppShell() {
  const location = useLocation()
  const current = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={`shell${sidebarOpen ? '' : ' shell--collapsed'}`}>
      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? '' : ' sidebar--collapsed'}`}>
        <div className="sidebar-brand">
          <span className="brand-mark"><FoxMascot /></span>
          {sidebarOpen && (
            <div className="brand-text">
              <span className="brand-name">StyleSoul</span>
              <span className="brand-sub">KOC 成长工作台</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item${isActive ? ' nav-item--active' : ''}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              <span className="nav-indicator" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* 折叠开关 */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
          >
            <span className="toggle-icon">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="toggle-label">收起</span>}
          </button>

          {sidebarOpen && (
            <div className="user-chip">
              <div className="user-avatar">G</div>
              <div className="user-info">
                <span className="user-name">@gaopengfei</span>
                <span className="user-status">
                  <span className="status-dot" />
                  B站已绑定
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-page">
            {current?.icon} {current?.label}
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn">
              <span>✦</span> AI 诊断
            </button>
          </div>
        </header>

        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
