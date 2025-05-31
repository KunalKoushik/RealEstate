// StarRating Component
const StarRating = ({ rating, setRating }) => {
    const stars = [1, 2, 3, 4, 5]; // We will have 5 stars
  
    return (
      <div className="flex gap-2">
        {stars.map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "gold" : "gray"}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            onClick={() => setRating(star)} // Update the rating for the specific property
            className="cursor-pointer"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };
  
  export default StarRating;
  