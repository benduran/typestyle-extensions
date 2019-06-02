
import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

export default function createStyles<
   T extends { [classkey: string]: NestedCSSProperties },
   K extends keyof T,
   O extends { [classKey in K]: string },
 >(styles: T): O {
  const out = Object.keys(styles).reduce((prev: O, classKey: string) => ({
    ...prev,
    [classKey]: style({
      ...styles[classKey],
      $debugName: process.env.NODE_ENV !== 'production' ? classKey : undefined,
    }),
  }) as O, {} as O);
  return out;
}
