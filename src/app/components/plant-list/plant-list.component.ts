import { Collection } from '@/types/Collection';
import { Plant } from '@/types/PlantType';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItem, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [IonItem, IonSpinner],
})
export class PlantListComponent implements OnInit {
  @Input() plants: Plant[] = [];
  @Input() collections: Collection[] = [];
  @Input() isLoading = false;

  router = inject(Router);

  constructor() { }

  ngOnInit() { }

  goTo(page: string, id: number | undefined) {
    this.router.navigate([page, id]);
  }

}
