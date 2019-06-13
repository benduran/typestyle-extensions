
import { getStyles } from 'typestyle';

import { createStyles } from '../src';
import { IStyleTest } from './test.types';
import { getCSSBySelector } from './util';

const s: IStyleTest = {
  cardActions: {
    background: 'red repeat',
  },
  cardActionsOverlay: {
    fontSize: 36,
    opacity: 0,
  },
  root: {
    $nest: {
      '& > $cardActionsOverlay, & > $cardActions > span, & > $cardActions > button': {
        opacity: 0.5,
      },
    },
    position: 'relative',
  },
};

const styles = createStyles(s);
const renderedStyles = getStyles();

test('Nest multiple single statement selectors', () => {
  const rootSelector = `.${styles.root}`;
  const cardActionsSelector = `.${styles.cardActions}`;
  const cardActionsOverlaySelector = `.${styles.cardActionsOverlay}`;
  // tslint:disable-next-line max-line-length
  const nestedComposedSelector = `${rootSelector} > ${cardActionsOverlaySelector}, ${rootSelector} > ${cardActionsSelector} > span, ${rootSelector} > ${cardActionsSelector} > button`;
  expect(renderedStyles).toContain(rootSelector);
  expect(renderedStyles).toContain(cardActionsSelector);
  expect(renderedStyles).toContain(cardActionsOverlaySelector);
  expect(renderedStyles).toContain(nestedComposedSelector);
  expect(
    getCSSBySelector(
      rootSelector,
      'position',
      renderedStyles,
    ),
  ).toEqual('relative');
  expect(
    getCSSBySelector(
      cardActionsSelector,
      'background',
      renderedStyles,
    ),
  ).toEqual('red repeat');
  expect(
    getCSSBySelector(
      cardActionsOverlaySelector,
      'font-size',
      renderedStyles,
    ),
  ).toEqual('36px');
  expect(
    getCSSBySelector(
      cardActionsOverlaySelector,
      'opacity',
      renderedStyles,
    ),
  ).toEqual('0');
  expect(
    getCSSBySelector(
      `${rootSelector} > ${cardActionsOverlaySelector}`,
      'opacity',
      renderedStyles,
    ),
  ).toEqual('0.5');
  expect(
    getCSSBySelector(
      `${rootSelector} > ${cardActionsSelector} > span`,
      'opacity',
      renderedStyles,
    ),
  ).toEqual('0.5');
  expect(
    getCSSBySelector(
      `${rootSelector} > ${cardActionsSelector} > button`,
      'opacity',
      renderedStyles,
    ),
  ).toEqual('0.5');
});
