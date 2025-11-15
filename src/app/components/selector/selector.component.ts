import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SelectorOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  imports: [CommonModule]
})
export class SelectorComponent {
  @Input() value: string | string[] | undefined;
  @Output() valueChange = new EventEmitter<any>();

  @Input() options: SelectorOption[] = [];

  isSelected(option: SelectorOption) {
    if (Array.isArray(this.value))
      return this.value.includes(option.value);
    else
      return option.value === this.value;
  }

  select(optionValue: string) {
    let value = this.value;
    if(Array.isArray(value)){
      if(value.includes(optionValue))
        value = value.filter(v => v !== optionValue);
      else
      value = [...value, optionValue];
    }
    else
      value = optionValue;

    this.valueChange.emit(value);
  }
}
