
import { media } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

export interface IBreakpoints {
  [size: string]: number;
}

let breakpoints: IBreakpoints = {
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

type BreakpointSize = keyof IBreakpoints;

export function setBreakpointSizes(breakpointSizes: IBreakpoints) {
  breakpoints = breakpointSizes;
}

export function widthDown(size: BreakpointSize, styles: NestedCSSProperties): NestedCSSProperties {
  return media({ maxWidth: breakpoints[size] }, styles);
}

export function widthUp(size: BreakpointSize, styles: NestedCSSProperties): NestedCSSProperties {
  return media({ minWidth: breakpoints[size] }, styles);
}
