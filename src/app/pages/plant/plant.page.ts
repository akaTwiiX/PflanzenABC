import { PlantFormService } from '@/services/plant-form.service';
import { PlantStorageService } from '@/services/plant-storage.service';
import { Plant } from '@/types/PlantType';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlantDetailsComponent } from 'src/app/components/plant-details/plant-details.component';

function migratePlant(plant: any, defaults: any): { plant: any; changed: boolean } {
  let changed = false;
  for (const key of Object.keys(defaults)) {
    if (plant[key] === undefined || plant[key] === null) {
      // Field missing entirely → use default
      plant[key] = structuredClone(defaults[key]);
      changed = true;
    } else if (Array.isArray(defaults[key]) && !Array.isArray(plant[key])) {
      // Type changed: was scalar, now array → wrap non-empty string, else use []
      plant[key] = plant[key] !== '' ? [plant[key]] : [];
      changed = true;
    } else if (
      typeof defaults[key] === 'object' &&
      !Array.isArray(defaults[key]) &&
      defaults[key] !== null &&
      typeof plant[key] === 'object' &&
      !Array.isArray(plant[key])
    ) {
      // Nested object → recurse
      const result = migratePlant(plant[key], defaults[key]);
      if (result.changed) changed = true;
    }
  }
  return { plant, changed };
}

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonText,
    IonButtons,
    PlantDetailsComponent,
    IonSpinner,
    IonIcon,
    IonButton,
    IonTitle
  ],
})
export class PlantPage implements OnInit {
  route = inject(ActivatedRoute);
  plantStorageService = inject(PlantStorageService);
  plantFormService = inject(PlantFormService);
  router = inject(Router);
  actionSheetCtrl = inject(ActionSheetController);
  alertCtrl = inject(ActionSheetController);

  plantId!: number;
  isLoading = true;
  errorMsg = '';
  plant: Plant | undefined = undefined;

  ngOnInit() {
    this.plantId = Number(this.route.snapshot.paramMap.get('id'))!;
  }

  ionViewWillEnter() {
    this.fetchPlantData(this.plantId);
  }

  async fetchPlantData(id: number) {
    this.isLoading = true;
    this.errorMsg = '';
    try {
      this.plant = await this.plantStorageService.getPlant(id);
      if (!this.plant) {
        this.errorMsg = 'Plant not found';
        return;
      }
      const defaults = this.plantFormService.getDefaultPlant();
      const { plant: migrated, changed } = migratePlant(this.plant, defaults);
      this.plant = migrated as Plant;
      if (changed) {
        await this.plantStorageService.updatePlant(this.plantId, this.plant);
      }
    } catch (err) {
      console.error('Failed to fetch related data:', err);
      this.errorMsg = 'Failed to fetch related data';
    } finally {
      this.isLoading = false;
    }
  }

  goToAddPlant() {
    this.router.navigate(['/add-plant'], {
      queryParams: { editId: this.plantId },
    });
  }

  goToHomeOrCollection() {
    if (this.plant!.collectionId) this.router.navigate(['/collection', this.plant!.collectionId]);
    else this.router.navigate(['/home']);
  }

  async openDialog() {
    const alert = await this.alertCtrl.create({
      header: 'Möchtest du diese Pflanze wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => this.deletePlant(),
        },
      ],
    });

    await alert.present();
  }

  deletePlant() {
    this.plantStorageService.removePlant(this.plantId);
    this.goToHomeOrCollection();
  }

  async openMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Optionen',
      buttons: [
        {
          text: 'Bearbeiten',
          icon: 'pencil-outline',
          handler: () => this.goToAddPlant(),
        },
        {
          text: 'Löschen',
          icon: 'trash-outline',
          handler: () => this.openDialog(),
        },
      ],
    });
    await actionSheet.present();
  }
}
