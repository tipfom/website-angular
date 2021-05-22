import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'ngxDate'
})
export class NgxDatePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(value: any, pattern: string = 'fullDate'): unknown {
    return new Date(value).toLocaleString(this.translateService.currentLang, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

}
