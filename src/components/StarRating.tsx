import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  const totalStars = 5;

  const handleClick = (index: number) => {
    if (setRating) {
      setRating(index + 1);
    }
  };

  return (
    <div className="star-rating">
      {Array.from({ length: totalStars }, (_, index) => (
        <span
          key={index}
          className={index < rating ? 'filled' : ''}
          onClick={() => handleClick(index)}
          style={{ cursor: setRating ? 'pointer' : 'default' }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;

