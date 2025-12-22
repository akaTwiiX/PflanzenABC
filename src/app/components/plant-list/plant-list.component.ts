import { Collection } from '@/types/Collection';
import { ListItem } from '@/types/ListItem';
import { Plant } from '@/types/PlantType';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonItem, IonSpinner, IonText } from '@ionic/angular/standalone';

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
  @Input() filter: Partial<Plant> = {};

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
    const worker = new Worker(new URL('../../shared/workers/list-sort.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      this.mergedItems = data;
      worker.terminate();
    };
    worker.postMessage({ plants: this.plants, collections: this.collections });
  }

  goTo(page: string, id: number | undefined) {
    this.router.navigate([page, id], {
      queryParams: {
        filter: JSON.stringify(this.filter),
      },
    });
  }
}
