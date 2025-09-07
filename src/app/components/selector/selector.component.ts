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
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  // Optionen jetzt von außen gesetzt
  @Input() options: SelectorOption[] = [];

  select(optionValue: string) {
    this.valueChange.emit(optionValue);
  }
}
