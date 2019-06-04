
import { getStyles } from 'typestyle';

import { createStyles } from '../src';

describe('Style tests', () => {
  test('Basic styles', () => {
    const s = {
      root: {
        backgroundColor: 'red',
        marginLeft: '24em',
        zIndex: 111,
      },
    };
    const styles = createStyles(s);
    const renderedStyles = getStyles();
    expect(renderedStyles.indexOf(styles.root)).toBeGreaterThan(-1);
    const rootStyles = renderedStyles.substring(renderedStyles.indexOf('{') + 1, renderedStyles.indexOf('}'));
    const backgroundColorRegex = /background\-color:(\w+);?/;
    const marginLeftRegex = /margin\-left:(\w+);?/;
    const zIndexRegex = /z\-index:(\w+);?/;
    expect(backgroundColorRegex.exec(rootStyles)![1]).toEqual(s.root.backgroundColor);
    expect(marginLeftRegex.exec(rootStyles)![1]).toEqual(s.root.marginLeft);
    expect(+zIndexRegex.exec(rootStyles)![1]).toEqual(s.root.zIndex);
  });
});
