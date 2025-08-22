import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonSelectOption, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonIcon, IonSelect, IonModal, IonInput, IonText, IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
  imports: [CommonModule, IonItem, IonSelectOption, IonButton, IonIcon, IonSelect, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonInput, FormsModule],
})
export class ChoicesComponent {

  @Input() options: string[] = [];

  /** Aktuell ausgewähltes Element */
  @Input() selected: string | undefined = undefined;

  /** Emits Änderungen zurück an den Parent */
  @Output() selectedChange = new EventEmitter<string>();
  @Output() optionsChange = new EventEmitter<string[]>();

  // Modal / neuer Wert
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
      this.options = [...this.options, this.newOption.trim()];
      this.selected = this.newOption.trim();

      this.optionsChange.emit(this.options);
      this.selectedChange.emit(this.selected);

      this.closeAddModal();
    }
  }

  onSelectChange(value: string) {
    this.selected = value;
    this.selectedChange.emit(value);
  }

}
