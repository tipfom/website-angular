import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'delta'
})
export class DeltaNumberPipe implements PipeTransform {

  constructor() {
  }

  transform(value: number, ...args: unknown[]): string {
    return (Math.sign(value) > 0 ? "+" : "−") + Math.abs(value).toLocaleString('en', { useGrouping: true });
  }

}
