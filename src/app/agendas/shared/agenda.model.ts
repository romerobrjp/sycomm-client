export class Agenda {
  public constructor(
    public id: number,
    public name: string,
    public start_date: Date,
    public employee_id: number,
    public customers_cpf: Array<string>,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static attributesDictionary = {
    'name' : 'Nome',
    'start_date' : 'Data de inicio',
    'employee_id' : 'Funcionario',
    'customers_cpf' : 'Clientes CPF',
  };
}
