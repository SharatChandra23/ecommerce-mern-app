import { FaSearch, FaTimes } from "react-icons/fa";
import { useState } from "react";

function CustomSearchInput({ debouncedSearch }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

  const clearInput = () => {
    setValue("");
    debouncedSearch("");
  };

  return (
    <div className="flex justify-center w-full">

      <div className="relative w-full max-w-2xl">

        {/* Search Icon */}
        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />

        <input
          type="text"
          value={value}
          placeholder="Search products..."
          onChange={handleChange}
          className="
            w-full
            pl-12 pr-10
            py-3
            rounded-full
            border border-gray-200
            bg-white
            shadow-sm
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-orange-400
            focus:border-orange-400
            transition-all duration-300
          "
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={clearInput}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-red-500
              transition
            "
          >
            <FaTimes size={14} />
          </button>
        )}

      </div>

    </div>
  );
}

export default CustomSearchInput;