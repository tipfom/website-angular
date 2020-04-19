import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localedelta'
})
export class LocaledeltaPipe implements PipeTransform {

  constructor(private translateService: TranslateService){

  }

  transform(value: number, ...args: unknown[]): string {
    return (Math.sign(value) > 0 ? "+" : "−") + Math.abs(value).toLocaleString(this.translateService.currentLang, { useGrouping: true });
  }

}
