
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  nestTest: {
    $nest: {
      '& > div': {
        backgroundColor: 'pink',
      },
    },
    borderBottom: '1px solid green',
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Basic Nest', () => {
  const nestSelector = `.${styles.nestTest}`;
  expect(
    getCSSBySelector(nestSelector, 'border-bottom', renderedStyles),
  ).toEqual(s.nestTest.borderBottom);
  expect(
    getCSSBySelector(
      `${nestSelector} > div`,
      'background-color',
      renderedStyles,
    ),
  ).toEqual(s.nestTest.$nest!['& > div']!.backgroundColor);
});
