import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localeint'
})
export class LocaleintPipe implements PipeTransform {

  constructor(private translateService: TranslateService){
  }

  transform(value: number, ...args: unknown[]): string {
    return value.toLocaleString(this.translateService.currentLang, { useGrouping: true });
  }

}
