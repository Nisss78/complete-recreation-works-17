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
  colorIndex?: number;
  className?: string;
  cardNumber?: number;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ name, description, icon_url, year, url, isPlaceholder = false, isBackground = false, colorIndex = 0, className = '', cardNumber }, ref) => {
    // Custom gradient palette
    const gradients = [
      'linear-gradient(to top, #37ecba 0%, #72afd3 100%)',
      'linear-gradient(to top, #ebbba7 0%, #cfc7f8 100%)',
      'linear-gradient(to top, #9795f0 0%, #fbc8d4 100%)',
      'linear-gradient(to top, #d9afd9 0%, #97d9e1 100%)',
      'linear-gradient(-20deg, #ddd6f3 0%, #faaca8 100%, #faaca8 100%)',
      'linear-gradient(to top, #d5dee7 0%, #ffafbd 0%, #c9ffbf 100%)'
    ];

    // Background versions (more subtle for peek cards)
    const backgroundGradients = [
      'linear-gradient(to top, rgba(55, 236, 186, 0.6) 0%, rgba(114, 175, 211, 0.6) 100%)',
      'linear-gradient(to top, rgba(235, 187, 167, 0.6) 0%, rgba(207, 199, 248, 0.6) 100%)',
      'linear-gradient(to top, rgba(151, 149, 240, 0.6) 0%, rgba(251, 200, 212, 0.6) 100%)',
      'linear-gradient(to top, rgba(217, 175, 217, 0.6) 0%, rgba(151, 217, 225, 0.6) 100%)',
      'linear-gradient(-20deg, rgba(221, 214, 243, 0.6) 0%, rgba(250, 172, 168, 0.6) 100%, rgba(250, 172, 168, 0.6) 100%)',
      'linear-gradient(to top, rgba(213, 222, 231, 0.6) 0%, rgba(255, 175, 189, 0.6) 0%, rgba(201, 255, 191, 0.6) 100%)'
    ];

    const handleClick = () => {
      if (url && !isPlaceholder) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    const cardGradient = gradients[colorIndex % gradients.length];
    const backgroundGradient = backgroundGradients[colorIndex % backgroundGradients.length];

    // Fallbacks when product info is missing
    const displayName = isPlaceholder || !name ? 'XXX' : name;
    const displayDescription = isPlaceholder || !description ? 'XXX XXX XXX XXX XXX XXX' : description;
    const displayYear = isPlaceholder || !year ? 'XXXX' : year;
    const hasIcon = !isPlaceholder && !!icon_url;

    return (
      <div
        ref={ref}
        data-product-card
        className={`relative overflow-hidden border-2 border-black rounded ${
          isBackground ? 'opacity-60' : 'opacity-100'
        } ${className}`}
        style={{
          width: 'clamp(240px, 75vw, 280px)',
          height: 'clamp(290px, 75vw * 1.19, 330px)',
          // Use custom gradients
          background: isBackground ? backgroundGradient : cardGradient,
          // Transform scale is controlled by carousel wrappers (avoid double scaling)
          transform: 'scale(1)',
          transition: 'transform 0.3s ease',
          // Make main cards feel richer; background ones stay subtle
          filter: isBackground ? 'saturate(0.95) brightness(0.98)' : 'saturate(1.15) contrast(1.05)',
          boxShadow: isBackground
            ? '0 8px 24px rgba(0,0,0,0.15)'
            : '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        {/* Large transparent card number in background - positioned absolutely from card root */}
        {cardNumber && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
            <span
              className="text-gray-800 font-black select-none pointer-events-none"
              style={{
                fontFamily: '"Stencil", "Impact", "Arial Black", sans-serif',
                fontWeight: '900',
                fontSize: '16rem',
                opacity: '0.06',
                letterSpacing: '0.1em',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scaleY(1.2)'
              }}
            >
              {cardNumber.toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Year badge in rectangle - positioned to avoid title overlap */}
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 px-2.5 py-1">
            <span className="text-gray-800 text-sm font-bold">
              {displayYear}
            </span>
          </div>
        </div>

        {/* Fixed position divider lines - frame to frame */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main horizontal divider line after title area - frame to frame */}
          <div className="absolute left-0 right-0 h-0.5 bg-black bg-opacity-40" style={{ top: '30%' }} />


          {/* Corner decorative elements - same thickness as main lines */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white bg-opacity-50" />
          <div className="absolute top-4 right-4 w-2 h-2 bg-white bg-opacity-50" />
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-white bg-opacity-50" />
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-white bg-opacity-50" />

          {/* Additional accent lines */}
          <div className="absolute left-6 right-6 h-px bg-white bg-opacity-30" style={{ top: '40%' }} />
          <div className="absolute left-6 right-6 h-px bg-white bg-opacity-30" style={{ top: '60%' }} />

          {/* Central cross grid */}
          <div className="absolute top-8 bottom-8 left-1/2 w-px bg-white bg-opacity-15" />
          <div className="absolute left-8 right-8 top-1/2 h-px bg-white bg-opacity-15" />
        </div>

        {/* Content container */}
        <div className="relative h-full flex flex-col">
          {/* Top section with icon and name */}
          <div className="px-8 pt-12 pb-6">
            <div className="flex items-center gap-4">
              {hasIcon ? (
                <img src={icon_url!} alt={displayName} className="w-12 h-12 object-cover rounded-lg" />
              ) : (
                <div className="w-12 h-12 bg-gray-600 rounded-lg" />
              )}
              <h3 className="text-3xl font-bold text-gray-800">
                {displayName}
              </h3>
            </div>
          </div>

          {/* Middle decorative section */}
          <div className="flex-1 relative px-8">

          </div>

          {/* Bottom section with description */}
          <div className="px-8 pb-8">
            <p className="text-gray-800 text-base mb-6 line-clamp-3">
              {displayDescription}
            </p>

            {/* Visit button with rectangle border */}
            <button
              onClick={handleClick}
              disabled={isPlaceholder || !url}
              className={`w-full py-3 px-6 font-semibold border-2 border-gray-800 border-opacity-50 flex items-center justify-center gap-2 transition-all ${
                isPlaceholder || !url
                  ? 'bg-gray-700 bg-opacity-50 text-gray-400 cursor-not-allowed border-gray-600'
                  : 'bg-white bg-opacity-20 backdrop-blur-sm text-gray-800 hover:bg-opacity-30'
              }`}
            >
              VISIT
              <span className="ml-2 tracking-wider font-mono text-lg">›››</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';
