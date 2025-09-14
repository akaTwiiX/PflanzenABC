import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonText, IonButtons, IonSpinner, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantStorageService } from '@/services/plant-storage.service';
import { Plant } from '@/types/PlantType';
import { PlantDetailsComponent } from "src/app/components/plant-details/plant-details.component";
import { PlantFormService } from '@/services/plant-form.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.page.html',
  styleUrls: ['./plant.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonBackButton, IonText, IonButtons, PlantDetailsComponent, IonSpinner, IonIcon, IonButton]
})
export class PlantPage implements OnInit {

  route = inject(ActivatedRoute);
  plantStorageService = inject(PlantStorageService);
  plantFormService = inject(PlantFormService);
  router = inject(Router);

  plantId!: number
  isLoading = true;
  errorMsg = '';
  plant: Plant | undefined = undefined

  ngOnInit() {
    this.plantId = Number(this.route.snapshot.paramMap.get('id'))!;
  }

  ionViewWillEnter() {
    this.fetchPlantData(this.plantId);
  }

  async fetchPlantData(id: number) {
    this.isLoading = true;
    this.errorMsg = '';
    try {
      this.plant = await this.plantStorageService.getPlant(id);
      if (!this.plant) {
        this.errorMsg = 'Plant not found';
        return;
      }

    } catch (err) {
      console.error('Failed to fetch related data:', err);
      this.errorMsg = 'Failed to fetch related data';
    } finally {
      this.isLoading = false;
    }
  }

  goToAddPlant() {
    this.plantFormService.setPlant(this.plant!);
    this.router.navigate(['/add-plant'], {
      queryParams: { editId: this.plantId }
    });
  }
}
