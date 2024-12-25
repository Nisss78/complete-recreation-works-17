import { cn } from "@/lib/utils";

interface AnimatedSquidButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedSquidButton = ({ isBookmarked, onClick, className }: AnimatedSquidButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg border transition-all duration-300",
        isBookmarked ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400",
        className
      )}
    >
      <div className="squid-bookmark relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            className={cn(
              "w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300",
              isBookmarked ? "text-blue-500" : "text-gray-600"
            )}
          >
            {/* イカの体 */}
            <path
              d="M12,4 C15,4 17,6 17,8 C17,10 15,12 12,14 C9,12 7,10 7,8 C7,6 9,4 12,4 Z"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="squid-body"
            />
            {/* イカの触手 */}
            <path
              d="M6,12 C6,14 8,16 12,20 C16,16 18,14 18,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="squid-tentacles"
            />
            {/* 追加の触手 */}
            <path
              d="M9,12 C9,13 10,15 12,17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="squid-tentacle-1"
            />
            <path
              d="M15,12 C15,13 14,15 12,17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="squid-tentacle-2"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
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
            transform: translateY(1px);
          }
        }

        .squid-tentacles {
          animation: tentacle 2s ease-in-out infinite;
        }

        .squid-tentacle-1 {
          animation: tentacle 2.2s ease-in-out infinite;
        }

        .squid-tentacle-2 {
          animation: tentacle 1.8s ease-in-out infinite;
        }

        .squid-body {
          transition: all 0.3s ease;
        }

        button:hover .squid-body {
          transform: scale(1.05);
        }
      `}</style>
    </button>
  );
};