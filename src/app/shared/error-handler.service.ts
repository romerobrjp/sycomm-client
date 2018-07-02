import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ErrorHandlerService {
  constructor(private messageService: MessageService) {}

  static handleResponseErrors(error: Response) {
    console.error('AuthService.handleErrors: ', error);
    // TODO arrumar um jeito de jogar um aviso na view
    // this.messageService.add({
    //   severity: 'error',
    //   summary: '',
    //   detail: error
    // });
    return Observable.throw(error);
  }
}
