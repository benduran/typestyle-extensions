# typestyle-extensions [![Build Status](https://travis-ci.org/benduran/typestyle-extensions.svg?branch=master)](https://travis-ci.org/benduran/typestyle-extensions)
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
### Basic Usage
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

// Your React component
const MyComponent = () => (
  <button className={styles.myButton}>
    <svg className={styles.icon}>{ /*...*/ }</svg>
  </button>
);

export default MyComponent;

```
### Media Queries
```
import { createStyles, mediaQueries } from 'typestyle-extensions';

const styles = createStyles({
  appWrapper: {
    $mediaQueries: [
      mediaQueries.widthDown('md', {
        right: 0,
        '-webkit-overflow-scrolling': 'touch',
      }),
      mediaQueries.widthUp('lg', {
        backgroundColor: 'red', // make my app super ugly on large desktop screens!
      }),
    ],
    bottom: 0,
    left: 0,
    position: 'fixed,
    right: '20rem',
    top: 0,
  },
});
```

Out of the box, `typestyle-extensions` makes some generalized assumptions about browser widths and sets the following breakpoint sizes (by default):
```
  sm: 600;
  md: 960;
  lg: 1280;
  xl: 1920;
```

If you would like to set your own sizes, you can do so via the `setBreakpointSizes(sizes)` function.
This must be done *before* you use the `widthDown` or `widthUp` helper functions

## License
**MIT**

Copyright 2019 [@benduran](stratodyne@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
