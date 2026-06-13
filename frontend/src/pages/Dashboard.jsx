import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';

const PIE_COLORS = ['#ff4fa3', '#4fa8d5', '#f5c842', '#39d98a', '#ff8c42', '#9b59ff', '#ff3b3b'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [statsRes, incRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/incidents?limit=5'),
      ]);
      setStats(statsRes.data);
      setRecentIncidents(incRes.data.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = () => fetchData();
    socket.on('incident:new', handler);
    socket.on('incident:updated', handler);
    return () => { socket.off('incident:new', handler); socket.off('incident:updated', handler); };
  }, [socket]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>;

  const ov = stats?.overview || {};

  const sevColor = { critical: 'var(--red)', high: 'var(--orange)', moderate: 'var(--yellow)', low: 'var(--green)', reported: 'var(--purple)', active: 'var(--pink)', responding: 'var(--blue)', resolved: 'var(--green)' };

  return (
    <div className="fade-up">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's the live overview of disaster operations"
      />

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Active Incidents" value={ov.activeIncidents} icon="⚡" color="var(--red)" sub={`${ov.criticalIncidents} critical`} />
        <StatCard label="Total Incidents" value={ov.totalIncidents} icon="📋" color="var(--orange)" sub={`${ov.resolvedIncidents} resolved`} />
        <StatCard label="Volunteers" value={ov.totalVolunteers} icon="👥" color="var(--blue)" sub={`${ov.availableVolunteers} available`} />
        <StatCard label="Relief Camps" value={ov.activeCamps} icon="⛺" color="var(--green)" sub="Active camps" />
        <StatCard label="Active Alerts" value={ov.activeAlerts} icon="▲" color="var(--pink)" sub="Government alerts" />
        <StatCard label="Resources" value={ov.totalResources} icon="◈" color="var(--purple)" sub="Total tracked" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Bar chart */}
        <div className="glass-card" style={{ padding: '20px 16px' }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Incidents Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.incidentsOverTime || []}>
              <XAxis dataKey="_id" tick={{ fill: 'rgba(240,240,248,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(240,240,248,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,13,20,0.95)', border: '1px solid rgba(255,79,163,0.3)', borderRadius: 8, color: '#f0f0f8' }} />
              <Bar dataKey="count" fill="#ff4fa3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass-card" style={{ padding: '20px 16px' }}>
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Incidents by Type</h3>
          {stats?.incidentsByType?.length > 0 ? (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={stats.incidentsByType} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {stats.incidentsByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(13,13,20,0.95)', border: '1px solid rgba(255,79,163,0.3)', borderRadius: 8, color: '#f0f0f8' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {stats.incidentsByType.map((d, i) => (
                  <div key={d._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{d._id}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No data yet</p>}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Recent Incidents</h3>
          <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => navigate('/incidents')}>View All →</button>
        </div>
        {recentIncidents.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No incidents reported yet</p>
        ) : (
          <div>
            {recentIncidents.map((inc, i) => (
              <div key={inc._id} onClick={() => navigate(`/incidents/${inc._id}`)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                borderBottom: i < recentIncidents.length - 1 ? '1px solid var(--glass-border)' : 'none',
                cursor: 'pointer', transition: 'all var(--transition)',
              }}
                onMouseOver={e => e.currentTarget.style.paddingLeft = '8px'}
                onMouseOut={e => e.currentTarget.style.paddingLeft = '0'}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: sevColor[inc.severity] || 'var(--text-muted)',
                  boxShadow: `0 0 8px ${sevColor[inc.severity] || 'transparent'}`,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inc.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{inc.location?.address || 'Location unknown'}</div>
                </div>
                <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                <span className={`badge badge-${inc.status}`}>{inc.status}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(inc.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
