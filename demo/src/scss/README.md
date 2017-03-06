# svbstrate [![npm](https://img.shields.io/npm/v/svbstrate.svg?maxAge=2592000)](https://www.npmjs.com/package/svbstrate)
A hyper-minimal functional CSS library. Includes a CLI for ease of use. **1.8kb gzipped**

This library assumes some familiarity with functional CSS and authoring quality CSS in general.

It does not provide:
  1. a grid
  2. breakpoints
  3. colors
  4. a reset/normalize

However, it's trivial to set up a grid using the provided utility classes, and you probably already have a preferred method of authoring and naming colors and breakpoints 😝 I'd also recommend [normalize.css](https://github.com/necolas/normalize.css), but that's up to you.

## Getting Started 
Install normally, then copy the files to your stylesheets directory:
```
npm i svbstrate --save
```
**Alternatively,** you can install svbstrate as a global module, and make use of its CLI tool.
```
npm i svbstrate -g

svbstrate init path/to/stylesheets/dir
```
See `postcss.config.js` and the scripts in `package.json` for the PostCSS setup, which you'll probably want to be using.

## API
### scale 
The type scale. `scale0` refers to the base type size, and `scale1`-`scale6` refer to the H1-H6 type scale.

White space should ideally be handled via `em` units to allow the scale to creative relative space around elements. Scale classes are provided to allow for selective scaling on non-typographical elements.
```html
<div class="pv2 scale1">Lots of padding</div>
```
**Source:**
```css
.scale0 { font-size: 1rem }
.scale1 { font-size: 4rem }
.scale2 { font-size: 3rem }
.scale3 { font-size: 2rem }
.scale4 { font-size: 1.5rem }
.scale5 { font-size: 1rem }
.scale6 { font-size: 0.875rem }
```
### typography
Easy starting point for typographic styles. Includes utils for setting font style, as well as heading classes for overriding default styles:
```html
<h1 class="h3 italic underline">Heading Three: Italic and Underlined</h1>
```
**Source:**
```css
/* ~ type definitions above ~ */

small {
  font-size: 0.8em;
}
strong {
  font-weight: bold;
}
.type--reset {
  margin: 0;
  line-height: 1;
}
.italic {
  font-style: italic;
}
.light {
  font-weight: 100;
}
.medium {
  font-weight: 500;
}
.bold {
  font-weight: 900;
}
.uppercase {
  text-transform: uppercase;
}
.underline {
  text-decoration: underline;
}
.decoration--none {
  text-decoration: none;
}
```
### spacing
`margin` and `padding` utils. All class follow the same pattern:
```
{margin or padding}{direction}{value}
```
For example, `mr1` translates to `margin-right: 1em` and `pv075` translates to `padding-left: 0.75em; padding-right: 0.75em`.

For both `padding` and `margin` the spacing scale includes `0.25em` `0.5em` `0.75em` `1em` and `2em` by default. Define more if you like.

**Note:** these classes to take up space, so remove them if not needed, and be wary of adding any non-reusable (magic) numbers here.

**Source:**
```css
.mla, .mha, .mxa { margin-left: auto }
.mra, .mha, .mxa { margin-right: auto }
.mta, .mva, .mxa { margin-top: auto }
.mba, .mva, .mxa { margin-bottom: auto; }

.mt025, .mv025, .mx025 { margin-top: 0.25em }
.mb025, .mv025, .mx025 { margin-bottom: 0.25em }
.ml025, .mh025, .mx025 { margin-left: 0.25em }
.mr025, .mh025, .mx025 { margin-right: 0.25em }
.mhn025 { margin-left: -0.25em; margin-right: -0.25em; }
.pt025, .pv025, .px025 { padding-top: 0.25em }
.pb025, .pv025, .px025 { padding-bottom: 0.25em }
.pl025, .ph025, .px025 { padding-left: 0.25em }
.pr025, .ph025, .px025 { padding-right: 0.25em }

/* ~ other definitions below ~ */
```
### display
Set the `display` property of an element:
```html
<div class="block"></div>
```
**Source:**
```css
.block { display: block }
.inline { display: inline }
.inline-block { display: inline-block }
.hide { display: none }
```
### positioning
Set the `position` property of an element. Also includes handy utils to set `left` `right` `top` and `bottom` to `0`:
```html
<div class="absolute fit-x"></div>
```
**Source:**
```css
.relative { position: relative }
.absolute { position: absolute }
.fixed { position: fixed }
.fit-t, .fit-x { top: 0 }
.fit-b, .fit-x { bottom: 0 }
.fit-l, .fit-x { left: 0 }
.fit-r, .fit-x { right: 0 }
```
### flexbox
Create basic layouts using flexbox:
```html
<div class="flex flex-wrap flex-items-center mhn1">
  ...
  <div class="ph1"></div>
  ...
</div>
```
**Source:**
```css
.flex { display: flex }
.flex-wrap { flex-wrap: wrap }
.flex-items-start { align-items: flex-start }
.flex-items-end { align-items: flex-end }
.flex-items-center { align-items: center }
.flex-items-baseline { align-items: baseline }
.flex-items-stretch { align-items: stretch }
.flex-justify-start { justify-content: flex-start }
.flex-justify-end { justify-content: flex-end }
.flex-justify-center { justify-content: center }
.flex-justify-between { justify-content: space-between }
.flex-justify-around { justify-content: space-around }
.flex-auto {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
```
### floats
Set `float` property. Includes a clearfix:
```html
<div class="clearfix">
  <div class="float-l"></div>
</div>
```
**Source:**
```css
.float-l { float: left }
.float-r { float: right }
.clearfix {
  &::before,
  &::after {
    content:' ';
    display: table;
  }

  &::after {
    clear: both;
  }
}
```
### buttons
Buttons should either be actual `button` elements, or `a[role="button"]` elements for accessibility:
```html
<button class="button">Actual Button</button>
<a href="#0" class="button" role="button">Fake Button</a>
```
### align
Set `text-align` and `vertical-align`:
```html
<div class="align-c">Centered Text</div>
```
**Source:**
```css
.align-l { text-align: left }
.align-c { text-align: center }
.align-r { text-align: right }
.align-j { text-align: justify }
.align-m { vertical-align: middle }
.align-t { vertical-align: top }
.align-b { vertical-align: baseline }
```
### forms
You get the drill. This is basic styling.
### lists
Lists are by default *unstyled*. To achieve list styling, add the `.list` class to your `ol` or `ul`:
```html
<ul class="list">
  <li>Styled list item</li>
</ul>
```
### tables
Basic table styling and util classes:
**Source:**
```css
.table--fixed { table-layout: fixed }
.table__row-header { display: table-header-group }
.table__row-footer { display: table-footer-group }
.table__row-group { display: table-row-group }
.table__row { display: table-row }
.table__cell { display: table-cell }
```
### z-index
Utils for setting `z-index`:
```html
<div class="z0"></div>
```
**Source:**
```css
.z0 { z-index: 0 }
.z1 { z-index: 100 }
.z2 { z-index: 200 }
.z3 { z-index: 300 }
.z5 { z-index: 500 }
.z6 { z-index: 600 }
.z7 { z-index: 700 }
.z8 { z-index: 800 }
.z9 { z-index: 900 }
.z10 { z-index: 1000 }
```

## Contributing
Issues and Pull Requests are welcome. See [CONTRIBUTING.md](https://github.com/barrel/svbstrate/blob/master/CONTRIBUTING.md) for more info.

## Related
- [BASSCSS](http://www.basscss.com/)
- [Tachyons](http://tachyons.io/) 

MIT License
