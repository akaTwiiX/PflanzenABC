import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import type { ChoiceName } from '@/shared/enums/ChoiceEntry';
import { ChoicesStorageService } from '@/shared/services/choices-storage.service';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss'],
  imports: [
    CommonModule,
    IonItem,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonSelect,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonInput,
    FormsModule,
  ],
})
export class ChoicesComponent implements OnInit {
  choiceStorageService = inject(ChoicesStorageService);

  @Input() multiple = false;

  @Input() selected: string | string[] | undefined = undefined;

  @Output() selectedChange = new EventEmitter<string | string[]>();

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
      const trimmed = this.newOption.trim();
      await this.choiceStorageService.addValue(this.choiceName, trimmed);

      if (this.multiple) {
        const current = Array.isArray(this.selected) ? this.selected : [];
        this.selected = [...current, trimmed];
      } else {
        this.selected = trimmed;
      }

      this.selectedChange.emit(this.selected);
      this.closeAddModal();
      this.getOptions();
    }
  }

  onSelectChange(value: string | string[]) {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  async getOptions() {
    this.options = await this.choiceStorageService.getChoicesByName(this.choiceName);
  }
}
