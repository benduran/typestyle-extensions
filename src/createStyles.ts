
import { cssRule, style } from 'typestyle';
import { NestedCSSSelectors } from 'typestyle/lib/types';

import generateRandomClassNameBase from './generateRandomClassNameBase';
import { IStylesheet } from './utilTypes';

function generateNestedStyles($nest: NestedCSSSelectors, parentSelector: string, classKeyClassNameMap: { [classKey: string]: string }) {
  Object.entries($nest).forEach(([currSelector, styles]) => {
    if (styles) {
      let replacedSelector = currSelector.replace(/&/gm, parentSelector);
      Object.keys(classKeyClassNameMap).forEach((classKey) => {
        const selector = `.${classKeyClassNameMap[classKey]}`;
        replacedSelector = replacedSelector.replace(`\$${classKey}`, selector);
      });
      const { $nest: $innerNest, ...rest } = styles;
      cssRule(replacedSelector, rest);
      if ($innerNest) generateNestedStyles($innerNest, replacedSelector, classKeyClassNameMap);
    }
  });
}

export default function createStyles<
  T extends { [classKey: string]: IStylesheet },
  K extends keyof T,
  O extends { [classKey in K]: string },
> (styles: T, useFriendlyNames: boolean = process.env.NODE_ENV !== 'production'): O {
  const seen: any = {};
  return Object.entries(styles).reduce((
    prev: O,
    [classKey, classKeyStyles]: [string, IStylesheet],
  ) => {
    const { $mediaQueries = [], $nest, ...rest } = classKeyStyles;
    // While this is less optimal that letting TypeStyle figure out which styles it can duplicate
    // it results in many fewer styling issues that are non obvious because of rule sharing among parent selectors
    const generatedClassName = style({ ...rest, $debugName: useFriendlyNames ? classKey : generateRandomClassNameBase() }, ...$mediaQueries);
    seen[classKey] = generatedClassName;
    if ($nest) generateNestedStyles($nest, `.${generatedClassName}`, seen);
    return Object.assign(prev, {
      [classKey]: generatedClassName,
    });
  }, {} as O);
}
