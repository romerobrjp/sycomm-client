export class Activity {
  public constructor(
    public id: number,
    public name: string,
    public description: string,
    public status: number,
    public user_id: number,
    public created_at: Date,
    public updated_at: Date
  ) {}
}
