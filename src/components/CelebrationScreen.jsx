import { useTimer } from '../hooks/useTimer';
import styles from './CelebrationScreen.module.css';

export default function CelebrationScreen() {
  const { days, hours, minutes, seconds } = useTimer();

  return (
    <div className={styles.container}>
      {/* Background watermark logo */}
      <div className={styles.watermark}></div>

      <div className={styles.content}>
        <h1 className={`heading-font ${styles.title}`}>
          We've been together for
        </h1>

        <div className={styles.timerGrid}>
          <div className={styles.timeBox}>
            <span className={styles.value}>{days}</span>
            <span className={styles.label}>Days</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.value}>{hours}</span>
            <span className={styles.label}>Hours</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.value}>{minutes}</span>
            <span className={styles.label}>Minutes</span>
          </div>
          <div className={styles.timeBox}>
            <span className={styles.value}>{seconds}</span>
            <span className={styles.label}>Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
