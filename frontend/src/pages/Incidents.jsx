import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import PageHeader from '../components/PageHeader';

const TYPES = ['all', 'flood', 'fire', 'earthquake', 'cyclone', 'landslide', 'tsunami', 'other'];
const SEVERITIES = ['all', 'critical', 'high', 'moderate', 'low'];
const STATUSES = ['all', 'reported', 'active', 'responding', 'resolved'];

const typeEmoji = { flood: '🌊', fire: '🔥', earthquake: '🏚', cyclone: '🌀', landslide: '⛰', tsunami: '🌊', other: '⚠', drought: '☀' };

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', severity: 'all', status: 'all' });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'flood', severity: 'moderate', affectedPeople: '', address: '', lat: '', lng: '', isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.severity !== 'all') params.severity = filters.severity;
      if (filters.status !== 'all') params.status = filters.status;
      const { data } = await API.get('/incidents', { params });
      setIncidents(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchIncidents(); }, [filters]);

  useEffect(() => {
    if (!socket) return;
    socket.on('incident:new', i => setIncidents(p => [i, ...p]));
    socket.on('incident:updated', u => setIncidents(p => p.map(i => i._id === u._id ? u : i)));
    socket.on('incident:deleted', ({ id }) => setIncidents(p => p.filter(i => i._id !== id)));
    return () => { socket.off('incident:new'); socket.off('incident:updated'); socket.off('incident:deleted'); };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const payload = {
        ...form,
        affectedPeople: parseInt(form.affectedPeople) || 0,
        location: { type: 'Point', coordinates: [parseFloat(form.lng) || 80.2707, parseFloat(form.lat) || 13.0827], address: form.address },
      };
      delete payload.lat; delete payload.lng; delete payload.address;
      await API.post('/incidents', payload);
      setShowForm(false);
      setForm({ title: '', description: '', type: 'flood', severity: 'moderate', affectedPeople: '', address: '', lat: '', lng: '', isAnonymous: false });
    } catch (e) { alert(e.response?.data?.message || 'Failed to report'); }
    finally { setSubmitting(false); }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(f => ({ ...f, lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6) }));
    });
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Incidents"
        subtitle={`${incidents.length} incidents found`}
        actions={
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Report Incident'}
          </button>
        }
      />

      {/* Report form */}
      {showForm && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>Report New Incident</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief description of the incident" required />
              </div>
              <div>
                <label>Type *</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {['flood', 'fire', 'earthquake', 'cyclone', 'landslide', 'tsunami', 'drought', 'other'].map(t => <option key={t} value={t}>{typeEmoji[t]} {t}</option>)}
                </select>
              </div>
              <div>
                <label>Severity *</label>
                <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                  {['low', 'moderate', 'high', 'critical'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label>Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Detailed description — what's happening, who is affected..." required />
              </div>
              <div>
                <label>People Affected</label>
                <input type="number" value={form.affectedPeople} onChange={e => setForm(f => ({ ...f, affectedPeople: e.target.value }))} placeholder="Estimated count" min="0" />
              </div>
              <div>
                <label>Location Address</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, Area, City" />
              </div>
              <div>
                <label>Latitude</label>
                <input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="13.0827" />
              </div>
              <div>
                <label>Longitude</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="80.2707" />
                  <button type="button" className="btn-ghost" style={{ whiteSpace: 'nowrap', padding: '10px 12px' }} onClick={getLocation}>📍 GPS</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="anon" checked={form.isAnonymous} onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))} style={{ width: 'auto' }} />
                <label htmlFor="anon" style={{ marginBottom: 0, textTransform: 'none', fontSize: '0.85rem' }}>Report anonymously</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : '🚨 Submit Report'}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['Type', 'type', TYPES], ['Severity', 'severity', SEVERITIES], ['Status', 'status', STATUSES]].map(([label, key, opts]) => (
          <div key={key}>
            <select value={filters[key]} onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))} style={{ width: 'auto', padding: '8px 12px' }}>
              {opts.map(o => <option key={o} value={o}>{label}: {o === 'all' ? 'All' : o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : incidents.length === 0 ? (
        <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No incidents found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {incidents.map(inc => (
            <div key={inc._id} className="glass-card" style={{ padding: '18px 20px', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'flex-start' }}
              onClick={() => navigate(`/incidents/${inc._id}`)}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{typeEmoji[inc.type] || '⚠'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{inc.title}</span>
                  <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                  <span className={`badge badge-${inc.status}`}>{inc.status}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{inc.description}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>📍 {inc.location?.address || 'Unknown'}</span>
                  {inc.affectedPeople > 0 && <span>👥 {inc.affectedPeople} affected</span>}
                  <span>🕐 {new Date(inc.createdAt).toLocaleString()}</span>
                  {inc.reportedBy && !inc.isAnonymous && <span>👤 {inc.reportedBy.name}</span>}
                </div>
              </div>
              {user?.role !== 'citizen' && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{inc.assignedResponders?.length || 0} responders</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
