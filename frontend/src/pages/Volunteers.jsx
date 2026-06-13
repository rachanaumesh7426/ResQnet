import React, { useEffect, useState } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAvailable, setFilterAvailable] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const params = {};
    if (filterAvailable !== 'all') params.available = filterAvailable;
    API.get('/volunteers', { params }).then(r => setVolunteers(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [filterAvailable]);

  const toggleAvailability = async () => {
    try {
      await API.put('/volunteers/availability', { isAvailable: !user.isAvailable });
      window.location.reload();
    } catch (e) { alert('Failed to update'); }
  };

  const skillColor = (skill) => {
    const colors = { medical: 'var(--red)', rescue: 'var(--orange)', driving: 'var(--blue)', cooking: 'var(--green)', engineering: 'var(--purple)', 'first-aid': 'var(--pink)' };
    return colors[skill] || 'var(--text-muted)';
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Volunteer Network"
        subtitle={`${volunteers.length} registered responders`}
        actions={
          user?.role === 'responder' && (
            <button className={user.isAvailable ? 'btn-ghost' : 'btn-primary'} onClick={toggleAvailability}>
              {user.isAvailable ? '● Available — Click to go offline' : '○ Offline — Click to go available'}
            </button>
          )
        }
      />

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'All Volunteers'], ['true', 'Available'], ['false', 'Unavailable']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterAvailable(val)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: '0.82rem', cursor: 'pointer',
            background: filterAvailable === val ? 'rgba(255,79,163,0.15)' : 'var(--glass-bg)',
            border: `1px solid ${filterAvailable === val ? 'var(--pink)' : 'var(--glass-border)'}`,
            color: filterAvailable === val ? 'var(--pink)' : 'var(--text-secondary)',
            transition: 'all var(--transition)', backdropFilter: 'blur(10px)',
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {volunteers.map(v => (
            <div key={v._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: v.isAvailable ? 'linear-gradient(135deg, var(--blue), var(--green))' : 'linear-gradient(135deg, #333, #555)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20,
                  boxShadow: v.isAvailable ? '0 4px 15px rgba(57,217,138,0.3)' : 'none',
                }}>{v.name?.[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{v.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: v.isAvailable ? 'var(--green)' : 'var(--text-muted)', boxShadow: v.isAvailable ? '0 0 6px var(--green)' : 'none' }} />
                    <span style={{ fontSize: '0.75rem', color: v.isAvailable ? 'var(--green)' : 'var(--text-muted)' }}>{v.isAvailable ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skills</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {v.skills?.length > 0 ? v.skills.map(s => (
                    <span key={s} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: `${skillColor(s)}15`, border: `1px solid ${skillColor(s)}40`, color: skillColor(s) }}>{s}</span>
                  )) : <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No skills listed</span>}
                </div>
              </div>
              {v.phone && (
                <a href={`tel:${v.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--blue)', textDecoration: 'none', padding: '8px 12px', background: 'rgba(79,168,213,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(79,168,213,0.2)' }}>
                  📞 {v.phone}
                </a>
              )}
            </div>
          ))}
          {volunteers.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No volunteers found</div>
          )}
        </div>
      )}
    </div>
  );
}
