import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { UserCrudService } from '../userCrud.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './Update.page.html',
  styleUrls: ['./Update.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class UpdatePage implements OnInit {

  id: any;
  userVal: any[] = [];
  updateForm: FormGroup = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    email: [''],
  });

  regInputs = ['First-Name', 'Last-Name', 'Email'];
  formCtrlName = [
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

  constructor(private formBuilder: FormBuilder, private alertController: AlertController, private router: Router,
    private activatedRoute: ActivatedRoute, private userCrudService: UserCrudService) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.fetchUser(this.id);
    this.updateForm = this.formBuilder.group({
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

  validateLink(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const linkPattern: RegExp = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)*$/;
      const valid: boolean = linkPattern.test(control.value);
      return valid ? null : { 'invalidString': { value: control.value } };
    };
  }

  onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[0-9]*$/.test(control.value);
      return valid ? null : { 'invalidNumber': { value: control.value } };
    };
  }

  fetchUser(id: Number) {
    this.userCrudService.getUser(id).subscribe((data) => {
      this.updateForm.setValue({
        name: data[0],
        email: data[1],
        username: data[2],
      });
      this.userVal = data;
    });
  }

  async submitForm() {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
      console.log('Form submitted:', formData);
      this.userCrudService.updateUser(this.id, this.updateForm.value)
        .subscribe({
          next: async () => {
            await this.showSuccessAlert();
            this.updateForm.reset();
            this.router.navigate(['/tabs/details']);
          }
        });
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your data got successfully updated',
      buttons: ['OK']
    });
    await alert.present();
  }

}
