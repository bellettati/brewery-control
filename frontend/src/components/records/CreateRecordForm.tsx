import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "../../api/records";
import { getBeers } from "../../api/beers";
import { getTanks } from "../../api/tanks";
import { useState } from "react";
import type { CreateFermentationRecordRequest } from "../../api/types";

const empty: CreateFermentationRecordRequest = {
  beerId: 0,
  tankId: 0,
  batchNumber: "",
  temperature: 0,
  ph: 0,
  extract: 0,
  recordedAt: new Date().toISOString(),
  observation: null,
};

export function CreateRecordForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);

  // dropdowns are fed by their own queries — reusing the cache from the other screens
  const { data: beers } = useQuery({ queryKey: ["beers"], queryFn: getBeers });
  const { data: tanks } = useQuery({ queryKey: ["tanks"], queryFn: getTanks });

  const mutation = useMutation({
    mutationFn: createRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["records"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // counts changed too
      setForm({ ...empty, recordedAt: new Date().toISOString() });
    },
  });

  function update<K extends keyof CreateFermentationRecordRequest>(
    key: K,
    value: CreateFermentationRecordRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-6 grid grid-cols-3 gap-3">
      <select
        className="border border-steel rounded px-3 py-2"
        value={form.beerId}
        onChange={(e) => update("beerId", Number(e.target.value))}
      >
        <option value={0} disabled>
          Selecione a cerveja
        </option>
        {beers?.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select
        className="border border-steel rounded px-3 py-2"
        value={form.tankId}
        onChange={(e) => update("tankId", Number(e.target.value))}
      >
        <option value={0} disabled>
          Selecione o tanque
        </option>
        {tanks?.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        className="border border-steel rounded px-3 py-2"
        placeholder="Nº do lote"
        value={form.batchNumber}
        onChange={(e) => update("batchNumber", e.target.value)}
      />

      <input
        className="border border-steel rounded px-3 py-2"
        type="number"
        step="0.1"
        placeholder="Temperatura"
        value={form.temperature}
        onChange={(e) => update("temperature", Number(e.target.value))}
      />
      <input
        className="border border-steel rounded px-3 py-2"
        type="number"
        step="0.1"
        placeholder="pH"
        value={form.ph}
        onChange={(e) => update("ph", Number(e.target.value))}
      />
      <input
        className="border border-steel rounded px-3 py-2"
        type="number"
        step="0.1"
        placeholder="Extrato"
        value={form.extract}
        onChange={(e) => update("extract", Number(e.target.value))}
      />

      <input
        className="border border-steel rounded px-3 py-2"
        type="datetime-local"
        onChange={(e) =>
          update("recordedAt", new Date(e.target.value).toISOString())
        }
      />
      <input
        className="border border-steel rounded px-3 py-2 col-span-2"
        placeholder="Observações"
        value={form.observation ?? ""}
        onChange={(e) => update("observation", e.target.value || null)}
      />

      <button
        className="bg-brand text-ink font-semibold px-4 py-2 rounded disabled:opacity-50 col-span-3"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(form)}
      >
        {mutation.isPending ? "Salvando..." : "Registrar"}
      </button>
    </div>
  );
}
