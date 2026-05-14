import React from "react";

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  destructive: "text-white hover:opacity-90",
  outline: "border bg-card hover:bg-muted",
  ghost: "hover:bg-muted",
  secondary: "bg-muted text-foreground hover:opacity-90"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  icon: "h-9 w-9"
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  style,
  ...props
}) {
  const destructiveStyle =
    variant === "destructive"
      ? { backgroundColor: "rgb(var(--destructive))", color: "rgb(var(--destructive-foreground))", ...style }
      : style;

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      style={destructiveStyle}
      {...props}
    />
  );
}
