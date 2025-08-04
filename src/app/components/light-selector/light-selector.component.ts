import { LightRequirement } from '@/enums/LightRequirements';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-light-selector',
  templateUrl: './light-selector.component.html',
  styleUrls: ['./light-selector.component.scss'],
})
export class LightSelectorComponent {
  @Input() value!: LightRequirement | undefined;
  @Output() valueChange = new EventEmitter<LightRequirement>();

  readonly options = [
    { label: 'Sonne', value: LightRequirement.FULL_SUN, icon: 'assets/icons/full-sun.png' },
    { label: 'Halbschatten', value: LightRequirement.PARTIAL_SHADE, icon: 'assets/icons/half-sun.png' },
    { label: 'Schatten', value: LightRequirement.SHADE, icon: 'assets/icons/shade.png' },
  ];

  select(value: LightRequirement) {
    this.valueChange.emit(value);
  }

}
