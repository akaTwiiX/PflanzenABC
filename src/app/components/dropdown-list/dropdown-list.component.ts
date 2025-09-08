import { CollectionStorageService } from '@/services/collection-storage.service';
import { PlantStorageService } from '@/services/plant-storage.service';
import { Collection } from '@/types/Collection';
import { Plant } from '@/types/PlantType';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { PlantListComponent } from "../plant-list/plant-list.component";

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  imports: [
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    IonIcon,
    CommonModule,
    PlantListComponent
  ],
})
export class DropdownListComponent implements OnInit {
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);

  plants: Plant[] = [];
  collections: Collection[] = [];

  expandedLetter: string | null = null;
  isLoading = true;

  constructor() { }

  ngOnInit() { }

  ionViewWillEnter() {
    if (this.expandedLetter)
      this.fetchPlants(this.expandedLetter);
  }

  onAccordionChange(event: any) {
    const value = event.detail.value;

    if (value && value !== this.expandedLetter) {
      this.expandedLetter = value;
      this.fetchPlants(value);
    }
  }

  async fetchPlants(letter: string) {
    this.isLoading = true;
    try {
      const [plants, collections] = await Promise.all([
        this.plantStorageService.queryBy('initialId', letter),
        this.collectionStorageService.queryBy('initialId', letter),
      ]);

      this.plants = plants;
      this.collections = collections;
    } catch (err) {
      console.error('Failed to fetch plants and collections:', err);
      this.plants = [];
      this.collections = [];
    } finally {
      this.isLoading = false;
    }
  }


}
