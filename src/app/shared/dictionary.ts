1import {Injectable} from '@angular/core';

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
    { value: '0', text: 'Atendimento'},
    { value: '1', text: 'Proposta' },
  ];
  activitytStatusesSelect: Array<Object> = [
    { value: '0', text: 'Não iniciado'},
    { value: '1', text: 'Em andamento' },
    { value: '2', text: 'Finalizado' },
    { value: '3', text: 'Fechado' },
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
