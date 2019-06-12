
import { getStyles } from 'typestyle';

import { createStyles, mediaQueries } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  basicMediaQuery: {
    $mediaQueries: [
      mediaQueries.widthDown('md', {
        height: 400,
        width: 900,
      }),
    ],
    padding: 16,
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Basic media query', () => {
  const basicMediaQuerySelector = `.${styles.basicMediaQuery}`;
  expect(
    getCSSBySelector(basicMediaQuerySelector, 'padding', renderedStyles),
  ).toEqual(`${s.basicMediaQuery.padding}px`);
  expect(
    getCSSBySelector(
      basicMediaQuerySelector,
      'height',
      renderedStyles,
      '(max-width: 960px)',
    ),
  ).toEqual('400px');
  expect(
    getCSSBySelector(
      basicMediaQuerySelector,
      'width',
      renderedStyles,
      '(max-width: 960px)',
    ),
  ).toEqual('900px');
});
