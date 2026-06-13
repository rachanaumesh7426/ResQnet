import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import PageHeader from '../components/PageHeader';

const typeConfig = {
  evacuation: { color: 'var(--red)', bg: 'rgba(255,59,59,0.08)', border: 'rgba(255,59,59,0.25)', icon: '🚨' },
  warning: { color: 'var(--orange)', bg: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.25)', icon: '⚠️' },
  info: { color: 'var(--blue)', bg: 'rgba(79,168,213,0.08)', border: 'rgba(79,168,213,0.25)', icon: 'ℹ️' },
  sos: { color: 'var(--red)', bg: 'rgba(255,59,59,0.1)', border: 'rgba(255,59,59,0.4)', icon: '🆘' },
  resolved: { color: 'var(--green)', bg: 'rgba(57,217,138,0.08)', border: 'rgba(57,217,138,0.25)', icon: '✅' },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'warning', severity: 'high', region: '' });
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchAlerts = async () => {
    try { const { data } = await API.get('/alerts'); setAlerts(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAlerts(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('alert:new', a => setAlerts(p => [a, ...p]));
    socket.on('alert:deactivated', a => setAlerts(p => p.filter(x => x._id !== a._id)));
    return () => { socket.off('alert:new'); socket.off('alert:deactivated'); };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await API.post('/alerts', form); setShowForm(false); setForm({ title: '', message: '', type: 'warning', severity: 'high', region: '' }); }
    catch (e) { alert('Failed to create alert'); }
  };

  const deactivate = async (id) => {
    if (!confirm('Deactivate this alert?')) return;
    try { await API.put(`/alerts/${id}/deactivate`); setAlerts(p => p.filter(a => a._id !== id)); }
    catch (e) { alert('Failed'); }
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Alerts & Broadcasts"
        subtitle={`${alerts.length} active alerts`}
        actions={user?.role === 'admin' && <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Issue Alert'}</button>}
      />

      {showForm && user?.role === 'admin' && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Issue New Alert</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: '1/-1' }}><label>Alert Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="⚠️ Flood Warning — South Chennai" required /></div>
              <div style={{ gridColumn: '1/-1' }}><label>Message *</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} placeholder="Detailed alert message for citizens..." required /></div>
              <div><label>Type *</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="warning">Warning</option><option value="evacuation">Evacuation</option><option value="info">Information</option><option value="resolved">Resolved</option></select></div>
              <div><label>Severity *</label><select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}><option value="critical">Critical</option><option value="high">High</option><option value="moderate">Moderate</option><option value="low">Low</option></select></div>
              <div><label>Region</label><input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="South Chennai, Velachery..." /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary">📡 Broadcast Alert</button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : alerts.length === 0 ? (
        <div className="glass-card" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div>No active alerts — all clear</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {alerts.map(alert => {
            const cfg = typeConfig[alert.type] || typeConfig.warning;
            return (
              <div key={alert._id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 'var(--radius-lg)', padding: '20px 24px', backdropFilter: 'blur(20px)', boxShadow: `0 4px 24px ${cfg.border}` }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', color: cfg.color }}>{alert.title}</h3>
                      <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                      {alert.region && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 10, border: '1px solid var(--glass-border)' }}>📍 {alert.region}</span>}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{alert.message}</p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Issued {new Date(alert.createdAt).toLocaleString()} {alert.issuedBy?.name && `by ${alert.issuedBy.name}`}
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <button onClick={() => deactivate(alert._id)} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '6px 12px', flexShrink: 0 }}>Deactivate</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
