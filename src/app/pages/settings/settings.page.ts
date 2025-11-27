import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
  MenuController,
  ModalController,
} from '@ionic/angular/standalone';
import { IncrementalBackupService } from '@/services/incremental-backup.service';
import { AuthenticationModalComponent } from 'src/app/components/authentication-modal/authentication-modal.component';
import { AuthService } from '@/services/auth.service';

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
