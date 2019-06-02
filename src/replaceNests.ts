
import { cssRule, getStyles, style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

/**
 * This is kind of gross, but it works.
 * Eventually, migrate to not mutating the first parameter, as that's pretty crappy (though it's easier to understand)
 */
function recurseReplaceNestsInNests (
  nested: NestedCSSProperties['$nest'] = {},
  outBuilder: { [nestedSelector: string]: string },
) {
  const outputKeys = Object.keys(outBuilder);
  for (const ok of outputKeys) {
    const $ok = `\$${ok}`;
    for (const cssSelector in nested) {
      const replacedSelector = cssSelector.replace(/&/g, `.${outBuilder[ok]}`).replace($ok, `.${outBuilder[ok]}`);
      if (cssSelector !== replacedSelector) {
        nested[replacedSelector] = nested[cssSelector];
        delete nested[cssSelector];
        if ('$nest' in nested[replacedSelector]!) recurseReplaceNestsInNests((nested[replacedSelector] as any).$nest as any, outBuilder);
      }
    }
  }
}

export default function replaceNests<
  T extends { [classKey: string]: NestedCSSProperties },
  K extends keyof T,
  O extends { [classKey in K]: string },
> (styles: T): O {
  const out: any = {};
  Object.keys(styles).forEach((classKey) => {
    // Need to find the nested $nest statements and extract them for later use
    // Because we need to do a first-pass at the top-level CSS rules, get the generated classname,
    // then inject into the $nest selectors and then perform cssRule()
    const it = styles[classKey];
    const styleKeys = Object.keys(it);
    if (styleKeys.some(sk => sk === '$nest')) {
      // Okay, we've got a nested $nest key, so we need to pluck that from this object
      const { $nest, ...cssRules } = it;
      const generatedClassName = style({ ...cssRules, $debugName: process.env.NODE_ENV !== 'production' ? classKey : undefined });
      // need to loop over all $nest keys
      out[classKey] = generatedClassName;
      recurseReplaceNestsInNests($nest, out);
      Object.keys($nest!).forEach(rule => cssRule(rule, $nest![rule]!));
    } else out[classKey] = style({ ...it, $debugName: process.env.NODE_ENV !== 'production' ? classKey : undefined });
  });
  return out as O;
}

if (!module.parent) {
  const ruleTest: { [classKey: string]: NestedCSSProperties } = {
    button: {
      $nest: {
        '& > span': {
          $nest: {
            '& div, & $button': {
              color: 'purplenurple',
            },
          },
        },

      },
      backgroundColor: 'white',
      color: 'red',
    },
  };
  const thing = replaceNests(ruleTest);
  console.info(thing);
  const styles = getStyles();
  console.info(styles);
}
