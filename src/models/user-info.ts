export interface UserInfo {
  cnpj: string;
  nome: string;
  endereco: string;
  cidade: string;
  telefone: string;
  sobre: string;
  nomeResponsavel: string;
  cpfResponsavel: string;

  doador: boolean;
  consumidor: boolean;
  admin: boolean;

  autorizado: boolean;
}
