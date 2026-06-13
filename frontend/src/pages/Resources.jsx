import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const typeIcon = { food: '🍱', water: '💧', medicine: '💊', shelter: '⛺', vehicle: '🚗', equipment: '🔧', clothing: '👕', other: '📦' };
const statusColor = { available: 'var(--green)', 'in-use': 'var(--yellow)', depleted: 'var(--red)' };

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'food', quantity: '', unit: 'units', notes: '', address: '' });
  const { user } = useAuth();

  const fetchResources = async () => {
    try { const { data } = await API.get('/resources'); setResources(data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/resources', { ...form, quantity: parseInt(form.quantity), location: { type: 'Point', coordinates: [80.2707, 13.0827], address: form.address } });
      setShowForm(false);
      setForm({ name: '', type: 'food', quantity: '', unit: 'units', notes: '', address: '' });
      fetchResources();
    } catch (e) { alert('Failed to add resource'); }
  };

  const updateStatus = async (id, status) => {
    try { await API.put(`/resources/${id}`, { status }); fetchResources(); }
    catch (e) { alert('Update failed'); }
  };

  const summary = resources.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + (r.status === 'available' ? r.quantity : 0);
    return acc;
  }, {});

  return (
    <div className="fade-up">
      <PageHeader
        title="Resource Management"
        subtitle={`${resources.length} resources tracked`}
        actions={user?.role !== 'citizen' && <button className="btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Resource'}</button>}
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {Object.entries(typeIcon).map(([type, icon]) => (
          <div key={type} className="glass-card" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--pink)' }}>{summary[type] || 0}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{type}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && user?.role !== 'citizen' && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add Resource</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: '1/-1' }}><label>Resource Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Food Packets" required /></div>
              <div><label>Type *</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>{Object.keys(typeIcon).map(t => <option key={t} value={t}>{typeIcon[t]} {t}</option>)}</select></div>
              <div><label>Quantity *</label><input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} placeholder="100" min="0" required /></div>
              <div><label>Unit</label><input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="packets / liters / kits" /></div>
              <div style={{ gridColumn: '1/-1' }}><label>Location</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Storage location address" /></div>
              <div style={{ gridColumn: '1/-1' }}><label>Notes</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional details" /></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn-primary">+ Add Resource</button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {['Resource', 'Type', 'Quantity', 'Status', 'Location', 'Managed By', ...(user?.role !== 'citizen' ? ['Actions'] : [])].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map((r, i) => (
                  <tr key={r._id} style={{ borderBottom: i < resources.length - 1 ? '1px solid var(--glass-border)' : 'none', transition: 'background var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--glass-bg-hover)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{r.name}</div>
                      {r.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{r.notes}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: '0.82rem' }}>{typeIcon[r.type]} {r.type}</span></td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--pink)' }}>{r.quantity}</span> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.unit}</span></td>
                    <td style={{ padding: '14px 16px' }}><span style={{ color: statusColor[r.status], fontSize: '0.82rem', fontWeight: 600 }}>● {r.status}</span></td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.location?.address || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.managedBy?.name || '—'}</td>
                    {user?.role !== 'citizen' && (
                      <td style={{ padding: '14px 16px' }}>
                        <select value={r.status} onChange={e => updateStatus(r._id, e.target.value)} style={{ padding: '5px 10px', width: 'auto', fontSize: '0.78rem' }}>
                          <option value="available">Available</option>
                          <option value="in-use">In Use</option>
                          <option value="depleted">Depleted</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {resources.length === 0 && <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No resources tracked yet</p>}
          </div>
        </div>
      )}
    </div>
  );
}
