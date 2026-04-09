import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export default function ResetScreen() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('');

  const handleReset = async () => {
    if (pin !== '0409') {
      setStatus('incorrect pin 🙅‍♂️');
      return;
    }

    setStatus('resetting...');
    const storageKey = 'avatar-proposal-timer-start';

    // Clear local cache
    localStorage.removeItem(storageKey);

    // Clear DB (using upsert since we don't have a DELETE policy)
    if (supabase) {
      const { error } = await supabase.from('timers').upsert({ id: storageKey, started_at: '' });
      if (error) {
        setStatus(`error: ${error.message}`);
        return;
      }
    }

    setStatus('timer obliterated! ready for a fresh start 🌊🪨🔥🌪️');
    setPin(''); // clear input
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100svh', background: 'var(--water-dark)', color: 'var(--air-white)', fontFamily: 'var(--font-body)'
    }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>Word Scroll Reset</h2>
      <input 
        type="password" 
        value={pin} 
        onChange={e => setPin(e.target.value)} 
        placeholder="Enter PIN" 
        maxLength={4}
        style={{ 
          margin: '20px 0', padding: '10px', fontSize: '1.5rem', textAlign: 'center', 
          borderRadius: '8px', border: '2px solid var(--earth-brown)', background: 'var(--air-white)', color: 'var(--water-dark)',
          width: '150px'
        }}
      />
      <button onClick={handleReset} style={{
        padding: '12px 24px', fontSize: '1.2rem', background: 'var(--fire-red)', color: 'white', 
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-heading)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        NUKE TIMER
      </button>
      <p style={{ marginTop: '20px', minHeight: '20px', fontWeight: 'bold' }}>{status}</p>
      
      <button 
        onClick={() => window.location.href = '/'} 
        style={{ marginTop: '40px', background: 'transparent', border: '1px solid var(--water-light)', color: 'var(--water-light)', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
      >
        return home
      </button>
    </div>
  );
}
