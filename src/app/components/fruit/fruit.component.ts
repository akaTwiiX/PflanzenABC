import { Component, inject, OnInit } from '@angular/core';
import { IonItem, IonLabel, IonCheckbox } from "@ionic/angular/standalone";
import { RangeSliderComponent } from "../range-slider/range-slider.component";
import { PlantFormService } from '@/services/plant-form.service';
import { monthRange } from '@/consts/monthRange';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss'],
  imports: [IonItem, IonLabel, IonCheckbox, RangeSliderComponent, CommonModule],
})
export class FruitComponent implements OnInit {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;
  monthRange = monthRange;

  ngOnInit() { }

}
