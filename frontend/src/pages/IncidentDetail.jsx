import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const typeEmoji = { flood: '🌊', fire: '🔥', earthquake: '🏚', cyclone: '🌀', landslide: '⛰', tsunami: '🌊', other: '⚠' };

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    API.get(`/incidents/${id}`).then(r => { setIncident(r.data); setStatusUpdate(r.data.status); }).catch(() => navigate('/incidents')).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    if (!updateMsg && statusUpdate === incident.status) return;
    setUpdating(true);
    try {
      const { data } = await API.put(`/incidents/${id}`, { status: statusUpdate, updateMessage: updateMsg });
      setIncident(data);
      setUpdateMsg('');
    } catch (e) { alert('Update failed'); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this incident permanently?')) return;
    try { await API.delete(`/incidents/${id}`); navigate('/incidents'); } catch (e) { alert('Delete failed'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>;
  if (!incident) return null;

  const sevColor = { critical: 'var(--red)', high: 'var(--orange)', moderate: 'var(--yellow)', low: 'var(--green)' };

  return (
    <div className="fade-up">
      <button className="btn-ghost" style={{ marginBottom: 20, padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => navigate('/incidents')}>← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Main */}
        <div>
          <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
              <span style={{ fontSize: 48 }}>{typeEmoji[incident.type] || '⚠'}</span>
              <div>
                <h1 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{incident.title}</h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge badge-${incident.severity}`}>{incident.severity}</span>
                  <span className={`badge badge-${incident.status}`}>{incident.status}</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>{incident.type}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 20 }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: 20 }}>{incident.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  ['📍 Location', incident.location?.address || 'Unknown'],
                  ['👥 Affected', incident.affectedPeople > 0 ? `${incident.affectedPeople} people` : 'Not specified'],
                  ['👤 Reported by', incident.isAnonymous ? 'Anonymous' : (incident.reportedBy?.name || 'Unknown')],
                  ['🕐 Reported at', new Date(incident.createdAt).toLocaleString()],
                  ['🗺 Coordinates', incident.location?.coordinates ? `${incident.location.coordinates[1].toFixed(4)}, ${incident.location.coordinates[0].toFixed(4)}` : 'N/A'],
                  ['✅ Resolved at', incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : 'Not resolved'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Update log */}
          {incident.updates?.length > 0 && (
            <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>Update Log</h3>
              {incident.updates.map((upd, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: i < incident.updates.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,79,163,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>↻</div>
                  <div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 4 }}>{upd.message}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(upd.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Assigned responders */}
          <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Assigned Responders ({incident.assignedResponders?.length || 0})</h3>
            {incident.assignedResponders?.length > 0 ? incident.assignedResponders.map(r => (
              <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{r.name?.[0]}</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.email}</div>
                </div>
              </div>
            )) : <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No responders assigned yet</p>}
          </div>

          {/* Admin/Responder actions */}
          {(user?.role === 'admin' || user?.role === 'responder') && (
            <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Update Incident</h3>
              <div style={{ marginBottom: 12 }}>
                <label>Status</label>
                <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
                  {['reported', 'active', 'responding', 'resolved'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Add Update Note</label>
                <textarea value={updateMsg} onChange={e => setUpdateMsg(e.target.value)} rows={3} placeholder="Describe current situation..." />
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleUpdate} disabled={updating}>{updating ? 'Updating...' : 'Save Update'}</button>
            </div>
          )}

          {/* Delete - admin only */}
          {user?.role === 'admin' && (
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ marginBottom: 12, fontSize: '0.95rem', color: 'var(--red)' }}>Danger Zone</h3>
              <button className="btn-danger" style={{ width: '100%' }} onClick={handleDelete}>Delete Incident</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
