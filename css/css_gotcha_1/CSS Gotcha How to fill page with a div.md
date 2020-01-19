---
title: CSS gotcha: How to fill page with a div?
published: false
description: How to make a div fill the page using some css magic
tags: #todayilearned, #beginners, #css
cover_image: https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-16-16-05.png
---

### TL;DR

If you want to have a full-page container div, make sure you have these:

```css
/* override browser default */
html,
body {
  margin: 0;
  padding: 0;
}

/* use viewport-relative units to cover page fully */
body: {
  height: 100vh;
  width: 100vw;
}

/* include border and padding in element width and height */
* {
  box-sizing: border-box;
}

/* full-sized  container that fills up the page */
div {
  height: 100%;
  width: 100%;

  /* example padding, font-size, background, etc */
  padding: 10px;
  font-size: 20px;
  background-color: lightskyblue;
}
```

## So let's say you want a div that fills up entire page...

```css
div {
  height: 100%;
  width: 100%;

  font-size: 20px;
  background-color: lightskyblue;
}
```

![./Untitled.png](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/Untitled.png)

What?! It doesn't work! The height still only takes up the content, but not the whole page.

> The width is good since the div is a **block element**, which takes as much width as possible anyways.

## Can we just use a more "absolute" value like `px` ?

```css
div {
  /* height: 100% */
  height: 865px; /* current height of my browser */
  /* ... */
}
```

It works... until the browser is resized

![doesnt work](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/full_div_px_not_working_3.gif)

It doesn't adapt when the browser is resized.

You can use JS for this, but that's way overkill for what we wanted.

> I mentioned `px` is "absolute", but only in the sense that they are not relative to anything else (like rem and vh). But the actual size still depends on the device. Here's some details:

[Stack Overflow: Is a CSS pixel really an absolute unit?](https://stackoverflow.com/questions/40480617/is-a-css-pixel-really-an-absolute-unit-that-is-is-1-inch-96px-true)

## Relative units to the rescue!

### Old school `height: 100%`

```css
html,
body {
  height: 100%;
  width: 100%;
}

div {
  height: 100%;
  /* ... */
}
```

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-16-25-32.png)

Works! _(We'll fix the scrollbars later)_

By setting both `<html>` and its child `<body>` to 100% height, we achieve the full size.

Note that only setting either of them won't work, since **percentage is always relative to another value.**

In this case:

- `div` is 100% the height of the `body`
- `body` is 100% the height of the `html`
- `html` is 100% the height of the Viewport

**Viewport** is the visible area of the browser, which varies by device.

> Viewport > `html` > `body` > `div`

For example, an iPhone 6/7/8 has a 375x667 viewport. You can verify this on your Browser dev tools.

For now, you can think about viewport as the device pixel size or resolution. But if you want to go deep:

[Media Genesis: Screen Size, Resolution, and Viewport: What does it all mean?](https://mediag.com/blog/popular-screen-resolutions-designing-for-all/)

### newer solution: viewport units `vh` and `vh`

_Viewport-percentage lengths_ aka **Viewport units** have been around for a while now, and is perfect for responding to browser resizes.

- **1 viewport height (`1vh`) = 1% of viewport height**
- **1 viewport width (`1vw`) = 1% of viewport width**

In other words, `100vh` = 100% of the viewport height

```css
html,
body {
  /* height: 100%; */
  /* width: 100% */
}

div {
  /* height: 100%; 
        width: 100%; */
  height: 100vh;
  width: 100vw;
  /* ... */
}
```

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-16-25-32.png)

Looks good too! _(We'll fix the scrollbars later)_

### How about `min-height: 100vh` ?

While `height` fixes the length at `100vh`, `min-height` starts at `100vh` but allows content to extend the div beyond that length. If content is less than the length specified, `min-height` has no effect.

In other words, `min-height` makes sure the length is **at least** the length and overrides `height` if `height` is defined and smaller than `min-height`

For our goal of having a div child with full height and width, it doesn't make any difference since the content is also at full size.

> A good use case of `min-height` is for having a sticky footer that gets pushed when there is more content on the page. Check this out here and other good uses of vh

[Fun with Viewport Units | CSS-Tricks](https://css-tricks.com/fun-viewport-units/#article-header-id-2)

### **A very common practice is to apply `height: 100vh` and `width: 100vh` to `<body>` directly...**

In this case, we can even keep the container `div` relatively sized like in the beginning, in case we change our minds later.

But with this approach, we assure that our entire DOM body would occupy full height and width regardless of our container div.

```css
body {
  height: 100vh;
  width: 100vw;
}

div {
  height: 100%;
  width: 100%;
  /* height: 100vh;
  width: 100vw; */
  /* ... */
}
```

### `vh/vw` versus `%`

A good way of thinking about `vh, vw` vs `%` is that they are analogous to `em` and `rem`

`%` and `em` are both relative to the parent size, while `vw/vh` and `rem` are both relative to the main source root font size or viewport.

## But why the scrollbar?

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-16-37-06.png)

## `<html>` and `<body>` have default margins and paddings!

Browsers feature a default margin, padding and borders to HTML elements. And the worst part is it's different for each browser!

**Chrome default for `<body>` has a `margin: 8px`**

**And `100vh + 8px` causes an overflow, since it's more than the viewport**

Luckily, it's fairly easy to fix that:

```css
html,
body {
  margin: 0;
  padding: 0;
}

body {...
```

This is a "blanket" solution that would cover all margin and padding variations for any browser you might have.

## Cool! Now we have our div filling up the page without scrollbars!

![no more scrollbars](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/Untitled_4.png)

Finally, let's add a little padding, since it's awkward that the content is right on the edges.

```css
div {
  padding: 10px;
  /* ... */
}
```

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-16-39-16.png)

What?! The scrollbar is back! What happened?

## `box-sizing` border-box

`box-sizing` allows you to define whether the **padding and border** is included in the div's height and width.

The default `content-box` of `box-sizing` doesn't include padding and border in the length, so div becomes

- `height = 100% + 10px * 2`
- `width = 100% + 10px * 2`

which overflows the page!

`border-box` includes padding and border, so div stays at our required sizes:

- `height = 100%`
- `width = 100%`

It's quite common to set **all** elements to `border-box` for a consistent layout and sizing throughout pages, using `*` selector:

```css
* {
  box-sizing: border-box;
}
```

### Perfect!

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1578863237/devto/css_gotcha_full_page_div/2020-01-12-15-41-52.png)

### Catch you in the next one!
