export class User {
  public constructor(
    public id: number,
    public registration: string,
    public name: string,
    public email: string,
    public password: string,
    public password_confirmation: string,
    public cpf: string,
    public landline: string,
    public cellphone: string,
    public whatsapp: string,
    public simple_address: string,
    public user_type: string,
    public organization_id: number,
    public role_id: number,
    public address_id: number,
    public created_at: Date,
    public auth_token: string,
    public encrypted_password?: string,
    public reset_password_token?: string,
    public reset_password_sent_at?: Date,
    public sign_in_count?: number,
    public current_sign_in_at?: Date,
    public last_sign_in_at?: Date,
    public current_sign_in_ip?: string,
    public last_sign_in_ip?: string
  ) {}
}
