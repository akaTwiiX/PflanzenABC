import { Component, inject, Input } from '@angular/core';
// import { Router } from '@angular/router';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonModal,
  IonInput,
  IonFab,
  IonFabButton,
  NavController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CollectionStorageService } from '@/services/collection-storage.service';
import { Collection } from '@/types/Collection';
import { getFirstLetter } from '@/utils/string.utils';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  imports: [IonButton, IonIcon, IonItem, IonModal, IonInput, IonFab, IonFabButton, FormsModule],
})
export class AddButtonComponent {
  @Input()
  parentCollection?: number;

  newCollection: string = '';
  navCtrl = inject(NavController);
  collectionStorageService = inject(CollectionStorageService);

  navigateToAddPlant() {
    if (this.parentCollection) {
      this.navCtrl.navigateForward(['/add-plant'], {
        queryParams: { parentId: this.parentCollection },
      });
    } else {
      this.navCtrl.navigateForward(['/add-plant']);
    }
  }

  async addNewCollection() {
    const collection: Collection = {
      name: this.newCollection,
      description: '',
      plantIds: [],
      collectionIds: [],
      updatedAt: new Date().toISOString(),
    };

    if (!this.parentCollection) collection.initialId = getFirstLetter(this.newCollection);

    try {
      const id = await this.collectionStorageService.addCollection(collection);

      if (this.parentCollection)
        await this.collectionStorageService.addChild(this.parentCollection, id, 'collection');

      this.navCtrl.navigateForward(['/collection', id]);
    } catch (error) {
      console.error('Failed to add new collection:', error);
    }
  }
}
