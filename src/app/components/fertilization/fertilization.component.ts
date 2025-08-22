import { Component, inject, OnInit } from '@angular/core';
import { IonLabel, IonItem, IonCheckbox, IonInput } from "@ionic/angular/standalone";
import { ChoicesComponent } from "../choices/choices.component";
import { PlantFormService } from '@/services/plant-form.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-fertilization',
  templateUrl: './fertilization.component.html',
  styleUrls: ['./fertilization.component.scss'],
  imports: [IonLabel, ChoicesComponent, CommonModule, IonCheckbox, IonItem, IonInput],
})
export class FertilizationComponent implements OnInit {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  options = ['Item A', 'Item B', 'Item C'];

  constructor() { }

  ngOnInit() { }

}
