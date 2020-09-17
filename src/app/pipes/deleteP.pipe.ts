import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deleteP'
})
export class DeletePPipe implements PipeTransform {

  transform(value:string): string {
          
    return value.slice(3, value.length-4);
  }

}
