import { parse as parseCss } from 'css';
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import * as mediaQueries from '../src/mediaQueries';
import { IStylesheet } from '../src/utilTypes';

interface IStyleTest {
  [classKey: string]: IStylesheet;
}

function getCSSBySelector(
  selector: string,
  prop: string,
  css: string,
  mediaQuery?: string,
): string | null {
  const parsed = parseCss(css);
  if (parsed.stylesheet) {
    for (const rule of parsed.stylesheet.rules) {
      const r = rule as any;
      if (!mediaQuery && 'selectors' in r) {
        if (r.selectors.some((sInner: any) => sInner === selector)) {
          return r.declarations.find((d: any) => d.property === prop).value;
        }
      }
      if (mediaQuery && 'media' in r) {
        if (r.media === mediaQuery) {
          for (const nestedRule of r.rules) {
            if ('selectors' in nestedRule) {
              if (nestedRule.selectors.some((sInner: any) => sInner === selector))  {
                return nestedRule.declarations.find((d: any) => d.property === prop).value;
              }
            }
          }
        }
      }
    }
  }
  return null;
}

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
  nestTopLevelDeep: {
    $nest: {
      '& $deepNest': {
        right: 23129312,
      },
    },
    left: 1000,
  },
  nestTest: {
    $nest: {
      '& > div': {
        backgroundColor: 'pink',
      },
    },
    borderBottom: '1px solid green',
  },
  root: {
    backgroundColor: 'red',
    marginLeft: '24em',
    zIndex: 111,
  },
};

const styles = createStyles(s);
let renderedStyles: string;

describe('Style tests', () => {
  beforeAll(() => {
    renderedStyles = getStyles();
  });
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
});
