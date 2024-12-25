import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedLikeButtonProps {
  hasLiked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedLikeButton = ({ hasLiked, onClick, className }: AnimatedLikeButtonProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(hasLiked);
  }, [hasLiked]);

  return (
    <div className={cn("relative", className)}>
      <label className="ui-bookmark cursor-pointer">
        <input 
          type="checkbox" 
          className="hidden" 
          checked={checked}
          onChange={() => {}}
          onClick={onClick}
        />
        <div className="bookmark">
          <svg viewBox="0 0 16 16" className="w-5 h-5">
            <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" fillRule="evenodd" />
          </svg>
        </div>
      </label>

      <style>
        {`
        .ui-bookmark {
          --icon-size: 20px;
          --icon-secondary-color: rgb(203 213 225);
          --icon-hover-color: rgb(244 63 94);
          --icon-primary-color: rgb(244 63 94);
          --icon-circle-border: 1px solid var(--icon-primary-color);
          --icon-circle-size: 35px;
          --icon-anmt-duration: 0.3s;
        }

        .bookmark {
          width: var(--icon-size);
          height: auto;
          fill: var(--icon-secondary-color);
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          transform-origin: center;
        }

        .bookmark::after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          box-shadow: 0 30px 0 -4px var(--icon-primary-color),
            30px 0 0 -4px var(--icon-primary-color),
            0 -30px 0 -4px var(--icon-primary-color),
            -30px 0 0 -4px var(--icon-primary-color),
            -22px 22px 0 -4px var(--icon-primary-color),
            -22px -22px 0 -4px var(--icon-primary-color),
            22px -22px 0 -4px var(--icon-primary-color),
            22px 22px 0 -4px var(--icon-primary-color);
          border-radius: 50%;
          transform: scale(0);
        }

        .bookmark::before {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: var(--icon-circle-border);
          opacity: 0;
        }

        .ui-bookmark:hover .bookmark {
          fill: var(--icon-hover-color);
        }

        .ui-bookmark input:checked + .bookmark {
          fill: var(--icon-primary-color);
          animation: bookmark var(--icon-anmt-duration) forwards;
          transition-delay: 0.3s;
        }

        .ui-bookmark input:checked + .bookmark::after {
          animation: circles var(--icon-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--icon-anmt-duration);
        }

        .ui-bookmark input:checked + .bookmark::before {
          animation: circle var(--icon-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--icon-anmt-duration);
        }

        @keyframes bookmark {
          50% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes circle {
          from {
            width: 0;
            height: 0;
            opacity: 0;
          }
          90% {
            width: var(--icon-circle-size);
            height: var(--icon-circle-size);
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes circles {
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
      `}
      </style>
    </div>
  );
};