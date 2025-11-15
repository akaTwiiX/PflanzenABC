import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon, IonModal, IonItem, IonList, IonLabel, IonCheckbox } from "@ionic/angular/standalone";
import { SelectorComponent, SelectorOption } from "../selector/selector.component";
import { icons, LightRequirement, LightRequirementLabel } from '@/enums/LightRequirements';
import { Plant } from '@/types/PlantType';
import { FormsModule } from '@angular/forms';
import { CHECKBOX_ARRAY } from '@/modals/plant-checkbox.config';
import { RangeSliderComponent } from "../range-slider/range-slider.component";
import { RangeSliderType } from '@/types/RangeSliderType';
import { distanceRange } from '@/consts/distanceRange';
import { monthRange } from '@/consts/monthRange';

type rangeFilter = {
  checked: boolean,
  range: RangeSliderType
}

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
  imports: [IonButton, IonIcon, IonModal, SelectorComponent, IonItem, IonList, IonCheckbox, IonLabel, FormsModule, RangeSliderComponent],
})
export class FilterButtonComponent implements OnInit {

  readonly options: SelectorOption[] = Object.values(LightRequirement).map(lr => ({
    value: lr,
    label: LightRequirementLabel[lr],
    icon: icons[lr],
  }));

  checkboxArray = CHECKBOX_ARRAY;

  selected = [];

  distanceRange = distanceRange;
  monthRange = monthRange;

  height: rangeFilter = {
    checked: false,
    range: {
      start: distanceRange[0],
      end: distanceRange[distanceRange.length - 1]
    }
  };

  bloomTime: rangeFilter = {
    checked: false,
    range: {
      start: monthRange[0],
      end: monthRange[monthRange.length - 1]
    }
  };


  constructor() { }

  ngOnInit() {
  }

  applyFilters() {
    const filter: Partial<Plant> = {};

    if (this.selected.length > 0) {
      filter.light = this.selected;
    }

    this.checkboxArray.forEach(box => {
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
  }

}
