import { Component, inject, OnInit } from '@angular/core';
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
  newCollection: string = '';
  router = inject(Router);
  collectionStorageService = inject(CollectionStorageService);



  ngOnInit() { }

  navigateToAddPlant() {
    this.router.navigate(['/add-plant']);
  }

  addNewCollection() {
    const collection: Collection = {
      name: this.newCollection,
      initialId: getFirstLetter(this.newCollection),
      description: '',
      plantIds: [],
      collectionIds: []
    }

    this.collectionStorageService.addCollection(collection).then((id) => {
      this.router.navigate(['/collection', id]);
    });
  }
}
