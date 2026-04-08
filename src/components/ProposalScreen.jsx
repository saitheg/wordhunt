import { useState, useEffect } from 'react';
import styles from './ProposalScreen.module.css';

export default function ProposalScreen({ onYes, onNo }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fade in effect
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${show ? styles.visible : ''}`}>
      <div className={`parchment ${styles.scrollInner}`}>
        <img
          src="/kataang.jpg"
          alt="Aang and Katara"
          className={styles.image}
        />

        <h2 className={`heading-font ${styles.proposalText}`}>
          can i be your boyfriend?
        </h2>

        <div className={styles.buttonGroup}>
          <button className={styles.btnYes} onClick={onYes}>
            yes 🌊
          </button>
          <button className={styles.btnNo} onClick={onNo}>
            no
          </button>
        </div>
      </div>
    </div>
  );
}
