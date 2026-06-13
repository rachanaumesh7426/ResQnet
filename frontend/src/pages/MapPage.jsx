import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { API } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import PageHeader from '../components/PageHeader';

const makeIcon = (color, emoji) => L.divIcon({
  html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.3);box-shadow:0 4px 15px ${color}88"><span style="transform:rotate(45deg);font-size:14px">${emoji}</span></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const icons = {
  flood: makeIcon('#4fa8d5', '🌊'),
  fire: makeIcon('#ff3b3b', '🔥'),
  earthquake: makeIcon('#f5c842', '🏚'),
  cyclone: makeIcon('#9b59ff', '🌀'),
  landslide: makeIcon('#ff8c42', '⛰'),
  tsunami: makeIcon('#4fa8d5', '🌊'),
  other: makeIcon('#ff4fa3', '⚠'),
  camp: makeIcon('#39d98a', '⛺'),
};

const severityColor = { critical: '#ff3b3b', high: '#ff8c42', moderate: '#f5c842', low: '#39d98a' };

export default function MapPage() {
  const [incidents, setIncidents] = useState([]);
  const [camps, setCamps] = useState([]);
  const [filter, setFilter] = useState('all');
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      const [iRes, cRes] = await Promise.all([API.get('/incidents'), API.get('/reliefcamps')]);
      setIncidents(iRes.data);
      setCamps(cRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('incident:new', inc => setIncidents(p => [inc, ...p]));
    socket.on('incident:updated', upd => setIncidents(p => p.map(i => i._id === upd._id ? upd : i)));
    socket.on('camp:new', c => setCamps(p => [...p, c]));
    return () => { socket.off('incident:new'); socket.off('incident:updated'); socket.off('camp:new'); };
  }, [socket]);

  const filtered = filter === 'all' ? incidents : filter === 'camps' ? [] : incidents.filter(i => i.status === filter || i.type === filter);

  return (
    <div className="fade-up">
      <PageHeader title="Live Disaster Map" subtitle="Real-time view of all active incidents and relief operations" />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'active', 'critical', 'responding', 'resolved', 'camps'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
            background: filter === f ? 'rgba(255,79,163,0.2)' : 'var(--glass-bg)',
            border: `1px solid ${filter === f ? 'var(--pink)' : 'var(--glass-border)'}`,
            color: filter === f ? 'var(--pink)' : 'var(--text-secondary)',
            fontWeight: filter === f ? 700 : 400, transition: 'all var(--transition)',
            backdropFilter: 'blur(10px)',
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {incidents.length} incidents · {camps.length} camps
        </span>
      </div>

      {/* Map */}
      <div className="glass-card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '60vh' }}>
        <MapContainer
          center={[13.0827, 80.2707]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CartoDB'
          />

          {/* Incidents */}
          {(filter !== 'camps' ? filtered : []).filter(i => i.location?.coordinates?.length === 2).map(inc => (
            <React.Fragment key={inc._id}>
              <Marker
                position={[inc.location.coordinates[1], inc.location.coordinates[0]]}
                icon={icons[inc.type] || icons.other}
              >
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 6 }}>{inc.title}</div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                      <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                      <span className={`badge badge-${inc.status}`}>{inc.status}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>{inc.location?.address}</div>
                    {inc.affectedPeople > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--orange)' }}>👥 {inc.affectedPeople} affected</div>}
                  </div>
                </Popup>
              </Marker>
              {inc.severity === 'critical' && (
                <Circle
                  center={[inc.location.coordinates[1], inc.location.coordinates[0]]}
                  radius={800}
                  pathOptions={{ color: severityColor[inc.severity], fillColor: severityColor[inc.severity], fillOpacity: 0.06, weight: 1.5, opacity: 0.4 }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Relief Camps */}
          {(filter === 'all' || filter === 'camps') && camps.filter(c => c.location?.coordinates?.length === 2).map(camp => (
            <Marker key={camp._id} position={[camp.location.coordinates[1], camp.location.coordinates[0]]} icon={icons.camp}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{camp.name}</div>
                  <div style={{ fontSize: '0.82rem', color: camp.currentOccupancy >= camp.capacity ? 'var(--red)' : 'var(--green)', marginBottom: 4 }}>
                    {camp.currentOccupancy}/{camp.capacity} capacity
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{camp.location?.address}</div>
                  {camp.contactPhone && <div style={{ fontSize: '0.78rem', color: 'var(--blue)', marginTop: 4 }}>📞 {camp.contactPhone}</div>}
                  {camp.facilities?.length > 0 && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      {camp.facilities.join(' · ')}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: '14px 20px', marginTop: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[['⚡ Incident', '#ff4fa3'], ['🔴 Critical Zone', 'rgba(255,59,59,0.5)'], ['⛺ Relief Camp', '#39d98a']].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
