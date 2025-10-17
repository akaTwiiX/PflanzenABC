import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonContent, IonItem, IonModal, IonInput } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { CollectionStorageService } from '@/services/collection-storage.service';
import { Collection } from '@/types/Collection';
import { getFirstLetter } from '@/utils/string.utils';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  imports: [IonButton, IonIcon, IonContent, IonItem, IonModal, IonInput, FormsModule],
})
export class AddButtonComponent implements OnInit {

  @Input()
  parentCollection?: number;

  newCollection: string = '';
  router = inject(Router);
  collectionStorageService = inject(CollectionStorageService);



  ngOnInit() { }

  navigateToAddPlant() {
    if (this.parentCollection) {
      this.router.navigate(['/add-plant'], {
        queryParams: { parentId: this.parentCollection }
      });
    } else {
      this.router.navigate(['/add-plant']);
    }
  }


  async addNewCollection() {
    const collection: Collection = {
      name: this.newCollection,
      description: '',
      plantIds: [],
      collectionIds: [],
      updatedAt: new Date().toISOString()
    };

    if (!this.parentCollection)
      collection.initialId = getFirstLetter(this.newCollection);

    try {
      const id = await this.collectionStorageService.addCollection(collection);

      if (this.parentCollection)
        await this.collectionStorageService.addChild(this.parentCollection, id, 'collection');

      this.router.navigate(['/collection', id]);
    } catch (error) {
      console.error('Failed to add new collection:', error);
    }
  }

}
