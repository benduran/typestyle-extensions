import { createTypeStyle, cssRule, style } from 'typestyle';
import { NestedCSSSelectors } from 'typestyle/lib/types';

import generateRandomClassNameBase from './generateRandomClassNameBase';
import { IStylesheet } from './utilTypes';

function generateNestedStyles(
  $nest: NestedCSSSelectors,
  parentSelector: string,
  classKeyClassNameMap: { [classKey: string]: string },
  classKeys: string[],
) {
  Object.entries($nest).forEach(([currSelector, styles]) => {
    if (styles) {
      let replacedSelector = currSelector.replace(/&/gm, parentSelector);
      classKeys.forEach((classKey) => {
        const selector = `.${classKeyClassNameMap[classKey]}`;
        replacedSelector = replacedSelector.replace(
          new RegExp(`\\$${classKey}`, 'gm'),
          selector,
        );
      });
      const { $nest: $innerNest, ...rest } = styles;
      cssRule(replacedSelector, rest);
      if ($innerNest) {
        generateNestedStyles(
          $innerNest,
          replacedSelector,
          classKeyClassNameMap,
          classKeys,
        );
      }
    }
  });
}

export default function createStyles<
  T extends { [classKey: string]: IStylesheet },
  K extends keyof T,
  O extends { [classKey in K]: string }
>(
  styles: T,
  classNamePrefix: string = '',
  createNewSheet: boolean = false,
  useFriendlyNames: boolean = process.env.NODE_ENV !== 'production',
): O {
  const tag = createNewSheet ? document.createElement('style') : null;
  if (tag) document.head.appendChild(tag);
  const instance = createNewSheet && tag ? createTypeStyle(tag) : null;
  const s = createNewSheet && instance ? instance.style : style;
  const seen: any = {};
  const out = Object.entries(styles).reduce(
    (prev: O, [classKey, classKeyStyles]: [string, IStylesheet]) => {
      const { $mediaQueries = [], $nest, ...rest } = classKeyStyles;
      // While this is less optimal that letting TypeStyle figure out which styles it can duplicate
      // it results in many fewer styling issues that are non obvious because of rule sharing among parent selectors
      const generatedClassName = s(
        {
          ...rest,
          $debugName: useFriendlyNames
            ? `${classNamePrefix}${classKey}`
            : generateRandomClassNameBase(classNamePrefix),
        },
        ...$mediaQueries,
      );
      seen[classKey] = generatedClassName;
      // Send in the current accumulated classKeys array, sorted by length in descending order.
      // This will prevent errors from occuring by premature matching of subset classkeys
      if ($nest) {
        generateNestedStyles(
          $nest,
          `.${generatedClassName}`,
          seen,
          Object.keys(seen).sort((a, b) => b.length - a.length),
        );
      }
      return Object.assign(prev, {
        [classKey]: generatedClassName,
      });
    },
    {} as O,
  );
  return out;
}
