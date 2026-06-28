export interface TankFields {
  name: string;
  capacityLiters: number;
}

export function validateTank(f: TankFields): string[] {
  const errors: string[] = [];
  if (!f.name.trim()) errors.push("Nome é obrigatório.");
  if (f.capacityLiters <= 0) errors.push("Capacidade deve ser maior que zero.");
  return errors;
}
