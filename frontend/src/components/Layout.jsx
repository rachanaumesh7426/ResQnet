import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationToast from './NotificationToast';
import SOSButton from './SOSButton';

const navItems = [
  { path: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { path: '/map', icon: '◎', label: 'Live Map' },
  { path: '/incidents', icon: '⚡', label: 'Incidents' },
  { path: '/resources', icon: '◈', label: 'Resources' },
  { path: '/volunteers', icon: '◉', label: 'Volunteers' },
  { path: '/relief-camps', icon: '⬟', label: 'Relief Camps' },
  { path: '/alerts', icon: '▲', label: 'Alerts' },
  { path: '/helpline', icon: '☎', label: 'Helpline' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { notifications, dismissNotification, onlineCount } = useSocket();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const roleColor = user?.role === 'admin' ? 'var(--purple)' : user?.role === 'responder' ? 'var(--blue)' : 'var(--green)';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        minWidth: sidebarOpen ? 240 : 72,
        background: 'rgba(5,5,7,0.85)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        overflow: 'hidden',
        zIndex: 100,
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #ff4fa3, #9b59ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: '0 4px 20px rgba(255,79,163,0.4)',
          }}>🛡</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>ResQNet</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--pink)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Disaster Mgmt</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '11px 12px', borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--pink)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(255,79,163,0.1)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(255,79,163,0.25)' : 'transparent'}`,
              textDecoration: 'none', marginBottom: 4,
              transition: 'all var(--transition)', whiteSpace: 'nowrap', overflow: 'hidden',
              boxShadow: isActive ? '0 0 20px rgba(255,79,163,0.1)' : 'none',
            })}
              title={!sidebarOpen ? item.label : ''}>
              {({ isActive }) => <>
                <span style={{ fontSize: 18, flexShrink: 0, filter: isActive ? 'drop-shadow(0 0 6px var(--pink))' : 'none' }}>{item.icon}</span>
                {sidebarOpen && <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.label}</span>}
              </>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: '16px 8px', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={() => navigate('/profile')} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--text-primary)',
            transition: 'all var(--transition)', marginBottom: 8, overflow: 'hidden',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${roleColor}, rgba(255,79,163,0.5))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
            }}>{user?.name?.[0]?.toUpperCase()}</div>
            {sidebarOpen && (
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: '0.68rem', color: roleColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</div>
              </div>
            )}
          </button>
          <button onClick={logout} className="btn-ghost" style={{ width: '100%', fontSize: '0.8rem', padding: '8px', justifyContent: 'center' }}>
            {sidebarOpen ? '→ Logout' : '→'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          position: 'absolute', top: 28, right: -12, width: 24, height: 24,
          borderRadius: '50%', background: 'var(--bg-surface)',
          border: '1px solid var(--glass-border)', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 10, display: 'flex',
          alignItems: 'center', justifyContent: 'center', transition: 'all var(--transition)',
          zIndex: 10,
        }}>{sidebarOpen ? '‹' : '›'}</button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 64, background: 'rgba(5,5,7,0.8)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{onlineCount} online</span>
            </div>
          </div>
          <SOSButton />
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      {/* Notifications */}
      <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
        {notifications.map(n => (
          <NotificationToast key={n.id} notification={n} onDismiss={() => dismissNotification(n.id)} />
        ))}
      </div>
    </div>
  );
}
