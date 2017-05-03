import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    return items ? items.filter(item => !value || item[field].includes(value)) : [];
  }
}
