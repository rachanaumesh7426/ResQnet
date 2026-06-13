import React, { useState } from 'react';
import { useAuth, API } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import PasswordInput from '../components/PasswordInput';

const SKILLS = ['medical', 'first-aid', 'rescue', 'driving', 'cooking', 'engineering', 'communication', 'language-tamil', 'language-hindi', 'childcare'];

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', skills: user?.skills || [] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSkill = (s) => setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s] }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await API.put('/auth/me', form);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (e) { alert('Failed to save'); } finally { setSaving(false); }
  };

  const roleColor = user?.role === 'admin' ? 'var(--purple)' : user?.role === 'responder' ? 'var(--blue)' : 'var(--green)';
  const roleDesc = { admin: 'Government coordinator with full system access', responder: 'Volunteer or emergency team member', citizen: 'Community member — report incidents and seek help' };

  return (
    <div className="fade-up" style={{ maxWidth: 640 }}>
      <PageHeader title="My Profile" subtitle="Manage your account and preferences" />

      {/* Avatar card */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `linear-gradient(135deg, ${roleColor}, rgba(255,79,163,0.4))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
          boxShadow: `0 8px 30px ${roleColor}40`,
        }}>{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>{user?.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ padding: '3px 12px', borderRadius: 20, background: `${roleColor}15`, border: `1px solid ${roleColor}30`, color: roleColor, fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{roleDesc[user?.role]}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>📧 {user?.email}</div>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20 }}>Edit Profile</h3>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <label>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Phone Number</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>Email</label>
 <div style={{ marginBottom: 16 }}>
  <label>New Password</label>
  <PasswordInput
    value={form.password || ''}
    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
    placeholder="Leave blank to keep current password"
  />
</div>           
          </div>

          {user?.role === 'responder' && (
            <div style={{ marginBottom: 20 }}>
              <label>Skills & Expertise</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {SKILLS.map(skill => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
                    background: form.skills.includes(skill) ? 'rgba(255,79,163,0.15)' : 'var(--glass-bg)',
                    border: `1px solid ${form.skills.includes(skill) ? 'var(--pink)' : 'var(--glass-border)'}`,
                    color: form.skills.includes(skill) ? 'var(--pink)' : 'var(--text-secondary)',
                    transition: 'all var(--transition)',
                  }}>{form.skills.includes(skill) ? '✓ ' : ''}{skill}</button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ padding: '11px 28px' }} disabled={saving}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(255,59,59,0.2)' }}>
        <h3 style={{ color: 'var(--red)', marginBottom: 12, fontSize: '0.95rem' }}>Account Actions</h3>
        <button className="btn-danger" onClick={logout}>Sign Out of ResQNet</button>
      </div>
    </div>
  );
}
