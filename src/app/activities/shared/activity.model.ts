import {Agenda} from '../../agendas/shared/agenda.model';
import {User} from '../../users/shared/user.model';

export class Activity {
  public constructor(
    public id: number,
    public name: string,
    public description: string,
    public annotations: string,
    public status: number,
    public activity_type: number,
    public employee_id: number,
    public customer_id: number,
    public customer_name: string,
    public created_at: Date,
    public updated_at: Date,
    public agenda: Agenda,
    public employee: User
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

  static statusesDictionary = {
    'not_started' : 'Não iniciada',
    'in_progress' : 'Em progresso',
    'finished' : 'Finalizada',
    'closed' : 'Fechada'
  };
}
