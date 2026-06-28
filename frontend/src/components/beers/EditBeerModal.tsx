import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBeer } from "../../api/beers";
import { Modal } from "../Modal";
import { useState } from "react";
import type { Beer, UpdateBeerRequest } from "../../api/types";
import { validateBeer } from "./validateBeer";

export function EditBeerModal({
  beer,
  onClose,
}: {
  beer: Beer;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState<UpdateBeerRequest>({
    name: beer.name,
    style: beer.style,
    tempMin: beer.tempMin,
    tempMax: beer.tempMax,
    phMin: beer.phMin,
    phMax: beer.phMax,
    extractMin: beer.extractMin,
    extractMax: beer.extractMax,
  });

  const errors = validateBeer({
    name: form.name ?? "",
    style: form.style ?? "",
    tempMin: form.tempMin!,
    tempMax: form.tempMax!,
    phMin: form.phMin!,
    phMax: form.phMax!,
    extractMin: form.extractMin!,
    extractMax: form.extractMax!,
  });

  const mutation = useMutation({
    mutationFn: () => updateBeer(beer.id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      onClose();
    },
  });

  function update<K extends keyof UpdateBeerRequest>(
    key: K,
    value: UpdateBeerRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate();
  }

  return (
    <Modal title={`Editar ${beer.name}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          className="border border-steel rounded px-3 py-2"
          placeholder="Nome"
          value={form.name ?? ""}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className="border border-steel rounded px-3 py-2"
          placeholder="Estilo"
          value={form.style ?? ""}
          onChange={(e) => update("style", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Num
          label="Temp. mín"
          v={form.tempMin!}
          on={(v) => update("tempMin", v)}
        />
        <Num label="pH mín" v={form.phMin!} on={(v) => update("phMin", v)} />
        <Num
          label="Extrato mín"
          v={form.extractMin!}
          on={(v) => update("extractMin", v)}
        />
        <Num
          label="Temp. máx"
          v={form.tempMax!}
          on={(v) => update("tempMax", v)}
        />
        <Num label="pH máx" v={form.phMax!} on={(v) => update("phMax", v)} />
        <Num
          label="Extrato máx"
          v={form.extractMax!}
          on={(v) => update("extractMax", v)}
        />
      </div>

      <div className="bg-status-attention/20 border border-status-attention rounded p-3 text-sm text-ink mb-4">
        Alterar os parâmetros não reclassifica registros já existentes — apenas
        novos registros usarão as faixas atualizadas.
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mb-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {mutation.isError && (
        <p className="text-status-out text-sm mb-3">
          {(mutation.error as Error).message}
        </p>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-steel text-ink"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="px-4 py-2 rounded bg-brand text-ink font-semibold disabled:opacity-50"
        >
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}

function Num({
  label,
  v,
  on,
}: {
  label: string;
  v: number;
  on: (v: number) => void;
}) {
  return (
    <label className="flex flex-col text-sm text-grey">
      {label}
      <input
        type="number"
        step="0.1"
        value={v}
        onChange={(e) => on(Number(e.target.value))}
        className="border border-steel rounded px-3 py-2 text-ink"
      />
    </label>
  );
}
