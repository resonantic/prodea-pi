export interface Doacao {
  id?: string;
  descricao: string;
  linkFoto: string | null;
  idDoador?: string;
  idConsumidor: null | string;
  validade: string;
  dataDoacao?: Date;
  cancelamento: string | null;
  entregue: boolean;
}
