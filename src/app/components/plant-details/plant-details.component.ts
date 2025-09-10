import { icons as lightIcons, LightRequirementLabel } from '@/enums/LightRequirements';
import { PlantTypeLabel } from '@/enums/PlantTypes';
import { icons as waterIcons, WaterRequirementLabel } from '@/enums/WaterRequirements';
import { PlantFormService } from '@/services/plant-form.service';
import { Plant } from '@/types/PlantType';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonImg, IonLabel, IonText, IonButton, IonItem, IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss'],
  imports: [IonImg, IonLabel, IonText, IonButton, IonItem, IonList],
})
export class PlantDetailsComponent implements OnInit {
  @Input() plant!: Plant;

  plantFormService = inject(PlantFormService);

  plantTypeLabel = PlantTypeLabel;
  lightRequirementLabel = LightRequirementLabel;
  lightIcons = lightIcons

  waterRequirementLabel = WaterRequirementLabel;
  waterIcons = waterIcons;

  ngOnInit() { }

}
