import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBeer } from "../../api/beers";
import { useState } from "react";
import type { CreateBeerRequest } from "../../api/types";
import { validateBeer } from "./validateBeer";

const empty: CreateBeerRequest = {
  name: "",
  style: "",
  tempMin: 0,
  tempMax: 0,
  phMin: 0,
  phMax: 0,
  extractMin: 0,
  extractMax: 0,
};

export function CreateBeerForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateBeerRequest>(empty);
  const [attempted, setAttempted] = useState(false);

  const errors = validateBeer(form);

  const mutation = useMutation({
    mutationFn: createBeer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      setForm(empty);
      setAttempted(false);
    },
  });

  function update<K extends keyof CreateBeerRequest>(
    key: K,
    value: CreateBeerRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate(form);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          className="border border-steel rounded px-3 py-2"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className="border border-steel rounded px-3 py-2"
          placeholder="Estilo"
          value={form.style}
          onChange={(e) => update("style", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <NumberField
          label="Temp. mín"
          value={form.tempMin}
          onChange={(v) => update("tempMin", v)}
        />
        <NumberField
          label="pH mín"
          value={form.phMin}
          onChange={(v) => update("phMin", v)}
        />
        <NumberField
          label="Extrato mín"
          value={form.extractMin}
          onChange={(v) => update("extractMin", v)}
        />
        <NumberField
          label="Temp. máx"
          value={form.tempMax}
          onChange={(v) => update("tempMax", v)}
        />
        <NumberField
          label="pH máx"
          value={form.phMax}
          onChange={(v) => update("phMax", v)}
        />
        <NumberField
          label="Extrato máx"
          value={form.extractMax}
          onChange={(v) => update("extractMax", v)}
        />
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mb-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <button
        className="bg-brand text-ink font-semibold px-4 py-2 rounded disabled:opacity-50"
        disabled={mutation.isPending}
        onClick={handleSubmit}
      >
        {mutation.isPending ? "Salvando..." : "Adicionar Cerveja"}
      </button>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col text-sm text-grey">
      {label}
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-steel rounded px-3 py-2 text-ink"
      />
    </label>
  );
}
