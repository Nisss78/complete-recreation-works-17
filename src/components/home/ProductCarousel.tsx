import { forwardRef, useState, useRef, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export const ProductCarousel = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: products, isLoading } = useProducts();
  const currentIndex = 0; // Static index for seamless loop system
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animatingRef = useRef(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const displayProducts = products || [];
  const totalProducts = displayProducts.length;

  // 5枚表示（左ピーク1 + メイン3 + 右ピーク1）
  const visibleCount = 5;

  // プロダクト順に基づく色
  const productColorIndex = (orderIndex: number) => {
    const cycle = [0, 1, 2, 3, 4, 5]; // 黄緑, 青, 紫, 赤, オレンジ, 黄色
    return cycle[orderIndex % cycle.length];
  };

  // 拡張配列（循環用）
  const extendedProducts: Array<any & { __orderIndex?: number }> = [];
  if (totalProducts > 0) {
    displayProducts.forEach((product, index) => {
      extendedProducts.push({ ...product, __orderIndex: index });
    });
  }

  // 現在位置から5枚を常に表示（ラップアラウンド）
  let visibleItems: any[] = [];
  const startSlot = 1;
  const baseShift = currentIndex % visibleCount;

  if (totalProducts === 0) {
    visibleItems = Array.from({ length: visibleCount }, () => ({} as any));
    for (let k = 0; k < visibleCount; k++) {
      const slotIndex = (startSlot + baseShift + k) % visibleCount;
      const colorIndex = productColorIndex(k);
      visibleItems[slotIndex] = { isPlaceholder: true, id: `placeholder-${slotIndex}`, colorIndex };
    }
  } else if (totalProducts < visibleCount) {
    visibleItems = Array.from({ length: visibleCount }, () => ({} as any));
    const productStart = currentIndex % totalProducts;
    for (let k = 0; k < visibleCount; k++) {
      const slotIndex = (startSlot + baseShift + k) % visibleCount;
      const colorIndex = productColorIndex(productStart + k);
      if (k < totalProducts) {
        const productIndex = (productStart + k) % totalProducts;
        visibleItems[slotIndex] = { ...displayProducts[productIndex], colorIndex, __orderIndex: productIndex };
      } else {
        visibleItems[slotIndex] = { isPlaceholder: true, id: `placeholder-${slotIndex}`, colorIndex };
      }
    }
  } else {
    visibleItems = Array.from({ length: visibleCount }, (_, i) => {
      const item = extendedProducts[(currentIndex + i) % extendedProducts.length] as any;
      const orderIdx = item.__orderIndex ?? 0;
      const colorIndex = productColorIndex(orderIdx);
      return { ...item, colorIndex };
    });
  }

  const canGoPrev = totalProducts >= 1;
  const canGoNext = totalProducts >= 1;

  const handlePrev = () => {
    if (!canGoPrev || animatingRef.current) return;

    console.log('[ProductCarousel] Prev button clicked');
    console.log('[ProductCarousel] scrubTo exists:', !!window.productCarouselScrubTo);
    console.log('[ProductCarousel] scrubTween exists:', !!window.productCarouselScrubTween?.current);

    animatingRef.current = true;
    setIsAnimating(true);

    // Use global scrubTo function
    if (window.productCarouselScrubTo && window.productCarouselScrubTween?.current) {
      const spacing = 0.1;
      const currentTime = window.productCarouselScrubTween.current.vars.totalTime || 0;
      console.log('[ProductCarousel] Current time:', currentTime, 'Target:', currentTime - spacing);
      window.productCarouselScrubTo(currentTime - spacing);
    } else {
      console.warn('[ProductCarousel] Seamless loop not initialized yet');
    }

    setTimeout(() => {
      animatingRef.current = false;
      setIsAnimating(false);
    }, 600);
  };

  const handleNext = () => {
    if (!canGoNext || animatingRef.current) return;

    console.log('[ProductCarousel] Next button clicked');
    console.log('[ProductCarousel] scrubTo exists:', !!window.productCarouselScrubTo);
    console.log('[ProductCarousel] scrubTween exists:', !!window.productCarouselScrubTween?.current);

    animatingRef.current = true;
    setIsAnimating(true);

    // Use global scrubTo function
    if (window.productCarouselScrubTo && window.productCarouselScrubTween?.current) {
      const spacing = 0.1;
      const currentTime = window.productCarouselScrubTween.current.vars.totalTime || 0;
      console.log('[ProductCarousel] Current time:', currentTime, 'Target:', currentTime + spacing);
      window.productCarouselScrubTo(currentTime + spacing);
    } else {
      console.warn('[ProductCarousel] Seamless loop not initialized yet');
    }

    setTimeout(() => {
      animatingRef.current = false;
      setIsAnimating(false);
    }, 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrev();
      }
    }
  };

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
    <>
      <div
        ref={ref}
        className="fixed left-0 w-full pointer-events-none md:pointer-events-none"
        style={{ top: '30vh', zIndex: 39, visibility: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards container */}
        <div ref={rowRef} className="relative flex items-center justify-center" style={{ opacity: 0, pointerEvents: 'auto', visibility: 'hidden' }}>
          <div className="relative flex items-center justify-center gap-12" style={{ zIndex: 10 }}>
            {visibleItems.map((item, index) => {
              const isMain = index >= 1 && index <= 3;
              const isPeekLeft = index === 0;
              const isPeekRight = index === 4;

              const wrapperStyle: React.CSSProperties = {
                transform: `scale(${isMain ? 1.08 : 0.7})`,
                opacity: isMain ? 1 : 0.6,
                zIndex: isMain ? 20 : 10,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                pointerEvents: 'auto',
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
                      colorIndex={item.colorIndex}
                      cardNumber={index === 1 ? 1 : ((index + 4) % 5) + 1}
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
                    colorIndex={product.colorIndex}
                    cardNumber={index === 1 ? 1 : ((index + 4) % 5) + 1}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </>
  );
});

ProductCarousel.displayName = 'ProductCarousel';