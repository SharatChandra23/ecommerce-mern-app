function AppHeading({
  children,
  level = 2,
  variant = "default",
  align = "left",
  subtitle,
  withDivider = false,
  className = ""
}) {
  const Tag = `h${level}`;

  const base =
    "font-bold tracking-tight";

  const sizes = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg",
    6: "text-base"
  };

  const variants = {
    default: "text-slate-900",

    primary: "text-slate-900",

    orange: "text-orange-500",

    danger: "text-red-500",

    success: "text-emerald-600",

    gradient:
      "bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent",

    muted: "text-gray-500",

    background:
      "inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-lg"
  };

  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const textUppercase = {
    "text-tranform": "uppercase"
  };

  return (
    <div className={`${alignment[align]} ${className}`} style={textUppercase}>

      <Tag className={`${base} ${sizes[level]} ${variants[variant]}`} style={textUppercase}>
        {children}
      </Tag>

      {subtitle && (
        <p className="mt-2 text-gray-500 text-sm md:text-base">
          {subtitle}
        </p>
      )}

      {withDivider && (
        <div className="mt-4 w-16 h-1 bg-orange-500 rounded-full mx-auto" />
      )}

    </div>
  );
}

export default AppHeading;