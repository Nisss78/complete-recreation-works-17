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
import { useEffect, useRef } from "react";

// GSAP types
type GSAPTimeline = {
  kill: () => void;
};

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
  const contactButtonRef = useRef<HTMLDivElement | null>(null);
  const taglineRef = useRef<HTMLHeadingElement | null>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);
  const refreshHandlerRef = useRef<(() => void) | null>(null);
  
  // Get latest 3 news items
  const latestNews = newsItems?.slice(0, 3) || [];

  const categoryBadges = {
    announcement: { ja: "お知らせ", en: "Announcement", color: "text-white", style: { backgroundColor: '#10c876' } },
    event: { ja: "イベント", en: "Event", color: "text-white", style: { backgroundColor: '#7bc61e' } },
    media: { ja: "メディア", en: "Media", color: "text-white", style: { backgroundColor: '#15b8e5' } },
    other: { ja: "その他", en: "Other", color: "bg-gray-500 text-white", style: {} },
  };

  useEffect(() => {
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
          
          // Adjust animation values for different screen sizes
          const weBuildX = isMobile ? -80 : isTablet ? -140 : -200;
          const coolProductsX = isMobile ? 60 : isTablet ? 100 : 150;
          const contactButtonX = isMobile ? -20 : isTablet ? -35 : -50;
          const taglineY = isMobile ? { from: 50, to: -25 } : isTablet ? { from: 75, to: -35 } : { from: 100, to: -50 };

          // Hero text parallax animations
          if (weBuildRef.current) {
            gsap.to(weBuildRef.current, {
              x: weBuildX,
              ease: 'none',
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                invalidateOnRefresh: true,
              }
            });
          }

          if (coolProductsRef.current) {
            gsap.to(coolProductsRef.current, {
              x: coolProductsX,
              ease: 'none',
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                invalidateOnRefresh: true,
              }
            });
          }

          if (contactButtonRef.current) {
            gsap.to(contactButtonRef.current, {
              x: contactButtonX,
              ease: 'none',
              scrollTrigger: {
                trigger: heroRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                invalidateOnRefresh: true,
              }
            });
          }

          // Tagline rise-up animation with responsive values
          if (taglineRef.current) {
            gsap.fromTo(taglineRef.current, {
              y: taglineY.from,
              opacity: 0.3,
            }, {
              y: taglineY.to,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: taglineRef.current,
                start: 'top bottom',
                end: 'bottom center',
                scrub: 1,
                invalidateOnRefresh: true,
              }
            });
          }

          // Fade & slide-up for items marked with .reveal-on-scroll
          if (mainRef.current) {
            const items = mainRef.current.querySelectorAll('.reveal-on-scroll');
            items.forEach((el, i) => {
              gsap.from(el, {
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
          ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 150, // Throttle scroll events for better performance
            ignoreMobileResize: true, // Don't recalculate on mobile keyboard show/hide
          });
        }, mainRef);
        cleanup = () => {
          timelineRef.current?.kill();
          // @ts-expect-error - ScrollTrigger removeEventListener not typed but exists
          if (refreshHandlerRef.current) ScrollTrigger.removeEventListener('refreshInit', refreshHandlerRef.current);
          ctx.revert();
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
      {/* Rolling ball overlay across the whole page */}
      <div ref={ballRef} className="pointer-events-none absolute z-30 size-4 sm:size-5 rounded-full" style={{
        background: 'radial-gradient(circle at 35% 35%, #ffffff, rgba(255,255,255,0.15))',
        boxShadow: '0 6px 22px rgba(0,0,0,0.25), 0 0 18px rgba(255,255,255,0.5)'
      }} />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden min-h-[100svh] flex items-center" style={{
          background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)'
        }}>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
          {/* The ball is now outside hero to avoid clipping while scrolling */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-left">
              <h1 className="reveal-on-scroll mb-4">
                <div 
                  ref={weBuildRef}
                  className="text-6xl sm:text-8xl lg:text-9xl font-bold mb-2"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px white',
                    textStroke: '2px white',
                    willChange: 'transform'
                  }}
                >
                  We build,
                </div>
                <div 
                  ref={coolProductsRef}
                  className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white"
                  style={{ willChange: 'transform' }}
                >
                  Cool & Scalable products
                </div>
              </h1>
              <div ref={contactButtonRef} className="flex flex-col sm:flex-row gap-4 mb-16 reveal-on-scroll" style={{ willChange: 'transform' }}>
                <Button
                  size="lg"
                  onClick={() => navigate("/contact")}
                  className="bg-white hover:bg-gray-100 w-fit"
                  style={{ color: '#0b925b' }}
                >
                  {isJapanese ? "お問い合わせ" : "Contact Us"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tagline Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center reveal-on-scroll">
              <h2 
                ref={taglineRef}
                className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight"
                style={{ willChange: 'transform' }}
              >
                Delivering experiences beyond imagination with maximum speed and quality
              </h2>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
              {isJapanese ? "私たちのサービス" : "Our Services"}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {isJapanese 
                ? "企業のニーズに合わせた最適なAIソリューションを提供します"
                : "We provide optimal AI solutions tailored to your business needs"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow reveal-on-scroll">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(123, 198, 30, 0.15)' }}>
                    <Code className="h-6 w-6" style={{ color: '#7bc61e' }} />
                  </div>
                  <CardTitle>{isJapanese ? "AIソフトウェア開発" : "AI Software Development"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese
                      ? "機械学習、深層学習を活用した最先端のAIソリューションを開発します。自然言語処理、画像認識、予測分析など、幅広い分野に対応。"
                      : "We develop cutting-edge AI solutions using machine learning and deep learning. Supporting various fields including NLP, image recognition, and predictive analytics."}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow reveal-on-scroll">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(16, 200, 118, 0.15)' }}>
                    <GraduationCap className="h-6 w-6" style={{ color: '#10c876' }} />
                  </div>
                  <CardTitle>{isJapanese ? "AI研修・コンサルティング" : "AI Training & Consulting"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese
                      ? "企業向けのAI人材育成プログラムと、AI導入に関する戦略的コンサルティングを提供。実践的なワークショップも実施。"
                      : "Providing AI talent development programs and strategic consulting for AI implementation. Including practical workshops."}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow reveal-on-scroll">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(21, 184, 229, 0.15)' }}>
                    <Briefcase className="h-6 w-6" style={{ color: '#15b8e5' }} />
                  </div>
                  <CardTitle>{isJapanese ? "受託開発" : "Contract Development"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {isJapanese
                      ? "お客様の要件に合わせたカスタムソリューションを開発。既存システムとの統合やPOC開発にも対応します。"
                      : "Developing custom solutions tailored to your requirements. Supporting system integration and POC development."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Recent News Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {isJapanese ? "最新ニュース" : "Recent News"}
                </h2>
                <p className="text-gray-600 mt-2">
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="reveal-on-scroll">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  COMPANY
                </h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {isJapanese ? "会社概要" : "About Us"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isJapanese
                    ? "ProtoductAI株式会社は、2025年3月に設立された最先端のAI技術企業です。私たちは、AIソフトウェア開発、AI研修・コンサルティング、受託開発の3つの事業を軸に、お客様のデジタルトランスフォーメーションを支援しています。"
                    : "ProtoductAI Inc. is a cutting-edge AI technology company established in March 2025. We support our customers' digital transformation through three main businesses: AI software development, AI training & consulting, and contract development."}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-start">
                    <Building2 className="h-5 w-5 mr-3 mt-1" style={{ color: '#5a9c11' }} />
                    <div>
                      <p className="font-semibold">{isJapanese ? "会社名" : "Company Name"}</p>
                      <p className="text-gray-600">ProtoductAI株式会社</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="h-5 w-5 mr-3 mt-1" style={{ color: '#0b925b' }} />
                    <div>
                      <p className="font-semibold">{isJapanese ? "設立" : "Founded"}</p>
                      <p className="text-gray-600">{isJapanese ? "2025年3月7日" : "March 7, 2025"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 mt-1" style={{ color: '#0c87a7' }} />
                    <div>
                      <p className="font-semibold">{isJapanese ? "従業員数" : "Employees"}</p>
                      <p className="text-gray-600">{isJapanese ? "6人（業務委託含む）" : "6 (including contractors)"}</p>
                    </div>
                  </div>
                </div>
                <Link to="/about">
                  <Button 
                    className="text-white"
                    style={{ 
                      backgroundColor: '#0b925b',
                      ':hover': { backgroundColor: '#0a7a4d' }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a7a4d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0b925b'}
                  >
                    {isJapanese ? "詳しく見る" : "Learn More"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative reveal-on-scroll">
                <div className="absolute inset-0 rounded-2xl transform rotate-3" style={{
                  background: 'linear-gradient(to bottom right, rgba(90, 156, 17, 0.1), rgba(11, 146, 91, 0.1), rgba(12, 135, 167, 0.1))'
                }}></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-20 rounded-lg mt-6" style={{
                      background: 'linear-gradient(to bottom right, rgba(90, 156, 17, 0.05), rgba(11, 146, 91, 0.05), rgba(12, 135, 167, 0.05))'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 reveal-on-scroll">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isJapanese ? "AIで未来を創造しよう" : "Create the Future with AI"}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {isJapanese 
                ? "お客様のビジネス課題を、最先端のAI技術で解決します"
                : "Solving your business challenges with cutting-edge AI technology"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/contact")}
                className="text-white"
                style={{ 
                  backgroundColor: '#0b925b'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a7a4d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0b925b'}
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
