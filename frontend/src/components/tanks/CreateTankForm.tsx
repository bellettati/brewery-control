import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTank } from "../../api/tanks";
import { useState } from "react";

export function CreateTankForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");

  const mutation = useMutation({
    mutationFn: createTank,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      setName("");
      setCapacity("");
    },
  });

  return (
    <div className="bg-white p-4 rounded shadow-sm mb-6 flex gap-3 items-row">
      <input
        className="border border-steel rounded px-3 py-2"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border border-steel rounded px-3 py-2"
        type="number"
        placeholder="Capacidade (L)"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button
        className="bg-brand text-ink font-semibold px-4 py-2 rounded disabled:opacity-50"
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({ name, capacityLiters: Number(capacity) })
        }
      >
        {mutation.isPending ? "Salvando..." : "Adicionar"}
      </button>
    </div>
  );
}
