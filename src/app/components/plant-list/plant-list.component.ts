import { Collection } from '@/types/Collection';
import { ListItem } from '@/types/ListItem';
import { Plant } from '@/types/PlantType';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IonItem, IonSpinner, IonIcon, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [IonItem, IonSpinner, IonIcon, CommonModule, IonText],
})
export class PlantListComponent implements OnChanges {
  @Input() plants: Plant[] = [];
  @Input() collections: Collection[] = [];
  @Input() isLoading = false;

  router = inject(Router);

  mergedItems: ListItem[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['plants'] || changes['collections']) {
      this.mergeAndSort();
    }
  }

  private mergeAndSort() {
    const mappedCollections: ListItem[] = this.collections.map((c) => ({
      id: c.id,
      displayName: c.name,
      type: 'collection',
      path: '/collection',
    }));

    const mappedPlants: ListItem[] = this.plants.map((p) => ({
      id: p.id,
      displayName: p.nameLatin,
      type: 'plant',
      path: '/plant',
    }));

    this.mergedItems = [...mappedCollections, ...mappedPlants].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  }

  goTo(page: string, id: number | undefined) {
    this.router.navigate([page, id]);
  }

}
