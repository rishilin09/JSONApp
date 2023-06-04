import { User, UserCrudService } from '../userCrud.service';
import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'Details.page.html',
  styleUrls: ['Details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class DetailsPage {

  Users: User[] = [];

  constructor(
    private userCrudService: UserCrudService,
    private alertController: AlertController
  ) {
    this.userCrudService.getUsers().subscribe((response) => {
      this.Users = response;
    });
  }

  ionViewDidEnter() {
    this.userCrudService.getUsers().subscribe((response) => {
      this.Users = response;
    });
  }

  async removeUser(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete canceled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.userCrudService.deleteUser(id).subscribe(() => {
              this.ionViewDidEnter();
              console.log('User deleted!');
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
