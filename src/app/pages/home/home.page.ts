import { AuthService } from '@/services/auth.service';
import { PlantStorageService } from '@/services/plant-storage.service';
import { Plant } from '@/types/PlantType';
import { Component, ViewChild, inject } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonSearchbar, IonToolbar } from '@ionic/angular/standalone';
import { AddButtonComponent } from 'src/app/components/add-button/add-button.component';
import { DropdownListComponent } from 'src/app/components/dropdown-list/dropdown-list.component';
import { FilterButtonComponent } from 'src/app/components/filter-button/filter-button.component';
import { PlantListComponent } from 'src/app/components/plant-list/plant-list.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    DropdownListComponent,
    AddButtonComponent,
    FilterButtonComponent,
    IonSearchbar,
    PlantListComponent,
  ],
})
export class HomePage {
  authService = inject(AuthService);
  plantStorageService = inject(PlantStorageService);

  @ViewChild('dropdownList') dropdownList!: DropdownListComponent;

  filter: Partial<Plant> = {};
  searchQuery: string = '';
  searchResults: Plant[] = [];

  ionViewWillEnter() {
    this.dropdownList.resetData(this.filter);
  }

  onApplyFilter(filter: Partial<Plant>) {
    this.filter = filter;
    this.dropdownList.resetData(filter);
  }

  onResetFilter() {
    this.filter = {};
    this.dropdownList.resetData(this.filter);
  }

  async onSearch(event: CustomEvent) {
    this.searchQuery = event.detail.value || '';

    if (this.searchQuery) {
      this.searchResults = await this.plantStorageService.searchPlants(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }
}
