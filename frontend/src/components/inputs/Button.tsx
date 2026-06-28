import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "warning" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-ink hover:brightness-95", // ArBrain yellow — acoes principais
  secondary: "border border-steel text-ink bg-white hover:bg-mist", // cancelar / neutro
  warning: "bg-status-attention text-ink hover:brightness-95", // atencao
  danger: "bg-status-out text-ink hover:brightness-95", // destrutivo/erro
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
