
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  funko: {
    border: '1px solid black',
  },
  funkolay: {
    backgroundColor: '#ffffffcc',
  },
  funky: {
    $nest: {
      '&:hover': {
        $nest: {
          '& > $funkolay': {
            opacity: 1,
          },
        },
      },
    },
    background: 'no-repeat center center',
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test.only('Funky nesting', () => {
  const funkySelector = `.${styles.funky}`;
  const funkyOverlaySelector = `.${styles.funkolay}`;
  const hoverSelector = `${funkySelector}:hover > ${funkyOverlaySelector}`;
  expect(renderedStyles).toContain(funkySelector);
  expect(renderedStyles).toContain(funkyOverlaySelector);
  expect(renderedStyles).toContain(hoverSelector);
  expect(
    getCSSBySelector(
      funkySelector,
      'background',
      renderedStyles,
    ),
  ).toEqual('no-repeat center center');
  expect(
    getCSSBySelector(
      hoverSelector,
      'opacity',
      renderedStyles,
    ),
  ).toEqual('1');
  expect(
    getCSSBySelector(
      funkyOverlaySelector,
      'background-color',
      renderedStyles,
    ),
  ).toEqual('#ffffffcc');
});
