export class Activity {
  public constructor(
    public id: number,
    public name: string,
    public description: string,
    public annotations: string,
    public status: number,
    public activity_type: number,
    public customer_id: number,
    public customer_name: string,
    public employee_id: number,
    public created_at: Date,
    public updated_at: Date
  ) {}

  static attributesDictionary = {
    'name' : 'Nome',
    'annotations' : 'Anotaçoes',
    'status' : 'Status',
    'activity_type' : 'Tipo',
    'user_id' : 'Dono',
    'client_id' : 'Cliente ID',
    'client_name' : 'Nome do cliente',
  };
}
