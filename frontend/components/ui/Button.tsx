import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "px-4 py-2",
  };
  const base =
    "rounded-lg font-semibold transition shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary",
    ghost: "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
  };

  return (
    <button className={clsx(base, sizeClasses[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

