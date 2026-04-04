import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonText,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { PlantDetailsComponent } from '../../components/plant-details/plant-details.component';
import { CollectionStorageService } from '../../shared/services/collection-storage.service';
import { PlantFormService } from '../../shared/services/plant-form.service';
import { PlantStorageService } from '../../shared/services/plant-storage.service';
import type { Plant } from '../../shared/types/PlantType';

function migratePlant(plant: any, defaults: any): { plant: any, changed: boolean, } {
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
      typeof defaults[key] === 'object'
      && !Array.isArray(defaults[key])
      && defaults[key] !== null
      && typeof plant[key] === 'object'
      && !Array.isArray(plant[key])
    ) {
      // Nested object → recurse
      const result = migratePlant(plant[key], defaults[key]);
      if (result.changed)
        changed = true;
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
  ],
})
export class PlantPage implements OnInit {
  route = inject(ActivatedRoute);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);
  plantFormService = inject(PlantFormService);
  navCtrl = inject(NavController);
  actionSheetCtrl = inject(ActionSheetController);
  alertCtrl = inject(AlertController);
  toastCtrl = inject(ToastController);

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
    this.navCtrl.navigateForward(['/add-plant'], {
      queryParams: { editId: this.plantId },
    });
  }

  goToHomeOrCollection() {
    if (this.plant!.collectionId)
      this.navCtrl.navigateForward(['/collection', this.plant!.collectionId]);
    else this.navCtrl.navigateForward(['/home']);
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

  async openCollectionDialog() {
    const collections = await this.collectionStorageService.getAllCollections();

    if (collections.length === 0) {
      const info = await this.alertCtrl.create({
        header: 'Keine Sammlungen',
        message: 'Es gibt noch keine Sammlungen. Erstelle zuerst eine Sammlung.',
        buttons: ['OK'],
      });
      await info.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'In Sammlung verschieben',
      inputs: collections.map(c => ({
        type: 'radio' as const,
        label: c.name,
        value: c.id,
        checked: c.id === this.plant?.collectionId,
      })),
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Verschieben',
          handler: (selectedId: number) => this.moveToCollection(selectedId),
        },
      ],
    });

    await alert.present();
  }

  async moveToCollection(targetCollectionId: number) {
    if (!this.plant)
      return;
    if (this.plant.collectionId === targetCollectionId)
      return;

    const oldCollectionId = this.plant.collectionId;

    if (oldCollectionId && oldCollectionId !== targetCollectionId) {
      const oldCollection = await this.collectionStorageService.getCollection(oldCollectionId);
      if (oldCollection) {
        const updatedIds = (oldCollection.plantIds ?? []).filter((id: number) => id !== this.plantId);
        await this.collectionStorageService.updateCollection(oldCollectionId, {
          plantIds: updatedIds,
        });
      }
    }

    const newCollection = await this.collectionStorageService.getCollection(targetCollectionId);
    if (newCollection) {
      const currentIds = newCollection.plantIds ?? [];
      if (!currentIds.includes(this.plantId)) {
        await this.collectionStorageService.updateCollection(targetCollectionId, {
          plantIds: [...currentIds, this.plantId],
        });
      }
    }

    this.plant.collectionId = targetCollectionId;
    await this.plantStorageService.updatePlant(this.plantId, { collectionId: targetCollectionId });

    const toast = await this.toastCtrl.create({
      message: 'Pflanze erfolgreich verschoben',
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async openMenu() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Optionen',
      buttons: [
        {
          text: 'in Sammlung verschieben',
          icon: 'file-tray-stacked-outline',
          handler: () => this.openCollectionDialog(),
        },
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
