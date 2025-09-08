import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AddButtonComponent } from "src/app/components/add-button/add-button.component";
import { PlantStorageService } from '@/services/plant-storage.service';
import { CollectionStorageService } from '@/services/collection-storage.service';
import { Collection } from '@/types/Collection';
import { Plant } from '@/types/PlantType';
import { PlantListComponent } from "src/app/components/plant-list/plant-list.component";

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonList, AddButtonComponent, PlantListComponent]
})
export class CollectionPage implements OnInit {
  collectionId!: number;
  route = inject(ActivatedRoute);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);

  collection: Collection | undefined = undefined;
  plants: Plant[] = [];
  collections: Collection[] = [];

  isLoading = true;


  ngOnInit() {
    this.collectionId = Number(this.route.snapshot.paramMap.get('id'))!;
  }

  ionViewWillEnter() {
    this.fetchCollectionData(this.collectionId);
  }

  async fetchCollectionData(id: number) {
    this.isLoading = true;
    try {
      this.collection = await this.collectionStorageService.getCollection(id);

      if (!this.collection) {
        this.plants = [];
        this.collections = [];
        return;
      }

      const [plants, collections] = await Promise.all([
        this.plantStorageService.bulkGet(this.collection.plantIds),
        this.collectionStorageService.bulkGet(this.collection.collectionIds),
      ]);

      this.plants = plants;
      this.collections = collections;
    } catch (err) {
      console.error('Failed to fetch related data:', err);
      this.plants = [];
      this.collections = [];
    } finally {
      this.isLoading = false;
    }
  }


}
