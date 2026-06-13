import React from 'react';
import PageHeader from '../components/PageHeader';

const helplines = [
  { category: 'Emergency', items: [
    { name: 'National Emergency', number: '112', icon: '🚨', color: 'var(--red)', desc: 'All emergencies — police, fire, ambulance' },
    { name: 'Ambulance', number: '108', icon: '🚑', color: 'var(--red)', desc: '24/7 emergency ambulance service' },
    { name: 'Fire Department', number: '101', icon: '🔥', color: 'var(--orange)', desc: 'Fire and rescue operations' },
    { name: 'Police', number: '100', icon: '👮', color: 'var(--blue)', desc: 'Law enforcement assistance' },
  ]},
  { category: 'Disaster Management', items: [
    { name: 'NDRF Helpline', number: '011-24363260', icon: '🛡', color: 'var(--purple)', desc: 'National Disaster Response Force' },
    { name: 'SDMA Tamil Nadu', number: '1800-425-1213', icon: '🏛', color: 'var(--blue)', desc: 'State Disaster Management Authority' },
    { name: 'Flood Control Room', number: '044-25384520', icon: '🌊', color: 'var(--blue)', desc: 'Chennai flood control operations' },
    { name: 'Cyclone Control Room', number: '044-28411526', icon: '🌀', color: 'var(--purple)', desc: 'IMD cyclone warning center' },
  ]},
  { category: 'Medical & Support', items: [
    { name: 'Government Hospital', number: '104', icon: '🏥', color: 'var(--green)', desc: 'Medical helpline for emergencies' },
    { name: 'Women Helpline', number: '181', icon: '👩', color: 'var(--pink)', desc: 'Women in distress' },
    { name: 'Child Helpline', number: '1098', icon: '👶', color: 'var(--yellow)', desc: 'Children in need of care' },
    { name: 'Mental Health', number: 'iCall: 9152987821', icon: '🧠', color: 'var(--purple)', desc: 'Psychological first aid' },
  ]},
  { category: 'Utilities', items: [
    { name: 'Electricity Board', number: '1912', icon: '⚡', color: 'var(--yellow)', desc: 'TNEB power outage / emergency' },
    { name: 'Water Board', number: '1916', icon: '💧', color: 'var(--blue)', desc: 'Chennai Metro Water helpline' },
    { name: 'Gas Emergency', number: '1906', icon: '💨', color: 'var(--orange)', desc: 'LPG / gas leak emergency' },
    { name: 'Coast Guard', number: '1554', icon: '⛵', color: 'var(--blue)', desc: 'Maritime emergency assistance' },
  ]},
];

export default function Helpline() {
  return (
    <div className="fade-up">
      <PageHeader title="Emergency Helpline" subtitle="One-tap calling for all emergency services" />

      <div style={{ background: 'rgba(255,59,59,0.06)', border: '1px solid rgba(255,59,59,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 22 }}>🆘</span>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--red)', fontSize: '0.95rem' }}>Life-threatening emergency? Call 112 immediately</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Single national emergency number — connects to police, fire, and medical services</div>
        </div>
        <a href="tel:112" style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <button className="btn-danger" style={{ padding: '10px 24px', fontSize: '1rem', letterSpacing: '0.05em' }}>📞 CALL 112</button>
        </a>
      </div>

      {helplines.map(section => (
        <div key={section.category} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{section.category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {section.items.map(item => (
              <div key={item.name} className="glass-card" style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${item.color}15`, border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.desc}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: item.color }}>{item.number}</div>
                </div>
                {!item.number.includes(' ') && (
                  <a href={`tel:${item.number}`} style={{ flexShrink: 0 }}>
                    <button style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `${item.color}15`, border: `1px solid ${item.color}40`,
                      color: item.color, cursor: 'pointer', fontSize: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all var(--transition)',
                    }}
                      onMouseOver={e => { e.currentTarget.style.background = `${item.color}30`; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = `${item.color}15`; e.currentTarget.style.transform = 'scale(1)'; }}
                    >📞</button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
