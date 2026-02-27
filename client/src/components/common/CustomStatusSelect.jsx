import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const statuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

const getStatusStyles = (status) => {
    switch (status) {
        case "Pending":
            return "bg-yellow-100 text-yellow-700";
        case "Shipped":
            return "bg-blue-100 text-blue-700";
        case "Delivered":
            return "bg-green-100 text-green-700";
        case "Cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function CustomStatusSelect({ value, onChange, disabled }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-44" ref={ref}>
            {/* Selected Button */}
            <button
                disabled={disabled}
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between
          px-4 py-2 rounded-xl shadow-sm border
          font-medium transition-all duration-200
          focus:ring-2 focus:ring-indigo-400
          ${getStatusStyles(value)}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
        `}
            >
                <span>{value}</span>

                {/* Proper spacing arrow */}
                <ChevronDown
                    size={18}
                    className={`ml-3 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown Pane */}
            {open && (
                <div
                    className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg
          border overflow-hidden animate-fadeIn"
                >
                    {statuses.map((status) => (
                        <div
                            key={status}
                            onClick={() => {
                                onChange(status);
                                setOpen(false);
                            }}
                            className={`px-4 py-2 cursor-pointer flex justify-between items-center
                transition-all duration-150
                hover:bg-indigo-50
                ${value === status ? "bg-indigo-100 font-semibold" : ""}
              `}
                        >
                            <span>{status}</span>
                            {value === status && (
                                <Check size={16} className="text-indigo-600" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}