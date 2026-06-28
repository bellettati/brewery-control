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
  // Estado de texto local: permite que o campo fique vazio ou em estado
  // intermediário ("", "-", "1.") enquanto o usuário digita. Sem isso, um estado
  // numérico converteria "" de volta para 0 e o campo nunca poderia ser limpo.
  const [text, setText] = useState(value === 0 ? "" : String(value));

  // Re-sincroniza quando o valor muda por fora do input (reset do formulário
  // após submit, ou carregamento de um registro existente no modal de edição).
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
        setText(raw); // mostra exatamente o que foi digitado (inclusive vazio)
        onChange(raw === "" ? 0 : Number(raw)); // reporta um número para o componente pai
      }}
      className="no-spinner border border-steel rounded-lg px-3 py-2 text-ink w-full
                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
    />
  );
}
