import React from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  fullScreen?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = true }) => {
  return (
    <div className={fullScreen ? styles.fullScreenContainer : styles.container}>
      <div className={styles.wrapperGrid}>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>L</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>O</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>A</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>D</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>I</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>N</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
        <div className={styles.cube}>
          <div className={`${styles.face} ${styles.faceFront}`}>G</div>
          <div className={`${styles.face} ${styles.faceBack}`} />
          <div className={`${styles.face} ${styles.faceRight}`} />
          <div className={`${styles.face} ${styles.faceLeft}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;