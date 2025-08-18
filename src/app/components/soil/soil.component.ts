import { Component, OnInit } from '@angular/core';
import { IonItem, IonSelectOption, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonIcon, IonSelect, IonModal, IonInput, IonText, IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss'],
  imports: [CommonModule, IonItem, IonSelectOption, IonButton, IonIcon, IonSelect, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonInput, FormsModule, IonText, IonLabel],
})
export class SoilComponent implements OnInit {
  options = ['Item 1', 'Item 2', 'Item 3'];
  selectedItem = '';
  showAddModal = false;
  newOption = '';

  openAddItemModal() {
    this.showAddModal = true;
    this.newOption = '';
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addNewOption() {
    if (this.newOption.trim()) {
      this.options.push(this.newOption.trim());
      this.selectedItem = this.newOption.trim();
      this.closeAddModal();
    }
  }

  ngOnInit(): void {

  }

}
