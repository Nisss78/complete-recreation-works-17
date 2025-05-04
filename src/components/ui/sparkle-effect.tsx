
import React, { useState, useEffect } from 'react';

interface Sparkle {
  id: string;
  size: number;
  style: React.CSSProperties;
}

interface SparkleEffectProps {
  children: React.ReactNode;
}

export const SparkleEffect = ({ children }: SparkleEffectProps) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const createSparkle = () => {
    const sparkle = {
      id: Math.random().toString(36).substring(2),
      size: 3 + Math.random() * 2,
      style: {
        top: `${-25 + Math.random() * 150}%`,
        left: `${-25 + Math.random() * 150}%`,
        animationDelay: `${Math.random() * 0.3}s`,
        animationDuration: `${0.5 + Math.random() * 0.3}s`
      }
    };
    return sparkle;
  };

  const handleClick = () => {
    const newSparkles = Array.from({ length: 5 }, () => createSparkle());
    setSparkles(newSparkles);
    
    setTimeout(() => {
      setSparkles([]);
    }, 1000);
  };

  return (
    <div className="sparkle-container relative" onClick={handleClick}>
      {sparkles.map(sparkle => (
        <span
          key={sparkle.id}
          className="sparkle animate-sparkle absolute pointer-events-none"
          style={{
            ...sparkle.style,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        />
      ))}
      {children}
    </div>
  );
};
