import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform(value: Array<any>, property: string=null,order: boolean=true, ): any {
    if(value){
      if (order) {
        if (property)
          return value.sort((a, b) => b[property] - a[property]);
        return value.sort((a, b) => b - a)
      }else{
        if (property)
          return value.sort((a, b) => a[property] - b[property]);
        return value.sort((a, b) => a - b)
      }
    }
  }
}
