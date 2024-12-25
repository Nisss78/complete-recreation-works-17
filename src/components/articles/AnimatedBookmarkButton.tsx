import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AnimatedBookmarkButtonProps {
  isBookmarked: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const AnimatedBookmarkButton = ({ isBookmarked, onClick, className }: AnimatedBookmarkButtonProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isBookmarked);
  }, [isBookmarked]);

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
          <svg viewBox="0 0 32 32" className="w-5 h-5">
            <g>
              <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
            </g>
          </svg>
        </div>
      </label>

      <style>
        {`
        .ui-bookmark {
          --icon-size: 20px;
          --icon-secondary-color: rgb(148 163 184);
          --icon-hover-color: rgb(100 116 139);
          --icon-primary-color: rgb(59 130 246);
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
          transform-origin: top;
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

        .ui-bookmark input:checked + .bookmark::after {
          animation: circles var(--icon-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--icon-anmt-duration);
        }

        .ui-bookmark input:checked + .bookmark {
          fill: var(--icon-primary-color);
          animation: bookmark var(--icon-anmt-duration) forwards;
          transition-delay: 0.3s;
        }

        .ui-bookmark input:checked + .bookmark::before {
          animation: circle var(--icon-anmt-duration)
            cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: var(--icon-anmt-duration);
        }

        @keyframes bookmark {
          50% {
            transform: scaleY(0.6);
          }
          100% {
            transform: scaleY(1);
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