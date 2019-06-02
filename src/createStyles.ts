
import { getStyles } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

import replaceNests from './replaceNests';

export default function createStyles<
   T extends { [classkey: string]: NestedCSSProperties },
   K extends keyof T,
   O extends { [classKey in K]: string },
 >(styles: T): O {
  return replaceNests<T, K, O>(styles);
}

const s = createStyles({
  anchor: {
    display: 'flex',
  },
  zebra: {
    borderTop: '5px solid transparent',
    height: 0,
    width: 0,
  },
  separator: {
    $nest: {
      '& > $anchor': {
        $nest: {
          ' & > $zebra': {
            backgroundColor: 'pink',
          },
        },
        position: 'absolute',
      },
    },
    backgroundColor: 'red',
    border: '4px solid blue',
  },
});

console.info(s);
console.info(getStyles());
