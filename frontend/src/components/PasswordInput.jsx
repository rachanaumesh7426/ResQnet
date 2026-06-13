import React, { useState } from 'react';

export default function PasswordInput({ value, onChange, placeholder, required, enforceStrong }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        pattern={enforceStrong ? "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$" : undefined}
        title={enforceStrong ? "Min 8 chars, 1 uppercase, 1 number, 1 symbol" : undefined}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none',
          cursor: 'pointer', fontSize: 18,
          color: show ? 'var(--pink)' : 'var(--text-muted)',
          transition: 'color var(--transition)',
          padding: 0, lineHeight: 1,
        }}
      >{show ? '🙈' : '👁'}</button>
    </div>
  );
}