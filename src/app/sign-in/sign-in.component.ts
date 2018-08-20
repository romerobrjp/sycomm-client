import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormUtils} from '../shared/form-utils';
import {AuthService} from '../shared/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  formUtils: FormUtils;
  submitted: boolean;
  formErrors: Array<string>;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.setupForm();
    this.formUtils = new FormUtils(this.form);
    this.submitted = false;
    this.formErrors = null;
  }

  ngOnInit() {
    // this.authService.signOut();
  }

  signIn() {
    this.submitted = true;

    this.authService.signIn(this.form.get('email').value, this.form.get('password').value).subscribe(
      success => {
        this.formErrors = null;
        this.router.navigate(['/dashboard']);
      },
      (responseError) => {
        this.submitted = false;
        if (responseError.status === 401) {
          this.formErrors = responseError.error.errors;
        } else {
          this.formErrors = ['Ocorreu um erro e não foi possível logar. Tente novamente mais tarde.'];
        }
      }
    );
  }

  setupForm() {
    this.form = this.formBuilder.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]]
      }
    );
  }

}
