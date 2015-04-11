#!/usr/bin/env node

 /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
     https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
 */

// dependencies
var fs = require('fs');
var http = require('http');

// Twitter assets by property name
var assets = {
  '16x16': [],
  '36x36': [],
  '72x72': []
};

// white spaces we don't want to catch via the RegExp
// there is no asset equivalent for these
var ignoreMissing = ['2002', '2003', '2005'];

// basic utility to organize async code
// see: http://webreflection.blogspot.co.uk/2012/03/tweet-sized-queue-system.html
// or:  http://webreflection.blogspot.co.uk/2012/06/working-with-queues.html
function Queue(args, f) {
  setTimeout(args.next = function next() {
    return (f = args.shift()) ? !!f(args) || !0 : !1;
  }, 0);
  return args;
}

// main task
Queue([

  // will populate assets arrays
  function grabAllAssets(q) {
    console.log('analyzing all assets ... ');
    // per each path/folder
    Object.keys(assets).forEach(function (path, i, paths) {
      // grab all files in that folder
      fs.readdir('./' + path, function (err, files) {
        // and add them to the assets path
        assets[path].push.apply(
          assets[path],
          files.map(upperCaseWithoutExtension)
        );
        // once all assets arrays have been populated
        if (paths.reduce(completed, true)) {
          console.log('[INFO] assets contains ' + assets[path].length + ' emoji.');
          q.next();
        }
      });
    });
    // drop extension + uppercase
    function upperCaseWithoutExtension(file) {
      return file.slice(0, file.lastIndexOf('.')).toUpperCase();
    }
    // returns true if all assets have been populated
    function completed(p, c) {
      return p && assets[c].length;
    }
  },

  // will fetch and store all emoji from unicode.org
  function fetchEmojiSources(q) {
    console.log('fetching EmojiSources.txt ... ');
    // grab all emoji and test them against them
    http.get("http://www.unicode.org/Public/UNIDATA/EmojiSources.txt", function (res) {
      var chunks = [];
      // if all good ...
      if (res.statusCode === 200) {
        // grab all data
        res.on('data', chunks.push.bind(chunks));
        // once done ...
        res.on('end', function () {
          console.log('analizing EmojiSources VS our assets ... ');
          // store all missing assets in one object
          var missing = {};
          // will be used to store an array with all missing
          var missingGrouped = {};

          // will be needed later on
          // parse it, clean it, and store it once
          q.emojiSource = chunks
            .join('')
            .split(/\r\n|\r|\n/)
            // filter once
            .filter(function (line) {
              return this.test(line);
            }, /^[0-9A-F]/)
            // take only emoji info
            .map(function (codePoint) {
              return codePoint
                .slice(0, codePoint.indexOf(';'))
                .toUpperCase()
                // drop spaces
                .replace(/\s+/g, '-')
                // drop 0 padded prefixes
                .replace(/^0+/g, '');
            });

          console.log('[INFO] parsed ' + q.emojiSource.length + ' standard emoji.');

          // find out which one is missing from our assets
          q.emojiSource.forEach(
            function (emoji) {
              // do not loop for emoji we know we should ignore
              if (ignoreMissing.indexOf(emoji) < 0) {
                // verify all others per each folder
                this.forEach(function (path) {
                  if (assets[path].indexOf(emoji) < 0) {
                    (missing[path] || (missing[path] = [])).push(emoji);
                    missingGrouped[emoji] = true;
                  }
                });
              }
              
            },
            // and per each folder
            Object.keys(assets)
          );

          // if some missing emoji has been found
          if (Object.keys(missing).length) {
            // warn and show which one is missing
            console.warn('[WARNING] missing assets for:');
            console.log(missing);
          }
          // create the array of all emoji we should ignore
          q.ignore = ignoreMissing.concat(Object.keys(missingGrouped));

          q.next();
        });
      } else {
        console.error('[ERROR] unable to fetch emoji at unicode.org');
        process.exit(1);
      }
    });
  },

  // grab the list of emoji that behave differently when
  // variants such \uFE0E and \uFE0F are in place
  function grabStandardVariants(q) {
    console.log('fetching StandardizedVariants.txt ... ');
    http.get(
      "http://unicode.org/Public/UNIDATA/StandardizedVariants.txt",
      function(res) {
        var chunks = [];
        if (res.statusCode == 200) {
          res.on('data', chunks.push.bind(chunks));
          res.on('end', function () {
            // cleaning up parsing sensitive emoji
            q.variantsSensitive = chunks
              .join('')                         // all content
              .split(/\r\n|\r|\n/)              // split in lines
              .filter(function (line) {         // containing FE0E; info
                return this.test(line);         // avoiding duplicated with FE0F
              }, / FE0E; text style/)
              .map(function (line) {            // cleaned up to grab
                return line.replace(this, '$1') // only first unicode
                        .toUpperCase();         // normalized as uppercase
              }, /^([0-9A-F]{4,}) FE0E;.+$/)    // sensitive char
            ;

            console.log('[INFO] parsed ' + q.variantsSensitive.length + ' variant sensitive emoji.');
            q.next();

          });
        } else {
          console.error('[ERROR] unable to fetch standard variants at unicode.org');
          process.exit(1);
        }
      }
    );
  },

  // add our own assets that are not part of the Unicode standard
  function addMissingEmojiAndSort(q) {
    q.nonStandard = [];
    Object.keys(assets).forEach(function (path, i) {
      assets[path].forEach(function (emoji) {
        if (
          q.emojiSource.indexOf(emoji) < 0 &&
          q.variantsSensitive.indexOf(emoji) < 0 &&
          q.nonStandard.indexOf(emoji) < 0
        ) {
          q.nonStandard.push(emoji);
        }
      });
    });

    if (q.nonStandard.length) {
      console.warn('[WARNING] assets contain ' + q.nonStandard.length + ' non standard emoji:');
      // console.log(q.nonStandard.join(', '));
    }

    // order by sequence of chars length
    q.emojiSource = q.emojiSource.concat(q.nonStandard).sort(sort);

    // actually this is not needed
    // q.variantsSensitive.sort(sort);

    q.next();

    function sort(a, b) {
      var diff = b.length - a.length;
      if (diff) return diff;
      return  parseInt(b.split('-')[0], 10) -
              parseInt(a.split('-')[0], 10)
    }

  },

  // with all info, generate a RegExp that will catch
  // only standard emoji that are present in our assets
  function generateRegExp(q) {
    console.log('generating a RegExp for available assets');
    var sensitive = [];
    var regular = [];
    q.emojiSource.forEach(function (codePoint) {
      var u;
      if (q.ignore.indexOf(codePoint) < 0) {
        u = codePoint.split('-').map(toJSON).join('');
        if (q.variantsSensitive.indexOf(codePoint) < 0) {
          regular.push(u);
        } else {
          sensitive.push(u);
        }
      }
    });

    // create a RegExp with properly ordered matches
    q.re = '((?:' +
      regular.join('|') + ')|(?:(?:' +
      sensitive.join('|') +
    ')([\\uFE0E\\uFE0F]?)))';

    q.next();

    // basic utilities to convert codepoints to JSON strings
    function toJSON(point) {
      return UTF162JSON(fromCodePoint(point));
    }
    function fromCodePoint(codepoint) {
      var code = typeof codepoint === 'string' ?
            parseInt(codepoint, 16) : codepoint;
      if (code < 0x10000) {
        return String.fromCharCode(code);
      }
      code -= 0x10000;
      return String.fromCharCode(
        0xD800 + (code >> 10),
        0xDC00 + (code & 0x3FF)
      );
    }
    function UTF162JSON(text) {
      for (var i = 0, r = []; i < text.length; i++) {
        r.push('\\u' + ('000' + text.charCodeAt(i).toString(16)).slice(-4));
      }
      return r.join('');
    }

  },

  function generateFile(q) {
    console.log('generating ./twemoji.js');
    createTwemoji(q.re);
    require('child_process').spawn('node', ['twemoji-dist.js']);
  }

]);



