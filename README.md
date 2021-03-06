# PostCSS Variable Media
[![Build Status](https://travis-ci.org/nathanhood/postcss-variable-media.svg?branch=master)](https://travis-ci.org/nathanhood/postcss-variable-media)
[![codecov](https://codecov.io/gh/nathanhood/postcss-variable-media/branch/master/graph/badge.svg)](https://codecov.io/gh/nathanhood/postcss-variable-media)
[![npm version](https://badge.fury.io/js/postcss-variable-media.svg)](https://badge.fury.io/js/postcss-variable-media)

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS] plugin that allows for defining custom at-rules to represent media queries

[PostCSS]: (https://github.com/postcss/postcss)

```css
/* before */
@tablet {
	.selection {
		background: #fff;
	}
}
@desktop {
	.selection {
		background: #000;
	}
}

/* after */
@media (min-width: 768px) {
	.selection {
		background: #fff;
	}
}
@media (min-width: 1024px) {
	.selection {
		background: #000;
	}
}
```

## Usage

```js
postcss([ require('postcss-variable-media') ])
```

See [PostCSS] docs for examples for your environment.

#### PostCSS

Add [PostCSS](https://github.com/postcss/postcss) to your build tool:

```bash
npm install postcss --save-dev
```

Load PostCSS Variables as a PostCSS plugin:

```js
postcss([
	require('postcss-variables')({ /* options */ })
]);
```

## Options

### `breakpoints`

Type: `Object`  
Default: `{}`

Specifies breakpoint variables and pixel min-width values.

```js
require('postcss-variable-media')({
	breakpoints: {
		tablet: 768,
		desktop: 1024
	}
});
```

### `consolidate`

Type: `boolean`  
Default: `true`

Merge repeated breakpoint declarations and append to end of document. If set to false, breakpoints will be converted to media queries in place.

**Note:** If needing to consolidate across multiple stylesheets, refer to [css-mqpacker](https://github.com/hail2u/node-css-mqpacker).

```js
require('postcss-variable-media')({
	breakpoints: {
		tablet: 768
	},
	consolidate: true
});
```

```css
@tablet {
    .block1 {
		background: #fff;
	}
}
@tablet {
	.block2 {
		font-size: 14px;
	}
}
```

```css
@media (min-width: 768px) {
	.block1 {
		background: #fff;
	}
	.block2 {
		font-size: 14px;
	}
}
```