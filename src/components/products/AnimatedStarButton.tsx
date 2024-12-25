import { cn } from "@/lib/utils";

interface AnimatedStarButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedStarButton = ({ isBookmarked, onClick, className }: AnimatedStarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg border transition-all duration-300",
        isBookmarked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400",
        className
      )}
    >
      <div className="squid-bookmark relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300",
              isBookmarked ? "text-blue-500" : "text-gray-600"
            )}
          >
            <path
              d="M12,2 C14,2 16,4 16,6 C16,8 14,10 12,12 C10,10 8,8 8,6 C8,4 10,2 12,2 Z"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4,12 C4,14 8,18 12,22 C16,18 20,14 20,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <style>{`
        .squid-bookmark {
          --primary: rgb(59, 130, 246);
        }

        .squid-bookmark::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: var(--primary);
          opacity: 0;
          transition: opacity 0.3s;
        }

        button:hover .squid-bookmark::before {
          opacity: 0.1;
        }

        button[data-state="checked"] .squid-bookmark::before {
          opacity: 0.15;
        }

        .squid-bookmark::after {
          content: '';
          position: absolute;
          inset: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 35px;
          height: 35px;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0;
        }

        button[data-state="checked"] .squid-bookmark::after {
          animation: ripple 0.6s ease-out;
        }

        @keyframes ripple {
          from {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }

        @keyframes tentacle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(2px);
          }
        }

        .squid-bookmark path:last-child {
          animation: tentacle 2s ease-in-out infinite;
        }
      `}</style>
    </button>
  );
};