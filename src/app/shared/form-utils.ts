import { FormGroup } from '@angular/forms';

export class FormUtils {
  // masks
  static registrationMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  static cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  static phoneMask = ['(', /\d/, /\d/, ')', ' ', /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public constructor(private form: FormGroup) {}

  public fieldClassForErrorOrSuccess(fieldName: string) {
    return {
      'has-error': this.showFieldError(fieldName)
      // 'has-success': this.getField(fieldName).valid
    };
  }

  public iconClassForErrorOrSuccess(fieldName: string) {
    return {
      'glyphicon-remove': this.showFieldError(fieldName)
      // 'glyphicon-ok': this.getField(fieldName).valid
    };
  }

  public showFieldSuccess(fieldName: string) {
    const field = this.getField(fieldName);
    return field.valid;
  }

  public showFieldError(fieldName: string) {
    const field = this.getField(fieldName);
    return field.invalid && (field.touched || field.dirty);
  }

  public getField(fieldName: string) {
    return this.form.get(fieldName);
  }
}
