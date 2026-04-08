import { useState } from 'react';
import styles from './ConfirmNoModal.module.css';

export default function ConfirmNoModal({ onDismiss, onConfirm }) {
  const [step, setStep] = useState(1);

  return (
    <div className={styles.overlay}>
      <div className={`parchment ${styles.modal}`}>
        {step === 1 ? (
          <>
            <p className={styles.message}>
              are u sure?
            </p>
            <div className={styles.actions}>
              <button className={styles.btnWait} onClick={onDismiss}>
                wait no
              </button>
              <button className={styles.btnSure} onClick={() => setStep(2)}>
                yes i'm sure
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.message}>
              are u really really sure?
            </p>
            <div className={styles.actions}>
              <button className={styles.btnWait} onClick={onDismiss}>
                wait no
              </button>
              <button className={styles.btnSure} onClick={onConfirm}>
                yes i'm really sure
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
