import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBookmarkProps extends React.HTMLAttributes<HTMLLabelElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const AnimatedBookmark = React.forwardRef<HTMLLabelElement, AnimatedBookmarkProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("ui-bookmark inline-flex items-center justify-center", className)}
        {...props}
      >
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
        <div className="bookmark">
          <svg viewBox="0 0 32 32" className="w-6 h-6">
            <g>
              <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z" />
            </g>
          </svg>
        </div>

        <style jsx>{`
          .ui-bookmark {
            --icon-size: 24px;
            --icon-secondary-color: rgb(77, 77, 77);
            --icon-hover-color: rgb(97, 97, 97);
            --icon-primary-color: #4F46E5;
            --icon-primary-gradient: linear-gradient(225deg, #6366F1 0%, #4F46E5 100%);
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
            box-shadow: 
              0 30px 0 -4px #6366F1,
              30px 0 0 -4px #4F46E5,
              0 -30px 0 -4px #6366F1,
              -30px 0 0 -4px #4F46E5,
              -22px 22px 0 -4px #6366F1,
              -22px -22px 0 -4px #4F46E5,
              22px -22px 0 -4px #6366F1,
              22px 22px 0 -4px #4F46E5;
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

          input:checked + .bookmark::after {
            animation: circles var(--icon-anmt-duration) cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            animation-delay: var(--icon-anmt-duration);
          }

          input:checked + .bookmark {
            fill: url(#bookmark-gradient);
            animation: bookmark var(--icon-anmt-duration) forwards;
            transition-delay: 0.3s;
          }

          input:checked + .bookmark::before {
            animation: circle var(--icon-anmt-duration) cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
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
        `}</style>
        
        <svg width="0" height="0">
          <defs>
            <linearGradient id="bookmark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#6366F1' }} />
              <stop offset="100%" style={{ stopColor: '#4F46E5' }} />
            </linearGradient>
          </defs>
        </svg>
      </label>
    );
  }
);

AnimatedBookmark.displayName = "AnimatedBookmark";