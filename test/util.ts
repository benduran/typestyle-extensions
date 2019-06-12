
import { parse as parseCss } from 'css';

const regex = /(?:([a-z0-9][A-Z]))/g;

export function varNameToCSSName(varName: string): string {
  const matches: string[] = [];
  let currMatch = regex.exec(varName);
  while (currMatch) {
    matches.push(currMatch[1]);
    currMatch = regex.exec(varName);
  }
  if (matches) {
    return matches.reduce((prev: string, m: string) => prev.replace(m, `${m[0]}-${m[1].toLowerCase()}`), varName);
  }
  return varName;
}

export function getCSSBySelector(
  selector: string,
  prop: string,
  css: string,
  mediaQuery?: string,
): string | null {
  const parsed = parseCss(css);
  if (parsed.stylesheet) {
    for (const rule of parsed.stylesheet.rules) {
      const r = rule as any;
      if (!mediaQuery && 'selectors' in r) {
        if (r.selectors.some((sInner: any) => sInner === selector)) {
          return r.declarations.find((d: any) => d.property === prop).value;
        }
      }
      if (mediaQuery && 'media' in r) {
        if (r.media === mediaQuery) {
          for (const nestedRule of r.rules) {
            if ('selectors' in nestedRule) {
              if (nestedRule.selectors.some((sInner: any) => sInner === selector))  {
                return nestedRule.declarations.find((d: any) => d.property === prop).value;
              }
            }
          }
        }
      }
    }
  }
  return null;
}
