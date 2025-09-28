import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function RotatingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const smooothRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!containerRef.current || !smooothRef.current || !circleRef.current) return;

    const shapes = gsap.utils.toArray<HTMLElement>('.letter');
    const proxy = proxyRef.current || document.createElement('div');
    proxyRef.current = proxy;

    const initialRotationOffset = 0;
    const letterCount = 9;
    // 文字を集めて配置（120度の範囲に広げる）
    const letterPos = Array.from({ length: letterCount }, (_, i) => (120 / (letterCount - 1)) * i);
    const progressWrap = gsap.utils.wrap(0, 1);
    const wrapRotation = gsap.utils.wrap(-120, 120);

    let screenRange = gsap.utils.mapRange(0, 2000, 500, 4500);
    let dragDistancePerRotation = screenRange(window.innerWidth);
    let startProgress = 0;

    const handleResize = () => {
      dragDistancePerRotation = screenRange(window.innerWidth);
      adjustRadius();
    };

    function adjustRadius() {
      const radius = Math.min(window.innerWidth * 0.5, 650, window.innerHeight * 0.43);

      gsap.set(shapes, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        transformOrigin: `50% 50% ${-radius}px`
      });
    }

    const spin = gsap.fromTo(
      shapes,
      {
        rotationY: (i) => letterPos[i] + initialRotationOffset
      },
      {
        rotationY: `-=${360}`,
        modifiers: {
          rotationY: (value) => wrapRotation(parseFloat(value)) + 'deg'
        },
        duration: 10,
        ease: 'none',
        repeat: -1
      }
    );

    spinRef.current = spin;

    function updateRotation(this: any) {
      const p = startProgress + (this.startX - this.x) / dragDistancePerRotation;
      spin.progress(progressWrap(p));
    }

    Draggable.create(proxy, {
      trigger: smooothRef.current,
      type: 'x',
      inertia: true,
      allowNativeTouchScrolling: true,
      onPress() {
        gsap.killTweensOf(spin);
        spin.timeScale(0);
        startProgress = spin.progress();
      },
      onDrag: updateRotation,
      onThrowUpdate: updateRotation,
      onRelease() {
        if (!this.tween || !this.tween.isActive()) {
          gsap.to(spin, { timeScale: 1, duration: 1 });
        }
      },
      onThrowComplete() {
        gsap.to(spin, { timeScale: 1, duration: 1 });
      }
    });

    adjustRadius();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      spin.kill();
      Draggable.get(proxy)?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Circle Background */}
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[min(700px,50svh)] max-h-[min(700px,50svh)] rounded-full bg-white"
        style={{
          boxShadow:
            'inset 0 2vh 15vw rgba(255, 255, 255, 0.5), inset 0 -2vh 7.5vw rgba(0, 0, 0, 0.25), 0 6vh 10vw rgba(0, 0, 0, 0.15)'
        }}
      />

      {/* Rotating Text */}
      <div
        ref={smooothRef}
        className="relative z-10 w-full h-full max-w-[1024px] max-h-[1024px] font-bold"
        style={{
          perspective: '100vw',
          fontSize: 'clamp(78px, 18vw, min(240px, 15.5svh))'
        }}
      >
        {['P', 'r', 'o', 't', 'o', 'd', 'u', 'c', 't'].map((letter, i) => (
          <div
            key={i}
            className="letter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            data-letter={letter}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}