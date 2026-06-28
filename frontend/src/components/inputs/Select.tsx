import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode; // the <option>s
};

export function Select({ value, onChange, children }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none border border-steel rounded-lg pl-3 pr-10 py-2 w-full
                   text-ink bg-white cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-grey pointer-events-none"
      />
    </div>
  );
}
