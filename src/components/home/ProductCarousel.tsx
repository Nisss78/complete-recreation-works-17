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
  
  // デフォルト5枚枠
  const visibleCount = 5;
  // 拡張配列（5以上の場合のみ使用）
  const extendedProducts: any[] = [];
  if (totalProducts >= visibleCount) {
    displayProducts.forEach((product, index) => {
      // 各プロダクトに固定のカラーインデックスを付与（2枚目=index1が緑=0）
      const colorIndex = (index - 1 + 6) % 6;
      extendedProducts.push({ ...product, colorIndex });
    });
  }
  
  // 現在位置から5枚を常に表示（ラップアラウンド）。
  // 5未満のときは重複させずにプレースホルダーで埋める。
  let visibleItems: any[] = [];
  if (totalProducts === 0) {
    visibleItems = Array.from({ length: visibleCount }, (_, i) => ({ isPlaceholder: true, id: `placeholder-${i}`, colorIndex: (i - 1 + 6) % 6 }));
  } else if (totalProducts < visibleCount) {
    // センター寄り（2枚目=index1）から、currentIndex をスロット回転として反映
    // まず全スロットを固定カラーのプレースホルダーで初期化
    visibleItems = Array.from({ length: visibleCount }, (_, i) => ({ isPlaceholder: true, id: `placeholder-${i}`, colorIndex: (i - 1 + 6) % 6 }));
    const startSlot = 1; // 2枚目から
    const baseShift = currentIndex % visibleCount;
    const productStart = totalProducts > 0 ? currentIndex % totalProducts : 0;
    for (let k = 0; k < totalProducts; k++) {
      const slotIndex = (startSlot + baseShift + k) % visibleCount;
      const productIndex = (productStart + k) % totalProducts;
      const colorIndex = (productIndex - 1 + 6) % 6; // プロダクトごとに固定
      visibleItems[slotIndex] = { ...displayProducts[productIndex], colorIndex };
    }
  } else {
    visibleItems = Array.from({ length: visibleCount }, (_, i) => extendedProducts[(currentIndex + i) % extendedProducts.length]);
  }

  // ナビゲーション可否（1件でも回転可能に）
  const canGoPrev = totalProducts >= 1;
  const canGoNext = totalProducts >= 1;

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
      const len = totalProducts >= visibleCount ? extendedProducts.length : visibleCount;
      if (len <= 0) return 0;
      return (prev - 1 + len) % len;
    });
  };

  const handleNext = () => {
    if (!canGoNext || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    flipStateRef.current = Flip.getState('[data-carousel-item]');
    setCurrentIndex(prev => {
      const len = totalProducts >= visibleCount ? extendedProducts.length : visibleCount;
      if (len <= 0) return 0;
      return (prev + 1) % len;
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
                    name={"XXX"}
                    description={"XXX XXX XXX XXX XXX XXX"}
                    icon_url={""}
                    year={"XXXX"}
                    isPlaceholder={true}
                    isBackground={!isMain}
                    colorIndex={(item as any).colorIndex ?? (index - 1 + 6) % 6}
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
                  colorIndex={(product as any).colorIndex ?? (index - 1 + 6) % 6}
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
        style={{ bottom: '12vh', left: '12%', zIndex: 50, opacity: 1 }}
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
