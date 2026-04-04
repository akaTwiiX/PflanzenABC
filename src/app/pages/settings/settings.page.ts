import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  MenuController,
  ModalController,
} from '@ionic/angular/standalone';
import { AuthenticationModalComponent } from '../../components/authentication-modal/authentication-modal.component';
import { AuthService } from '../../shared/services/auth.service';
import { IncrementalBackupService } from '../../shared/services/incremental-backup.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonList,
    IonIcon,
    IonLabel,
  ],
})
export class SettingsPage implements OnInit {
  private menuCtrl = inject(MenuController);
  private modalCtrl = inject(ModalController);
  authService = inject(AuthService);

  ngOnInit() {
    console.log('SettingsPage initialized');
  }

  get backupAvailable() {
    return IncrementalBackupService.backupAvailable();
  }

  async openAuthModal() {
    await this.menuCtrl.close();
    const modal = await this.modalCtrl.create({
      component: AuthenticationModalComponent,
    });
    await modal.present();
  }

  async logout() {
    await this.authService.logout();
    IncrementalBackupService.backupAvailable.set(false);
    await this.menuCtrl.close();
  }
}
