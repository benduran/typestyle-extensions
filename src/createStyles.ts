
import { NestedCSSProperties } from 'typestyle/lib/types';

import replaceNests from './replaceNests';

export default function createStyles<
   T extends { [classkey: string]: NestedCSSProperties },
   K extends keyof T,
   O extends { [classKey in K]: string },
 >(styles: T): O {
  return replaceNests<T, K, O>(styles);
}
