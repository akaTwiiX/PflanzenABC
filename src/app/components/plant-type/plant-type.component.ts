import { Component, inject, OnInit } from '@angular/core';
import { IonLabel } from "@ionic/angular/standalone";
import { ChoicesComponent } from "../choices/choices.component";
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plant-type',
  templateUrl: './plant-type.component.html',
  styleUrls: ['./plant-type.component.scss'],
  imports: [IonLabel, ChoicesComponent, CommonModule],
})
export class PlantTypeComponent {

  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  options = ['Item A', 'Item B', 'Item C'];

}
