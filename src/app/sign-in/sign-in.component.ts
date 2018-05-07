import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form-utils';
import {AuthService} from '../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  public form: FormGroup;
  public formUtils: FormUtils;
  public submitted: boolean;
  public formErrors: Array<string>;

  public constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.setupForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.formErrors = null;
  }

  public signIn() {
    this.submitted = true;

    console.log('Tentou fazer SignIn');

    // this.authService.signIn(this.form.get('email').value, this.form.get('password').value)
    //   .subscribe(
    //     success => {
    //       this.formErrors = null;
    //       this.router.navigate(['/dashboard']);
    //     },
    //     error => {
    //       this.submitted = false;
    //       if (error.status === 401) {
    //         this.formErrors = JSON.parse(error._body).errors;
    //       } else {
    //         this.formErrors = ['Ocorreu um erro e não foi possível logar. Tente novamente mais tarde.']
    //       }
    //     }
    //   );
  }

  public setupForm() {
    this.form = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]]
      }
    );
  }

}
