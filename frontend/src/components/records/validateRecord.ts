export interface RecordFields {
  beerId: number;
  tankId: number;
  batchNumber: string;
  temperature: number;
  ph: number;
  extract: number;
}

export function validateRecord(f: RecordFields): string[] {
  const errors: string[] = [];
  if (f.beerId <= 0) errors.push("Selecione uma cerveja.");
  if (f.tankId <= 0) errors.push("Selecione um tanque.");
  if (!f.batchNumber.trim()) errors.push("Número do lote é obrigatório.");
  if (f.ph < 0 || f.ph > 14) errors.push("pH deve estar entre 0 e 14.");
  return errors;
}
