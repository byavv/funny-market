import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort' })
export class SortPipe implements PipeTransform {
    transform(value: string): string {
        // milage+ --> milage ▲  ▼
        var type = value.substr(-1)
            .replace('-', '\f151')
            .replace('+', '\f151');          
        value = value.replace(/[+-]/, ' ');
        return value + type;
    }
}