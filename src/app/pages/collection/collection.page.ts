import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonButton,
  AlertController,
  ToastController,
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantStorageService } from '@/services/plant-storage.service';
import { CollectionStorageService } from '@/services/collection-storage.service';
import { Collection } from '@/types/Collection';
import { Plant } from '@/types/PlantType';
import { PlantListComponent } from 'src/app/components/plant-list/plant-list.component';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonList,
    PlantListComponent,
    IonButton,
    IonIcon,
  ],
})
export class CollectionPage {
  collectionId!: number;
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  plantStorageService = inject(PlantStorageService);
  collectionStorageService = inject(CollectionStorageService);
  alertCtrl = inject(AlertController);
  toastCtrl = inject(ToastController);

  collection: Collection | undefined = undefined;
  plants: Plant[] = [];
  collections: Collection[] = [];
  activeFilter: Partial<Plant> = {};

  isLoading = true;

  private destroy$ = new Subject<void>();

  ionViewWillEnter() {
    this.getRouteParams();
  }

  getRouteParams() {
    combineLatest([this.activateRoute.paramMap, this.activateRoute.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),
        map(([params, query]) => {
          const id = Number(params.get('id'));

          let filter = {};
          const f = query.get('filter');
          if (f) {
            try {
              filter = JSON.parse(f);
            } catch {}
          }

          return { id, filter };
        }),
      )
      .subscribe(({ id, filter }) => {
        this.collectionId = id;
        this.activeFilter = filter;
        this.fetchCollectionData(this.collectionId);
      });
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

  onAddPlant() {
    this.alertCtrl
      .create({
        header: 'Willst du wirklich eine Pflanze hinzufügen?',
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
          },
          {
            text: 'Hinzufügen',
            handler: () => {
              this.navigateToAddPlant();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  navigateToAddPlant() {
    this.router.navigate(['/add-plant'], {
      queryParams: { parentId: this.collectionId },
      replaceUrl: true,
    });
  }

  onDelete() {
    this.alertCtrl
      .create({
        header: 'Möchtest du diese Sammlung wirklich löschen?',
        message: `Es werden alle Pflanzen in ${this.collection?.name} gelöscht!`,
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
          },
          {
            text: 'Löschen',
            cssClass: 'alert-danger-button',
            handler: () => {
              this.deleteCollection();
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }

  async deleteCollection() {
    await this.plantStorageService.bulkDelete(this.collection!.plantIds);
    await this.collectionStorageService.removeCollection(this.collectionId);

    this.toastCtrl
      .create({
        message: 'Sammlung gelöscht',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      })
      .then((toast) => {
        toast.present();
        this.router.navigate(['/home']);
      });
  }

  ionViewDidLeave() {
    this.destroy$.next();
  }
}
