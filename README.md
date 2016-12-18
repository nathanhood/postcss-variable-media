# PostCSS Variable Media
[![Build Status](https://travis-ci.org/nathanhood/postcss-variable-media.svg?branch=master)](https://travis-ci.org/nathanhood/postcss-variable-media)
[![codecov](https://codecov.io/gh/nathanhood/postcss-variable-media/branch/master/graph/badge.svg)](https://codecov.io/gh/nathanhood/postcss-variable-media)

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS] plugin that allows for defining custom at-rules to represent media queries

[PostCSS]: (https://github.com/postcss/postcss)

```css
/* before */
@tablet {
    background: #fff;
}
@desktop {
	background: #000;
}

/* after */
@media (min-width: 768px) {
  background: #fff;
}
@media (min-width: 1024px) {
	background: #000;
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
    background: #fff;
}
@tablet {
	font-size: 14px;
}
```

```css
@media (min-width: 768px) {
	background: #fff;
	font-size: 14px;
}
```