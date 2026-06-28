import { useState, useEffect } from "react";

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
  // local text state lets the field be empty / mid-edit ("", "-", "1.")
  const [text, setText] = useState(value === 0 ? "" : String(value));

  // keep in sync when the parent value changes from outside (e.g. form reset, edit modal load)
  useEffect(() => {
    const asNum = text === "" ? 0 : Number(text);
    if (asNum !== value) setText(value === 0 ? "" : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="number"
      step={step}
      placeholder={placeholder}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw); // show exactly what was typed (incl. empty)
        onChange(raw === "" ? 0 : Number(raw)); // report a number upward
      }}
      className="no-spinner border border-steel rounded-lg px-3 py-2 text-ink w-full
                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
    />
  );
}
