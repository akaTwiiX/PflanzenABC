import { Component, inject, OnInit } from '@angular/core';
import { IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoicesComponent } from "../choices/choices.component";
import { PlantFormService } from '@/services/plant-form.service';
import { ChoiceName } from '@/enums/ChoiceEntry';

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss'],
  imports: [CommonModule, FormsModule, IonLabel, ChoicesComponent],
})
export class SoilComponent {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  ChoiceName = ChoiceName;


}
