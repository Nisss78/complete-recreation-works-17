import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface AnimatedLikeButtonProps {
  hasLiked: boolean;
  totalLikes: number;
  onLike: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedLikeButton = ({ 
  hasLiked, 
  totalLikes, 
  onLike,
  className 
}: AnimatedLikeButtonProps) => {
  return (
    <button
      onClick={onLike}
      className={cn(
        "group relative flex items-center gap-1.5 transition-all duration-300",
        "hover:scale-105 active:scale-95",
        hasLiked ? "text-pink-500" : "text-gray-500 hover:text-pink-400",
        className
      )}
    >
      <div className="relative">
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            "group-hover:animate-pulse",
            hasLiked && "fill-current animate-scale-once"
          )}
        />
        {hasLiked && (
          <>
            {/* Glow effect */}
            <div className="absolute -inset-1 animate-ping-once">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Heart className="w-6 h-6 text-pink-300 opacity-50" />
              </div>
            </div>
            
            {/* Particles */}
            <div className="absolute -inset-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-pink-400 rounded-full animate-sparkle"
                  style={{
                    top: `${50 + Math.cos(i * 60 * Math.PI / 180) * 100}%`,
                    left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 100}%`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            
            {/* Rings */}
            <div className="absolute -inset-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border border-pink-400 rounded-full animate-ring-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <span className={cn(
        "text-sm font-medium transition-all duration-300",
        hasLiked ? "text-pink-500" : "text-gray-600"
      )}>
        {totalLikes}
      </span>

      <style>
        {`
        @keyframes scale-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        @keyframes ping-once {
          0% { transform: scale(0.2); opacity: 0.8; }
          80% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1.2); opacity: 0; }
        }

        @keyframes sparkle {
          0% { transform: scale(0) translate(0, 0); opacity: 0; }
          50% { transform: scale(1) translate(-10px, -10px); opacity: 1; }
          100% { transform: scale(0) translate(-20px, -20px); opacity: 0; }
        }

        @keyframes ring-pulse {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .animate-scale-once {
          animation: scale-once 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-ping-once {
          animation: ping-once 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-sparkle {
          animation: sparkle 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-ring-pulse {
          animation: ring-pulse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        `}
      </style>
    </button>
  );
};