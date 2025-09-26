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
  
  const placeholderCount = Math.max(0, 4 - totalProducts);
  const placeholders = Array(placeholderCount).fill(null);
  
  const allItems = [...displayProducts, ...placeholders.map((_, i) => ({ isPlaceholder: true, id: `placeholder-${i}` }))];
  
  const visibleItems = allItems.slice(currentIndex, currentIndex + 4);
  
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + 4 < allItems.length;

  const handlePrev = () => {
    setCurrentIndex(prev => {
      const newIndex = prev - 1;
      return newIndex < 0 ? allItems.length - 4 : newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      return newIndex > allItems.length - 4 ? 0 : newIndex;
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
        {/* Main 3 cards */}
        <div className="flex items-center justify-center gap-8">
          {visibleItems.slice(0, 3).map((item, index) => {
          
            if ('isPlaceholder' in item && item.isPlaceholder) {
              return (
                <div key={item.id} data-product-card>
                  <ProductCard
                    ref={el => cardRefs.current[index] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={false}
                  />
                </div>
              );
            }

            const product = item as any;
            const year = new Date(product.created_at).getFullYear().toString();

            return (
              <div key={product.id} data-product-card>
                <ProductCard
                  ref={el => cardRefs.current[index] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={false}
                />
              </div>
            );
          })}
        </div>
        
        {/* 4th card - positioned on the right side, overlapping */}
        {visibleItems[3] && (
          <div className="absolute" style={{ right: '8%', transform: 'scale(0.7)', opacity: 0.6, zIndex: 1 }} data-product-card>
            {(() => {
              const item = visibleItems[3];
              if ('isPlaceholder' in item && item.isPlaceholder) {
                return (
                  <ProductCard
                    key={item.id}
                    ref={el => cardRefs.current[3] = el}
                    name="XXX"
                    description="XXX XXX XXX XXX XXX XXX"
                    icon_url=""
                    year="XXXX"
                    isPlaceholder={true}
                    isBackground={true}
                  />
                );
              }

              const product = item as any;
              const year = new Date(product.created_at).getFullYear().toString();

              return (
                <ProductCard
                  key={product.id}
                  ref={el => cardRefs.current[3] = el}
                  name={product.name}
                  description={product.description}
                  icon_url={product.icon_url}
                  year={year}
                  url={product.URL}
                  isBackground={true}
                />
              );
            })()}
          </div>
        )}
      </div>

      {/* Navigation buttons - simple design */}
      <div 
        data-nav-buttons
        className="fixed flex gap-6 pointer-events-auto"
        style={{ bottom: '12vh', left: '8%', zIndex: 39 }}
      >
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
      </div>
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';