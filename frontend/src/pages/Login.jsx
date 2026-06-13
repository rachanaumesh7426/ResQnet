import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@demo.com', password: 'admin123', color: 'var(--purple)' },
  { label: 'Responder', email: 'responder@demo.com', password: 'responder123', color: 'var(--blue)' },
  { label: 'Citizen', email: 'citizen@demo.com', password: 'citizen123', color: 'var(--green)' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  const fillDemo = (acc) => setForm({ email: acc.email, password: acc.password });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }} className="fade-up">
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #ff4fa3, #9b59ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 8px 40px rgba(255,79,163,0.4)',
          }}>🛡</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>ResQNet</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.9rem' }}>Disaster Management System</p>
        </div>

        {/* Card */}
        <div className="glass-card fade-up" style={{ padding: '32px 28px', animationDelay: '0.1s' }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Sign In</h2>
          {error && (
            <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, color: 'var(--red)', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label>Password</label>
            <PasswordInput
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
            />  
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--pink)', textDecoration: 'none' }}>Register</Link>
          </p>
        </div>

        {/* Demo accounts */}
        <div className="glass-card fade-up" style={{ padding: '20px 24px', marginTop: 16, animationDelay: '0.2s' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Quick Demo Access</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.label} onClick={() => fillDemo(acc)} style={{
                flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                background: `${acc.color}12`, border: `1px solid ${acc.color}30`,
                color: acc.color, fontSize: '0.8rem', fontWeight: 600,
                transition: 'all var(--transition)',
              }}
                onMouseOver={e => e.currentTarget.style.background = `${acc.color}25`}
                onMouseOut={e => e.currentTarget.style.background = `${acc.color}12`}
              >{acc.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
