
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  root: {
    backgroundColor: 'red',
    marginLeft: '24em',
    zIndex: 111,
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Basic styles', () => {
  expect(renderedStyles.indexOf(styles.root)).toBeGreaterThan(-1);
  const rootSelector = `.${styles.root}`;
  expect(
    getCSSBySelector(rootSelector, 'background-color', renderedStyles),
  ).toEqual(s.root.backgroundColor);
  expect(
    getCSSBySelector(rootSelector, 'margin-left', renderedStyles),
  ).toEqual(s.root.marginLeft);
  expect(+getCSSBySelector(rootSelector, 'z-index', renderedStyles)!).toEqual(
    s.root.zIndex,
  );
});
