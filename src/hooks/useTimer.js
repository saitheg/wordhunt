import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export function useTimer(storageKey = 'avatar-proposal-timer-start') {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [startObj, setStartObj] = useState(null);

  useEffect(() => {
    async function initTime() {
      let startTime = null;

      if (supabase) {
        // Try to fetch from database
        const { data } = await supabase
          .from('timers')
          .select('started_at')
          .eq('id', storageKey)
          .single();

        if (data && data.started_at) {
          startTime = data.started_at;
        } else {
          // If not found, create it in DB
          startTime = Date.now().toString();
          await supabase.from('timers').upsert({ id: storageKey, started_at: startTime });
        }
      } else {
        // Fallback to local storage
        startTime = localStorage.getItem(storageKey);
        if (!startTime) {
          startTime = Date.now().toString();
          localStorage.setItem(storageKey, startTime);
        }
      }

      setStartObj(parseInt(startTime, 10));
    }
    
    initTime();
  }, [storageKey]);

  useEffect(() => {
    if (!startObj) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = now - startObj;
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [startObj]);

  return elapsed;
}
