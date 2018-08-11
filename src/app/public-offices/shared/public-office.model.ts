export class PublicOffice {
  public constructor(
    public id: number,
    public name: string,
    public description: string
  ) {}

  static attributesDictionary = {
    'name' : 'Nome',
    'description' : 'Descriçao',
  };
}
