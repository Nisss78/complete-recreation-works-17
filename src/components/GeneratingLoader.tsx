import React from 'react';
import styles from './GeneratingLoader.module.css';

interface GeneratingLoaderProps {
  fullScreen?: boolean;
}

const GeneratingLoader: React.FC<GeneratingLoaderProps> = ({ fullScreen = true }) => {
  return (
    <div className={fullScreen ? styles.fullScreenContainer : styles.container}>
      <div className={styles.loaderWrapper}>
        <span className={styles.loaderLetter}>G</span>
        <span className={styles.loaderLetter}>e</span>
        <span className={styles.loaderLetter}>n</span>
        <span className={styles.loaderLetter}>e</span>
        <span className={styles.loaderLetter}>r</span>
        <span className={styles.loaderLetter}>a</span>
        <span className={styles.loaderLetter}>t</span>
        <span className={styles.loaderLetter}>i</span>
        <span className={styles.loaderLetter}>n</span>
        <span className={styles.loaderLetter}>g</span>
        <div className={styles.loader}>
          <div className={styles.loaderAfter}></div>
        </div>
      </div>
    </div>
  );
};

export default GeneratingLoader;
