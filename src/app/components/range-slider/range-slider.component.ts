import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RangeSliderType } from '@/types/RangeSliderType';
import { IonRange, IonText } from '@ionic/angular/standalone';
import { CommaDecimalPipe } from "@/pipes/comma-decimal.pipe";

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
  imports: [IonRange, IonText, CommaDecimalPipe]
})
export class RangeSliderComponent<T extends string | number | null> implements OnChanges {
  @Input() label!: string;
  @Input() range: T[] = [];
  @Input() value!: RangeSliderType;
  @Output() valueChange = new EventEmitter<RangeSliderType>();

  min = 0;
  max = 0;
  lower = 0;
  upper = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['range']) {
      this.max = this.range.length - 1;
    }

    if (changes['value'] && this.value) {
      this.lower = this.getIndex(this.value.start, 0);
      this.upper = this.getIndex(this.value.end, this.range.length - 1);
    }
  }

  private getIndex(val: any, fallback: number): number {
    const index = this.range.indexOf(val);
    return index >= 0 ? index : fallback;
  }

  onChange(ev: CustomEvent) {
    const { lower, upper } = ev.detail.value;
    const start = this.range[lower];
    const end = this.range[upper];
    this.valueChange.emit({ start, end });
  }
}