function createTwemoji(re) {
  fs.writeFileSync(
    'twemoji.js',
    '/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */\n' +
    'var twemoji = (' +
    function (
      /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
        https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
      */

      // WARNING:   this file is generated automatically via
      //            `node twemoji-generator.js`
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
          base: (location.protocol === 'https:' ? 'https:' : 'http:') +
                '//twemoji.maxcdn.com/',

          // default assets file extensions, by default '.png'
          ext: '.png',

          // default assets/folder size, by default "36x36"
          // available via Twitter CDN: 16, 36, 72
          size: '36x36',

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
              this.parentNode.replaceChild(createText(this.alt), this);
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
           *                                codePoint:string  the lower case HEX code point
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
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"> emoji!
           *
           *
           *  twemoji.parse("I \u2764\uFE0F emoji!", function(icon, options, variant) {
           *    return '/assets/' + icon + '.gif';
           *  });
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"> emoji!
           *
           *
           * twemoji.parse("I \u2764\uFE0F emoji!", {
           *   size: 72,
           *   callback: function(icon, options, variant) {
           *     return '/assets/' + options.size + '/' + icon + options.ext;
           *   }
           * });
           *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"> emoji!
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
           *                    This calback wil receive standard
           *                    String.prototype.replace(str, callback)
           *                    arguments such:
           *  callback(
           *    match,  // the emoji match
           *    icon,   // the emoji text (same as text)
           *    variant // either '\uFE0E' or '\uFE0F', if present
           *  );
           *
           *                    and others commonly received via replace.
           *
           *  NOTE: When the variant \uFE0E is found, remember this is an explicit intent
           *  from the user: the emoji should **not** be replaced with an image.
           *  In \uFE0F case one, it's the opposite, it should be graphic.
           *  This utility convetion is that only \uFE0E are not translated into images.
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

        // used to find HTML special chars in attributes
        rescaper = /[&<>'"]/g,

        // nodes with type 1 which should **not** be parsed
        shouldntBeParsed = /IFRAME|NOFRAMES|NOSCRIPT|SCRIPT|SELECT|STYLE|TEXTAREA/,

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
      function createText(text) {
        return document.createTextNode(text);
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
       * @param   string    optional "\uFE0F" variant char, ignored by default
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
          // ignore all nodes that are not type 1 or that
          // should not be parsed as script, style, and others
          else if (nodeType === 1 && !shouldntBeParsed.test(subnode.nodeName)) {
            grabAllTextNodes(subnode, allText);
          }
        }
        return allText;
      }

      /**
       * Used to both remove the possible variant
       *  and to convert utf16 into code points
       * @param   string    the emoji surrogate pair
       * @param   string    the optional variant char, if any
       */
      function grabTheRightIcon(icon, variant) {
        // if variant is present as \uFE0F
        return toCodePoint(
          variant === '\uFE0F' ?
            // the icon should not contain it
            icon.slice(0, -1) :
            // fix non standard OSX behavior
            (icon.length === 3 && icon.charAt(1) === '\uFE0F' ?
              icon.charAt(0) + icon.charAt(2) : icon)
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
          alt,
          icon,
          variant,
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
                createText(text.slice(i, index))
              );
            }
            alt = match[0];
            icon = match[1];
            variant = match[2];
            i = index + alt.length;
            if (variant !== '\uFE0E') {
              src = options.callback(
                grabTheRightIcon(icon, variant),
                options,
                variant
              );
              if (src) {
                img = new Image();
                img.onerror = twemoji.onerror;
                img.setAttribute('draggable', 'false');
                attrib = options.attributes(icon, variant);
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
                img.alt = alt;
                img.src = src;
                modified = true;
                fragment.appendChild(img);
              }
            }
            if (!img) fragment.appendChild(createText(alt));
            img = null;
          }
          // is there actually anything to replace in here ?
          if (modified) {
            // any text left to be added ?
            if (i < text.length) {
              fragment.appendChild(
                createText(text.slice(i))
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
        return replace(str, function (match, icon, variant) {
          var
            ret = match,
            attrib,
            attrname,
            src;
          // verify the variant is not the FE0E one
          // this variant means "emoji as text" and should not
          // require any action/replacement
          // http://unicode.org/Public/UNIDATA/StandardizedVariants.html
          if (variant !== '\uFE0E') {
            src = options.callback(
              grabTheRightIcon(icon, variant),
              options,
              variant
            );
            if (src) {
              // recycle the match string replacing the emoji
              // with its image counter part
              ret = '<img '.concat(
                'class="', options.className, '" ',
                'draggable="false" ',
                // needs to preserve user original intent
                // when variants should be copied and pasted too
                'alt="',
                match,
                '"',
                ' src="',
                src,
                '"'
              );
              attrib = options.attributes(icon, variant);
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
              ret = ret.concat('>');
            }
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
          className:  how.className || twemoji.className
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
      .replace('re = /twemoji/', 're = /' + re + '/g')
      .replace(/(\\u00[2-3][0-9])(\\u20e3)/g, '$1\\ufe0f?$2')
      // add the full license
      .replace('/*! (C) Twitter Inc. */',
        '/*! (C) Twitter Inc. *//*\n' +
        fs.readFileSync('LICENSE').toString().replace(
          /^./gm, '   '
        ) +
        '\n  */'
      ) + '());');
}
