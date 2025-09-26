import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  icon_url: string;
  year: string;
  url?: string | null;
  isPlaceholder?: boolean;
  isBackground?: boolean;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ name, description, icon_url, year, url, isPlaceholder = false, isBackground = false }, ref) => {
    const handleClick = () => {
      if (url && !isPlaceholder) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <div
        ref={ref}
        data-product-card
        className={`relative rounded-2xl overflow-hidden ${
          isBackground ? 'opacity-60' : 'opacity-100'
        }`}
        style={{
          width: '380px',
          height: '450px',
          background: isPlaceholder 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          transform: isBackground ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Year badge */}
        <div className="absolute top-6 right-6 text-white text-xl font-bold opacity-80">
          {isPlaceholder ? 'XXXX' : year}
        </div>

        {/* Content container */}
        <div className="relative h-full flex flex-col">
          {/* Top section with icon and name */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-4">
              {isPlaceholder ? (
                <div className="w-12 h-12 rounded-lg bg-gray-600" />
              ) : (
                <img src={icon_url} alt={name} className="w-12 h-12 rounded-lg object-cover" />
              )}
              <h3 className="text-3xl font-bold text-white">
                {isPlaceholder ? 'XXX' : name}
              </h3>
            </div>
          </div>

          {/* Middle decorative section */}
          <div className="flex-1 relative px-8">
            {!isPlaceholder && (
              <div className="absolute inset-0 opacity-20">
                {/* Decorative graphics - can be customized per product */}
                <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-3xl" />
                <div className="absolute top-1/4 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-2xl" />
              </div>
            )}
          </div>

          {/* Bottom section with description */}
          <div className="px-8 pb-8">
            <p className="text-white text-base mb-6 line-clamp-3">
              {isPlaceholder ? 'XXX XXX XXX XXX XXX XXX' : description}
            </p>

            {/* Visit button */}
            <button
              onClick={handleClick}
              disabled={isPlaceholder || !url}
              className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isPlaceholder || !url
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              VISIT
              <ArrowRight className="w-5 h-5" />
              <ArrowRight className="w-5 h-5 -ml-4" />
              <ArrowRight className="w-5 h-5 -ml-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';