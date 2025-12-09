import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nullsafe'
})
export class NullsafePipe implements PipeTransform {

  transform(
    value: any,
    enumDict?: unknown,
    suffix?: string,
    defaultValue: string = '-',
    separator: string = ' ',
  ): unknown {
    const empty =
      typeof value === 'undefined' ||
      value === null ||
      JSON.stringify(value) === '{}' ||
      (typeof value === 'string' && (value === '' || value.trim() === ''));
    if (empty) {
      return defaultValue;
    }

    let val = value;
    if (enumDict) {
      const valueKey = `${value}`;
      if (Object.keys(enumDict).includes(valueKey)) {
        // @ts-ignore
        val = enumDict[valueKey];
      } else {
        return defaultValue;
      }
    }

    return suffix ? `${val}${separator}${suffix}` : val;
  }

}
