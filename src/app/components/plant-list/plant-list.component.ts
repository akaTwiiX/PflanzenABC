import { Collection } from '@/types/Collection';
import { ListItem } from '@/types/ListItem';
import { Plant } from '@/types/PlantType';
import { CdkVirtualForOf, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonItem, IonSpinner, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [IonItem, IonSpinner, IonIcon, CommonModule, IonText, ScrollingModule, CdkVirtualForOf],
})
export class PlantListComponent implements OnChanges {
  @Input() plants: Plant[] = [];
  @Input() collections: Collection[] = [];
  @Input() isLoading = false;
  @Input() filter: Partial<Plant> = {};

  router = inject(Router);

  mergedItems: ListItem[] = [];
  isSorting = signal(false);

  get viewportHeight() {
    const itemHeight = 80;
    const totalHeight = this.mergedItems.length * itemHeight;
    return totalHeight + 0 + 'px';
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
    this.isSorting.set(true);
    const worker = new Worker(new URL('../../shared/workers/list-sort.worker', import.meta.url));
    worker.onmessage = ({ data }) => {
      this.mergedItems = data;
      this.isSorting.set(false);
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
