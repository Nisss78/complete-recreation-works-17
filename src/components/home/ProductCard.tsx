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
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ name, description, icon_url, year, url, isPlaceholder = false, isBackground = false, colorIndex = 0, className = '' }, ref) => {
    // Color palette: 黄緑、青、紫、赤、オレンジ、黄色
    const colors = [
      '#7bc61e', // 黄緑
      '#3b82f6', // 青
      '#8b5cf6', // 紫
      '#ef4444', // 赤
      '#f97316', // オレンジ
      '#eab308'  // 黄色
    ];
    // Darker variants for stronger gradients on main cards
    const darkColors = [
      '#4d8c12', // 黄緑(濃)
      '#1e40af', // 青(濃)
      '#6d28d9', // 紫(濃)
      '#b91c1c', // 赤(濃)
      '#c2410c', // オレンジ(濃)
      '#a16207'  // 黄色(濃)
    ];

    const handleClick = () => {
      if (url && !isPlaceholder) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    const cardColor = colors[colorIndex % colors.length];
    const darkCardColor = darkColors[colorIndex % darkColors.length];
    const subtleCardColor = colors[colorIndex % colors.length] + '80'; // 背景用の控えめな透明色

    // Fallbacks when product info is missing
    const displayName = isPlaceholder || !name ? 'XXX' : name;
    const displayDescription = isPlaceholder || !description ? 'XXX XXX XXX XXX XXX XXX' : description;
    const displayYear = isPlaceholder || !year ? 'XXXX' : year;
    const hasIcon = !isPlaceholder && !!icon_url;

    return (
      <div
        ref={ref}
        data-product-card
        className={`relative rounded-2xl overflow-hidden ${
          isBackground ? 'opacity-60' : 'opacity-100'
        } ${className}`}
        style={{
          width: '320px',
          height: '380px',
          // Placeholder(XXX)でも黒にせず、通常のカラーパレットを使う
          background: isBackground
            ? `linear-gradient(135deg, ${subtleCardColor} 0%, ${subtleCardColor} 100%)`
            : `linear-gradient(135deg, ${cardColor} 0%, ${darkCardColor} 100%)`,
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
        {/* Year badge */}
        <div className="absolute top-6 right-6 text-white text-xl font-bold opacity-80">
          {displayYear}
        </div>

        {/* Content container */}
        <div className="relative h-full flex flex-col">
          {/* Top section with icon and name */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-4">
              {hasIcon ? (
                <img src={icon_url!} alt={displayName} className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-600" />
              )}
              <h3 className="text-3xl font-bold text-white">
                {displayName}
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
              {displayDescription}
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
