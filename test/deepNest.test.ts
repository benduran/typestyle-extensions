
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  deepNest: {
    $nest: {
      '&:hover > span': {
        $nest: {
          '&:focus': {
            color: 'yellow',
          },
        },
        backgroundImage: 'url(yay.png)',
      },
    },
    fontFamily: 'Arial',
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Deep Nest', () => {
  const deepSelector = `.${styles.deepNest}`;
  expect(
    getCSSBySelector(deepSelector, 'font-family', renderedStyles),
  ).toEqual(s.deepNest.fontFamily);
  expect(
    getCSSBySelector(
      `${deepSelector}:hover > span`,
      'background-image',
      renderedStyles,
    ),
  ).toEqual(s.deepNest.$nest!['&:hover > span']!.backgroundImage);
  expect(
    getCSSBySelector(
      `${deepSelector}:hover > span:focus`,
      'color',
      renderedStyles,
    ),
  ).toEqual(s.deepNest.$nest!['&:hover > span']!.$nest!['&:focus']!.color);
});
