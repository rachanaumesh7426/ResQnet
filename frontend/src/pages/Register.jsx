import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const SKILLS = ['medical', 'first-aid', 'rescue', 'driving', 'cooking', 'engineering', 'communication', 'language-tamil', 'language-hindi', 'childcare'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', phone: '', skills: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleSkill = (skill) => setForm(f => ({
    ...f, skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 14px', background: 'linear-gradient(135deg, #ff4fa3, #9b59ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, boxShadow: '0 8px 40px rgba(255,79,163,0.4)' }}>🛡</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>Join ResQNet</h1>
        </div>
        <div className="glass-card" style={{ padding: '28px' }}>
          {error && <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--red)', fontSize: '0.85rem' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div><label>Full Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required /></div>
              <div><label>Phone</label><input
  value={form.phone}
  onChange={e => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, phone: val }));
  }}
  placeholder="9876543210"
  pattern="[0-9]{10}"
  title="Phone number must be exactly 10 digits"
/></div>
            </div>
            <div style={{ marginBottom: 14 }}><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" required /></div>
            <div style={{ marginBottom: 14 }}><label>Password</label>
            <PasswordInput
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
              required
              enforceStrong
            /></div>
            <div style={{ marginBottom: 16 }}>
              <label>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="citizen">Citizen — Report incidents, seek help</option>
                <option value="responder">Responder — NGO, Volunteer, Emergency team</option>
              </select>
            </div>
            {form.role === 'responder' && (
              <div style={{ marginBottom: 16 }}>
                <label>Your Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {SKILLS.map(skill => (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)} style={{
                      padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem', cursor: 'pointer',
                      background: form.skills.includes(skill) ? 'rgba(255,79,163,0.2)' : 'var(--glass-bg)',
                      border: `1px solid ${form.skills.includes(skill) ? 'var(--pink)' : 'var(--glass-border)'}`,
                      color: form.skills.includes(skill) ? 'var(--pink)' : 'var(--text-secondary)',
                      transition: 'all var(--transition)',
                    }}>{skill}</button>
                  ))}
                </div>
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Have an account? <Link to="/login" style={{ color: 'var(--pink)', textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
