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
    if (canGoPrev) {
      setCurrentIndex(prev => Math.max(0, prev - 4));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => Math.min(allItems.length - 4, prev + 4));
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
    <div ref={ref} className="fixed left-0 w-full pointer-events-none" style={{ top: '45vh', zIndex: 39 }}>
      {/* Cards container */}
      <div className="flex items-center justify-center gap-8 px-20 pointer-events-auto">
        {visibleItems.map((item, index) => {
          const isBackground = index === 3;
          
          if ('isPlaceholder' in item && item.isPlaceholder) {
            return (
              <ProductCard
                key={item.id}
                ref={el => cardRefs.current[index] = el}
                name="XXX"
                description="XXX XXX XXX XXX XXX XXX"
                icon_url=""
                year="XXXX"
                isPlaceholder={true}
                isBackground={isBackground}
              />
            );
          }

          const product = item as any;
          const year = new Date(product.created_at).getFullYear().toString();

          return (
            <ProductCard
              key={product.id}
              ref={el => cardRefs.current[index] = el}
              name={product.name}
              description={product.description}
              icon_url={product.icon_url}
              year={year}
              url={product.URL}
              isBackground={isBackground}
            />
          );
        })}
      </div>

      {/* Navigation buttons - only show if more than 4 items */}
      {allItems.length > 4 && (
        <div 
          data-nav-buttons
          className="fixed left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto"
          style={{ bottom: '10vh', zIndex: 39 }}
        >
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`p-4 rounded-lg border-2 transition-all ${
              canGoPrev
                ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
            <ChevronLeft className="w-6 h-6 -ml-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`p-4 rounded-lg border-2 transition-all ${
              canGoNext
                ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                : 'border-gray-300 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
            <ChevronRight className="w-6 h-6 -ml-4" />
          </button>
        </div>
      )}
    </div>
  );
});

ProductCarousel.displayName = 'ProductCarousel';