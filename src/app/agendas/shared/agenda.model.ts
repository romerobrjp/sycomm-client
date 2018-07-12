export class Agenda {
  public constructor(
    public id: number,
    public name: string,
    public start_date: string,
    public user_id: string,
    public user_name: string,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static attributesDictionary = {
    'name' : 'Nome',
    'start_date' : 'Data de inicio',
  };
}
