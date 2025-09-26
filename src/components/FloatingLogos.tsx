import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Logo {
  id: number;
  size: number;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  drift: number;
  rotation: number;
}

const FloatingLogos = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<Logo[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const logos: Logo[] = [];
    const logoCount = 35; // Increased for more coverage
    
    // Divide screen into grid sections for even distribution
    const cols = 5;
    const rows = 7;
    const sectionWidth = containerWidth / cols;
    const sectionHeight = containerHeight / rows;

    for (let i = 0; i < logoCount; i++) {
      // Calculate grid position
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Random position within section for natural look
      const x = col * sectionWidth + Math.random() * sectionWidth * 0.8 + sectionWidth * 0.1;
      const y = row * sectionHeight + Math.random() * sectionHeight;
      
      logos.push({
        id: i,
        size: 40 + Math.random() * 40, // 40-80px
        x: x,
        y: y,
        speed: 12 + Math.random() * 8, // 12-20 seconds (slower than particles)
        opacity: 0.15 + Math.random() * 0.25, // 0.15-0.4 (more subtle)
        drift: (Math.random() - 0.5) * 60,
        rotation: Math.random() * 360,
      });
    }

    logosRef.current = logos;

    logos.forEach(logo => {
      const logoElement = document.createElement('div');
      logoElement.className = 'floating-logo';
      logoElement.style.cssText = `
        position: absolute;
        width: ${logo.size}px;
        height: ${logo.size}px;
        pointer-events: none;
        will-change: transform;
        left: ${logo.x}px;
        top: ${logo.y}px;
        opacity: ${logo.opacity};
        background-image: url('/lovable-uploads/2b4f768d-73fc-4ad4-a297-fbd2600a520c.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: brightness(1.2);
      `;
      logoElement.setAttribute('data-logo-id', logo.id.toString());
      container.appendChild(logoElement);
    });

    logos.forEach(logo => {
      const element = container.querySelector(`[data-logo-id="${logo.id}"]`) as HTMLElement;
      if (element) {
        gsap.set(element, {
          x: 0,
          y: 0,
          rotation: logo.rotation,
        });

        const animation = gsap.to(element, {
          y: -(containerHeight + logo.y + 200),
          x: logo.drift,
          rotation: logo.rotation + 180,
          duration: logo.speed,
          ease: "none",
          repeat: -1,
          modifiers: {
            y: (y) => {
              const yVal = parseFloat(y);
              if (yVal < -(containerHeight + 200)) {
                return (containerHeight + 100) + 'px';
              }
              return y;
            }
          }
        });
        animationsRef.current.push(animation);
      }
    });

    return () => {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
      const logoElements = container.querySelectorAll('.floating-logo');
      logoElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default FloatingLogos;