import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, GraduationCap, Briefcase, Building2, TrendingUp, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNews } from "@/hooks/useNews";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/StructuredData";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import RotatingText from "@/components/RotatingText";

// GSAP types
type GSAPTimeline = {
  kill: () => void;
};

// Extend window for global carousel control
declare global {
  interface Window {
    productCarouselScrubTo?: (totalTime: number) => void;
    productCarouselScrubTween?: React.MutableRefObject<any>;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isJapanese = language === 'ja';
  const { data: newsItems } = useNews();
  const heroRef = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const weBuildRef = useRef<HTMLDivElement | null>(null);
  const coolProductsRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLHeadingElement | null>(null);
  const taglineLine1Ref = useRef<HTMLDivElement | null>(null);
  const taglineLine2Ref = useRef<HTMLDivElement | null>(null);
  const taglineLine3Ref = useRef<HTMLDivElement | null>(null);
  const finalTextRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);
  const refreshHandlerRef = useRef<(() => void) | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const whiteCircleRef = useRef<HTMLDivElement | null>(null);
  const scatteredTextRef = useRef<HTMLDivElement | null>(null);
  const servicesTitleRef = useRef<HTMLDivElement | null>(null);
  const productCarouselRef = useRef<HTMLDivElement | null>(null);
  const seamlessLoopRef = useRef<any>(null);
  const scrubTweenRef = useRef<any>(null);
  const iterationRef = useRef<number>(0);
  const scrollTriggerRef = useRef<any>(null);

  // Get latest 3 news items
  const latestNews = newsItems?.slice(0, 3) || [];

  const categoryBadges = {
    announcement: { ja: "お知らせ", en: "Announcement", color: "text-white", style: { backgroundColor: '#10c876' } },
    event: { ja: "イベント", en: "Event", color: "text-white", style: { backgroundColor: '#7bc61e' } },
    media: { ja: "メディア", en: "Media", color: "text-white", style: { backgroundColor: '#15b8e5' } },
    other: { ja: "その他", en: "Other", color: "bg-gray-500 text-white", style: {} },
  };

  useLayoutEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsapMod = await import(/* @vite-ignore */ 'gsap') as { default?: unknown } & Record<string, unknown>;
        const ScrollTriggerMod = await import(/* @vite-ignore */ 'gsap/ScrollTrigger') as { default?: unknown, ScrollTrigger?: unknown } & Record<string, unknown>;
        const MotionPathMod = await import(/* @vite-ignore */ 'gsap/MotionPathPlugin') as { default?: unknown, MotionPathPlugin?: unknown } & Record<string, unknown>;

        const gsap = gsapMod.default || gsapMod;
        const ScrollTrigger = ScrollTriggerMod.default || ScrollTriggerMod.ScrollTrigger || ScrollTriggerMod;
        const MotionPathPlugin = MotionPathMod.default || MotionPathMod.MotionPathPlugin || MotionPathMod;

        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

        const ctx = gsap.context(() => {
          // Performance optimization: only show ball on larger screens
          const shouldShowBall = window.innerWidth >= 768;
          
          // A serpentine path that spans from hero to bottom, synced to scroll
          const buildSerpentinePath = () => {
            if (!mainRef.current || !ballRef.current || !shouldShowBall) return;
            const el = mainRef.current;
            const w = el.clientWidth;
            const h = el.scrollHeight; // full content height
            const topOffset = 120;
            const bottomOffset = 160;
            const usableH = Math.max(0, h - topOffset - bottomOffset);
            const segments = Math.max(6, Math.ceil(usableH / 480));
            const xs = [0.2, 0.8];
            const points: Array<{ x: number; y: number }> = [];
            points.push({ x: w * 0.5, y: Math.max(60, topOffset * 0.5) });
            for (let i = 1; i <= segments; i++) {
              const y = topOffset + (i / segments) * usableH;
              const x = w * xs[i % 2];
              points.push({ x, y });
            }

            // Reset previous timeline
            timelineRef.current?.kill();
            gsap.set(ballRef.current, { x: points[0].x, y: points[0].y, opacity: shouldShowBall ? 1 : 0, rotate: 0 });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                invalidateOnRefresh: true,
              }
            });
            tl.to(ballRef.current, {
              motionPath: {
                path: points,
                curviness: 1.25,
                autoRotate: false,
              },
              ease: 'none',
            }, 0).to(ballRef.current, { rotate: 900, ease: 'none' }, 0);
            timelineRef.current = tl;
          };

          buildSerpentinePath();
          // Recompute on refresh (resize, content changes)
          // @ts-expect-error - ScrollTrigger addEventListener not typed but exists
          ScrollTrigger.addEventListener('refreshInit', buildSerpentinePath);
          refreshHandlerRef.current = buildSerpentinePath;

          // Responsive animation values based on screen size
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth < 1024;
          
          // Adjust animation values for complete off-screen exit
          const screenWidth = window.innerWidth;
          const weBuildX = -(screenWidth + 200); // Completely off left side
          const coolProductsX = screenWidth + 200; // Completely off right side
          // Since tagline is now centered, no Y movement needed for initial positioning
          const taglineY = { from: 0, to: 0 };

          // Disable scroll acceleration during animation
          ScrollTrigger.normalizeScroll(true);
          
          // Set CSS to disable smooth scrolling during animation
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';

          // Pin hero section and animate text within it (extended for all animations)
          // Adjust animation duration based on screen size - increased for mobile to allow full animation display
          const scrollDuration = isMobile ? '+=4000vh' : '+=2400vh';
          const scrubSpeed = isMobile ? 3 : 6;

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: scrollDuration,
              scrub: scrubSpeed,
              pin: true,
              pinSpacing: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onStart: () => {
                ScrollTrigger.normalizeScroll(true);
                document.documentElement.style.scrollBehavior = 'auto';
                document.body.style.scrollBehavior = 'auto';
              },
              onComplete: () => {
                ScrollTrigger.normalizeScroll(false);
                document.documentElement.style.scrollBehavior = 'smooth';
                document.body.style.scrollBehavior = 'smooth';
              },
            }
          });

          // Add text animations to the timeline (complete off-screen exit)
          if (weBuildRef.current) {
            heroTimeline.to(weBuildRef.current, {
              x: weBuildX,
              ease: 'power2.out',
            }, 0);
          }

          if (coolProductsRef.current) {
            heroTimeline.to(coolProductsRef.current, {
              x: coolProductsX,
              ease: 'power2.out',
            }, 0);
          }


          // STEP 1: Tagline appears (3 lines fade in)
          if (taglineLine1Ref.current) {
            heroTimeline.to(taglineLine1Ref.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, 0.45);
          }

          if (taglineLine2Ref.current) {
            heroTimeline.to(taglineLine2Ref.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, 0.48);
          }

          if (taglineLine3Ref.current) {
            heroTimeline.to(taglineLine3Ref.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, 0.51);
          }

          // STEP 2: Much longer pause to display tagline clearly before wave
          heroTimeline.to({}, { duration: 0.15 }, 0.54); // Much longer pause after appearance

          // STEP 3: Wave animation (2 repetitions only) - starts much later
          if (taglineLine3Ref.current) {
            const waveLetters = taglineLine3Ref.current.querySelectorAll('.wave-letter');
            
            // Calculate total wave duration: duration * (1 + repeat) * 2 (yoyo) + stagger time
            const waveDuration = 0.3 * (1 + 1) * 2; // 1.2 seconds for each letter
            const totalStaggerTime = waveLetters.length * 0.02; // Total stagger across all letters
            const totalWaveTime = waveDuration + totalStaggerTime; // Total time for wave to complete
            
            waveLetters.forEach((letter, index) => {
              heroTimeline.to(letter, {
                y: -35,
                duration: 0.3,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1, // Only 2 waves total (1 repeat = 2 times)
              }, 0.72 + (index * 0.02)); // Wave starts much later to allow full display
            });
          }

          // STEP 4: MUCH LONGER pause after wave completely finishes - wait for all waves to complete
          heroTimeline.to({}, { duration: 0.25 }, 0.95); // Extended pause until wave animation is completely done

          // STEP 5: Tagline exits upward (starts ONLY after wave is completely finished)
          if (taglineLine1Ref.current) {
            heroTimeline.to(taglineLine1Ref.current, {
              y: -200,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
            }, 1.05); // Much later start - after wave is completely done

            heroTimeline.to(taglineLine2Ref.current, {
              y: -200,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
            }, 1.07);

            heroTimeline.to(taglineLine3Ref.current, {
              y: -200,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.in',
            }, 1.09);
          }

          // STEP 6: Much longer pause on green screen after tagline completely exits
          heroTimeline.to({}, { duration: 0.45 }, 1.15); // Much longer green screen pause

          // STEP 7: "Let's enjoy" appears at 1.6 timing
          if (finalTextRef.current) {
            // Final text entrance - at 1.6 timing
            heroTimeline.fromTo(finalTextRef.current, {
              y: 100,
              opacity: 0,
            }, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power2.out',
            }, 1.60); // 1.6 timing as requested

            // STEP 8: Hold "Let's enjoy" for much longer time
            heroTimeline.to({}, { duration: 0.25 }, 1.65); // Much longer hold

            // STEP 9: Final text exits upward
            heroTimeline.to(finalTextRef.current, {
              y: -200,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.in',
            }, 1.85); // Later exit timing

            // STEP 10: Much longer final green screen pause before unpinning (1 second)
            heroTimeline.to({}, { duration: 1.0 }, 1.95); // 1 second final green screen to keep background green until text completely exits

            // STEP 11: White circle expansion - starts after final text exits
            if (whiteCircleRef.current) {
              heroTimeline.fromTo(whiteCircleRef.current, {
                scale: 0,
                opacity: 1,
              }, {
                scale: 30,
                duration: 1.5,
                ease: 'power2.out',
              }, 2.95); // Start after green screen pause
            }

            // STEP 12: Scattered text reveal - sync with white circle expansion
            if (scatteredTextRef.current) {
              heroTimeline.fromTo(scatteredTextRef.current, {
                clipPath: 'circle(0px at center)',
                opacity: 0,
                visibility: 'hidden',
              }, {
                clipPath: 'circle(2000px at center)',
                opacity: 1,
                visibility: 'visible',
                duration: 1.5,
                ease: 'power2.out',
              }, 2.95); // Same timing as white circle
            }

            // STEP 13: Extended hold after white circle completes - keep hero section pinned
            // This ensures the animation completes fully before unpinning
            heroTimeline.to({}, {
              duration: isMobile ? 3.0 : 2.0
            }, 4.45); // Hold for 3 seconds on mobile to ensure full display
          }

          // Scattered text animation - characters gather to center on scroll (fixed position)
          if (scatteredTextRef.current && servicesTitleRef.current) {
            const letters = scatteredTextRef.current.querySelectorAll('.scattered-letter');
            
            // Create a temporary reference text to get natural letter positions
            const tempText = document.createElement('div');
            tempText.style.position = 'absolute';
            tempText.style.visibility = 'hidden';
            tempText.style.fontSize = window.getComputedStyle(scatteredTextRef.current).fontSize;
            tempText.style.fontFamily = window.getComputedStyle(scatteredTextRef.current).fontFamily;
            tempText.style.fontWeight = window.getComputedStyle(scatteredTextRef.current).fontWeight;
            // Ensure proper line height for large text
            tempText.style.lineHeight = '1.2';
            tempText.style.whiteSpace = 'nowrap';
            tempText.innerHTML = 'Our Services';
            document.body.appendChild(tempText);
            
            // Get natural character positions
            const textMetrics = tempText.getBoundingClientRect();
            const finalPositions = [];
            
            // Calculate each character position for perfect center alignment
            const text = 'Our Services';
            const chars = text.split('');
            
            // Calculate total width first
            let totalWidth = 0;
            const charWidths = [];
            
            chars.forEach((char, i) => {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              charSpan.style.visibility = 'hidden';
              charSpan.style.position = 'absolute';
              // Apply same styles as the actual container
              charSpan.style.fontSize = window.getComputedStyle(scatteredTextRef.current).fontSize;
              charSpan.style.fontFamily = window.getComputedStyle(scatteredTextRef.current).fontFamily;
              charSpan.style.fontWeight = window.getComputedStyle(scatteredTextRef.current).fontWeight;
              document.body.appendChild(charSpan);
              
              const charRect = charSpan.getBoundingClientRect();
              charWidths[i] = charRect.width;
              totalWidth += charRect.width;
              
              document.body.removeChild(charSpan);
            });
            
            // Position each character from center
            let currentPos = -totalWidth / 2;
            chars.forEach((char, i) => {
              finalPositions.push({ 
                left: currentPos, 
                top: 0 
              });
              currentPos += charWidths[i];
            });
            
            // Clean up temp element
            document.body.removeChild(tempText);

            // STAGE 1: Animate each letter to natural positions with enhanced effects
            letters.forEach((letter, index) => {
              // Create a timeline for each letter with sequential delays
              const letterTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: servicesTitleRef.current,
                  start: 'top center',
                  end: '8% center', // もっと短縮して瞬時に集まるように
                  scrub: 0.02, // さらに速く
                }
              });

              // Add staggered delay based on index for very gradual gathering
              const staggerDelay = index * 0.02; // delayももっと短縮
              
              letterTimeline
                .to(letter, {
                  left: finalPositions[index].left + 'px',
                  top: '0px',
                  opacity: 1, // Full opacity when gathered
                  rotation: 0, // Reset rotation to 0
                  scale: 1, // Reset scale to 1
                  filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))', // Enhanced glow
                  duration: 0.6, // durationも短縮
                  ease: 'power2.out', // Smooth without bounce
                  delay: staggerDelay
                });
            });

            // STAGE 2: Shorter pause in center, then move to top-left with underline effect
            const finalTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: servicesTitleRef.current,
                start: '8% center', // Start after gathering is complete (matches STAGE 1 end)
                end: '25% center', // もっと短縮してテンポよく
                scrub: 0.03, // Extremely slow scrub for ultra-smooth movement
                onComplete: () => {
                  // Add underline effect after positioning
                  const underline = document.createElement('div');
                  underline.style.position = 'absolute';
                  underline.style.bottom = '-5px'; // Closer to text
                  underline.style.left = '0';
                  underline.style.width = '0%';
                  underline.style.height = '3px';
                  underline.style.background = 'linear-gradient(90deg, #7bc61e, #10c876, #15b8e5)'; // Green gradient
                  underline.style.borderRadius = '2px';
                  underline.style.boxShadow = '0 0 8px rgba(123, 198, 30, 0.4)'; // Green glow
                  scatteredTextRef.current?.appendChild(underline);
                  
                  // Animate underline
                  gsap.to(underline, {
                    width: '100%',
                    duration: 1.5,
                    ease: 'power2.out',
                    delay: 0.5
                  });
                }
              }
            });

            finalTimeline
              // Shorter pause at center
              .to(scatteredTextRef.current, {
                top: '30vh',
                left: '50%',
                ease: 'none',
                duration: 0.3
              })
              // Smooth, elegant move to final position with size reduction
              .to(scatteredTextRef.current, {
                top: '15vh',
                left: window.innerWidth < 768 ? '50%' : '30%',
                scale: window.innerWidth < 768 ? 0.7 : 0.3,
                ease: 'power2.inOut',
                duration: 0.7
              });

            // Build seamless loop for infinite horizontal scrolling
            const buildSeamlessLoop = (items: Element[], spacing: number, gsapInstance: any) => {
              const overlap = Math.ceil(1 / spacing);
              const startTime = items.length * spacing + 0.5;
              const loopTime = (items.length + overlap) * spacing + 1;
              const rawSequence = gsapInstance.timeline({ paused: true });
              const seamlessLoop = gsapInstance.timeline({
                paused: true,
                repeat: -1,
                onRepeat() {
                  // @ts-expect-error - GSAP internal properties
                  if (this._time === this._dur) {
                    // @ts-expect-error - GSAP internal properties
                    this._tTime += this._dur - 0.01;
                  }
                }
              });

              const l = items.length + overlap * 2;
              let time = 0;

              // Set initial state
              gsapInstance.set(items, { xPercent: 400, opacity: 0, scale: 0 });

              // Create animations with stagger
              for (let i = 0; i < l; i++) {
                const index = i % items.length;
                const item = items[index];
                time = i * spacing;

                rawSequence
                  .fromTo(item,
                    { scale: 0, opacity: 0 },
                    {
                      scale: 1,
                      opacity: 1,
                      zIndex: 100,
                      duration: 0.5,
                      yoyo: true,
                      repeat: 1,
                      ease: 'power1.in',
                      immediateRender: false
                    },
                    time
                  )
                  .fromTo(item,
                    { xPercent: 400 },
                    {
                      xPercent: -400,
                      duration: 1,
                      ease: 'none',
                      immediateRender: false
                    },
                    time
                  );

                if (i <= items.length) {
                  seamlessLoop.add('label' + i, time);
                }
              }

              // Setup scrubbing
              rawSequence.time(startTime);
              seamlessLoop
                .to(rawSequence, {
                  time: loopTime,
                  duration: loopTime - startTime,
                  ease: 'none'
                })
                .fromTo(rawSequence,
                  { time: overlap * spacing + 1 },
                  {
                    time: startTime,
                    duration: startTime - (overlap * spacing + 1),
                    immediateRender: false,
                    ease: 'none'
                  }
                );

              return seamlessLoop;
            };

            // Wrap forward function
            const wrapForward = (trigger: any) => {
              iterationRef.current++;
              trigger.wrapping = true;
              trigger.scroll(trigger.start + 1);
            };

            // Wrap backward function
            const wrapBackward = (trigger: any) => {
              iterationRef.current--;
              if (iterationRef.current < 0) {
                iterationRef.current = 9;
                if (seamlessLoopRef.current) {
                  seamlessLoopRef.current.totalTime(
                    seamlessLoopRef.current.totalTime() + seamlessLoopRef.current.duration() * 10
                  );
                }
                if (scrubTweenRef.current) {
                  scrubTweenRef.current.pause();
                }
              }
              trigger.wrapping = true;
              trigger.scroll(trigger.end - 1);
            };

            // scrubTo function for navigation buttons
            const scrubTo = (totalTime: number) => {
              if (!seamlessLoopRef.current || !scrollTriggerRef.current) return;

              const progress = (totalTime - seamlessLoopRef.current.duration() * iterationRef.current) / seamlessLoopRef.current.duration();

              if (progress > 1) {
                wrapForward(scrollTriggerRef.current);
              } else if (progress < 0) {
                wrapBackward(scrollTriggerRef.current);
              } else {
                scrollTriggerRef.current.scroll(
                  scrollTriggerRef.current.start + progress * (scrollTriggerRef.current.end - scrollTriggerRef.current.start)
                );
              }
            };

            // Expose scrubTo to window for ProductCarousel access
            window.productCarouselScrubTo = scrubTo;
            window.productCarouselScrubTween = scrubTweenRef;

            // Product cards slide in from top-right one by one AFTER "Our Services" is fixed
            // Wait for ProductCarousel to render
            const setupProductCards = () => {
              if (!productCarouselRef.current) return;

              const cardsContainer = productCarouselRef.current.querySelector('.relative');
              const mainCards = productCarouselRef.current.querySelectorAll('[data-product-card-main]');
              const peekCards = productCarouselRef.current.querySelectorAll('[data-product-card-peek]');
              const leftPeek = productCarouselRef.current.querySelector('[data-product-card-peek="left"]');
              const rightPeek = productCarouselRef.current.querySelector('[data-product-card-peek="right"]');

              if (mainCards.length === 0) {
                setTimeout(setupProductCards, 100);
                return;
              }

              // Make carousel visible once setup starts
              if (productCarouselRef.current) {
                (gsap as any).set(productCarouselRef.current, { visibility: 'visible' });
              }

              // Initially hide cards with entrance position
              if (mainCards.length > 0) {
                (gsap as any).set(mainCards, { opacity: 0, x: 400, y: -200, rotation: 15, scale: 0.85, transformOrigin: '50% 50%' });
              }
              if (peekCards.length > 0) {
                (gsap as any).set(peekCards, { opacity: 0, x: 400, y: -200, rotation: 15, scale: 0.65, transformOrigin: '50% 50%' });
              }
              if (cardsContainer) {
                (gsap as any).set(cardsContainer, { opacity: 1, visibility: 'visible' });
              }

              // Initial entrance animation timeline
              const cardsTimeline = (gsap as any).timeline({
                scrollTrigger: {
                  trigger: servicesTitleRef.current,
                  start: '25% center',  // 早めのタイミングに調整
                  end: '50% center',    // より短い範囲で完了
                  scrub: 0.2,           // よりレスポンシブに
                }
              });

              // Animate entrance from top-right
              const orderedCards: Element[] = [];
              if (leftPeek) orderedCards.push(leftPeek);
              orderedCards.push(...Array.from(mainCards));
              if (rightPeek) orderedCards.push(rightPeek);

              const step = 0.08;
              orderedCards.forEach((card, index) => {
                const isMain = (card as HTMLElement).hasAttribute('data-product-card-main');
                if (isMain) {
                  cardsTimeline.to(card, {
                    opacity: 1,
                    visibility: 'visible',
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1.08,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                  }, index * step);
                } else {
                  cardsTimeline.to(card, {
                    opacity: 0.6,
                    visibility: 'visible',
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 0.7,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                  }, index * step);
                }
              });

              // Setup seamless loop after cards animation
              const callStartTime = orderedCards.length * step + 0.3;
              cardsTimeline.call(() => {
                  const allCards = Array.from(orderedCards);
                  if (allCards.length === 0) return;

                  console.log('[Home] Initializing seamless loop with', allCards.length, 'cards');

                  const spacing = 0.1;
                  const snap = (gsap as any).utils.snap(spacing);

                  // Build seamless loop
                  seamlessLoopRef.current = buildSeamlessLoop(allCards, spacing, gsap);
                  console.log('[Home] Seamless loop created:', seamlessLoopRef.current);

                  // Create smooth scrub tween
                  scrubTweenRef.current = (gsap as any).to(seamlessLoopRef.current, {
                    totalTime: 0,
                    duration: 0.5,
                    ease: 'power3',
                    paused: true
                  });
                  console.log('[Home] Scrub tween created:', scrubTweenRef.current);

                  // Expose to window immediately
                  window.productCarouselScrubTo = scrubTo;
                  window.productCarouselScrubTween = scrubTweenRef;
                  console.log('[Home] Global functions exposed to window');

                  // Create scroll trigger for infinite scrolling
                  scrollTriggerRef.current = (ScrollTrigger as any).create({
                    trigger: servicesTitleRef.current,
                    start: '95% center',
                    end: '+=3000',
                    onUpdate(self) {
                      if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
                        wrapForward(self);
                      } else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
                        wrapBackward(self);
                      } else {
                        if (scrubTweenRef.current && seamlessLoopRef.current) {
                          scrubTweenRef.current.vars.totalTime = snap(
                            (iterationRef.current + self.progress) * seamlessLoopRef.current.duration()
                          );
                          scrubTweenRef.current.invalidate().restart();
                        }
                        self.wrapping = false;
                      }
                    }
                  });
                }, '>', callStartTime + 0.4);
            };

            setupProductCards();

            // Scroll-based fade out animation for Our Services and Product Cards only
            if (servicesTitleRef.current && scatteredTextRef.current && productCarouselRef.current) {
              const screenHeight = window.innerHeight;
              const moveDistance = screenHeight + 300;

              const fadeOutTimeline = (gsap as any).timeline({
                scrollTrigger: {
                  trigger: servicesTitleRef.current,
                  start: 'bottom+=100vh bottom',  // 少しだけ滞在
                  end: '+=300vh',  // フェードアウトはゆっくり
                  scrub: 1,  // 元のスピードに戻す
                }
              });

              fadeOutTimeline
                .to([scatteredTextRef.current, productCarouselRef.current], {
                  y: -moveDistance,
                  ease: 'none',
                }, 0)
                .to([scatteredTextRef.current, productCarouselRef.current], {
                  opacity: 0,
                  ease: 'none',
                }, 0.85);

            }
          }

          // Fade & slide-up for items marked with .reveal-on-scroll
          if (mainRef.current) {
            const items = mainRef.current.querySelectorAll('.reveal-on-scroll');
            items.forEach((el, i) => {
              (gsap as any).from(el, {
                y: isMobile ? 15 : 30, // Reduce movement on mobile
                opacity: 0,
                duration: isMobile ? 0.4 : 0.6, // Faster animations on mobile
                ease: 'power2.out',
                delay: Math.min(i * (isMobile ? 0.04 : 0.06), 0.3),
                scrollTrigger: {
                  trigger: el as Element,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                  fastScrollEnd: true, // Performance optimization
                  preventOverlaps: true, // Prevent animation conflicts
                }
              });
            });
          }

          // Optimize ScrollTrigger settings for performance
          (ScrollTrigger as any).config({
            limitCallbacks: true,
            syncInterval: 150, // Throttle scroll events for better performance
            ignoreMobileResize: true, // Don't recalculate on mobile keyboard show/hide
          });
          
          // Refresh ScrollTrigger after all animations are set up
          requestAnimationFrame(() => {
            (ScrollTrigger as any).refresh();
          });
        }, mainRef);
        cleanup = () => {
          timelineRef.current?.kill();
          // @ts-expect-error - ScrollTrigger removeEventListener not typed but exists
          if (refreshHandlerRef.current) ScrollTrigger.removeEventListener('refreshInit', refreshHandlerRef.current);
          ctx.revert();
          
          // Restore normal scrolling behavior on cleanup
          (ScrollTrigger as any).normalizeScroll(false);
          document.documentElement.style.scrollBehavior = 'smooth';
          document.body.style.scrollBehavior = 'smooth';
        };
      } catch (e) {
        // GSAP not installed yet or failed to load; no-op
        if (import.meta.env.DEV) {
          console.warn('GSAP not available. Install gsap to enable animations.', e);
        }
      }
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{isJapanese ? "ProtoductAI Studio - 未来の没入体験アプリを量産するスタジオ" : "ProtoductAI Studio - Studio for Mass-Producing Future Immersive Experience Apps"}</title>
        <meta name="description" content={isJapanese
          ? "ProtoductAI Studioは、未来の没入体験ができるアプリを量産するスタジオです。革新的なテクノロジーで次世代の体験を創造します。"
          : "ProtoductAI Studio is a studio for mass-producing apps that enable future immersive experiences. We create next-generation experiences with innovative technology."} />
        <meta name="keywords" content={isJapanese
          ? "プロトダクト, ProtoductAI, 没入体験, アプリ開発, スタジオ, 量産, 未来技術, イノベーション, AI, 体験デザイン"
          : "ProtoductAI, immersive experience, app development, studio, mass production, future technology, innovation, AI, experience design"} />
        <meta property="og:title" content={isJapanese ? "ProtoductAI Studio - 未来の没入体験アプリを量産するスタジオ" : "ProtoductAI Studio - Studio for Mass-Producing Future Immersive Experience Apps"} />
        <meta property="og:description" content={isJapanese
          ? "未来の没入体験ができるアプリを量産するスタジオ。革新的なテクノロジーで次世代の体験を創造。"
          : "A studio for mass-producing apps that enable future immersive experiences. Creating next-generation experiences with innovative technology."} />
        <meta property="og:image" content={isJapanese ? "/og-image-ja.png" : "/og-image.png"} />
        <meta property="og:url" content={isJapanese ? "https://protoduct.jp" : "https://protoduct.jp/en"} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={isJapanese ? "ProtoductAI Studio - 未来の没入体験アプリを量産するスタジオ" : "ProtoductAI Studio - Studio for Mass-Producing Future Immersive Experience Apps"} />
        <meta property="twitter:description" content={isJapanese
          ? "未来の没入体験ができるアプリを量産するスタジオ"
          : "A studio for mass-producing apps that enable future immersive experiences"} />
        <link rel="canonical" href={isJapanese ? "https://protoduct.jp" : "https://protoduct.jp/en"} />
      </Helmet>
      <StructuredData
        type="website"
        title={isJapanese ? "ProtoductAI Studio - 未来の没入体験アプリを量産するスタジオ" : "ProtoductAI Studio - Studio for Mass-Producing Future Immersive Experience Apps"}
        description={isJapanese
          ? "ProtoductAI Studioは、未来の没入体験ができるアプリを量産するスタジオです。革新的なテクノロジーで次世代の体験を創造します。"
          : "ProtoductAI Studio is a studio for mass-producing apps that enable future immersive experiences. We create next-generation experiences with innovative technology."}
        url={isJapanese ? "https://protoduct.jp" : "https://protoduct.jp/en"}
      />
      {/* Rolling ball overlay across the whole page */}
      <div ref={ballRef} className="pointer-events-none absolute z-30 size-4 sm:size-5 rounded-full" style={{
        background: 'radial-gradient(circle at 35% 35%, #ffffff, rgba(255,255,255,0.15))',
        boxShadow: '0 6px 22px rgba(0,0,0,0.25), 0 0 18px rgba(255,255,255,0.5)'
      }} />

      {/* Scattered Text - Fixed position overlay */}
      <div
        ref={scatteredTextRef}
        className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-gray-900 pointer-events-none"
        style={{
          top: '30vh',
          zIndex: 40,
          clipPath: 'circle(0px at center)',
          willChange: 'clip-path, top, left',
          fontSize: 'clamp(3rem, 15vw, 16rem)',
          maxWidth: '90vw',
          overflow: 'visible',
          opacity: 0,
          visibility: 'hidden'
        }}
      >
        <>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-350px, -45vw, -700px)', top: 'clamp(-180px, -23vh, -360px)',
            opacity: 0.6,
            transform: 'rotate(-15deg) scale(0.8)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#74ebd5'
          }}>O</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-200px, -25vw, -400px)', top: 'clamp(-280px, -35vh, -560px)',
            opacity: 0.7,
            transform: 'rotate(22deg) scale(1.1)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#7aecd9'
          }}>u</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-280px, -35vw, -560px)', top: 'clamp(100px, 12vh, 200px)',
            opacity: 0.5,
            transform: 'rotate(-8deg) scale(0.7)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#80eddd'
          }}>r</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: '0px', top: '0px',
            opacity: 0.8,
            transform: 'rotate(0deg) scale(1.0)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease'
          }}> </span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(200px, 25vw, 400px)', top: 'clamp(120px, 15vh, 240px)',
            opacity: 0.4,
            transform: 'rotate(18deg) scale(1.2)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#86eee1'
          }}>S</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-150px, -18vw, -300px)', top: 'clamp(-150px, -19vh, -300px)',
            opacity: 0.6,
            transform: 'rotate(-25deg) scale(0.9)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#8bf1e3'
          }}>e</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-400px, -50vw, -800px)', top: 'clamp(280px, 35vh, 560px)',
            opacity: 0.7,
            transform: 'rotate(12deg) scale(0.8)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#8ff3e5'
          }}>r</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-80px, -10vw, -160px)', top: 'clamp(320px, 40vh, 640px)',
            opacity: 0.5,
            transform: 'rotate(-18deg) scale(1.1)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#93f5e6'
          }}>v</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(120px, 15vw, 240px)', top: 'clamp(-100px, -12vh, -200px)',
            opacity: 0.8,
            transform: 'rotate(8deg) scale(0.6)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#97f7e6'
          }}>i</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(-320px, -40vw, -640px)', top: 'clamp(180px, 22vh, 360px)',
            opacity: 0.6,
            transform: 'rotate(-12deg) scale(1.0)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#9af9e6'
          }}>c</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(80px, 10vw, 160px)', top: 'clamp(250px, 31vh, 500px)',
            opacity: 0.7,
            transform: 'rotate(20deg) scale(0.9)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#9dfbe6'
          }}>e</span>
          <span className="scattered-letter inline-block absolute" style={{
            left: 'clamp(280px, 35vw, 560px)', top: 'clamp(-200px, -25vh, -400px)',
            opacity: 0.5,
            transform: 'rotate(-10deg) scale(1.1)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
            transition: 'all 0.3s ease',
            color: '#9face6'
          }}>s</span>
        </>
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40 }}>
        <Header />
      </div>
      <main className="flex-1 flex flex-col md:block">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden min-h-[100svh] flex items-center">
          {/* Blurred gradient background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(-225deg, #D4FFEC 0%, #57F2CC 48%, #4596FB 100%)',
            filter: 'blur(10px)'
          }} />
          <FloatingParticles />
          <FloatingLogos />
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          {/* The ball is now outside hero to avoid clipping while scrolling */}
          <div className="w-full px-8 sm:px-12 lg:px-20 relative z-10">
            <div className="text-left pl-8 sm:pl-16 lg:pl-24 pt-20 sm:pt-28 lg:pt-36">
              <h1 className="mb-4">
                <div
                  ref={weBuildRef}
                  className="text-9xl sm:text-[10rem] lg:text-[13rem] font-bold mb-8 intro-from-right"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px white',
                    textStroke: '2px white',
                    fontWeight: '900',
                    letterSpacing: '-0.02em',
                    willChange: 'transform'
                  }}
                >
                  We build,
                </div>
                <div
                  ref={coolProductsRef}
                  className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white intro-from-left -mt-4"
                  style={{
                    willChange: 'transform',
                    fontWeight: '900',
                    letterSpacing: '-0.02em',
                    animationDelay: '180ms',
                    lineHeight: '0.95'
                  }}
                >
                  Cool & Scalable<br />products
                </div>
              </h1>
            </div>

            {/* Tagline within hero section - split into 3 lines - centered */}
            <div ref={taglineRef} className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full" style={{ pointerEvents: 'none', zIndex: 100 }}>
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight px-4 space-y-1 sm:space-y-2">
                <div
                  ref={taglineLine1Ref}
                  className="opacity-0"
                  style={{ willChange: 'transform' }}
                >
                  Delivering experiences
                </div>
                <div
                  ref={taglineLine2Ref}
                  className="opacity-0"
                  style={{ willChange: 'transform' }}
                >
                  beyond imagination with maximum
                </div>
                <div
                  ref={taglineLine3Ref}
                  className="opacity-0"
                  style={{ willChange: 'transform' }}
                >
                  <span className="wave-text">
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>s</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>p</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>e</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>e</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>d</span>
                  </span>
                  {' '}and{' '}
                  <span className="wave-text">
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>q</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>u</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>a</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>l</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>i</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>t</span>
                    <span className="wave-letter inline-block" style={{ willChange: 'transform' }}>y</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Final text - Let's enjoy - centered and separate */}
            <div
              ref={finalTextRef}
              className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full opacity-0"
              style={{ willChange: 'transform' }}
            >
              <div className="font-bold text-white mx-auto leading-tight px-2 whitespace-nowrap" style={{ fontSize: 'clamp(1.2rem, 5.5vw, 5rem)' }}>
                Let's enjoy immersing ourselves!!
              </div>
            </div>

            {/* White Circle - expands after final text */}
            <div
              ref={whiteCircleRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-50 rounded-full pointer-events-none"
              style={{ willChange: 'transform', scale: 0, zIndex: 9999 }}
            />
          </div>
        </section>

        {/* Transition Section - for scroll-based text gathering and future product animations */}
        <section ref={servicesTitleRef} className="relative bg-gray-50" style={{ minHeight: '400vh' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingParticles />
          </div>
        </section>

        {/* Product Carousel - fixed position below "Our Product" */}
        <ProductCarousel ref={productCarouselRef} />

        {/* Spacer for product cards */}
        <div style={{ height: '0vh' }}></div>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingParticles />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
            <h2 className="text-5xl md:text-6xl font-bold mb-8" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Our Support
            </h2>
            <p className="text-base text-gray-600 mb-12 max-w-2xl">
              {isJapanese
                ? "企業のニーズに合わせた最適なAIソリューションを提供します"
                : "We provide optimal AI solutions tailored to your business needs"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{isJapanese ? "AI研修・コンサルティング" : "AI Training & Consulting"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {isJapanese
                      ? "企業向けのAI人材育成プログラムと、AI導入に関する戦略的コンサルティングを提供。実践的なワークショップも実施。"
                      : "Providing AI talent development programs and strategic consulting for AI implementation. Including practical workshops."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/services")}
                    className="w-full"
                  >
                    {isJapanese ? "さらに詳しく" : "Learn More"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{isJapanese ? "受託開発" : "Contract Development"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {isJapanese
                      ? "お客様の要件に合わせたカスタムソリューションを開発。既存システムとの統合やPOC開発にも対応します。"
                      : "Developing custom solutions tailored to your requirements. Supporting system integration and POC development."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/services")}
                    className="w-full"
                  >
                    {isJapanese ? "さらに詳しく" : "Learn More"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent News Section */}
        <section className="py-20 bg-gray-50 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingParticles />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold" style={{
                  background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {isJapanese ? "最新ニュース" : "Recent News"}
                </h2>
                <p className="text-base text-gray-600 mt-2">
                  {isJapanese ? "最新の情報をお届けします" : "Stay updated with our latest news"}
                </p>
              </div>
              <Link to="/news">
                <Button variant="outline">
                  {isJapanese ? "もっと見る" : "View More"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {latestNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestNews.map((item) => (
                  <Link key={item.id} to={`/news/${item.id}`} className="reveal-on-scroll">
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      {item.thumbnail_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.thumbnail_url} 
                            alt={isJapanese ? item.title_ja : (item.title_en || item.title_ja)}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className={cn(
                              "inline-block px-2 py-1 rounded-full text-xs font-medium",
                              categoryBadges[item.category].color
                            )}
                            style={categoryBadges[item.category].style}
                          >
                            {isJapanese 
                              ? categoryBadges[item.category].ja 
                              : categoryBadges[item.category].en}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {format(new Date(item.date), 'yyyy.MM.dd')}
                          </span>
                        </div>
                        <CardTitle className="line-clamp-2 text-lg">
                          {isJapanese ? item.title_ja : (item.title_en || item.title_ja)}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  {isJapanese ? "ニュースはまだありません" : "No news available yet"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Company Section */}
        <section className="pt-20 bg-gray-50 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <FloatingParticles />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal-on-scroll">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  COMPANY
                </h2>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                  {isJapanese ? "会社概要" : "About Us"}
                </h3>
                <p className="text-base text-gray-600 mb-6">
                  {isJapanese
                    ? "ProtoductAI株式会社は、2025年3月に設立された最先端のAI技術企業です。私たちは、AIソフトウェア開発、AI研修・コンサルティング、受託開発の3つの事業を軸に、お客様のデジタルトランスフォーメーションを支援しています。"
                    : "ProtoductAI Inc. is a cutting-edge AI technology company established in March 2025. We support our customers' digital transformation through three main businesses: AI software development, AI training & consulting, and contract development."}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <Building2 className="h-5 w-5 mr-3 mt-1" style={{ color: '#5a9c11' }} />
                    <div>
                      <p className="text-sm font-semibold">{isJapanese ? "会社名" : "Company Name"}</p>
                      <p className="text-sm text-gray-600">ProtoductAI株式会社</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1" style={{ color: '#0b925b' }} />
                    <div>
                      <p className="text-sm font-semibold">{isJapanese ? "設立" : "Founded"}</p>
                      <p className="text-sm text-gray-600">{isJapanese ? "2025年3月7日" : "March 7, 2025"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 mt-1" style={{ color: '#0c87a7' }} />
                    <div>
                      <p className="text-sm font-semibold">{isJapanese ? "従業員数" : "Employees"}</p>
                      <p className="text-sm text-gray-600">{isJapanese ? "6人（業務委託含む）" : "6 (including contractors)"}</p>
                    </div>
                  </div>
                </div>
                <Link to="/about">
                  <Button
                    className="relative overflow-hidden text-white"
                    style={{
                      background: 'rgba(16, 200, 118, 0.9)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 15px rgba(16, 200, 118, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 200, 118, 1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 200, 118, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(16, 200, 118, 0.9)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 200, 118, 0.4)';
                    }}
                  >
                    {isJapanese ? "詳しく見る" : "Learn More"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative reveal-on-scroll w-full h-[500px]">
                <RotatingText />
              </div>
            </div>

            {/* Contact Button */}
            <div className="flex justify-center pb-20">
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="relative overflow-hidden text-white"
                style={{
                  background: 'linear-gradient(145deg, rgba(16, 200, 118, 0.85), rgba(123, 198, 30, 0.75))',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 20px rgba(16, 200, 118, 0.25), 0 1px 0 rgba(255,255,255,0.2) inset',
                  backdropFilter: 'blur(16px) saturate(1.3)',
                  WebkitBackdropFilter: 'blur(16px) saturate(1.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(16, 200, 118, 0.95), rgba(123, 198, 30, 0.85))';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 200, 118, 0.35), 0 1px 0 rgba(255,255,255,0.3) inset';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(145deg, rgba(16, 200, 118, 0.85), rgba(123, 198, 30, 0.75))';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 200, 118, 0.25), 0 1px 0 rgba(255,255,255,0.2) inset';
                }}
              >
                {isJapanese ? "お問い合わせはこちら" : "Contact Us Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
