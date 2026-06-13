import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const facilityIcon = { food: '🍱', water: '💧', medical: '🏥', sanitation: '🚽', electricity: '⚡', internet: '📶', childcare: '👶' };

export default function ReliefCamps() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', capacity: '', address: '', lat: '', lng: '', contactPhone: '', facilities: [] });
  const { user } = useAuth();

  useEffect(() => {
    API.get('/reliefcamps').then(r => setCamps(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleFacility = (f) => setForm(prev => ({
    ...prev, facilities: prev.facilities.includes(f) ? prev.facilities.filter(x => x !== f) : [...prev.facilities, f]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reliefcamps', {
        ...form, capacity: parseInt(form.capacity),
        location: { type: 'Point', coordinates: [parseFloat(form.lng) || 80.2707, parseFloat(form.lat) || 13.0827], address: form.address },
      });
      setShowForm(false);
      API.get('/reliefcamps').then(r => setCamps(r.data));
    } catch (e) { alert('Failed to add camp'); }
  };

  const getCapacityColor = (camp) => {
    const pct = camp.currentOccupancy / camp.capacity;
    if (pct >= 1) return 'var(--red)';
    if (pct >= 0.8) return 'var(--orange)';
    if (pct >= 0.5) return 'var(--yellow)';
    return 'var(--green)';
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Relief Camps"
        subtitle={`${camps.length} camps registered`}
        actions={user?.role !== 'citizen' && <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Camp'}</button>}
      />

      {showForm && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Register New Camp</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: '1/-1' }}><label>Camp Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Velachery Govt School Relief Camp" required /></div>
              <div><label>Capacity *</label><input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="500" required /></div>
              <div><label>Contact Phone</label><input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} placeholder="044-12345678" /></div>
              <div style={{ gridColumn: '1/-1' }}><label>Address</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full address" /></div>
              <div><label>Latitude</label><input value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="13.0827" /></div>
              <div><label>Longitude</label><input value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="80.2707" /></div>
              <div style={{ gridColumn: '1/-1' }}>
                <label>Available Facilities</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {Object.keys(facilityIcon).map(f => (
                    <button type="button" key={f} onClick={() => toggleFacility(f)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', cursor: 'pointer',
                      background: form.facilities.includes(f) ? 'rgba(57,217,138,0.15)' : 'var(--glass-bg)',
                      border: `1px solid ${form.facilities.includes(f) ? 'var(--green)' : 'var(--glass-border)'}`,
                      color: form.facilities.includes(f) ? 'var(--green)' : 'var(--text-secondary)',
                      transition: 'all var(--transition)',
                    }}>{facilityIcon[f]} {f}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary">Register Camp</button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {camps.map(camp => {
            const pct = Math.round((camp.currentOccupancy / camp.capacity) * 100);
            const capColor = getCapacityColor(camp);
            return (
              <div key={camp._id} className="glass-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: 4 }}>{camp.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {camp.location?.address}</div>
                  </div>
                  <span className={`badge badge-${camp.status}`}>{camp.status}</span>
                </div>

                {/* Capacity bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Occupancy</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: capColor }}>{camp.currentOccupancy}/{camp.capacity} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: capColor, borderRadius: 4, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${capColor}80` }} />
                  </div>
                </div>

                {/* Facilities */}
                {camp.facilities?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {camp.facilities.map(f => (
                      <span key={f} title={f} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(57,217,138,0.1)', border: '1px solid rgba(57,217,138,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{facilityIcon[f]}</span>
                    ))}
                  </div>
                )}

                {camp.contactPhone && (
                  <a href={`tel:${camp.contactPhone}`} style={{ display: 'block', textAlign: 'center', padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(79,168,213,0.08)', border: '1px solid rgba(79,168,213,0.2)', color: 'var(--blue)', textDecoration: 'none', fontSize: '0.82rem' }}>
                    📞 {camp.contactPhone}
                  </a>
                )}
              </div>
            );
          })}
          {camps.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No camps registered</div>}
        </div>
      )}
    </div>
  );
}
