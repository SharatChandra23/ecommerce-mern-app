import { FaSpinner } from "react-icons/fa";

function AppButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    circle = false,
    fullWidth = false,
    loading = false,
    disabled = false,
    icon,
    type = "button",
    className = ""
}) {

    const base =
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    const sizes = {
        sm: circle ? "w-8 h-8 text-sm" : "px-3 py-1.5 text-sm",
        md: circle ? "w-10 h-10 text-sm" : "px-5 py-2.5 text-sm",
        lg: circle ? "w-12 h-12 text-base" : "px-8 py-3 text-base"
    };

    const variants = {

        primary:
            "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400",

        success:
            "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400",

        danger:
            "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",

        outline:
            "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-300",

        ghost:
            "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",

        orange:
            "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md focus:ring-orange-400",

        yellow:
            "bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-md focus:ring-yellow-300",

        gradient:
            "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-lg focus:ring-orange-400",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                font-semibold
                ${base}
                ${sizes[size]}
                ${circle ? "rounded-full" : "rounded-lg gap-2 px-5"}
                ${variants[variant]}
                ${fullWidth ? "w-full" : ""}
                ${disabled || loading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5 active:scale-90"}
                ${className}
            `}>
            {icon} {loading ? (
                <FaSpinner className="animate-spin" />
            ) : (
                children
            )}
        </button>
    );
}

export default AppButton;