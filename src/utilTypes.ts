
import { NestedCSSProperties } from 'typestyle/lib/types';

export interface IStylesheet extends NestedCSSProperties {
  $mediaQueries?: NestedCSSProperties[];
}
