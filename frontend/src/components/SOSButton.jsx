import React, { useState } from 'react';
import { API } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export default function SOSButton() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { socket } = useSocket();

  const handleSOS = async () => {
    if (sending || sent) return;
    if (!confirm('🆘 Send SOS Emergency Alert? This will notify all nearby responders immediately.')) return;
    setSending(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const coordinates = [pos.coords.longitude, pos.coords.latitude];
        await API.post('/incidents/sos', { coordinates, address: 'Current Location' });
        socket?.emit('sos:send', { coordinates });
        setSent(true);
        setTimeout(() => setSent(false), 10000);
      }, async () => {
        await API.post('/incidents/sos', { coordinates: [80.2705, 13.0524], address: 'Unknown Location' });
        setSent(true);
        setTimeout(() => setSent(false), 10000);
      });
    } catch (err) {
      alert('Failed to send SOS. Please call 112.');
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      onClick={handleSOS}
      className={sent ? '' : 'pulse'}
      style={{
        background: sent ? 'linear-gradient(135deg, #39d98a, #0d8c4e)' : 'linear-gradient(135deg, #ff3b3b, #990000)',
        color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
        padding: '10px 20px', fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: '0.9rem', cursor: sending ? 'wait' : 'pointer',
        letterSpacing: '0.08em', transition: 'all 0.3s ease',
        boxShadow: sent ? '0 4px 20px rgba(57,217,138,0.4)' : '0 4px 20px rgba(255,59,59,0.5)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}
    >
      <span style={{ fontSize: 18 }}>{sent ? '✓' : '🆘'}</span>
      {sent ? 'SOS SENT' : sending ? 'SENDING...' : 'SOS'}
    </button>
  );
}
