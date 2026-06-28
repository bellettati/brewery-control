import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBeer } from "../../api/beers";
import { useState } from "react";
import type { CreateBeerRequest } from "../../api/types";
import { validateBeer } from "./validateBeer";
import { Field } from "../Field";

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
        <Field label="Nome" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Field label="Estilo" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={form.style}
            onChange={(e) => update("style", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <NumField
          label="Temp. mín (°C)"
          value={form.tempMin}
          onChange={(v) => update("tempMin", v)}
        />
        <NumField
          label="pH mín"
          value={form.phMin}
          onChange={(v) => update("phMin", v)}
        />
        <NumField
          label="Extrato mín (°P)"
          value={form.extractMin}
          onChange={(v) => update("extractMin", v)}
        />
        <NumField
          label="Temp. máx (°C)"
          value={form.tempMax}
          onChange={(v) => update("tempMax", v)}
        />
        <NumField
          label="pH máx"
          value={form.phMax}
          onChange={(v) => update("phMax", v)}
        />
        <NumField
          label="Extrato máx (°P)"
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

// numeric field built on the shared Field wrapper
function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label} required>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-steel rounded px-3 py-2 text-ink w-full"
      />
    </Field>
  );
}
