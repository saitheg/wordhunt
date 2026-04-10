import CelebrationScreen from './components/CelebrationScreen';
import ResetScreen from './components/ResetScreen';

export default function App() {
  if (window.location.pathname === '/reset') {
    return <ResetScreen />;
  }

  return (
    <div className="app-container">
      <div className="avatar-logo-bg"></div>
      
      {/* Background drifting particles */}
      <div className="particle">🍃</div>
      <div className="particle">✨</div>
      <div className="particle">🍂</div>
      <div className="particle">✨</div>
      <div className="particle">🍃</div>
      
      <CelebrationScreen />
    </div>
  );
}
