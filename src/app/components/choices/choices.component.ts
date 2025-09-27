import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonSelectOption, IonButton, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonIcon, IonSelect, IonModal, IonInput, IonText, IonLabel } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoiceName } from '@/enums/ChoiceEntry';
import { ChoicesStorageService } from '@/services/choices-storage.service';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
  imports: [CommonModule, IonItem, IonSelectOption, IonButton, IonIcon, IonSelect, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonInput, FormsModule],
})
export class ChoicesComponent implements OnInit {

  choiceStorageService = inject(ChoicesStorageService);


  @Input() selected: string | undefined = undefined;

  @Output() selectedChange = new EventEmitter<string>();

  @Input() choiceName!: ChoiceName;

  options: string[] = [];
  showAddModal = false;
  newOption = '';

  ngOnInit(): void {
    this.getOptions();
  }

  openAddItemModal() {
    this.showAddModal = true;
    this.newOption = '';
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  async addNewOption() {
    if (this.newOption.trim()) {
      this.selected = this.newOption.trim();
      await this.choiceStorageService.addValue(this.choiceName, this.selected);

      this.selectedChange.emit(this.selected);

      this.closeAddModal();
    }
  }

  onSelectChange(value: string) {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  async getOptions() {
    this.options = await this.choiceStorageService.getChoicesByName(this.choiceName);
  }

}
