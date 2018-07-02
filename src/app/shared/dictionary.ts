import {Injectable} from '@angular/core';

@Injectable()
export class Dictionary {
  // ACTIVITY
  activityStatuses = {
    'not_started' : 'Não iniciada',
    'in_progress' : 'Em progresso',
    'finished' : 'Finalizada',
    'closed' : 'Fechada'
  };

  activityTypes = {
    'attendance' : 'Atendimento',
    'offer' : 'Proposta',
  };

  activitytTypesSelect: Array<Object> = [
    { value: 'attendance', text: 'Atendimento'},
    { value: 'offer', text: 'Proposta' },
  ];
  activitytStatusesSelect: Array<Object> = [
    { value: 'not_started', text: 'Não iniciado'},
    { value: 'in_progress', text: 'Em andamento' },
    { value: 'finished', text: 'Finalizado' },
    { value: 'closed', text: 'Fechado' },
  ];

  // USER
  userTypes = {
    'Admin': 'Administrador',
    'Employee': 'Funcionário',
    'Customer': 'Cliente',
  };

  userTypesSelect: Array<Object> = [
    { value: 'Admin', text: 'Administrador'},
    { value: 'Employee', text: 'Funcionário' },
    { value: 'Customer', text: 'Cliente' }
  ];

  constructor() {}
}
