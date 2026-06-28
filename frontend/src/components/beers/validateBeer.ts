export interface BeerFields {
  name: string;
  style: string;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  extractMin: number;
  extractMax: number;
}

export function validateBeer(f: BeerFields): string[] {
  const errors: string[] = [];
  if (!f.name.trim()) errors.push("Nome é obrigatório.");
  if (!f.style.trim()) errors.push("Estilo é obrigatório.");
  if (f.phMin < 0 || f.phMax > 14) errors.push("pH deve estar entre 0 e 14.");
  if (f.extractMin < 0 || f.extractMax < 0)
    errors.push("Extrato não pode ser negativo.");
  if (f.tempMin > f.tempMax)
    errors.push("Temperatura mínima não pode ser maior que a máxima.");
  if (f.phMin > f.phMax)
    errors.push("pH mínimo não pode ser maior que o máximo.");
  if (f.extractMin > f.extractMax)
    errors.push("Extrato mínimo não pode ser maior que o máximo.");
  return errors;
}
