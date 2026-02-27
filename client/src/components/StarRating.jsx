import { FaStar } from "react-icons/fa";

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={index < Math.round(rating) ? "" : "opacity-30"}
                />
            ))}
            <span className="text-sm text-gray-500 ml-2">
                ({rating})
            </span>
        </div>
    );
}

export default StarRating;