# Twitter Emoji (Twemoji) [![Build Status](https://travis-ci.org/twitter/twemoji.svg?branch=gh-pages)](https://travis-ci.org/twitter/twemoji)

A simple library that provides standard Unicode [emoji](http://en.wikipedia.org/wiki/Emoji) support across all platforms.

## CDN Support

The folks over at [MaxCDN](https://www.maxcdn.com) graciously provide CDN support. 

Just use the following in the `<head>` tag of your HTML document(s):

```html
<script src="//twemoji.maxcdn.com/twemoji.min.js"></script>
```

## API

Following all methods exposed through the `twemoji` namespace.

### twemoji.parse( ... )

This is the main parsing utility and has 3 overloads per each parsing type.

There are mainly two kind of parsing: [string parsing](https://github.com/twitter/twemoji#string-parsing) and [DOM parsing](https://github.com/twitter/twemoji#dom-parsing).

Each of them accept a callback to generate each image source or an options object with parsing info.

Here is a walk through all parsing possibilities:

##### string parsing
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

If security is a major concern, this parsing can be considered the safest option but with a slightly penalized performance gap due DOM operations that are inevitably *costy* compared to basic strings.

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
function imageSourceGenrator(icon, options) {
  return ''.concat(
    options.base, // by default Twitter Inc. CDN
    options.size, // by default "36x36" string
    '/',
    icon,         // the found emoji as code point
    options.ext   // by default ".png"
  );
}
```


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

#### Exclude Characters

To exclude certain characters from being replaced by twemoji.js, call twemoji.parse() with a callback, returning false for the specific unicode icon. For example:

```js
twemoji.parse(document.body, {
    callback: function(icon, options, variant) {
        switch ( icon ) {
            case 'a9':      // copyright
            case 'ae':      // trademark
                return false;
        }
        return ''.concat(options.base, options.size, '/', icon, options.ext);
    }
});
```

### Build
In order to build the Unicode based standard emoji RegExp, probably the most important core feature of this library, the `twemoji-generator.js` file needs to perform few online and offline operations.

Once executed through `node twemoji-generator.js`, and after installing via `npm install` dependencies, this file will create a fresh new copy of all libraries.

This means that if you'd like to change or improve `twemoji`, you should probably do it inside the `createTwemoji` function at the bottom of `twemoji-generator.js` instead of directly in the library, unless it's not just for testing purpose.

## Future Plans: Unicode 8.0 and Diversity

The twemoji project currently adheres to the [7.0 Unicode version](http://www.unicode.org/charts/PDF/Unicode-7.0/U70-1F300.pdf) and supports 872 different emoji. In the future, we hope to work with the community to support Unicode 8.0 additions like [Diversity](http://www.unicode.org/reports/tr51/#Diversity).

## Attribution Requirements

As an open source project, attribution is critical from a legal, practical and motivational perspective in our opinion. The graphics are licensed under the CC-BY 4.0 which has a pretty good guide on [best practices for attribution](https://wiki.creativecommons.org/Best_practices_for_attribution). 

However, we consider the guide a bit onerous and as a project, will accept a mention in a project README or an 'About' section or footer on a website. In mobile applications, a common place would be in the Settings/About section (for example, see the mobile Twitter application Settings->About->Legal section). We would consider a mention in the HTML/JS source sufficient also.

## Community Projects

* [Twemoji Awesome](http://ellekasai.github.io/twemoji-awesome/) by [@ellekasai](https://twitter.com/ellekasai/status/531979044036698112): Use Twemoji using CSS classes (like [Font Awesome](http://fortawesome.github.io/Font-Awesome/))

## Committers and Contributors
* Andrea Giammarchi (Twitter)
* Chris Aniszczyk (Twitter)
* Joen Asmussen (WordPress)
* Marcus Kazmierczak (WordPress)

The goal of this project is to simply provide emoji for everyone. We definitely welcome improvements and fixes, but we may not merge every pull request suggested by the community due to the simple nature of the project.

The rules for contributing are available at `CONTRIBUTING.md` file.

Thank you to all of our [contributors](https://github.com/twitter/twemoji/graphs/contributors).

## License
Copyright 2014 Twitter, Inc and other contributors

Code licensed under the MIT License: http://opensource.org/licenses/MIT

Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
