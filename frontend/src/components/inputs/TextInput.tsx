type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function TextInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-steel rounded-lg px-3 py-2 text-ink w-full
                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
    />
  );
}
