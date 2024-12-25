import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface AnimatedStarButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedStarButton = ({ isBookmarked, onClick, className }: AnimatedStarButtonProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isBookmarked);
  }, [isBookmarked]);

  return (
    <div className={cn("relative", className)}>
      <label className="ui-star cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden" 
          checked={checked}
          onChange={() => {}}
          onClick={onClick}
        />
        <div className="star-icon">
          <Star className={cn(
            "w-5 h-5 transition-all duration-300",
            checked ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-400"
          )} />
        </div>
      </label>

      <style jsx>{`
        .ui-star {
          --icon-size: 20px;
          --icon-color: rgb(234 179 8);
          --icon-circle-border: 1px solid var(--icon-color);
          --icon-circle-size: 35px;
          --icon-anmt-duration: 0.3s;
        }

        .star-icon {
          width: var(--icon-size);
          height: auto;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transform-origin: center;
        }

        .star-icon::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          box-shadow: 0 30px 0 -4px var(--icon-color),
            30px 0 0 -4px var(--icon-color),
            0 -30px 0 -4px var(--icon-color),
            -30px 0 0 -4px var(--icon-color),
            -22px 22px 0 -4px var(--icon-color),
            -22px -22px 0 -4px var(--icon-color),
            22px -22px 0 -4px var(--icon-color),
            22px 22px 0 -4px var(--icon-color);
          border-radius: 50%;
          transform: scale(0);
        }

        .ui-star input:checked + .star-icon::after {
          animation: sparkles var(--icon-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--icon-anmt-duration);
        }

        .ui-star input:checked + .star-icon {
          animation: bounce var(--icon-anmt-duration) forwards;
          transition-delay: 0.3s;
        }

        @keyframes sparkles {
          from {
            transform: scale(0);
          }
          40% {
            opacity: 1;
          }
          to {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        @keyframes bounce {
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};