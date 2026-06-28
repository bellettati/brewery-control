import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTank } from "../../api/tanks";
import { useState } from "react";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";
import { Button } from "../inputs/Button";
import { validateTank } from "./validateTank";

export function CreateTankForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [attempted, setAttempted] = useState(false);

  const errors = validateTank({ name, capacityLiters: capacity });

  const mutation = useMutation({
    mutationFn: createTank,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      setName("");
      setCapacity(0);
      setAttempted(false);
    },
  });

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0)
      mutation.mutate({ name, capacityLiters: capacity });
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" required>
          <TextInput value={name} onChange={setName} />
        </Field>
        <Field label="Capacidade (L)" required>
          <NumberInput value={capacity} onChange={setCapacity} />
        </Field>
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mt-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <Button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="mt-3"
      >
        {mutation.isPending ? "Salvando..." : "Adicionar"}
      </Button>
    </div>
  );
}
