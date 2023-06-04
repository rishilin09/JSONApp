import { Component, NgZone } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UserCrudService, User } from '../userCrud.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab1',
  templateUrl: 'Register.page.html',
  styleUrls: ['Register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage {

  registerForm: FormGroup;
  regInputs = ['Id', 'First-Name', 'Last-Name', 'Email'];
  formCtrlName = [
    {
      name: 'id',
      error: 'invalidNumber'
    },
    {
      name: 'firstName',
      error: 'invalidString'
    },
    {
      name: 'lastName',
      error: 'invalidString'
    },
    {
      name: 'email',
      error: 'invalidEmail'
    }
  ];

  constructor(private formBuilder: FormBuilder, private alertController: AlertController, userCrudServ: UserCrudService, private router: Router,
    private zone: NgZone, private userCrudService: UserCrudService) {
    this.registerForm = this.formBuilder.group({
      id: ['', [Validators.required, this.onlyNumbers()]],
      firstName: ['', [Validators.required, this.onlyAlphabets()]],
      lastName: ['', [Validators.required, this.onlyAlphabets()]],
      email: ['', [Validators.required, this.emailValidator()]]
    });
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

      if (control.value && !validPattern.test(control.value)) {
        return { 'invalidEmail': { value: control.value } };
      }

      return null;
    };
  }

  onlyAlphabets(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[a-zA-Z\s]*$/.test(control.value);
      return valid ? null : { 'invalidString': { value: control.value } };
    };
  }

  onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[0-9]*$/.test(control.value);
      return valid ? null : { 'invalidNumber': { value: control.value } };
    };
  }

  async submitForm() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form submitted:', formData);
      this.userCrudService.createUser(formData)
        .subscribe({
          next: async () => {
            await this.showSuccessAlert(formData['firstName']);
            this.resetFormAndNavigate();
          }
        });
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Failure',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  resetFormAndNavigate() {
    this.zone.run(() => {
      this.registerForm.reset();
      this.router.navigate(['/tabs/details']);
    });
  }

  async showSuccessAlert(firstName: any) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Thanks ' + firstName + ' for registration!',
      buttons: ['OK']
    });
    await alert.present();
  }

}
