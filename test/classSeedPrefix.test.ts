
import { getStyles } from 'typestyle';
import uuid from 'uuid-random';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  classSeedPrefixRoot: {
    left: 999,
    height: 111,
  },
};

const prefix = `${uuid().replace(/-/g, '')}_`;
const styles = createStyles(s, prefix);
const renderedStyles = getStyles();

test('Generated class names contain user-provided prefix', () => {
  expect(renderedStyles.indexOf(styles.classSeedPrefixRoot)).toBeGreaterThan(-1);
  const classSeedSelector = `.${styles.classSeedPrefixRoot}`;
  expect(
    getCSSBySelector(classSeedSelector, 'left', renderedStyles),
  ).toEqual(`${s.classSeedPrefixRoot.left}px`);
  expect(
    getCSSBySelector(classSeedSelector, 'height', renderedStyles),
  ).toEqual(`${s.classSeedPrefixRoot.height}px`);
  expect(styles.classSeedPrefixRoot).toContain(prefix);
});
