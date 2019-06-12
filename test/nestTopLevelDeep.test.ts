
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  deepNest: {
    borderRight: '5px dotted pink',
  },
  nestTopLevelDeep: {
    $nest: {
      '& $deepNest': {
        right: 23129312,
      },
    },
    left: 1000,
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Nest top level reference', () => {
  const nestTopLevelDeepSelector = `.${styles.nestTopLevelDeep}`;
  expect(
    getCSSBySelector(nestTopLevelDeepSelector, 'left', renderedStyles)!,
  ).toEqual(`${s.nestTopLevelDeep.left}px`);
  expect(
    getCSSBySelector(
      `${nestTopLevelDeepSelector} .${styles.deepNest}`,
      'right',
      renderedStyles,
    ),
  ).toEqual(`${s.nestTopLevelDeep.$nest!['& $deepNest']!.right}px`);
});
