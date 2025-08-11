export interface AtualizarReservaDto {
  id: string;
  localId: string;
  salaId: string;
  responsavelNome: string;
  responsavelEmail: string;
  inicio: string; // ISO
  fim: string;    // ISO
  cafe: boolean;
  cafeQuantidade?: number | null;
  cafeDescricao?: string | null;
  rowVersion: number[];
}
