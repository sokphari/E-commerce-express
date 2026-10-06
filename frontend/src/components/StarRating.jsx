import { Star } from "lucide-react";

export default function StarRating({ value = 0, size = 16, onChange, ariaLabel }) {
  if (onChange) {
    return (
      <div className="rating-picker" aria-label={ariaLabel}>
        {Array.from({ length: 5 }).map((_, index) => {
          const rating = index + 1;
          return (
            <button
              type="button"
              className={rating <= value ? "rating-button active" : "rating-button"}
              key={rating}
              onClick={() => onChange(rating)}
              title={`${rating} stars`}
              aria-label={`Rate ${rating} of 5 stars`}
            >
              <Star size={size} fill="currentColor" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="review-stars" aria-label={ariaLabel || `Rating ${Number(value).toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={index < value ? "star-on" : "star-off"} fill="currentColor" size={size} />
      ))}
    </div>
  );
}