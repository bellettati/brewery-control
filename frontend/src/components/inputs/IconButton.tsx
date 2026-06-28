import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  title?: string;
};

export function IconButton({ children, className = "", ...props }: Props) {
  return (
    <button
      className={`cursor-pointer text-grey hover:text-ink transition
                  disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
