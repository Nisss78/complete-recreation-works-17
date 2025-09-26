import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";

export const ProductCarousel = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: products, isLoading } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  
  const visibleItems = extendedProducts.slice(currentIndex, currentIndex + visibleCount);
  
  // 無限ループのためのインデックス計算
  const maxIndex = Math.max(0, extendedProducts.length - visibleCount);
  // 5枚以上またはループするプロダクトがある場合は常にナビゲーション可能
  const canGoPrev = extendedProducts.length >= visibleCount;
  const canGoNext = extendedProducts.length >= visibleCount;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      return newIndex < 0 ? maxIndex : newIndex;
    });
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return newIndex > maxIndex ? 0 : newIndex;
    });
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
    <div ref={ref} className="fixed left-0 w-full pointer-events-none" style={{ top: '30vh', zIndex: 39 }}>
      {/* Cards container */}
      <div className="relative flex items-center justify-center pointer-events-auto" style={{ opacity: 0 }}>
        {/* Left peek card - behind main cards */}
        {visibleItems[0] && (
          // 左のプレビューカードも右側と左右対称になるように位置を調整
          <div className="absolute" style={{ left: '5%', transform: 'scale(0.7)', opacity: 0.6, zIndex: 1 }} data-product-card>
            {(() => {
              const item = visibleItems[0];
              if ('isPlaceholder' in item && item.isPlaceholder) {
                return (
                  <ProductCard
                    key={item.id}
                    ref={el => cardRefs.current[0] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={true}
                    colorIndex={item.colorIndex}
                  />
                );
              }

              const product = item as any;
              const year = new Date(product.created_at).getFullYear().toString();

              return (
                <ProductCard
                  key={product.id || `${product.name}-0`}
                  ref={el => cardRefs.current[0] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={true}
                  colorIndex={item.colorIndex}
                />
              );
            })()}
          </div>
        )}

        {/* Right peek card - behind main cards */}
        {visibleItems[4] && (
          <div className="absolute" style={{ right: '5%', transform: 'scale(0.7)', opacity: 0.6, zIndex: 1 }} data-product-card>
            {(() => {
              const item = visibleItems[4];
              if ('isPlaceholder' in item && item.isPlaceholder) {
                return (
                  <ProductCard
                    key={item.id}
                    ref={el => cardRefs.current[4] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={true}
                    colorIndex={item.colorIndex}
                  />
                );
              }

              const product = item as any;
              const year = new Date(product.created_at).getFullYear().toString();

              return (
                <ProductCard
                  key={product.id || `${product.name}-4`}
                  ref={el => cardRefs.current[4] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={true}
                  colorIndex={item.colorIndex}
                />
              );
            })()}
          </div>
        )}

        {/* Main 3 cards - in front of peek cards */}
        <div className="relative flex items-center justify-center gap-8" style={{ zIndex: 10 }}>
          {visibleItems.slice(1, 4).map((item, index) => {
          
            if ('isPlaceholder' in item && item.isPlaceholder) {
              return (
                <div key={item.id} data-product-card>
                  <ProductCard
                    ref={el => cardRefs.current[index + 1] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={false}
                    colorIndex={item.colorIndex}
                  />
                </div>
              );
            }

            const product = item as any;
            const year = new Date(product.created_at).getFullYear().toString();

            return (
              <div key={product.id || `${product.name}-${index + 1}`} data-product-card>
                <ProductCard
                  ref={el => cardRefs.current[index + 1] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={false}
                  colorIndex={item.colorIndex}
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
            disabled={!canGoPrev}
            className="w-12 h-12 rounded-full bg-black/80 border-2 border-white/80 text-white hover:bg-black/90 hover:border-white shadow-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="w-12 h-12 rounded-full bg-black/80 border-2 border-white/80 text-white hover:bg-black/90 hover:border-white shadow-lg transition-all flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
      </div>
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';
