import { CdkVirtualForOf, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, inject, Input, signal } from '@angular/core';
// import { Router } from '@angular/router';
import { IonIcon, IonItem, IonSpinner, IonText, NavController } from '@ionic/angular/standalone';
import type { Collection } from '../../shared/types/Collection';
import type { ListItem } from '../../shared/types/ListItem';
import type { Plant } from '../../shared/types/PlantType';

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

  navCtrl = inject(NavController);

  mergedItems: ListItem[] = [];
  isSorting = signal(false);

  get viewportHeight() {
    const itemHeight = 80;
    const totalHeight = this.mergedItems.length * itemHeight;
    return `${totalHeight + 0}px`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('plants' in changes || 'collections' in changes) {
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
    this.navCtrl.navigateForward([page, id], {
      queryParams: {
        filter: JSON.stringify(this.filter),
      },
    });
  }
}
