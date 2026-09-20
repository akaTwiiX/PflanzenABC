import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
} from '@ionic/angular/standalone';
import { distanceRange } from '../../shared/consts/distanceRange';
import { monthRange } from '../../shared/consts/monthRange';
import { ChoiceName } from '../../shared/enums/ChoiceEntry';
import {
  icons,
  LightRequirement,
  LightRequirementLabel,
} from '../../shared/enums/LightRequirements';
import { CHECKBOX_ARRAY, type CheckboxItem } from '../../shared/modals/plant-checkbox.config';
import { ChoicesStorageService } from '../../shared/services/choices-storage.service';
import type { Plant } from '../../shared/types/PlantType';
import type { RangeSliderType } from '../../shared/types/RangeSliderType';
import { RangeSliderComponent } from '../range-slider/range-slider.component';
import type { SelectorOption } from '../selector/selector.component';
import { SelectorComponent } from '../selector/selector.component';

interface rangeFilter {
  checked: boolean;
  range: RangeSliderType;
}

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonModal,
    IonItem,
    IonList,
    IonCheckbox,
    IonLabel,
    FormsModule,
    SelectorComponent,
    RangeSliderComponent,
    IonImg,
    CommonModule,
  ],
})
export class FilterButtonComponent {
  @Output() applyFiltersFn = new EventEmitter<Partial<Plant>>();
  @Output() resetFiltersFn = new EventEmitter<void>();

  choiceStorageService = inject(ChoicesStorageService);

  readonly options: SelectorOption[] = Object.values(LightRequirement).map(lr => ({
    value: lr,
    label: LightRequirementLabel[lr],
    icon: icons[lr],
  }));

  readonly checkboxArray = signal([...CHECKBOX_ARRAY]);

  readonly selected = signal([]);

  readonly distanceRange = distanceRange;
  readonly monthRange = monthRange;

  height: rangeFilter = {
    checked: false,
    range: {
      start: distanceRange[0],
      end: distanceRange.at(-1)!,
    },
  };

  bloomTime: rangeFilter = {
    checked: false,
    range: {
      start: monthRange[0],
      end: monthRange.at(-1)!,
    },
  };

  readonly isChecked = computed(() => {
    return (
      this.selected().length > 0 ||
      this.checkboxArray().some(box => box.checked) ||
      this.height.checked ||
      this.bloomTime.checked
    );
  });

  readonly allPlantTypes = computed(async () => {
    const types = await this.choiceStorageService.getChoicesByName(ChoiceName.PlantType);

    return types;
  });

  readonly filterTypes = signal<string[]>([]);

  toggleCheckbox(item: CheckboxItem) {
    this.checkboxArray.update(boxes =>
      boxes.map(box => (box.name === item.name ? { ...box, checked: !box.checked } : box)),
    );
  }

  toggleTypeBox(type: string) {
    this.filterTypes.update(
      types =>
        types.includes(type)
          ? types.filter(t => t !== type) // entfernen
          : [...types, type], // hinzufügen
    );
  }

  resetFilters() {
    this.selected.set([]);
    this.checkboxArray.update(boxes => boxes.map(box => ({ ...box, checked: false })));
    this.height.checked = false;
    this.bloomTime.checked = false;

    this.resetFiltersFn.emit();
  }

  applyFilters() {
    const filter: Partial<Plant> = {};

    if (this.selected().length > 0) {
      filter.light = this.selected();
    }

    this.checkboxArray().forEach(box => {
      if (box.checked) {
        filter[box.name] = box.checked;
      }
    });

    if (this.height.checked) {
      filter.height = this.height.range;
    }

    if (this.bloomTime.checked) {
      filter.bloomTime = this.bloomTime.range;
    }

    console.log(filter);

    this.applyFiltersFn.emit(filter);
  }
}
