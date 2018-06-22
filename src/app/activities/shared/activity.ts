export class Activity {
  public constructor(
    public id: number,
    public name: string,
    public annotations: string,
    public status: number,
    public activity_type: number,
    public user_id: number,
    public client_id: number,
    public client_name: string,
    public created_at: Date,
    public updated_at: Date
  ) {}
}
