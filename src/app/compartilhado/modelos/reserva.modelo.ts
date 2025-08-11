export interface Reserva {
  id: string;
  localId: string;
  salaId: string;
  localNome: string;
  salaNome: string;
  responsavelNome: string;
  responsavelEmail: string;
  inicio: string;  // ISO date string
  fim: string;     // ISO date string
  cafe: boolean;
  cafeQuantidade?: number;
  cafeDescricao?: string;
  rowVersion: number[]; // byte[] em C# vira array de numbers no JSON
}

