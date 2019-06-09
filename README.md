# typestyle-extensions
Useful extension and helper functions to make your TypeStyle experience better

## What does this provide that out-of-the-box TypeStyle does not?
- A single entry-point for defining your CSS-in-JS rules
- Ability to create styles similar to `jss` or `@material-ui`'s styling solution
- Friendly common-case media query handling for your styles with easy to use syntax
- Ability to use generated CSS class names in deeply-nested parent / child styling relationships

## Prerequisites
- Has a **peer dependency** on `typestyle@^2.0.2` (does not provide its own copy of `typestyle`)

## Installation
- `npm install typestyle-extensions --save`

## Usage
```
import { createStyles } from 'typestyle-extensions';

const styles = createStyles({
  icon: {
    fontSize: '1em',
    height: '1em',
    width: '1em',
  },
  myButton: {
    $nest: {
      '&:hover': {
        $nest: {
          '& > $icon': { // Use the generated classname for "icon" here in a nested selector
            color: 'pink',
          },
        },
        backgroundColor: 'blue',
        color: 'white',
      },
    },
    backgroundColor: 'transparent',
    border: '1px solid blue',
    color: 'blue',
  },
});

const MyComponent = () => (
  <button className={styles.myButton}>
    <svg className={styles.icon}>{ /*...*/ }</svg>
  </button>
);

export default MyComponent;

```
