export class User {
  public constructor(
    public id: number,
    public name: string,
    public type: string,
    public created_at: Date,
    public updated_at: Date,
    public auth_token: string,
    public email?: string,
    public cpf?: string,
    public landline?: string,
    public cellphone?: string,
    public whatsapp?: string,
    public simple_address?: string,
    public registration?: string,
    public password?: string,
    public password_confirmation?: string,
    public public_agency_id?: number,
    public public_office_id?: number,
    public address_id?: number,
    public encrypted_password?: string,
    public reset_password_token?: string,
    public reset_password_sent_at?: Date,
    public sign_in_count?: number,
    public current_sign_in_at?: Date,
    public last_sign_in_at?: Date,
    public current_sign_in_ip?: string,
    public last_sign_in_ip?: string
  ) {}

  static attributesDictionary = {
    'registration' : 'Matrícula',
    'name' : 'Nome',
    'email' : 'E-mail',
    'password' : 'Senha',
    'password_confirmation' : 'Confirmação de Senha',
    'cpf' : 'CPF',
    'landline' : 'Telefone fixo',
    'cellphone' : 'Celular',
    'whatsapp' : 'WhatsApp',
    'simples_adress' : 'Endereço',
    'type' : 'Tipo de usuário',
    'public_agency' : 'Organização',
    'public_office' : 'Cargo'
  };
}
