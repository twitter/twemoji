#!/usr/bin/env node

 /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
     https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
 */

// dependencies
var fs = require('fs');
var http = require('http');
var path = require('path');
var Utils = require('./utils');
var regex = require('twemoji-parser/dist/lib/regex').default;
var { version } = require('../package.json');

function file(which) {
  return path.join(__dirname, '..', which);
}

function createTwemoji() {
  fs.mkdirSync('dist/',{ recursive: true })
  fs.writeFileSync(
    file('dist/twemoji.js'),
    '/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */\n' +
    'var twemoji = (' +
    function (
      /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
        https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
      */

      // WARNING:   this file is generated automatically via
      //            `node scripts/build.js`
      //            please update its `createTwemoji` function
      //            at the bottom of the same file instead.

    ) {
      'use strict';

      /*jshint maxparams:4 */

      var
        // the exported module object
        twemoji = {


        /////////////////////////
        //      properties     //
        /////////////////////////

          // default assets url, by default will be Twitter Inc. CDN
          base: 'https://twemoji.maxcdn.com/v/$VERSION/',

          // default assets file extensions, by default '.png'
          ext: '.png',

          // default assets/folder size, by default "72x72"
          // available via Twitter CDN: 72
          size: '72x72',

          // default class name, by default 'emoji'
          className: 'emoji',

          // basic utilities / helpers to convert code points
          // to JavaScript surrogates and vice versa
          convert: {

            /**
             * Given an HEX codepoint, returns UTF16 surrogate pairs.
             *
             * @param   string  generic codepoint, i.e. '1F4A9'
             * @return  string  codepoint transformed into utf16 surrogates pair,
             *          i.e. \uD83D\uDCA9
             *
             * @example
             *  twemoji.convert.fromCodePoint('1f1e8');
             *  // "\ud83c\udde8"
             *
             *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
             *  // "\ud83c\udde8\ud83c\uddf3"
             */
            fromCodePoint: fromCodePoint,

            /**
             * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
             *
             * @param   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
             * @param   string  optional separator for double code points, default='-'
             * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
             *
             * @example
             *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
             *  // "1f1e8-1f1f3"
             *
             *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
             *  // "1f1e8~1f1f3"
             */
            toCodePoint: toCodePoint
          },


        /////////////////////////
        //       methods       //
        /////////////////////////

          /**
           * User first: used to remove missing images
           * preserving the original text intent when
           * a fallback for network problems is desired.
           * Automatically added to Image nodes via DOM
           * It could be recycled for string operations via:
           *  $('img.emoji').on('error', twemoji.onerror)
           */
          onerror: function onerror() {
            if (this.parentNode) {
              this.parentNode.replaceChild(createText(this.alt, false), this);
            }
          },

          /**
           * Main method/logic to generate either <img> tags or HTMLImage nodes.
           *  "emojify" a generic text or DOM Element.
           *
           * @overloads
           *
           * String replacement for `innerHTML` or server side operations
           *  twemoji.parse(string);
           *  twemoji.parse(string, Function);
           *  twemoji.parse(string, Object);
           *
           * HTMLElement tree parsing for safer operations over existing DOM
           *  twemoji.parse(HTMLElement);
           *  twemoji.parse(HTMLElement, Function);
           *  twemoji.parse(HTMLElement, Object);
           *
           * @param   string|HTMLElement  the source to parse and enrich with emoji.
           *
           *          string              replace emoji matches with <img> tags.
           *                              Mainly used to inject emoji via `innerHTML`
           *                              It does **not** parse the string or validate it,
           *                              it simply replaces found emoji with a tag.
           *                              NOTE: be sure this won't affect security.
           *
           *          HTMLElement         walk through the DOM tree and find emoji
           *                              that are inside **text node only** (nodeType === 3)
           *                              Mainly used to put emoji in already generated DOM
           *                              without compromising surrounding nodes and
           *                              **avoiding** the usage of `innerHTML`.
           *                              NOTE: Using DOM elements instead of strings should
           *                              improve security without compromising too much
           *                              performance compared with a less safe `innerHTML`.
           *
           * @param   Function|Object  [optional]
           *                              either the callback that will be invoked or an object
           *                              with all properties to use per each found emoji.
           *
           *          Function            if specified, this will be invoked per each emoji
           *                              that has been found through the RegExp except
           *                              those follwed by the invariant \uFE0E ("as text").
           *                              Once invoked, parameters will be:
           *
           *                                iconId:string     the lower case HEX code point
           *                                                  i.e. "1f4a9"
           *
           *                                options:Object    all info for this parsing operation
           *
           *                                variant:char      the optional \uFE0F ("as image")
           *                                                  variant, in case this info
           *                                                  is anyhow meaningful.
           *                                                  By default this is ignored.
           *
           *                              If such callback will return a falsy value instead
           *                              of a valid `src` to use for the image, nothing will
           *                              actually change for that specific emoji.
           *
           *
           *          Object              if specified, an object containing the following properties
           *
           *            callback   Function  the callback to invoke per each found emoji.
           *            base       string    the base url, by default twemoji.base
           *            ext        string    the image extension, by default twemoji.ext
           *            size       string    the assets size, by default twemoji.size
           *
           * @example
           *
           *  twemoji.parse("I \u2764\uFE0F emoji!");
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
           *
           *
           *  twemoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
           *    return '/assets/' + iconId + '.gif';
           *  });
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
           *
           *
           * twemoji.parse("I \u2764\uFE0F emoji!", {
           *   size: 72,
           *   callback: function(iconId, options) {
           *     return '/assets/' + options.size + '/' + iconId + options.ext;
           *   }
           * });
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"/> emoji!
           *
           */
          parse: parse,

          /**
           * Given a string, invokes the callback argument
           *  per each emoji found in such string.
           * This is the most raw version used by
           *  the .parse(string) method itself.
           *
           * @param   string    generic string to parse
           * @param   Function  a generic callback that will be
           *                    invoked to replace the content.
           *                    This callback will receive standard
           *                    String.prototype.replace(str, callback)
           *                    arguments such:
           *  callback(
           *    rawText,  // the emoji match
           *  );
           *
           *                    and others commonly received via replace.
           */
          replace: replace,

          /**
           * Simplify string tests against emoji.
           *
           * @param   string  some text that might contain emoji
           * @return  boolean true if any emoji was found, false otherwise.
           *
           * @example
           *
           *  if (twemoji.test(someContent)) {
           *    console.log("emoji All The Things!");
           *  }
           */
          test: test
        },

        // used to escape HTML special chars in attributes
        escaper = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        },

        // RegExp based on emoji's official Unicode standards
        // http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
        re = /twemoji/,

        // avoid runtime RegExp creation for not so smart,
        // not JIT based, and old browsers / engines
        UFE0Fg = /\uFE0F/g,

        // avoid using a string literal like '\u200D' here because minifiers expand it inline
        U200D = String.fromCharCode(0x200D),

        // used to find HTML special chars in attributes
        rescaper = /[&<>'"]/g,

        // nodes with type 1 which should **not** be parsed
        shouldntBeParsed = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/,

        // just a private shortcut
        fromCharCode = String.fromCharCode;

      return twemoji;


      /////////////////////////
      //  private functions  //
      //     declaration     //
      /////////////////////////

      /**
       * Shortcut to create text nodes
       * @param   string  text used to create DOM text node
       * @return  Node  a DOM node with that text
       */
      function createText(text, clean) {
        return document.createTextNode(clean ? text.replace(UFE0Fg, '') : text);
      }

      /**
       * Utility function to escape html attribute text
       * @param   string  text use in HTML attribute
       * @return  string  text encoded to use in HTML attribute
       */
      function escapeHTML(s) {
        return s.replace(rescaper, replacer);
      }

      /**
       * Default callback used to generate emoji src
       *  based on Twitter CDN
       * @param   string    the emoji codepoint string
       * @param   string    the default size to use, i.e. "36x36"
       * @return  string    the image source to use
       */
      function defaultImageSrcGenerator(icon, options) {
        return ''.concat(options.base, options.size, '/', icon, options.ext);
      }

      /**
       * Given a generic DOM nodeType 1, walk through all children
       * and store every nodeType 3 (#text) found in the tree.
       * @param   Element a DOM Element with probably some text in it
       * @param   Array the list of previously discovered text nodes
       * @return  Array same list with new discovered nodes, if any
       */
      function grabAllTextNodes(node, allText) {
        var
          childNodes = node.childNodes,
          length = childNodes.length,
          subnode,
          nodeType;
        while (length--) {
          subnode = childNodes[length];
          nodeType = subnode.nodeType;
          // parse emoji only in text nodes
          if (nodeType === 3) {
            // collect them to process emoji later
            allText.push(subnode);
          }
          // ignore all nodes that are not type 1, that are svg, or that
          // should not be parsed as script, style, and others
          else if (nodeType === 1 && !('ownerSVGElement' in subnode) &&
              !shouldntBeParsed.test(subnode.nodeName.toLowerCase())) {
            grabAllTextNodes(subnode, allText);
          }
        }
        return allText;
      }

      /**
       * Used to both remove the possible variant
       *  and to convert utf16 into code points.
       *  If there is a zero-width-joiner (U+200D), leave the variants in.
       * @param   string    the raw text of the emoji match
       * @return  string    the code point
       */
      function grabTheRightIcon(rawText) {
        // if variant is present as \uFE0F
        return toCodePoint(rawText.indexOf(U200D) < 0 ?
          rawText.replace(UFE0Fg, '') :
          rawText
        );
      }

      /**
       * DOM version of the same logic / parser:
       *  emojify all found sub-text nodes placing images node instead.
       * @param   Element   generic DOM node with some text in some child node
       * @param   Object    options  containing info about how to parse
        *
        *            .callback   Function  the callback to invoke per each found emoji.
        *            .base       string    the base url, by default twemoji.base
        *            .ext        string    the image extension, by default twemoji.ext
        *            .size       string    the assets size, by default twemoji.size
        *
       * @return  Element same generic node with emoji in place, if any.
       */
      function parseNode(node, options) {
        var
          allText = grabAllTextNodes(node, []),
          length = allText.length,
          attrib,
          attrname,
          modified,
          fragment,
          subnode,
          text,
          match,
          i,
          index,
          img,
          rawText,
          iconId,
          src;
        while (length--) {
          modified = false;
          fragment = document.createDocumentFragment();
          subnode = allText[length];
          text = subnode.nodeValue;
          i = 0;
          while ((match = re.exec(text))) {
            index = match.index;
            if (index !== i) {
              fragment.appendChild(
                createText(text.slice(i, index), true)
              );
            }
            rawText = match[0];
            iconId = grabTheRightIcon(rawText);
            i = index + rawText.length;
            src = options.callback(iconId, options);
            if (iconId && src) {
              img = new Image();
              img.onerror = options.onerror;
              img.setAttribute('draggable', 'false');
              attrib = options.attributes(rawText, iconId);
              for (attrname in attrib) {
                if (
                  attrib.hasOwnProperty(attrname) &&
                  // don't allow any handlers to be set + don't allow overrides
                  attrname.indexOf('on') !== 0 &&
                  !img.hasAttribute(attrname)
                ) {
                  img.setAttribute(attrname, attrib[attrname]);
                }
              }
              img.className = options.className;
              img.alt = rawText;
              img.src = src;
              modified = true;
              fragment.appendChild(img);
            }
            if (!img) fragment.appendChild(createText(rawText, false));
            img = null;
          }
          // is there actually anything to replace in here ?
          if (modified) {
            // any text left to be added ?
            if (i < text.length) {
              fragment.appendChild(
                createText(text.slice(i), true)
              );
            }
            // replace the text node only, leave intact
            // anything else surrounding such text
            subnode.parentNode.replaceChild(fragment, subnode);
          }
        }
        return node;
      }

      /**
       * String/HTML version of the same logic / parser:
       *  emojify a generic text placing images tags instead of surrogates pair.
       * @param   string    generic string with possibly some emoji in it
       * @param   Object    options  containing info about how to parse
       *
       *            .callback   Function  the callback to invoke per each found emoji.
       *            .base       string    the base url, by default twemoji.base
       *            .ext        string    the image extension, by default twemoji.ext
       *            .size       string    the assets size, by default twemoji.size
       *
       * @return  the string with <img tags> replacing all found and parsed emoji
       */
      function parseString(str, options) {
        return replace(str, function (rawText) {
          var
            ret = rawText,
            iconId = grabTheRightIcon(rawText),
            src = options.callback(iconId, options),
            attrib,
            attrname;
          if (iconId && src) {
            // recycle the match string replacing the emoji
            // with its image counter part
            ret = '<img '.concat(
              'class="', options.className, '" ',
              'draggable="false" ',
              // needs to preserve user original intent
              // when variants should be copied and pasted too
              'alt="',
              rawText,
              '"',
              ' src="',
              src,
              '"'
            );
            attrib = options.attributes(rawText, iconId);
            for (attrname in attrib) {
              if (
                attrib.hasOwnProperty(attrname) &&
                // don't allow any handlers to be set + don't allow overrides
                attrname.indexOf('on') !== 0 &&
                ret.indexOf(' ' + attrname + '=') === -1
              ) {
                ret = ret.concat(' ', attrname, '="', escapeHTML(attrib[attrname]), '"');
              }
            }
            ret = ret.concat('/>');
          }
          return ret;
        });
      }

      /**
       * Function used to actually replace HTML special chars
       * @param   string  HTML special char
       * @return  string  encoded HTML special char
       */
      function replacer(m) {
        return escaper[m];
      }

      /**
       * Default options.attribute callback
       * @return  null
       */
      function returnNull() {
        return null;
      }

      /**
       * Given a generic value, creates its squared counterpart if it's a number.
       *  As example, number 36 will return '36x36'.
       * @param   any     a generic value.
       * @return  any     a string representing asset size, i.e. "36x36"
       *                  only in case the value was a number.
       *                  Returns initial value otherwise.
       */
      function toSizeSquaredAsset(value) {
        return typeof value === 'number' ?
          value + 'x' + value :
          value;
      }


      /////////////////////////
      //  exported functions //
      //     declaration     //
      /////////////////////////

      function fromCodePoint(codepoint) {
        var code = typeof codepoint === 'string' ?
              parseInt(codepoint, 16) : codepoint;
        if (code < 0x10000) {
          return fromCharCode(code);
        }
        code -= 0x10000;
        return fromCharCode(
          0xD800 + (code >> 10),
          0xDC00 + (code & 0x3FF)
        );
      }

      function parse(what, how) {
        if (!how || typeof how === 'function') {
          how = {callback: how};
        }
        // if first argument is string, inject html <img> tags
        // otherwise use the DOM tree and parse text nodes only
        return (typeof what === 'string' ? parseString : parseNode)(what, {
          callback:   how.callback || defaultImageSrcGenerator,
          attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
          base:       typeof how.base === 'string' ? how.base : twemoji.base,
          ext:        how.ext || twemoji.ext,
          size:       how.folder || toSizeSquaredAsset(how.size || twemoji.size),
          className:  how.className || twemoji.className,
          onerror:    how.onerror || twemoji.onerror
        });
      }

      function replace(text, callback) {
        return String(text).replace(re, callback);
      }

      function test(text) {
        // IE6 needs a reset before too
        re.lastIndex = 0;
        var result = re.test(text);
        re.lastIndex = 0;
        return result;
      }

      function toCodePoint(unicodeSurrogates, sep) {
        var
          r = [],
          c = 0,
          p = 0,
          i = 0;
        while (i < unicodeSurrogates.length) {
          c = unicodeSurrogates.charCodeAt(i++);
          if (p) {
            r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
            p = 0;
          } else if (0xD800 <= c && c <= 0xDBFF) {
            p = c;
          } else {
            r.push(c.toString(16));
          }
        }
        return r.join(sep || '-');
      }

    }.toString()
      // drop current indentation
      .replace(/^    /gm, '')
      // add the RegExp in the right place
      .replace('re = /twemoji/', `re = ${regex.toString()}`)
      .replace('$VERSION', version)
      // add the full license
      .replace('/*! (C) Twitter Inc. */',
        '/*! (C) Twitter Inc. *//*\n' +
        fs.readFileSync(file('LICENSE')).toString().replace(
          /^./gm, '   '
        ) +
        '\n  */'
      ) + '());');

}

createTwemoji();
require('./create-dist');
require('./preview');
