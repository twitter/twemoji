# Twitter Emoji (Twemoji) [![Build Status](https://travis-ci.org/twitter/twemoji.svg?branch=gh-pages)](https://travis-ci.org/twitter/twemoji)

A simple library that provides standard Unicode [emoji](http://en.wikipedia.org/wiki/Emoji) support across all platforms.

## Unicode 8.0 and Diversity
The **twemoji V2** adheres to the [8.0 Unicode version](http://unicode.org/versions/Unicode8.0.0/) and **supports** 1661 different emoji, including **[diversity](http://www.unicode.org/reports/tr51/#Diversity)**.
The previous twemoji V1 adheres to the [7.0 Unicode version](http://www.unicode.org/charts/PDF/Unicode-7.0/U70-1F300.pdf) and supports 872 different emoji.

## Version 2 CDN Support

The folks over at [MaxCDN](https://www.maxcdn.com) graciously provide CDN support for both version 1 and version 2.

For the latter one, use the following in the `<head>` tag of your HTML document(s):
```html
<script src="//twemoji.maxcdn.com/2/twemoji.min.js"></script>
```

## Breaking changes in V2

_TL;DR_: there's no `variant` anymore, all callbacks receives the transformed `iconId` and in some case the rawText too.

There are few potentially breaking changes in `twemoji` version 2:

  * the `parse` invoked function signature is now `(iconId, options)` instead of `(icon, options, variant)`
  * the `attributes` function will receives `(rawText, iconId)` instead of `(icon, variant)`
  * the **default** remote protocol is now **https** regardless the current site is _http_ or even _file_
  * the **default** PNG icon size is **72** pixels and **there are no other PNG assets** for 16 or 32.
  * in order to access latest Unicode 8 ready assets you need to specify *folder* `2/72x72` or `2/svg`.

Everything else is pretty much the same so if you were using defaults, all you need to do is to add the version `2/` before the `twmoji.js` file you were using.


## Version 1 CDN Support

The folks over at [MaxCDN](https://www.maxcdn.com) graciously provide CDN support.

Just use the following in the `<head>` tag of your HTML document(s):

```html
<script src="//twemoji.maxcdn.com/twemoji.min.js"></script>
```

Alternatively you can use [cdnjs](https://cdnjs.com/) if you prefer:

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/twemoji/1.3.2/twemoji.min.js"></script>
```

## API

Following all methods exposed through the `twemoji` namespace.

### twemoji.parse( ... ) V1

This is the main parsing utility and has 3 overloads per each parsing type.

There are mainly two kind of parsing: [string parsing](https://github.com/twitter/twemoji#string-parsing) and [DOM parsing](https://github.com/twitter/twemoji#dom-parsing).

Each of them accept a callback to generate each image source or an options object with parsing info.

Here is a walk through all parsing possibilities:

##### string parsing (V1)
Given a generic string, it will replace all emoji with an `<img>` tag.

While this can be used to inject via `innerHTML` emoji image tags, please note that this method does not sanitize the string or prevent malicious code from being executed. As an example, if the text contains a `<script>` tag, this **will not** be converted into `&lt;script&gt;` since it's out of this method scope to prevent these kind of attacks.

However, for already sanitized strings, this method can be considered safe enough. Please see DOM parsing if security is one of your major concerns.

```js
twemoji.parse('I \u2764\uFE0F emoji!');

// will produce
/*
I <img
  class="emoji"
  draggable="false"
  alt="❤️"
  src="https://twemoji.maxcdn.com/36x36/2764.png"> emoji!
*/
```

_string parsing + callback_
If a callback is passed, the `src` attribute will be the one returned by the same callback.
```js
twemoji.parse(
  'I \u2764\uFE0F emoji!',
  function(icon, options, variant) {
    return '/assets/' + options.size + '/' + icon + '.gif';
  }
);

// will produce
/*
I <img
  class="emoji"
  draggable="false"
  alt="❤️"
  src="/assets/36x36/2764.gif"> emoji!
*/
```

By default, the `options.size` parameter will be the string `"36x36"` and the `variant` will be an optional `\uFE0F` char that is usually ignored by default. If your assets include or distinguish between `\u2764\uFE0F` and `\u2764`, you might want to use such a variable.

_string parsing + callback returning_ `falsy`
If the callback returns "falsy values" such `null`, `undefined`, `0`, `false`, or an empty string, nothing will change for that specific emoji.
```js
var i = 0;
twemoji.parse(
  'emoji, m\u2764\uFE0Fn am\u2764\uFE0Fur',
  function(icon, options, variant) {
    if (i++ === 0) {
      return; // no changes made first call
    }
    return '/assets/' + icon + options.ext;
  }
);

// will produce
/*
emoji, m❤️n am<img
  class="emoji"
  draggable="false"
  alt="❤️"
  src="/assets/2764.png">ur
*/
```

_string parsing + object_
In case an object is passed as second parameter, the passed `options` object will reflect its properties.
```js
twemoji.parse(
  'I \u2764\uFE0F emoji!',
  {
    callback: function(icon, options) {
      return '/assets/' + options.size + '/' + icon + '.gif';
    },
    size: 128
  }
);

// will produce
/*
I <img
  class="emoji"
  draggable="false"
  alt="❤️"
  src="/assets/128x128/2764.gif"> emoji!
*/
```

##### DOM parsing

Differently from `string` parsing, if the first argument is a `HTMLElement` generated image tags will replace emoji that are **inside `#text` node only** without compromising surrounding nodes or listeners, and avoiding completely the usage of `innerHTML`.

If security is a major concern, this parsing can be considered the safest option but with a slightly penalized performance gap due to DOM operations that are inevitably *costly* compared to basic strings.

```js
var div = document.createElement('div');
div.textContent = 'I \u2764\uFE0F emoji!';
document.body.appendChild(div);

twemoji.parse(document.body);

var img = div.querySelector('img');

// note the div is preserved
img.parentNode === div; // true

img.src;        // https://twemoji.maxcdn.com/36x36/2764.png
img.alt;        // \u2764\uFE0F
img.className;  // emoji
img.draggable;  // false

```

All other overloads described for `string` are available exactly same way for DOM parsing.

### Object as parameter
Here the list of properties accepted by the optional object that could be passed to parse.

```js
  {
    callback: Function,   // default the common replacer
    attributes: Function, // default returns {}
    base: string,         // default MaxCDN
    ext: string,          // default ".png"
    className: string,    // default "emoji"
    size: string|number,  // default "36x36"
    folder: string        // in case it's specified
                          // it replaces .size info, if any
  }
```

##### callback
The function to invoke in order to generate images `src`.

By default it is a function like the following one:
```js
function imageSourceGenerator(icon, options) {
  return ''.concat(
    options.base, // by default Twitter Inc. CDN
    options.size, // by default "36x36" string
    '/',
    icon,         // the found emoji as code point
    options.ext   // by default ".png"
  );
}
```

##### attributes (V1)
The function to invoke in order to generate additional, custom attributes for the image tag.

By default it is a function like the following one:
```js
function attributesCallback(icon, variant) {
  return {
    title: 'Emoji: ' + icon + variant
  };
}
```

Event handlers cannot be specified via this method, and twemoji-provided attributes (src, alt, className, draggable) cannot be re-defined.

##### base
The default url is the same as `twemoji.base`, so if you modify the former, it will reflect as default for all parsed strings or nodes.


##### ext
The default image extension is the same as `twemoji.ext` which is `".png"`.

If you modify the former, it will reflect as default for all parsed strings or nodes.


##### className
The default `class` per each generated image is `emoji`. It is possible to specify a different one through this property.


##### size
The default assets size is the same as `twemoji.size` which is `"36x36"`.

If you modify the former, it will reflect as default for all parsed strings or nodes.


##### folder
In case there is no need to specify a size. It is possible to chose a folder, as is the case of SVG emoji.
```js
twemoji.parse(genericNode, {
  folder: 'svg',
  ext: '.svg'
});
```
This will generate urls such `https://twemoji.maxcdn.com/svg/2764.svg` instead of using a specific size based one.


## Tips

#### Inline Styles

If you'd like to size the emoji according to the surrounding text, you can add the following CSS to your stylesheet:

```
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
```

This will make sure emoji derive their width and height from the `font-size` of the text they're shown with. It also adds just a little bit of space before and after each emoji, and pulls them upwards a little bit for better optical alignment.

#### UTF-8 Character Set

To properly support emoji, the document character must be set to UTF-8. This can done by including the following meta tag in the document `<head>`

```html
<meta charset="utf-8">
```

#### Exclude Characters (V1)

To exclude certain characters from being replaced by twemoji.js, call twemoji.parse() with a callback, returning false for the specific unicode icon. For example:

```js
twemoji.parse(document.body, {
    callback: function(icon, options, variant) {
        switch ( icon ) {
            case 'a9':      // © copyright
            case 'ae':      // ® registered trademark
            case '2122':    // ™ trademark
                return false;
        }
        return ''.concat(options.base, options.size, '/', icon, options.ext);
    }
});
```

### Build
If you'd like to test and/or contribute please follow these instructions.

```bash
# clone this repo
git clone https://github.com/twitter/twemoji.git
cd twemoji

# install dependencies
npm install

# generate 2/twemoji*.js files
./2/utils/generate
```

If you'd like to test and/or propose some change to the V2 library please change `./2/utils/generate` file at its end so that everything will be generated properly once launched.


## Attribution Requirements

As an open source project, attribution is critical from a legal, practical and motivational perspective in our opinion. The graphics are licensed under the CC-BY 4.0 which has a pretty good guide on [best practices for attribution](https://wiki.creativecommons.org/Best_practices_for_attribution).

However, we consider the guide a bit onerous and as a project, will accept a mention in a project README or an 'About' section or footer on a website. In mobile applications, a common place would be in the Settings/About section (for example, see the mobile Twitter application Settings->About->Legal section). We would consider a mention in the HTML/JS source sufficient also.

## Community Projects

* [Twemoji Awesome](http://ellekasai.github.io/twemoji-awesome/) by [@ellekasai](https://twitter.com/ellekasai/status/531979044036698112): Use Twemoji using CSS classes (like [Font Awesome](http://fortawesome.github.io/Font-Awesome/))
* [Twemoji Ruby](https://github.com/jollygoodcode/twemoji) by [@JollyGoodCode](https://twitter.com/jollygoodcode): Use Twemoji in Ruby.
* [Twemoji for Pencil](https://github.com/nathanielw/Twemoji-for-Pencil) by [@Nathanielnw](https://twitter.com/nathanielnw): Use Twemoji in Pencil.

## Committers and Contributors
* Andrea Giammarchi (ex-Twitter)
* Tom Wuttke (Twitter)
* Joen Asmussen (WordPress)
* Marcus Kazmierczak (WordPress)

The goal of this project is to simply provide emoji for everyone. We definitely welcome improvements and fixes, but we may not merge every pull request suggested by the community due to the simple nature of the project.

The rules for contributing are available at `CONTRIBUTING.md` file.

Thank you to all of our [contributors](https://github.com/twitter/twemoji/graphs/contributors).

## License
Copyright 2014 Twitter, Inc and other contributors

Code licensed under the MIT License: http://opensource.org/licenses/MIT

Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
