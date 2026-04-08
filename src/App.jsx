import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ProposalScreen from './components/ProposalScreen';
import CelebrationScreen from './components/CelebrationScreen';
import ConfirmNoModal from './components/ConfirmNoModal';
import dictArray from 'an-array-of-english-words';

const validWordsSet = new Set(dictArray.map(w => w.toUpperCase()));
const wordsToFind = ['BOY', 'FRIEND'];

export default function App() {
  const [screen, setScreen] = useState('GAME'); // GAME, PROPOSAL, CELEBRATION
  const [foundWords, setFoundWords] = useState([]);
  const [showNoModal, setShowNoModal] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (screen !== 'GAME' || isMorphing || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setFoundWords(current => [...new Set([...current, ...wordsToFind])]);
          setIsMorphing(true);
          setTimeout(() => {
            setScreen('PROPOSAL');
          }, 3500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [screen, isMorphing]);

  const handleWordFound = (word) => {
    if (word.length >= 3 && !foundWords.includes(word) && validWordsSet.has(word)) {
      const newFound = [...foundWords, word];
      setFoundWords(newFound);
      setScore(s => s + (word.length * 100));
      
      if (newFound.includes('BOY') && newFound.includes('FRIEND')) {
        // Trigger sequence!
        setIsMorphing(true);
        setTimeout(() => {
          setScreen('PROPOSAL');
        }, 3500); // Wait for sequence
      }
    }
  };

  return (
    <div className="app-container">
      <div className="avatar-logo-bg"></div>
      
      {/* Background drifting particles */}
      <div className="particle">🍃</div>
      <div className="particle">✨</div>
      <div className="particle">🍂</div>
      <div className="particle">✨</div>
      <div className="particle">🍃</div>
      
      {screen === 'GAME' && (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
            <h1 className="heading-font" style={{ fontSize: '2.5rem', color: 'var(--water-light)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.4))' }}>🌊</span>
              Word Scroll
              <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.4))' }}>🔥</span>
            </h1>
            <p style={{ color: 'var(--earth-light)', fontSize: '1rem', fontWeight: 'bold' }}>
              Score: {score}
            </p>
            
            <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center', minHeight: '30px', maxHeight: '50px', overflowY: 'auto' }}>
               {foundWords.map(w => (
                 <span key={w} style={{ background: 'rgba(245, 230, 200, 0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--water-light)' }}>{w}</span>
               ))}
            </div>

            {screen === 'GAME' && !isMorphing && (
              <div style={{ marginTop: '10px', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: timeLeft <= 10 ? 'var(--fire-red)' : 'var(--air-orange)', fontWeight: 'bold' }}>
                ⏳ 0:{timeLeft.toString().padStart(2, '0')}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
            {/* The Four Elements Decor */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '2rem', opacity: 0.15, pointerEvents: 'none' }}>🌊</div>
            <div style={{ position: 'absolute', top: '10%', right: '5%', fontSize: '2rem', opacity: 0.15, pointerEvents: 'none' }}>🪨</div>
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', fontSize: '2rem', opacity: 0.15, pointerEvents: 'none' }}>🌪️</div>
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', fontSize: '2rem', opacity: 0.15, pointerEvents: 'none' }}>🔥</div>

            <GameBoard 
              onWordFound={handleWordFound} 
              foundWords={foundWords}
              isMorphing={isMorphing} 
            />
          </div>
        </div>
      )}

      {screen === 'PROPOSAL' && (
        <ProposalScreen 
          onYes={() => setScreen('CELEBRATION')} 
          onNo={() => setShowNoModal(true)} 
        />
      )}

      {screen === 'CELEBRATION' && (
        <CelebrationScreen />
      )}

      {showNoModal && (
        <ConfirmNoModal 
          onDismiss={() => setShowNoModal(false)} 
          onConfirm={() => {
            setShowNoModal(false);
            setScreen('CELEBRATION');
          }} 
        />
      )}
    </div>
  );
}
