import React from 'react';
import { StarIcon } from './Icons';

export default function RatingStars({ 
  rating = 0, 
  maxRating = 5, 
  size = "w-4 h-4", 
  interactive = false, 
  onRate = null, 
  showNumber = true,
  count = null 
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[...Array(maxRating)].map((_, i) => {
          const starValue = i + 1;
          const isFilled = rating >= starValue;
          const isHalf = !isFilled && rating >= starValue - 0.5;

          return (
            <button
              type="button"
              key={i}
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starValue)}
              className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'} focus:outline-none`}
            >
              <StarIcon 
                className={`${size} ${isFilled ? 'text-amber-400 fill-amber-400' : isHalf ? 'text-amber-400 fill-amber-200' : 'text-gray-300'}`} 
                filled={isFilled} 
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-gray-700">
          {Number(rating || 0).toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
}
