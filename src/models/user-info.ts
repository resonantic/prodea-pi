export interface UserInfo {
  email: string;

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

  status: StatusAutorizacao;
}

export enum StatusAutorizacao {
  aguardando = 0,
  autorizado = 1,
  negado = 2,
}
