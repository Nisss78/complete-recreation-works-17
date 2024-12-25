import React from 'react';
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
        "group relative flex items-center gap-1.5 transition-all",
        "focus:outline-none",
        className
      )}
    >
      <div className="relative">
        <div className={cn(
          "like-button-box relative p-2 rounded-md transition-all duration-300",
          "border-2 border-gray-200 dark:border-gray-700",
          "hover:scale-110",
          hasLiked && [
            "border-primary bg-primary/10",
            "dark:border-primary dark:bg-primary/20"
          ]
        )}>
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              hasLiked ? [
                "fill-primary stroke-primary",
                "dark:fill-primary dark:stroke-primary",
                "animate-scale-once"
              ] : [
                "stroke-gray-500",
                "dark:stroke-gray-400",
                "group-hover:stroke-primary",
                "dark:group-hover:stroke-primary"
              ]
            )}
          />
          
          {/* グローエフェクト */}
          <div className={cn(
            "absolute inset-0 rounded-md bg-primary/20 opacity-0 blur-md transition-opacity duration-300",
            hasLiked && "opacity-100"
          )} />

          {/* パーティクルエフェクト */}
          {hasLiked && (
            <>
              <div className="absolute inset-0">
                <div className="particles">
                  {[...Array(12)].map((_, i) => (
                    <span
                      key={i}
                      className="particle bg-primary"
                      style={{
                        '--delay': `${i * 0.1}s`,
                        '--angle': `${i * 30}deg`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
              <div className="rings">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-ring-pulse absolute inset-0 rounded-full border border-primary"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <span className={cn(
        "text-sm font-medium transition-colors",
        hasLiked ? "text-primary" : "text-gray-500 dark:text-gray-400"
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

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: particle-fly 0.6s ease-out forwards;
          opacity: 0;
          box-shadow: 0 0 6px var(--primary);
        }

        @keyframes particle-fly {
          0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(20px) scale(0);
            opacity: 0;
          }
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ring-pulse {
          animation: ring-pulse 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        `}
      </style>
    </button>
  );
};