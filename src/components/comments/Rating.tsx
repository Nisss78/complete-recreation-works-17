import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export const Rating = ({ value, onChange, readonly }: RatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'} ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      ))}
    </div>
  );
};