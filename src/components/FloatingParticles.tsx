import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  drift: number;
}

const FloatingParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Create particles data
    const particles: Particle[] = [];
    const particleCount = 80; // Increased for more visible effect

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * containerWidth; // Spread across entire width
      
      particles.push({
        id: i,
        size: 8 + Math.random() * 12, // 8-20px (much larger)
        x: x,
        y: Math.random() * containerHeight * 1.5, // Start at random positions throughout
        speed: 8 + Math.random() * 7, // 8-15 seconds (more consistent speed)
        opacity: 0.7 + Math.random() * 0.3, // 0.7-1.0 (much more opaque)
        drift: (Math.random() - 0.5) * 40, // -20 to +20px horizontal drift
      });
    }

    particlesRef.current = particles;

    // Create DOM elements for particles
    particles.forEach(particle => {
      const particleElement = document.createElement('div');
      particleElement.className = 'floating-particle';
      particleElement.style.cssText = `
        position: absolute;
        width: ${particle.size}px;
        height: ${particle.size}px;
        background: radial-gradient(circle, rgba(116, 235, 213, ${particle.opacity * 0.5}) 0%, rgba(159, 172, 230, ${particle.opacity * 0.4}) 50%, rgba(116, 235, 213, ${particle.opacity * 0.3}) 100%);
        border-radius: 50%;
        pointer-events: none;
        will-change: transform;
        left: ${particle.x}px;
        top: ${particle.y}px;
        box-shadow: 0 0 ${particle.size * 2}px rgba(116, 235, 213, ${particle.opacity * 0.4}), 0 0 ${particle.size * 4}px rgba(159, 172, 230, ${particle.opacity * 0.3});
      `;
      particleElement.setAttribute('data-particle-id', particle.id.toString());
      container.appendChild(particleElement);
    });

    // Calculate speed multiplier based on container height
    // Standard viewport height reference: 800px
    const standardViewportHeight = 800;
    const speedMultiplier = Math.max(1, containerHeight / standardViewportHeight);

    // Animate each particle independently for seamless infinite loop
    particles.forEach(particle => {
      const element = container.querySelector(`[data-particle-id="${particle.id}"]`) as HTMLElement;
      if (element) {
        // Set initial position
        gsap.set(element, {
          x: 0,
          y: 0,
          opacity: particle.opacity,
        });

        // Create infinite loop animation for each particle
        const animation = gsap.to(element, {
          y: -(containerHeight + particle.y + 200), // Move above container
          x: particle.drift, // Slight horizontal drift
          rotation: 360,
          duration: particle.speed * speedMultiplier, // Adjust duration based on container height
          ease: "none",
          repeat: -1, // Infinite repeat for each particle
          modifiers: {
            y: (y) => {
              // Seamless wrapping: when particle goes above, reset to bottom
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

    // Cleanup function
    return () => {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
      // Remove all particle elements
      const particleElements = container.querySelectorAll('.floating-particle');
      particleElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default FloatingParticles;