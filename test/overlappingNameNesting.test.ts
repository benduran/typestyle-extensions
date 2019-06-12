
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';

const s: IStyleTest = {
  funko: {
    border: '1px solid black',
  },
  funkolay: {
    backgroundColor: '#ffffffcc',
    bottom: 0,
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    transition: 'opacity .2s ease',
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
    backgroundColor: '#ccc',
    backgroundSize: 'cover',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: '60%',
    position: 'relative',
    width: '100%',
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test.only('Funky nesting', () => {
  const funkySelector = `.${styles.funky}`;
  const funkyOverlaySelector = `.${styles.funkolay}`;
  expect(renderedStyles).toContain(funkySelector);
  expect(renderedStyles).toContain(funkyOverlaySelector);
  expect(renderedStyles).toContain(`${funkySelector}:hover > ${funkyOverlaySelector}`);
});
