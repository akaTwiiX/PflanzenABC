import { Component, inject, OnInit } from '@angular/core';
import { IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoicesComponent } from "../choices/choices.component";
import { PlantFormService } from '@/services/plant-form.service';

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss'],
  imports: [CommonModule, FormsModule, IonLabel, ChoicesComponent],
})
export class SoilComponent implements OnInit {
  plantFormService = inject(PlantFormService);
  plantForm$ = this.plantFormService.plantForm$;

  options = ['Item 1', 'Item 2', 'Item 3'];

  ngOnInit(): void {

  }

}
