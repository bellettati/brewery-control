import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTank } from "../../api/tanks";
import { useState } from "react";
import { Field } from "../Field";
import { validateTank } from "./validateTank";

export function CreateTankForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [attempted, setAttempted] = useState(false);

  const errors = validateTank({ name, capacityLiters: Number(capacity) });

  const mutation = useMutation({
    mutationFn: createTank,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      setName("");
      setCapacity("");
      setAttempted(false);
    },
  });

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0)
      mutation.mutate({ name, capacityLiters: Number(capacity) });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="Capacidade (L)" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            type="number"
            step="0.1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Field>
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mt-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <button
        className="bg-brand text-ink font-semibold px-4 py-2 rounded disabled:opacity-50 mt-3"
        disabled={mutation.isPending}
        onClick={handleSubmit}
      >
        {mutation.isPending ? "Salvando..." : "Adicionar"}
      </button>
    </div>
  );
}
