import { Collection } from '@/types/Collection';
import { ListItem } from '@/types/ListItem';
import { Plant } from '@/types/PlantType';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IonItem, IonSpinner, IonIcon, IonText } from "@ionic/angular/standalone";
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [IonItem, IonSpinner, IonIcon, CommonModule, IonText, ScrollingModule],
})
export class PlantListComponent implements OnChanges {
  @Input() plants: Plant[] = [];
  @Input() collections: Collection[] = [];
  @Input() isLoading = false;

  router = inject(Router);

  mergedItems: ListItem[] = [];

  get viewportHeight() {
    const itemHeight = 50; 
    const totalHeight = this.mergedItems.length * itemHeight;
    return totalHeight + 'px';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['plants'] || changes['collections']) {

      this.mergeAndSort();
    }
  }

  trackByItem(_: number, item: ListItem) {
    return item.id;
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
