import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'sliderdate'
})
export class SliderdatePipe implements PipeTransform {

  date: Date = new Date("2020-01-22");

  constructor(private translateService: TranslateService) {
  }

  transform(value: number, ...args: unknown[]): string {
    let d = new Date(this.date);
    d.setDate(d.getDate() + value);
    return d.toLocaleString(this.translateService.currentLang, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

}
