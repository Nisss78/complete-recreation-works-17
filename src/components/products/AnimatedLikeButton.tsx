import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface AnimatedLikeButtonProps {
  hasLiked: boolean;
  likes: number;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedLikeButton = ({ hasLiked, likes, onClick, className }: AnimatedLikeButtonProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(hasLiked);
  }, [hasLiked]);

  return (
    <div className={cn("relative", className)}>
      <label className="ui-like cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden" 
          checked={checked}
          onChange={() => {}}
          onClick={onClick}
        />
        <div className="like-button flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-300">
          <ArrowUp className={cn(
            "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300",
            checked ? "text-upvote transform -translate-y-0.5" : "text-gray-700"
          )} />
          <span className={cn(
            "text-sm sm:text-base font-medium transition-all duration-300",
            checked ? "text-upvote" : "text-gray-700"
          )}>
            {likes}
          </span>
        </div>
      </label>

      <style>
        {`
          .ui-like {
            --like-color: rgb(255, 97, 84);
            --icon-anmt-duration: 0.3s;
          }

          .like-button {
            border-color: var(--like-color);
            transform-origin: center;
          }

          .ui-like input:not(:checked) + .like-button {
            border-color: rgb(229, 231, 235);
          }

          .ui-like input:not(:checked) + .like-button:hover {
            border-color: rgb(156, 163, 175);
          }

          .ui-like input:checked + .like-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 35px;
            height: 35px;
            background: var(--like-color);
            border-radius: 50%;
            opacity: 0.15;
            animation: ripple 0.6s ease-out;
          }

          @keyframes ripple {
            from {
              opacity: 0.15;
              transform: translate(-50%, -50%) scale(0);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -50%) scale(2);
            }
          }

          .ui-like input:checked + .like-button {
            animation: pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }

          @keyframes pop {
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </div>
  );
};