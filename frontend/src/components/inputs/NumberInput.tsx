type Props = {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  placeholder?: string;
};

export function NumberInput({
  value,
  onChange,
  step = 0.1,
  placeholder,
}: Props) {
  return (
    <input
      type="number"
      step={step}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="no-spinner border border-steel rounded-lg px-3 py-2 text-ink w-full
                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
    />
  );
}
