import { forwardRef, useState, useRef, useEffect } from "react";
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

gsap.registerPlugin(Flip);

export const ProductCarousel = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: products, isLoading } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animatingRef = useRef(false);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const displayProducts = products || [];
  const totalProducts = displayProducts.length;
  
  // デフォルト5枚表示、5個未満の場合はループして5枚確保
  const visibleCount = 5;
  const extendedProducts = [];
  
  if (totalProducts === 0) {
    // プロダクトがない場合はプレースホルダー5枚
    for (let i = 0; i < visibleCount; i++) {
      extendedProducts.push({ isPlaceholder: true, id: `placeholder-${i}`, colorIndex: i });
    }
  } else if (totalProducts < visibleCount) {
    // 5個未満の場合は繰り返して5枚作る
    for (let i = 0; i < visibleCount; i++) {
      const productIndex = i % totalProducts;
      extendedProducts.push({ ...displayProducts[productIndex], colorIndex: i });
    }
  } else {
    // 5個以上の場合は通常通り
    displayProducts.forEach((product, index) => {
      extendedProducts.push({ ...product, colorIndex: index });
    });
  }
  
  // 現在位置から5枚を常に表示（ラップアラウンド）
  const visibleItems = extendedProducts.length > 0
    ? Array.from({ length: visibleCount }, (_, i) => extendedProducts[(currentIndex + i) % extendedProducts.length])
    : [];

  // ナビゲーション可否（1枚以上あれば回転可能）
  const canGoPrev = extendedProducts.length > 1;
  const canGoNext = extendedProducts.length > 1;

  const runFlip = () => {
    const state = flipStateRef.current;
    if (!state) return;
    flipStateRef.current = null;
    Flip.from(state, {
      absolute: true,
      duration: 0.6,
      ease: 'power3.inOut',
      stagger: 0.02,
      onComplete: () => {
        animatingRef.current = false;
        setIsAnimating(false);
      }
    });
  };

  const handlePrev = () => {
    if (!canGoPrev || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    flipStateRef.current = Flip.getState('[data-carousel-item]');
    setCurrentIndex(prev => {
      if (extendedProducts.length === 0) return 0;
      return (prev - 1 + extendedProducts.length) % extendedProducts.length;
    });
  };

  const handleNext = () => {
    if (!canGoNext || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    flipStateRef.current = Flip.getState('[data-carousel-item]');
    setCurrentIndex(prev => {
      if (extendedProducts.length === 0) return 0;
      return (prev + 1) % extendedProducts.length;
    });
  };

  useEffect(() => {
    if (animatingRef.current && flipStateRef.current) {
      runFlip();
    }
  }, [currentIndex]);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, visibleItems.length);
  }, [visibleItems.length]);

  if (isLoading) {
    return (
      <div ref={ref} className="flex items-center justify-center py-20">
        <div className="text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div ref={ref} className="fixed left-0 w-full pointer-events-none" style={{ top: '30vh', zIndex: 39 }}>
      {/* Cards container unified for Flip */}
      <div ref={rowRef} className="relative flex items-center justify-center pointer-events-auto" style={{ opacity: 0 }}>
        <div className="relative flex items-center justify-center gap-8" style={{ zIndex: 10 }}>
          {visibleItems.map((item, index) => {
            const isMain = index >= 1 && index <= 3;
            const isPeekLeft = index === 0;
            const isPeekRight = index === 4;
            const wrapperStyle: React.CSSProperties = {
              transform: `scale(${isMain ? 1.08 : 0.7})`,
              opacity: isMain ? 1 : 0.6,
              zIndex: isMain ? 20 : 10,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            };
            const commonAttrs = {
              'data-carousel-item': true,
              'data-product-card': true,
              ...(isMain ? { 'data-product-card-main': true } : {}),
              ...(isPeekLeft ? { 'data-product-card-peek': 'left' } : {}),
              ...(isPeekRight ? { 'data-product-card-peek': 'right' } : {}),
            } as any;

            if ('isPlaceholder' in item && item.isPlaceholder) {
              return (
                <div key={item.id} style={wrapperStyle} {...commonAttrs}>
                  <ProductCard
                    ref={el => cardRefs.current[index] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={!isMain}
                    colorIndex={item.colorIndex}
                  />
                </div>
              );
            }

            const product = item as any;
            const year = new Date(product.created_at).getFullYear().toString();

            return (
              <div key={product.id || `${product.name}-${index}`} style={wrapperStyle} {...commonAttrs}>
                <ProductCard
                  ref={el => cardRefs.current[index] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={!isMain}
                  colorIndex={(item as any).colorIndex}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons - simple design */}
      <div 
        data-nav-buttons
        className="fixed flex gap-6 pointer-events-auto"
        style={{ bottom: '12vh', left: '8%', zIndex: 50, opacity: 1 }}
      >
          <button
            onClick={handlePrev}
            disabled={!canGoPrev || isAnimating}
            className="w-12 h-12 rounded-full bg-black/80 border-2 border-white/80 text-white hover:bg-black/90 hover:border-white shadow-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext || isAnimating}
            className="w-12 h-12 rounded-full bg-black/80 border-2 border-white/80 text-white hover:bg-black/90 hover:border-white shadow-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
      </div>
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';
