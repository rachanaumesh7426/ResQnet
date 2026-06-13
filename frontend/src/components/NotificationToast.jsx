import React from 'react';

const typeConfig = {
  sos: { color: 'var(--red)', icon: '🆘', border: 'rgba(255,59,59,0.4)' },
  incident: { color: 'var(--orange)', icon: '⚡', border: 'rgba(255,140,66,0.4)' },
  alert: { color: 'var(--pink)', icon: '▲', border: 'rgba(255,79,163,0.4)' },
  info: { color: 'var(--blue)', icon: 'ℹ', border: 'rgba(79,168,213,0.4)' },
};

export default function NotificationToast({ notification, onDismiss }) {
  const cfg = typeConfig[notification.type] || typeConfig.info;
  return (
    <div className="toast glass-card" style={{
      border: `1px solid ${cfg.border}`,
      padding: '14px 16px',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${cfg.border}`,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', color: cfg.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          {notification.type.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{notification.message}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {new Date(notification.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
        fontSize: 16, padding: 2, flexShrink: 0,
      }}>×</button>
    </div>
  );
}
