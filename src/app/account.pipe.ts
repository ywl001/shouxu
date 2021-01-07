import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'account'
})
export class AccountPipe implements PipeTransform {

  transform(value:string): string {
    return value.match(/[\w\.@]{6,}/g).join(",")
  }

}
