import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaDecimal',
  standalone: true
})
export class CommaDecimalPipe implements PipeTransform {

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace('.', ',');
  }

}
