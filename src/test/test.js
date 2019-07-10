
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
*/
var base = twemoji.base;
wru.test([{
  name: 'string parsing',
  test: function () {
    // without variant
    wru.assert(
      'default parsing works',
      twemoji.parse('I \u2764 emoji!') ===
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png"/> emoji!'
    );
    // with "as image" variant
    wru.assert(
      'default \uFE0F variant parsing works',
      twemoji.parse('I \u2764\uFE0F emoji!') ===
      'I <img class="emoji" draggable="false" alt="\u2764\uFE0F" src="' + base + '72x72/2764.png"/> emoji!'
    );
    // with "as text" variant
    wru.assert(
      'default \uFE0E variant parsing works',
      twemoji.parse('I \u2764\uFE0E emoji!') ===
      'I \u2764\uFE0E emoji!'
    );
  }
},{
  name: 'string parsing + size',
  test: function () {
    wru.assert(
      'number is squared',
      twemoji.parse('I \u2764 emoji!', {size: 72}) ===
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png"/> emoji!'
    );
    wru.assert(
      'string is preserved',
      twemoji.parse('I \u2764 emoji!', {size: 'any-size'}) ===
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + 'any-size/2764.png"/> emoji!'
    );
  }
},{
  name: 'string parsing + callback',
  test: function () {
    var result = false;
    twemoji.parse('I \u2764 emoji!', function (icon, options) {
      result = icon === '2764' && options.size === '72x72';
    });
    wru.assert('works OK without variant', result);
    result = false;
    twemoji.parse('I \u2764\uFE0F emoji!', function (icon, options) {
      result = icon === '2764' && options.size === '72x72';
    });
    wru.assert('works OK with variant', result);
    result = true;
    twemoji.parse('I \u2764\uFE0E emoji!', function (icon, options) {
      result = false;
    });
    wru.assert('not invoked when \uFE0E is matched', result);
  }
},{
  name: 'string parsing + callback returning `falsy`',
  test: function () {
    wru.assert(
      'does not add an image',
      'I \u2764\uFE0F emoji!' ===
      twemoji.parse('I \u2764\uFE0F emoji!', function () {})
    );
  }
},{
  name: 'string parsing + callback + size',
  test: function () {
    wru.assert(
      'size is overwritten',
      'I <img class="emoji" draggable="false" alt="\u2764" src="72x72/2764.png"/> emoji!' ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          base: '',
          size: 72
        }
      )
    );
  }
},{
  name: 'twemoji.replace(str, callback)',
  test: function () {
    var parsed = false;
    var original = 'I \u2764\uFE0E emoji!';
    var str = twemoji.replace(original, function (match, emoji, variant) {
      parsed = true;
    });
    wru.assert('variant \\uFE0E has been ignored', !parsed);
    wru.assert('returned value is the expected', str === original);
  }
},{
  name: 'twemoji.test(str)',
  test: function () {
    wru.assert(
      twemoji.test('I \u2764 emoji!') &&
      twemoji.test('I \u2764\uFE0F emoji!') &&
      !twemoji.test('I \u2764\uFE0E emoji!') &&
      !twemoji.test('nope')
    );
  }
},{
  name: 'DOM parsing',
  test: function () {
    var img,
    // without variant
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div);
    wru.assert('default parsing works creating 3 nodes', div.childNodes.length === 3);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    img = div.removeChild(div.firstChild);
    wru.assert('second child is the image', img.nodeName === 'IMG');
    wru.assert('img attributes are OK',
      img.className === 'emoji' &&
      img.getAttribute('draggable') === 'false' &&
      img.src === base + '72x72/2764.png' &&
      img.alt === '\u2764' &&
      img.onerror === twemoji.onerror
    );
    wru.assert('last child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji!');
    // with "as image" variant
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0F emoji!'));
    twemoji.parse(div);
    wru.assert('default parsing created 3 nodes', div.childNodes.length === 3);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    img = div.removeChild(div.firstChild);
    wru.assert('second child is the image', img.nodeName === 'IMG');
    wru.assert('img attributes are OK',
      img.className === 'emoji' &&
      img.getAttribute('draggable') === 'false' &&
      img.src === base + '72x72/2764.png' &&
      img.alt === '\u2764\uFE0F' &&
      img.onerror === twemoji.onerror
    );
    wru.assert('last child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji!');
    // with "as text" variant
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0E emoji!'));
    twemoji.parse(div);
    wru.assert('default parsing did NOT create 3 nodes anyway', div.childNodes.length === 1);
  }
},{
  name: 'DOM parsing + size',
  test: function () {
    var img,
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div, {size: 16});
    wru.assert('default parsing works creating 3 nodes', div.childNodes.length === 3);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    img = div.removeChild(div.firstChild);
    wru.assert('second child is the image', img.nodeName === 'IMG');
    wru.assert('img attributes are OK',
      img.className === 'emoji' &&
      img.getAttribute('draggable') === 'false' &&
      img.src === base + '16x16/2764.png' &&
      img.alt === '\u2764' &&
      img.onerror === twemoji.onerror
    );
    wru.assert('last child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji!');
  }
},{
  name: 'DOM parsing + callback',
  test: function () {
    var result = false,
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div, function (icon, options) {
      result = icon === '2764' && options.size === '72x72';
    });
    wru.assert('works OK without variant', result);
    result = false;
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0F emoji!'));
    twemoji.parse(div, function (icon, options) {
      result = icon === '2764' && options.size === '72x72';
    });
    wru.assert('works OK with variant', result);
    result = true;
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0E emoji!'));
    twemoji.parse(div, function (icon, options, variant) {
      result = false;
    });
    wru.assert('not invoked when \uFE0E is matched', result);
  }
},{
  name: 'DOM parsing + callback returning `falsy`',
  test: function () {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div, function () {});
    wru.assert(div.innerHTML === 'I \u2764 emoji!');
  }
},{
  name: 'DOM parsing + callback + size',
  test: function () {
    var result = false,
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div, {
      size: 16,
      callback: function (icon, options) {
        result = icon === '2764' && options.size === '16x16';
      }
    });
    wru.assert('works OK without variant', result);
    result = false;
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0F emoji!'));
    twemoji.parse(div, {
      size: 72,
      callback: function (icon, options) {
        result = icon === '2764' && options.size === '72x72';
      }
    });
    wru.assert('works OK with variant', result);
  }
},{
  name: 'nested nodes',
  test: function () {
    var str = '<img class="emoji" draggable="false" alt="\u2764" src="https://twemoji.maxcdn.com/72x72/2764.png"/>',
        div = document.createElement('div'),
        p,
        img;
    div.innerHTML = '<p>I \u2764 emoji<strong>!</strong></p><p>I \u2764 them too</p>';
    p = div.getElementsByTagName('p');
    twemoji.parse(div);
    wru.assert('preserved structure', p.length === 2);
    img = div.getElementsByTagName('img');
    wru.assert('correct amount of images found', img.length === 2);
    wru.assert('images are in the right place',
      img[0].parentNode === p[0] &&
      img[1].parentNode === p[1]
    );
  }
},{
  name: 'only nodes are affected',
  test: function () {
    var div = document.createElement('div');
    var innerHTML = '<script>/*\u2764*/</script><style>/*\u2764*/</style><hr class="\u2764">';
    div.innerHTML = innerHTML;
    twemoji.parse(div);
    wru.assert(!/<img/i.test(div.innerHTML));
  }
},{
  name: 'DOM parsing multiple per node',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = 'I \u2764\ufe0f emoji, you should \u2764 emoji too!';
    twemoji.parse(div);
    wru.assert('default parsing works creating 5 nodes', div.childNodes.length === 5);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    wru.assert('second child is the expected one', div.removeChild(div.firstChild).alt === '\u2764\ufe0f');
    wru.assert('third child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji, you should ');
    wru.assert('fourth child is the expected one', div.removeChild(div.firstChild).alt === '\u2764');
    wru.assert('fifth child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji too!');
  }
},{
  name: 'DOM parsing does not create XSS',
  test: function () {
    var div = document.createElement('div'), text, html;
    div.innerHTML = 'I \u2764\ufe0f emoji, you shuold &lt;3 them too!';
    text = div.childNodes[0].nodeValue.slice('I \u2764\ufe0f'.length);
    html = div.innerHTML.replace('\u2764\ufe0f', '');
    twemoji.parse(div);
    wru.assert('third child is the expected one', div.childNodes[2].nodeValue === text);
    wru.assert('html unaltered', div.innerHTML.replace(/<img[^>]+?>/i, '') === html);
  }
},{
  name: 'string parsing + className',
  test: function () {
    var className = 'img-' + Math.random();
    var img = 'I <img class="' + className + '" draggable="false" alt="\u2764" src="72x72/2764.png"/> emoji!';
    wru.assert(
      'className is overwritten',
      img ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          className: className,
          base: ''
        }
      )
    );
  }
},{
  name: 'DOM parsing + className',
  test: function () {
    var className = 'img-' + Math.random();
    var img,
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(div, {className: className});
    wru.assert(
      'className is overwritten',
      div.getElementsByTagName('img')[0].className === className
    );
  }
},{
  name: 'string parsing + attributes callback',
  test: function () {
    wru.assert(
      'custom attributes are inserted',
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png" title="Emoji: \u2764" data-test="We all &lt;3 emoji"/> emoji!' ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          attributes: function(rawText, iconId) {
            return {
              title: 'Emoji: ' + rawText,
              'data-test': 'We all <3 emoji'
            };
          }
        }
      )
    );
  }
},{
  name: 'string parsing + attributes callback icon id',
  test: function () {
    wru.assert(
      'custom attributes are inserted',
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png" title="Emoji: 2764" data-test="We all &lt;3 emoji"/> emoji!' ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          attributes: function(rawText, iconId) {
            return {
              title: 'Emoji: ' + iconId,
              'data-test': 'We all <3 emoji'
            };
          }
        }
      )
    );
  }
},{  name: 'string parsing + attributes callback content properly encoded',
  test: function () {
    wru.assert(
      'custom attributes are inserted',
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png" title="&amp;amp;lt;script&amp;amp;gt;alert(&quot;yo&quot;)&amp;amp;lt;/script&amp;amp;gt;"/> emoji!' ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          attributes: function(rawText, iconId) {
            return {
              title: '&amp;lt;script&amp;gt;alert("yo")&amp;lt;/script&amp;gt;'
            };
          }
        }
      )
    );
  }
},{
  name: 'string parsing + attributes callback "on" attributes are omitted',
  test: function () {
    wru.assert(
      'custom attributes are inserted',
      'I <img class="emoji" draggable="false" alt="❤" src="' + base + '72x72/2764.png" title="test"/> emoji!' ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          attributes: function(rawText, iconId) {
            return {
              title: 'test',
              onsomething: 'whoops!',
              onclick: 'nope',
              onmousedown: 'nada'
            };
          }
        }
      )
    );
  }
},{
  name: 'DOM parsing + attributes callback',
  test: function () {
    var img,
    // without variant
        div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764 emoji!'));
    twemoji.parse(
      div, {
        attributes: function(rawText, iconId) {
          return {
            title: 'Emoji: ' + rawText,
            'data-test': 'We all <3 emoji',
            onclick: 'nope',
            onmousedown: 'nada'
          };
        }
      }

    );
    wru.assert('default parsing works creating 3 nodes', div.childNodes.length === 3);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    img = div.removeChild(div.firstChild);
    wru.assert('second child is the image', img.nodeName === 'IMG');
    wru.assert('img attributes are OK',
      img.className === 'emoji' &&
      img.getAttribute('draggable') === 'false' &&
      img.src === base + '72x72/2764.png' &&
      img.alt === '\u2764' &&
      img.onerror === twemoji.onerror &&
      img.getAttribute('title') === 'Emoji: \u2764' &&
      img.getAttribute('data-test') === 'We all <3 emoji'
    );
    wru.assert('img on attributes are omitted',
      img.onclick === null &&
      img.onmousedown === null
    );
  }
},{
  name: 'folder option',
  test: function () {
    var img = 'I <img class="emoji" draggable="false" alt="\u2764" src="svg/2764.svg"/> emoji!';
    wru.assert(
      'folder is accepted',
      img ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          folder: 'svg',
          ext: '.svg',
          base: ''
        }
      )
    );
    wru.assert(
      'folder overwrites size',
      img ===
      twemoji.parse(
        'I \u2764 emoji!',
        {
          size: 72,
          folder: 'svg',
          ext: '.svg',
          base: ''
        }
      )
    );
  }
},{
  name: 'keycap variant',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '5\ufe0f\u20e3';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === "5️⃣" &&
      div.firstChild.src.indexOf('72x72/35-20e3.png') !== -1
    );
    wru.assert('the length is preserved',
      div.getElementsByTagName('img')[0].alt.length === 3);
  }
},{
  name: 'keycap without variant',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '5\u20e3';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === "5⃣" &&
      div.firstChild.src.indexOf('72x72/35-20e3.png') !== -1
    );
    wru.assert('the length is preserved',
      div.getElementsByTagName('img')[0].alt.length === 2);
  }
},{
  name: 'non standard iOS asterisk keycap variant',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '*\ufe0f\u20e3';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === '*\ufe0f\u20e3' &&
      div.firstChild.src.indexOf('72x72/2a-20e3.png') !== -1
    );
    wru.assert('the length is preserved',
      div.getElementsByTagName('img')[0].alt.length === 3);
  }
},{
  name: 'same but standard asterisk keycap without variant',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '*\u20e3';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === '*\u20e3' &&
      div.firstChild.src.indexOf('72x72/2a-20e3.png') !== -1
    );
    wru.assert('the length is preserved',
      div.getElementsByTagName('img')[0].alt.length === 2);
  }
}, {
  name: 'non standard iOS frowning variant',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '\u2639\ufe0f';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === '\u2639\ufe0f' &&
      div.firstChild.src.indexOf('72x72/2639.png') !== -1
    );
  }
},{
  name: 'same but standard frowning',
  test: function () {
    var div = document.createElement('div');
    div.innerHTML = '\u2639';
    twemoji.parse(div);
    wru.assert('recognized as graphical',
      div.firstChild.className === 'emoji' &&
      div.firstChild.getAttribute('draggable') === 'false' &&
      div.firstChild.getAttribute('alt') === '\u2639' &&
      div.firstChild.src.indexOf('72x72/2639.png') !== -1
    );
  }
},{
  name: 'lone vs16s',
  test: function () {
    wru.assert('are not parsed in strings',
     twemoji.parse('\ufe0f') === '\ufe0f'
    );

    var div = document.createElement('div');
    div.innerHTML = '\ufe0f';
    twemoji.parse(div);
    wru.assert('are not parsed in nodes',
      div.innerHTML === '\ufe0f'
    );
  }
},{
  name: 'unnecessary vs16s',
  test: function () {
    wru.assert('are not parsed in strings',
     /^<img.*>\ufe0f$/.test(twemoji.parse('\ud83d\ude10\ufe0f')) 
    );

    var div = document.createElement('div');
    div.innerHTML = '\ud83d\ude10\ufe0f';
    twemoji.parse(div);
    wru.assert('are not parsed in nodes',
      div.children.length === 1 && div.innerText === '\ufe0f'
    );
  }
},{
  name: 'multiple parsing using a callback',
  test: function () {
    wru.assert(
      'FE0E is still ignored',
      twemoji.parse('\u25c0 \u25c0\ufe0e \u25c0\ufe0f', {
        callback: function(iconId, options){return 'icon';}
      }) ===
      '<img class="emoji" draggable="false" alt="\u25c0" src="icon"/> \u25c0\ufe0e <img class="emoji" draggable="false" alt="\u25c0\ufe0f" src="icon"/>'
    );
  }
},{
  name: 'invalid variants and chars',
  test: function () {
    var div = document.createElement('div');
    var img;
    div.innerHTML = twemoji.parse('"\u2b1c\uFE0F"');
    img = div.getElementsByTagName('img')[0];
    wru.assert('correct img.alt 1', img.alt === "\u2b1c\uFE0F");
    wru.assert('correct img.src 1', img.src.slice(-8) === '2b1c.png');
    // other variants should be ignored
    div.innerHTML = twemoji.parse('"\u2b1c\uFE00"');
    img = div.getElementsByTagName('img')[0];
    wru.assert('correct img.alt 2', img.alt === "\u2b1c");
    wru.assert('correct img.src 2', img.src.slice(-8) === '2b1c.png');
    div.removeChild(img);
    // the variant without meanings are still there
    div.innerHTML === '"\uFE00"';
    // when there is a trailing \uFE0E there should be no image
    div.innerHTML = twemoji.parse('"\u2b1c\uFE0E"');
    wru.assert('correct length', div.getElementsByTagName('img').length === 0);
    wru.assert('expected html', div.innerHTML === '"\u2b1c\uFE0E"');
  }
}, {
  name: 'Specific elements are not ignored',
  test: function () {
    var innerHTML, div = document.createElement('div');
    div.innerHTML = '<iframe>\u2764</iframe>';
    innerHTML = div.innerHTML;
    twemoji.parse(div);
    wru.assert('Exclude tags', div.innerHTML === div.innerHTML);
    div.innerHTML = '<customiframe>\u2764</customiframe>';
    wru.assert('Avoid false positive',
      /^<customiframe><img .*?><\/customiframe>$/.test(twemoji.parse(div).innerHTML));
  }
}, {
  name: 'XHTML parseNode compatibility',
  test: function () {
    var frame = document.createElement('iframe');
    frame.src = 'data:application/xhtml+xml;charset=utf-8,%3Cx%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxhtml%22%3E%E2%9D%A4%3C%2Fx%3E';
    document.body.appendChild(frame);
    setTimeout(wru.async(function () {
      twemoji.parse(frame.contentDocument.documentElement);
      if (frame.contentDocument.documentElement.outerHTML.indexOf("<html>") == 0) {
        wru.assert('unable to test XHTML due to iframe not loading');
      } else {
        wru.assert('parse XHTML node', /^<x.*?><img .*?><\/x>$/.test(twemoji.parse(frame.contentDocument.documentElement).outerHTML));
      }
      document.body.removeChild(frame);
    }, 10));
  }
}, {
  name: 'SVG Elements are ignored',
  test: function () {
    if (typeof SVGElement !== 'undefined') {
      var innerHTML, div = document.createElement('div');
      div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">' +
        '<switch>' +
          '<circle cx="20" cy="20" r="18" stroke="grey" stroke-width="2" fill="#99FF66" />' +
          '<foreignObject>' +
            '<div>I \u2764 emoji!</div>' +
          '</foreignObject>' +
        '</switch>' +
      '</svg>';
      // grab the normalized one
      innerHTML = div.innerHTML;
      twemoji.parse(div);
      wru.assert('nothing changed', innerHTML === div.innerHTML);
    } else {
      wru.assert('nothing to do here');
    }
  }
}, {
  name: 'using a different onerror',
  test: function () {
    var Image = window.Image;
    window.Image = function () {
      var self = new Image;
      setTimeout(function () {
        window.Image = Image;
        self.onerror();
      }, 10);
      return self;
    };
    var div = document.createElement('div');
    div.innerHTML = '5\ufe0f\u20e3';
    twemoji.parse(div, {onerror: wru.async(function () {
      wru.assert('OK');
    })});
  }
}, {
  name: 'all iOS emoji',
  test: function () {
    var allIosEmoji = [
      '\ud83d\ude00',
      '\ud83d\ude2c',
      '\ud83d\ude01',
      '\ud83d\ude02',
      '\ud83d\ude03',
      '\ud83d\ude04',
      '\ud83d\ude05',
      '\ud83d\ude06',
      '\ud83d\ude07',
      '\ud83d\ude09',
      '\ud83d\ude0a',
      '\ud83d\ude42',
      '\ud83d\ude43',
      '\u263a\ufe0f',
      '\ud83d\ude0b',
      '\ud83d\ude0c',
      '\ud83d\ude0d',
      '\ud83d\ude18',
      '\ud83d\ude17',
      '\ud83d\ude19',
      '\ud83d\ude1a',
      '\ud83d\ude1c',
      '\ud83d\ude1d',
      '\ud83d\ude1b',
      '\ud83e\udd11',
      '\ud83e\udd13',
      '\ud83d\ude0e',
      '\ud83e\udd17',
      '\ud83d\ude0f',
      '\ud83d\ude36',
      '\ud83d\ude10',
      '\ud83d\ude11',
      '\ud83d\ude12',
      '\ud83d\ude44',
      '\ud83e\udd14',
      '\ud83d\ude33',
      '\ud83d\ude1e',
      '\ud83d\ude1f',
      '\ud83d\ude20',
      '\ud83d\ude21',
      '\ud83d\ude14',
      '\ud83d\ude15',
      '\ud83d\ude41',
      '\u2639\ufe0f',
      '\ud83d\ude23',
      '\ud83d\ude16',
      '\ud83d\ude2b',
      '\ud83d\ude29',
      '\ud83d\ude24',
      '\ud83d\ude2e',
      '\ud83d\ude31',
      '\ud83d\ude28',
      '\ud83d\ude30',
      '\ud83d\ude2f',
      '\ud83d\ude26',
      '\ud83d\ude27',
      '\ud83d\ude22',
      '\ud83d\ude25',
      '\ud83d\ude2a',
      '\ud83d\ude13',
      '\ud83d\ude2d',
      '\ud83d\ude35',
      '\ud83d\ude32',
      '\ud83e\udd10',
      '\ud83d\ude37',
      '\ud83e\udd12',
      '\ud83e\udd15',
      '\ud83d\ude34',
      '\ud83d\udca4',
      '\ud83d\udca9',
      '\ud83d\ude08',
      '\ud83d\udc7f',
      '\ud83d\udc79',
      '\ud83d\udc7a',
      '\ud83d\udc80',
      '\ud83d\udc7b',
      '\ud83d\udc7d',
      '\ud83e\udd16',
      '\ud83d\ude3a',
      '\ud83d\ude38',
      '\ud83d\ude39',
      '\ud83d\ude3b',
      '\ud83d\ude3c',
      '\ud83d\ude3d',
      '\ud83d\ude40',
      '\ud83d\ude3f',
      '\ud83d\ude3e',
      '\ud83d\ude4c',
      '\ud83d\udc4f',
      '\ud83d\udc4b',
      '\ud83d\udc4d',
      '\ud83d\udc4e',
      '\ud83d\udc4a',
      '\u270a',
      '\u270c',
      '\ud83d\udc4c',
      '\u270b',
      '\ud83d\udc50',
      '\ud83d\udcaa',
      '\ud83d\ude4f',
      '\u261d',
      '\ud83d\udc46',
      '\ud83d\udc47',
      '\ud83d\udc48',
      '\ud83d\udc49',
      '\ud83d\udd95',
      '\ud83d\udd90',
      '\ud83d\udd90',
      '\ud83e\udd18',
      '\ud83d\udd96',
      '\u270d',
      '\ud83d\udc85',
      '\ud83d\udc44',
      '\ud83d\udc45',
      '\ud83d\udc42',
      '\ud83d\udc43',
      '\ud83d\udc41',
      '\ud83d\udc40',
      '\ud83d\udc64',
      '\ud83d\udc65',
      '\ud83d\udde3',
      '\ud83d\udc76',
      '\ud83d\udc66',
      '\ud83d\udc67',
      '\ud83d\udc68',
      '\ud83d\udc69',
      '\ud83d\udc71',
      '\ud83d\udc74',
      '\ud83d\udc75',
      '\ud83d\udc72',
      '\ud83d\udc73',
      '\ud83d\udc6e',
      '\ud83d\udc77',
      '\ud83d\udc82',
      '\ud83d\udd75',
      '\ud83c\udf85',
      '\ud83d\udc7c',
      '\ud83d\udc78',
      '\ud83d\udc70',
      '\ud83d\udeb6',
      '\ud83c\udfc3',
      '\ud83d\udc83',
      '\ud83d\udc6f',
      '\ud83d\udc6b',
      '\ud83d\udc6c',
      '\ud83d\udc6d',
      '\ud83d\ude47',
      '\ud83d\udc81',
      '\ud83d\ude45',
      '\ud83d\ude46',
      '\ud83d\ude4b',
      '\ud83d\ude4e',
      '\ud83d\ude4d',
      '\ud83d\udc87',
      '\ud83d\udc86',
      '\ud83d\udc91',
      '\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc69',
      '\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68',
      '\ud83d\udc8f',
      '\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69',
      '\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68',
      '\ud83d\udc6a',
      '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67',
      '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66',
      '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66',
      '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc67',
      '\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66',
      '\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67',
      '\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66',
      '\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66',
      '\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc67',
      '\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66',
      '\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67',
      '\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d\udc66',
      '\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66',
      '\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d\udc67',
      '\ud83d\udc5a',
      '\ud83d\udc55',
      '\ud83d\udc56',
      '\ud83d\udc54',
      '\ud83d\udc57',
      '\ud83d\udc59',
      '\ud83d\udc58',
      '\ud83d\udc84',
      '\ud83d\udc8b',
      '\ud83d\udc63',
      '\ud83d\udc60',
      '\ud83d\udc61',
      '\ud83d\udc62',
      '\ud83d\udc5e',
      '\ud83d\udc5f',
      '\ud83d\udc52',
      '\ud83c\udfa9',
      '\ud83c\udf93',
      '\ud83d\udc51',
      '\u26d1',
      '\ud83c\udf92',
      '\ud83d\udc5d',
      '\ud83d\udc5b',
      '\ud83d\udc5c',
      '\ud83d\udcbc',
      '\ud83d\udc53',
      '\ud83d\udd76',
      '\ud83d\udc8d',
      '\ud83c\udf02',
      '\ud83d\udc36',
      '\ud83d\udc31',
      '\ud83d\udc2d',
      '\ud83d\udc39',
      '\ud83d\udc30',
      '\ud83d\udc3b',
      '\ud83d\udc3c',
      '\ud83d\udc28',
      '\ud83d\udc2f',
      '\ud83e\udd81',
      '\ud83d\udc2e',
      '\ud83d\udc37',
      '\ud83d\udc3d',
      '\ud83d\udc38',
      '\ud83d\udc19',
      '\ud83d\udc35',
      '\ud83d\ude48',
      '\ud83d\ude49',
      '\ud83d\ude4a',
      '\ud83d\udc12',
      '\ud83d\udc14',
      '\ud83d\udc27',
      '\ud83d\udc26',
      '\ud83d\udc24',
      '\ud83d\udc23',
      '\ud83d\udc25',
      '\ud83d\udc3a',
      '\ud83d\udc17',
      '\ud83d\udc34',
      '\ud83e\udd84',
      '\ud83d\udc1d',
      '\ud83d\udc1b',
      '\ud83d\udc0c',
      '\ud83d\udc1e',
      '\ud83d\udc1c',
      '\ud83d\udd77',
      '\ud83e\udd82',
      '\ud83e\udd80',
      '\ud83d\udc0d',
      '\ud83d\udc22',
      '\ud83d\udc20',
      '\ud83d\udc1f',
      '\ud83d\udc21',
      '\ud83d\udc2c',
      '\ud83d\udc33',
      '\ud83d\udc0b',
      '\ud83d\udc0a',
      '\ud83d\udc06',
      '\ud83d\udc05',
      '\ud83d\udc03',
      '\ud83d\udc02',
      '\ud83d\udc04',
      '\ud83d\udc2a',
      '\ud83d\udc2b',
      '\ud83d\udc18',
      '\ud83d\udc10',
      '\ud83d\udc0f',
      '\ud83d\udc11',
      '\ud83d\udc0e',
      '\ud83d\udc16',
      '\ud83d\udc00',
      '\ud83d\udc01',
      '\ud83d\udc13',
      '\ud83e\udd83',
      '\ud83d\udd4a',
      '\ud83d\udc15',
      '\ud83d\udc29',
      '\ud83d\udc08',
      '\ud83d\udc07',
      '\ud83d\udc3f',
      '\ud83d\udc3e',
      '\ud83d\udc09',
      '\ud83d\udc32',
      '\ud83c\udf35',
      '\ud83c\udf84',
      '\ud83c\udf32',
      '\ud83c\udf33',
      '\ud83c\udf34',
      '\ud83c\udf31',
      '\ud83c\udf3f',
      '\u2618',
      '\ud83c\udf40',
      '\ud83c\udf8d',
      '\ud83c\udf8b',
      '\ud83c\udf43',
      '\ud83c\udf42',
      '\ud83c\udf41',
      '\ud83c\udf3e',
      '\ud83c\udf3a',
      '\ud83c\udf3b',
      '\ud83c\udf39',
      '\ud83c\udf37',
      '\ud83c\udf3c',
      '\ud83c\udf38',
      '\ud83d\udc90',
      '\ud83c\udf44',
      '\ud83c\udf30',
      '\ud83c\udf83',
      '\ud83d\udc1a',
      '\ud83d\udd78',
      '\ud83c\udf0e',
      '\ud83c\udf0d',
      '\ud83c\udf0f',
      '\ud83c\udf15',
      '\ud83c\udf16',
      '\ud83c\udf17',
      '\ud83c\udf18',
      '\ud83c\udf11',
      '\ud83c\udf12',
      '\ud83c\udf13',
      '\ud83c\udf14',
      '\ud83c\udf1a',
      '\ud83c\udf1d',
      '\ud83c\udf1b',
      '\ud83c\udf1c',
      '\ud83c\udf1e',
      '\ud83c\udf19',
      '\u2b50\ufe0f',
      '\ud83c\udf1f',
      '\ud83d\udcab',
      '\u2728',
      '\u2604',
      '\u2600\ufe0f',
      '\ud83c\udf24',
      '\u26c5\ufe0f',
      '\ud83c\udf25',
      '\ud83c\udf26',
      '\u2601\ufe0f',
      '\ud83c\udf27',
      '\u26c8',
      '\ud83c\udf29',
      '\u26a1\ufe0f',
      '\ud83d\udd25',
      '\ud83d\udca5',
      '\u2744\ufe0f',
      '\ud83c\udf28',
      '\u2603',
      '\u26c4\ufe0f',
      '\ud83c\udf2c',
      '\ud83d\udca8',
      '\ud83c\udf2a',
      '\ud83c\udf2b',
      '\u2602',
      '\u2614\ufe0f',
      '\ud83d\udca7',
      '\ud83d\udca6',
      '\ud83c\udf0a',
      '\ud83c\udf4f',
      '\ud83c\udf4e',
      '\ud83c\udf50',
      '\ud83c\udf4a',
      '\ud83c\udf4b',
      '\ud83c\udf4c',
      '\ud83c\udf49',
      '\ud83c\udf47',
      '\ud83c\udf53',
      '\ud83c\udf48',
      '\ud83c\udf52',
      '\ud83c\udf51',
      '\ud83c\udf4d',
      '\ud83c\udf45',
      '\ud83c\udf46',
      '\ud83c\udf36',
      '\ud83c\udf3d',
      '\ud83c\udf60',
      '\ud83c\udf6f',
      '\ud83c\udf5e',
      '\ud83e\uddc0',
      '\ud83c\udf57',
      '\ud83c\udf56',
      '\ud83c\udf64',
      '\ud83c\udf73',
      '\ud83c\udf54',
      '\ud83c\udf5f',
      '\ud83c\udf2d',
      '\ud83c\udf55',
      '\ud83c\udf5d',
      '\ud83c\udf2e',
      '\ud83c\udf2f',
      '\ud83c\udf5c',
      '\ud83c\udf72',
      '\ud83c\udf65',
      '\ud83c\udf63',
      '\ud83c\udf71',
      '\ud83c\udf5b',
      '\ud83c\udf59',
      '\ud83c\udf5a',
      '\ud83c\udf58',
      '\ud83c\udf62',
      '\ud83c\udf61',
      '\ud83c\udf67',
      '\ud83c\udf68',
      '\ud83c\udf66',
      '\ud83c\udf70',
      '\ud83c\udf82',
      '\ud83c\udf6e',
      '\ud83c\udf6c',
      '\ud83c\udf6d',
      '\ud83c\udf6b',
      '\ud83c\udf7f',
      '\ud83c\udf69',
      '\ud83c\udf6a',
      '\ud83c\udf7a',
      '\ud83c\udf7b',
      '\ud83c\udf77',
      '\ud83c\udf78',
      '\ud83c\udf79',
      '\ud83c\udf7e',
      '\ud83c\udf76',
      '\ud83c\udf75',
      '\u2615\ufe0f',
      '\ud83c\udf7c',
      '\ud83c\udf74',
      '\ud83c\udf7d',
      '\u26bd\ufe0f',
      '\ud83c\udfc0',
      '\ud83c\udfc8',
      '\u26be\ufe0f',
      '\ud83c\udfbe',
      '\ud83c\udfd0',
      '\ud83c\udfc9',
      '\ud83c\udfb1',
      '\u26f3\ufe0f',
      '\ud83c\udfcc',
      '\ud83c\udfd3',
      '\ud83c\udff8',
      '\ud83c\udfd2',
      '\ud83c\udfd1',
      '\ud83c\udfcf',
      '\ud83c\udfbf',
      '\u26f7',
      '\ud83c\udfc2',
      '\u26f8',
      '\ud83c\udff9',
      '\ud83c\udfa3',
      '\ud83d\udea3',
      '\ud83c\udfca',
      '\ud83c\udfc4',
      '\ud83d\udec0',
      '\u26f9',
      '\ud83c\udfcb',
      '\ud83d\udeb4',
      '\ud83d\udeb5',
      '\ud83c\udfc7\ud83c\udffb',
      '\ud83d\udd74',
      '\ud83c\udfc6',
      '\ud83c\udfbd',
      '\ud83c\udfc5',
      '\ud83c\udf96',
      '\ud83c\udf97',
      '\ud83c\udff5',
      '\ud83c\udfab',
      '\ud83c\udf9f',
      '\ud83c\udfad',
      '\ud83c\udfa8',
      '\ud83c\udfaa',
      '\ud83c\udfa4',
      '\ud83c\udfa7',
      '\ud83c\udfbc',
      '\ud83c\udfb9',
      '\ud83c\udfb7',
      '\ud83c\udfba',
      '\ud83c\udfb8',
      '\ud83c\udfbb',
      '\ud83c\udfac',
      '\ud83c\udfae',
      '\ud83d\udc7e',
      '\ud83c\udfaf',
      '\ud83c\udfb2',
      '\ud83c\udfb0',
      '\ud83c\udfb3',
      '\ud83d\ude92',
      '\ud83d\ude97',
      '\ud83d\ude95',
      '\ud83d\ude99',
      '\ud83d\ude8c',
      '\ud83d\ude8e',
      '\ud83c\udfce',
      '\ud83d\ude93',
      '\ud83d\ude91',
      '\ud83d\ude92',
      '\ud83d\ude90',
      '\ud83d\ude9a',
      '\ud83d\ude9b',
      '\ud83d\ude9c',
      '\ud83c\udfcd',
      '\ud83d\udeb2',
      '\ud83d\udea8',
      '\ud83d\ude94',
      '\ud83d\ude8d',
      '\ud83d\ude98',
      '\ud83d\ude96',
      '\ud83d\udea1',
      '\ud83d\udea0',
      '\ud83d\ude9f',
      '\ud83d\ude83',
      '\ud83d\ude8b',
      '\ud83d\ude9d',
      '\ud83d\ude84',
      '\ud83d\ude85',
      '\ud83d\ude88',
      '\ud83d\ude9e',
      '\ud83d\ude82',
      '\ud83d\ude86',
      '\ud83d\ude87',
      '\ud83d\ude8a',
      '\ud83d\ude89',
      '\ud83d\ude81',
      '\ud83d\udee9',
      '\u2708\ufe0f',
      '\ud83d\udeeb',
      '\ud83d\udeec',
      '\u26f5\ufe0f',
      '\ud83d\udee5',
      '\ud83d\udea4',
      '\u26f4',
      '\ud83d\udef3',
      '\ud83d\ude80',
      '\ud83d\udef0',
      '\ud83d\udcba',
      '\u2693\ufe0f',
      '\ud83d\udea7',
      '\u26fd\ufe0f',
      '\ud83d\ude8f',
      '\ud83d\udea6',
      '\ud83d\udea5',
      '\ud83c\udfc1',
      '\ud83d\udea2',
      '\ud83c\udfa1',
      '\ud83c\udfa2',
      '\ud83c\udfa0',
      '\ud83c\udfd7',
      '\ud83c\udf01',
      '\ud83d\uddfc',
      '\ud83c\udfed',
      '\u26f2\ufe0f',
      '\ud83c\udf91',
      '\u26f0',
      '\ud83c\udfd4',
      '\ud83d\uddfb',
      '\ud83c\udf0b',
      '\ud83d\uddfe',
      '\ud83c\udfd5',
      '\u26fa\ufe0f',
      '\ud83c\udfde',
      '\ud83d\udee3',
      '\ud83d\udee4',
      '\ud83c\udf05',
      '\ud83c\udf04',
      '\ud83c\udfdc',
      '\ud83c\udfd6',
      '\ud83c\udfdd',
      '\ud83c\udf07',
      '\ud83c\udf06',
      '\ud83c\udfd9',
      '\ud83c\udf03',
      '\ud83c\udf09',
      '\ud83c\udf0c',
      '\ud83c\udf20',
      '\ud83c\udf87',
      '\ud83c\udf86',
      '\ud83c\udf08',
      '\ud83c\udfd8',
      '\ud83c\udff0',
      '\ud83c\udfef',
      '\ud83c\udfdf',
      '\ud83d\uddfd',
      '\ud83c\udfe0',
      '\ud83c\udfe1',
      '\ud83c\udfda',
      '\ud83c\udfe2',
      '\ud83c\udfec',
      '\ud83c\udfe3',
      '\ud83c\udfe4',
      '\ud83c\udfe5',
      '\ud83c\udfe6',
      '\ud83c\udfe8',
      '\ud83c\udfea',
      '\ud83c\udfeb',
      '\ud83c\udfe9',
      '\ud83d\udc92',
      '\ud83c\udfdb',
      '\u26ea\ufe0f',
      '\ud83d\udd4c',
      '\ud83d\udd4d',
      '\ud83d\udd4b',
      '\u26e9',
      '\u231a\ufe0f',
      '\ud83d\udcf1',
      '\ud83d\udcf2',
      '\ud83d\udcbb',
      '\u2328',
      '\ud83d\udda5',
      '\ud83d\udda8',
      '\ud83d\uddb1',
      '\ud83d\uddb2',
      '\ud83d\udd79',
      '\ud83d\udddc',
      '\ud83d\udcbd',
      '\ud83d\udcbe',
      '\ud83d\udcbf',
      '\ud83d\udcc0',
      '\ud83d\udcfc',
      '\ud83d\udcf7',
      '\ud83d\udcf8',
      '\ud83d\udcf9',
      '\ud83c\udfa5',
      '\ud83d\udcfd',
      '\ud83c\udf9e',
      '\ud83d\udcde',
      '\u260e\ufe0f',
      '\ud83d\udcdf',
      '\ud83d\udce0',
      '\ud83d\udcfa',
      '\ud83d\udcfb',
      '\ud83c\udf99',
      '\ud83c\udf9a',
      '\ud83c\udf9b',
      '\u23f1',
      '\u23f2',
      '\u23f0',
      '\ud83d\udd70',
      '\u23f3',
      '\u231b\ufe0f',
      '\ud83d\udce1',
      '\ud83d\udd0b',
      '\ud83d\udd0c',
      '\ud83d\udca1',
      '\ud83d\udd26',
      '\ud83d\udd6f',
      '\ud83d\uddd1',
      '\ud83d\udee2',
      '\ud83d\udcb8',
      '\ud83d\udcb5',
      '\ud83d\udcb4',
      '\ud83d\udcb6',
      '\ud83d\udcb7',
      '\ud83d\udcb0',
      '\ud83d\udcb3',
      '\ud83d\udc8e',
      '\u2696',
      '\ud83d\udd27',
      '\ud83d\udd28',
      '\u2692',
      '\ud83d\udee0',
      '\u26cf',
      '\ud83d\udd29',
      '\u2699',
      '\u26d3',
      '\ud83d\udd2b',
      '\ud83d\udca3',
      '\ud83d\udd2a',
      '\ud83d\udde1',
      '\u2694',
      '\ud83d\udee1',
      '\ud83d\udeac',
      '\u2620',
      '\u26b0',
      '\u26b1',
      '\ud83c\udffa',
      '\ud83d\udd2e',
      '\ud83d\udcff',
      '\ud83d\udc88',
      '\u2697',
      '\ud83d\udd2d',
      '\ud83d\udd2c',
      '\ud83d\udd73',
      '\ud83d\udc8a',
      '\ud83d\udc89',
      '\ud83c\udf21',
      '\ud83c\udff7',
      '\ud83d\udd16',
      '\ud83d\udebd',
      '\ud83d\udebf',
      '\ud83d\udec1',
      '\ud83d\udd11',
      '\ud83d\udddd',
      '\ud83d\udecb',
      '\ud83d\udecc',
      '\ud83d\udecf',
      '\ud83d\udeaa',
      '\ud83d\udece',
      '\ud83d\uddbc',
      '\ud83d\uddfa',
      '\u26f1',
      '\ud83d\uddff',
      '\ud83d\udecd',
      '\ud83c\udf88',
      '\ud83c\udf8f',
      '\ud83c\udf80',
      '\ud83c\udf81',
      '\ud83c\udf8a',
      '\ud83c\udf89',
      '\ud83c\udf8e',
      '\ud83c\udf90',
      '\ud83c\udf8c',
      '\ud83c\udfee',
      '\u2709\ufe0f',
      '\ud83d\udce9',
      '\ud83d\udce8',
      '\ud83d\udce7',
      '\ud83d\udc8c',
      '\ud83d\udcee',
      '\ud83d\udcea',
      '\ud83d\udceb',
      '\ud83d\udcec',
      '\ud83d\udced',
      '\ud83d\udce6',
      '\ud83d\udcef',
      '\ud83d\udce5',
      '\ud83d\udce4',
      '\ud83d\udcdc',
      '\ud83d\udcc3',
      '\ud83d\udcd1',
      '\ud83d\udcca',
      '\ud83d\udcc8',
      '\ud83d\udcc9',
      '\ud83d\udcc4',
      '\ud83d\udcc5',
      '\ud83d\udcc6',
      '\ud83d\uddd3',
      '\ud83d\udcc7',
      '\ud83d\uddc3',
      '\ud83d\uddf3',
      '\ud83d\uddc4',
      '\ud83d\udccb',
      '\ud83d\uddd2',
      '\ud83d\udcc1',
      '\ud83d\udcc2',
      '\ud83d\uddc2',
      '\ud83d\uddde',
      '\ud83d\udcf0',
      '\ud83d\udcd3',
      '\ud83d\udcd5',
      '\ud83d\udcd7',
      '\ud83d\udcd8',
      '\ud83d\udcd9',
      '\ud83d\udcd4',
      '\ud83d\udcd2',
      '\ud83d\udcda',
      '\ud83d\udcd6',
      '\ud83d\udd17',
      '\ud83d\udcce',
      '\ud83d\udd87',
      '\u2702\ufe0f',
      '\ud83d\udcd0',
      '\ud83d\udccf',
      '\ud83d\udccc',
      '\ud83d\udccd',
      '\ud83d\udea9',
      '\ud83c\udff3',
      '\ud83c\udff4',
      '\ud83d\udd10',
      '\ud83d\udd12',
      '\ud83d\udd13',
      '\ud83d\udd0f',
      '\ud83d\udd8a',
      '\ud83d\udd8b',
      '\u2712\ufe0f',
      '\ud83d\udcdd',
      '\u270f\ufe0f',
      '\ud83d\udd8d',
      '\ud83d\udd8c',
      '\ud83d\udd0d',
      '\ud83d\udd0e',
      '\u2764\ufe0f',
      '\ud83d\udc9b',
      '\ud83d\udc9a',
      '\ud83d\udc99',
      '\ud83d\udc9c',
      '\ud83d\udc94',
      '\u2763',
      '\ud83d\udc95',
      '\ud83d\udc9e',
      '\ud83d\udc93',
      '\ud83d\udc97',
      '\ud83d\udc96',
      '\ud83d\udc98',
      '\ud83d\udc9d',
      '\ud83d\udc9f',
      '\u262e',
      '\u271d',
      '\u262a',
      '\ud83d\udd49',
      '\u2638',
      '\u2721',
      '\ud83d\udd2f',
      '\ud83d\udd4e',
      '\u262f',
      '\u2626',
      '\ud83d\uded0',
      '\u26ce',
      '\u2648\ufe0f',
      '\u2649\ufe0f',
      '\u264a\ufe0f',
      '\u264b\ufe0f',
      '\u264c\ufe0f',
      '\u264d\ufe0f',
      '\u264e\ufe0f',
      '\u264f\ufe0f',
      '\u2650\ufe0f',
      '\u2651\ufe0f',
      '\u2652\ufe0f',
      '\u2653\ufe0f',
      '\ud83c\udd94',
      '\u269b',
      '\ud83c\ude33',
      '\ud83c\ude39',
      '\u2622',
      '\u2623',
      '\ud83d\udcf4',
      '\ud83d\udcf3',
      '\ud83c\ude36',
      '\ud83c\ude1a\ufe0f',
      '\ud83c\ude38',
      '\ud83c\ude3a',
      '\ud83c\ude37',
      '\u2734\ufe0f',
      '\ud83c\udd9a',
      '\ud83c\ude51',
      '\ud83d\udcae',
      '\ud83c\ude50',
      '\u3299\ufe0f',
      '\u3297\ufe0f',
      '\ud83c\ude34',
      '\ud83c\ude35',
      '\ud83c\ude32',
      '\ud83c\udd70',
      '\ud83c\udd71',
      '\ud83c\udd8e',
      '\ud83c\udd91',
      '\ud83c\udd7e',
      '\ud83c\udd98',
      '\u26d4\ufe0f',
      '\ud83d\udcdb',
      '\ud83d\udeab',
      '\u274c',
      '\u2b55\ufe0f',
      '\ud83d\udca2',
      '\u2668\ufe0f',
      '\ud83d\udeb7',
      '\ud83d\udeaf',
      '\ud83d\udeb3',
      '\ud83d\udeb1',
      '\ud83d\udd1e',
      '\ud83d\udcf5',
      '\u2757\ufe0f',
      '\u2755',
      '\u2753',
      '\u2754',
      '\u203c\ufe0f',
      '\u2049\ufe0f',
      '\ud83d\udcaf',
      '\ud83d\udd05',
      '\ud83d\udd06',
      '\ud83d\udd31',
      '\u269c',
      '\u303d\ufe0f',
      '\u26a0\ufe0f',
      '\ud83d\udeb8',
      '\ud83d\udd30',
      '\u267b\ufe0f',
      '\ud83c\ude2f\ufe0f',
      '\ud83d\udcb9',
      '\u2747\ufe0f',
      '\u2733\ufe0f',
      '\u274e',
      '\u2705',
      '\ud83d\udca0',
      '\ud83c\udf00',
      '\u27bf',
      '\ud83c\udf10',
      '\u24c2\ufe0f',
      '\ud83c\udfe7',
      '\ud83c\ude02',
      '\ud83d\udec2',
      '\ud83d\udec3',
      '\ud83d\udec4',
      '\ud83d\udec5',
      '\u267f\ufe0f',
      '\ud83d\udead',
      '\ud83d\udebe',
      '\ud83c\udd7f\ufe0f',
      '\ud83d\udeb0',
      '\ud83d\udeb9',
      '\ud83d\udeba',
      '\ud83d\udebc',
      '\ud83d\udebb',
      '\ud83d\udeae',
      '\ud83c\udfa6',
      '\ud83d\udcf6',
      '\ud83c\ude01',
      '\ud83c\udd96',
      '\ud83c\udd97',
      '\ud83c\udd99',
      '\ud83c\udd92',
      '\ud83c\udd95',
      '\ud83c\udd93',
      '0\ufe0f\u20e3',
      '1\ufe0f\u20e3',
      '2\ufe0f\u20e3',
      '3\ufe0f\u20e3',
      '4\ufe0f\u20e3',
      '5\ufe0f\u20e3',
      '6\ufe0f\u20e3',
      '7\ufe0f\u20e3',
      '8\ufe0f\u20e3',
      '9\ufe0f\u20e3',
      '\ud83d\udd1f',
      '\ud83d\udd22',
      '\u25b6\ufe0f',
      '\u23f8',
      '\u23ef',
      '\u23f9',
      '\u23fa',
      '\u23ed',
      '\u23ee',
      '\u23e9',
      '\u23ea',
      '\ud83d\udd00',
      '\ud83d\udd01',
      '\ud83d\udd02',
      '\u25c0\ufe0f',
      '\ud83d\udd3c',
      '\ud83d\udd3d',
      '\u23eb',
      '\u23ec',
      '\u27a1\ufe0f',
      '\u2b05\ufe0f',
      '\u2b06\ufe0f',
      '\u2b07\ufe0f',
      '\u2197\ufe0f',
      '\u2198\ufe0f',
      '\u2199\ufe0f',
      '\u2196\ufe0f',
      '\u2195\ufe0f',
      '\u2194\ufe0f',
      '\ud83d\udd04',
      '\u21aa\ufe0f',
      '\u21a9\ufe0f',
      '\u2934\ufe0f',
      '\u2935\ufe0f',
      '#\ufe0f\u20e3',
      '*\ufe0f\u20e3',
      '\u2139\ufe0f',
      '\ud83d\udd24',
      '\ud83d\udd21',
      '\ud83d\udd20',
      '\ud83d\udd23',
      '\ud83c\udfb5',
      '\ud83c\udfb6',
      '\u3030',
      '\u27b0',
      '\u2714\ufe0f',
      '\ud83d\udd03',
      '\u2795',
      '\u2796',
      '\u2797',
      '\u2716\ufe0f',
      '\ud83d\udcb2',
      '\ud83d\udcb1',
      '\xa9\ufe0f',
      '\xae\ufe0f',
      '\u2122\ufe0f',
      '\ud83d\udd1a',
      '\ud83d\udd19',
      '\ud83d\udd1b',
      '\ud83d\udd1d',
      '\ud83d\udd1c',
      '\u2611\ufe0f',
      '\ud83d\udd18',
      '\u26aa\ufe0f',
      '\u26ab\ufe0f',
      '\ud83d\udd34',
      '\ud83d\udd35',
      '\ud83d\udd38',
      '\ud83d\udd39',
      '\ud83d\udd36',
      '\ud83d\udd37',
      '\ud83d\udd3a',
      '\u25aa\ufe0f',
      '\u25ab\ufe0f',
      '\u2b1b\ufe0f',
      '\u2b1c\ufe0f',
      '\ud83d\udd3b',
      '\u25fc\ufe0f',
      '\u25fb\ufe0f',
      '\u25fe\ufe0f',
      '\u25fd\ufe0f',
      '\ud83d\udd32',
      '\ud83d\udd33',
      '\ud83d\udd08',
      '\ud83d\udd09',
      '\ud83d\udd0a',
      '\ud83d\udd07',
      '\ud83d\udce3',
      '\ud83d\udce2',
      '\ud83d\udd14',
      '\ud83d\udd15',
      '\ud83c\udccf',
      '\ud83c\udc04\ufe0f',
      '\u2660\ufe0f',
      '\u2663\ufe0f',
      '\u2665\ufe0f',
      '\u2666\ufe0f',
      '\ud83c\udfb4',
      '\ud83d\udc41\u200d\ud83d\udde8',
      '\ud83d\udcad',
      '\ud83d\uddef',
      '\ud83d\udcac',
      '\ud83d\udd50',
      '\ud83d\udd51',
      '\ud83d\udd52',
      '\ud83d\udd53',
      '\ud83d\udd54',
      '\ud83d\udd55',
      '\ud83d\udd56',
      '\ud83d\udd57',
      '\ud83d\udd58',
      '\ud83d\udd59',
      '\ud83d\udd5a',
      '\ud83d\udd5b',
      '\ud83d\udd5c',
      '\ud83d\udd5d',
      '\ud83d\udd5e',
      '\ud83d\udd5f',
      '\ud83d\udd60',
      '\ud83d\udd61',
      '\ud83d\udd62',
      '\ud83d\udd63',
      '\ud83d\udd64',
      '\ud83d\udd65',
      '\ud83d\udd66',
      '\ud83d\udd67',
      '\ud83c\udde6\ud83c\uddeb',
      '\ud83c\udde6\ud83c\uddfd',
      '\ud83c\udde6\ud83c\uddf1',
      '\ud83c\udde9\ud83c\uddff',
      '\ud83c\udde6\ud83c\uddf8',
      '\ud83c\udde6\ud83c\udde9',
      '\ud83c\udde6\ud83c\uddf4',
      '\ud83c\udde6\ud83c\uddee',
      '\ud83c\udde6\ud83c\uddf6',
      '\ud83c\udde6\ud83c\uddec',
      '\ud83c\udde6\ud83c\uddf7',
      '\ud83c\udde6\ud83c\uddf2',
      '\ud83c\udde6\ud83c\uddfc',
      '\ud83c\udde6\ud83c\uddfa',
      '\ud83c\udde6\ud83c\uddf9',
      '\ud83c\udde6\ud83c\uddff',
      '\ud83c\udde7\ud83c\uddf8',
      '\ud83c\udde7\ud83c\udded',
      '\ud83c\udde7\ud83c\udde9',
      '\ud83c\udde7\ud83c\udde7',
      '\ud83c\udde7\ud83c\uddfe',
      '\ud83c\udde7\ud83c\uddea',
      '\ud83c\udde7\ud83c\uddff',
      '\ud83c\udde7\ud83c\uddef',
      '\ud83c\udde7\ud83c\uddf2',
      '\ud83c\udde7\ud83c\uddf9',
      '\ud83c\udde7\ud83c\uddf4',
      '\ud83c\udde7\ud83c\udde6',
      '\ud83c\udde7\ud83c\uddfc',
      '\ud83c\udde7\ud83c\uddf7',
      '\ud83c\uddee\ud83c\uddf4',
      '\ud83c\uddfb\ud83c\uddec',
      '\ud83c\udde7\ud83c\uddf3',
      '\ud83c\udde7\ud83c\uddec',
      '\ud83c\udde7\ud83c\uddeb',
      '\ud83c\udde7\ud83c\uddee',
      '\ud83c\uddf0\ud83c\udded',
      '\ud83c\udde8\ud83c\uddf2',
      '\ud83c\udde8\ud83c\udde6',
      '\ud83c\uddee\ud83c\udde8',
      '\ud83c\udde8\ud83c\uddfb',
      '\ud83c\udde7\ud83c\uddf6',
      '\ud83c\uddf0\ud83c\uddfe',
      '\ud83c\udde8\ud83c\uddeb',
      '\ud83c\uddf9\ud83c\udde9',
      '\ud83c\udde8\ud83c\uddf1',
      '\ud83c\udde8\ud83c\uddf3',
      '\ud83c\udde8\ud83c\uddfd',
      '\ud83c\udde8\ud83c\udde8',
      '\ud83c\udde8\ud83c\uddf4',
      '\ud83c\uddf0\ud83c\uddf2',
      '\ud83c\udde8\ud83c\uddec',
      '\ud83c\udde8\ud83c\udde9',
      '\ud83c\udde8\ud83c\uddf0',
      '\ud83c\udde8\ud83c\uddf7',
      '\ud83c\udde8\ud83c\uddee',
      '\ud83c\udded\ud83c\uddf7',
      '\ud83c\udde8\ud83c\uddfa',
      '\ud83c\udde8\ud83c\uddfc',
      '\ud83c\udde8\ud83c\uddfe',
      '\ud83c\udde8\ud83c\uddff',
      '\ud83c\udde9\ud83c\uddf0',
      '\ud83c\udde9\ud83c\uddef',
      '\ud83c\udde9\ud83c\uddf2',
      '\ud83c\udde9\ud83c\uddf4',
      '\ud83c\uddea\ud83c\udde8',
      '\ud83c\uddea\ud83c\uddec',
      '\ud83c\uddf8\ud83c\uddfb',
      '\ud83c\uddec\ud83c\uddf6',
      '\ud83c\uddea\ud83c\uddf7',
      '\ud83c\uddea\ud83c\uddea',
      '\ud83c\uddea\ud83c\uddf9',
      '\ud83c\uddea\ud83c\uddfa',
      '\ud83c\uddeb\ud83c\uddf0',
      '\ud83c\uddeb\ud83c\uddf4',
      '\ud83c\uddeb\ud83c\uddef',
      '\ud83c\uddeb\ud83c\uddee',
      '\ud83c\uddeb\ud83c\uddf7',
      '\ud83c\uddec\ud83c\uddeb',
      '\ud83c\uddf5\ud83c\uddeb',
      '\ud83c\uddf9\ud83c\uddeb',
      '\ud83c\uddec\ud83c\udde6',
      '\ud83c\uddec\ud83c\uddf2',
      '\ud83c\uddec\ud83c\uddea',
      '\ud83c\udde9\ud83c\uddea',
      '\ud83c\uddec\ud83c\udded',
      '\ud83c\uddec\ud83c\uddee',
      '\ud83c\uddec\ud83c\uddf7',
      '\ud83c\uddec\ud83c\uddf1',
      '\ud83c\uddec\ud83c\udde9',
      '\ud83c\uddec\ud83c\uddf5',
      '\ud83c\uddec\ud83c\uddfa',
      '\ud83c\uddec\ud83c\uddf9',
      '\ud83c\uddec\ud83c\uddec',
      '\ud83c\uddec\ud83c\uddf3',
      '\ud83c\uddec\ud83c\uddfc',
      '\ud83c\uddec\ud83c\uddfe',
      '\ud83c\udded\ud83c\uddf9',
      '\ud83c\udded\ud83c\uddf3',
      '\ud83c\udded\ud83c\uddf0',
      '\ud83c\udded\ud83c\uddfa',
      '\ud83c\uddee\ud83c\uddf8',
      '\ud83c\uddee\ud83c\uddf3',
      '\ud83c\uddee\ud83c\udde9',
      '\ud83c\uddee\ud83c\uddf7',
      '\ud83c\uddee\ud83c\uddf6',
      '\ud83c\uddee\ud83c\uddea',
      '\ud83c\uddee\ud83c\uddf2',
      '\ud83c\uddee\ud83c\uddf1',
      '\ud83c\uddee\ud83c\uddf9',
      '\ud83c\uddef\ud83c\uddf2',
      '\ud83c\uddef\ud83c\uddf5',
      '\ud83c\uddef\ud83c\uddea',
      '\ud83c\uddef\ud83c\uddf4',
      '\ud83c\uddf0\ud83c\uddff',
      '\ud83c\uddf0\ud83c\uddea',
      '\ud83c\uddf0\ud83c\uddee',
      '\ud83c\uddfd\ud83c\uddf0',
      '\ud83c\uddf0\ud83c\uddfc',
      '\ud83c\uddf0\ud83c\uddec',
      '\ud83c\uddf1\ud83c\udde6',
      '\ud83c\uddf1\ud83c\uddfb',
      '\ud83c\uddf1\ud83c\udde7',
      '\ud83c\uddf1\ud83c\uddf8',
      '\ud83c\uddf1\ud83c\uddf7',
      '\ud83c\uddf1\ud83c\uddfe',
      '\ud83c\uddf1\ud83c\uddee',
      '\ud83c\uddf1\ud83c\uddf9',
      '\ud83c\uddf1\ud83c\uddfa',
      '\ud83c\uddf2\ud83c\uddf4',
      '\ud83c\uddf2\ud83c\uddf0',
      '\ud83c\uddf2\ud83c\uddec',
      '\ud83c\uddf2\ud83c\uddfc',
      '\ud83c\uddf2\ud83c\uddfe',
      '\ud83c\uddf2\ud83c\uddfb',
      '\ud83c\uddf2\ud83c\uddf1',
      '\ud83c\uddf2\ud83c\uddf9',
      '\ud83c\uddf2\ud83c\udded',
      '\ud83c\uddf2\ud83c\uddf6',
      '\ud83c\uddf2\ud83c\uddf7',
      '\ud83c\uddf2\ud83c\uddfa',
      '\ud83c\uddfe\ud83c\uddf9',
      '\ud83c\uddf2\ud83c\uddfd',
      '\ud83c\uddeb\ud83c\uddf2',
      '\ud83c\uddf2\ud83c\udde9',
      '\ud83c\uddf2\ud83c\udde8',
      '\ud83c\uddf2\ud83c\uddf3',
      '\ud83c\uddf2\ud83c\uddea',
      '\ud83c\uddf2\ud83c\uddf8',
      '\ud83c\uddf2\ud83c\udde6',
      '\ud83c\uddf2\ud83c\uddff',
      '\ud83c\uddf2\ud83c\uddf2',
      '\ud83c\uddf3\ud83c\udde6',
      '\ud83c\uddf3\ud83c\uddf7',
      '\ud83c\uddf3\ud83c\uddf5',
      '\ud83c\uddf3\ud83c\uddf1',
      '\ud83c\uddf3\ud83c\udde8',
      '\ud83c\uddf3\ud83c\uddff',
      '\ud83c\uddf3\ud83c\uddee',
      '\ud83c\uddf3\ud83c\uddea',
      '\ud83c\uddf3\ud83c\uddec',
      '\ud83c\uddf3\ud83c\uddfa',
      '\ud83c\uddf3\ud83c\uddeb',
      '\ud83c\uddf0\ud83c\uddf5',
      '\ud83c\uddf2\ud83c\uddf5',
      '\ud83c\uddf3\ud83c\uddf4',
      '\ud83c\uddf4\ud83c\uddf2',
      '\ud83c\uddf5\ud83c\uddf0',
      '\ud83c\uddf5\ud83c\uddfc',
      '\ud83c\uddf5\ud83c\uddf8',
      '\ud83c\uddf5\ud83c\udde6',
      '\ud83c\uddf5\ud83c\uddec',
      '\ud83c\uddf5\ud83c\uddfe',
      '\ud83c\uddf5\ud83c\uddea',
      '\ud83c\uddf5\ud83c\udded',
      '\ud83c\uddf5\ud83c\uddf3',
      '\ud83c\uddf5\ud83c\uddf1',
      '\ud83c\uddf5\ud83c\uddf9',
      '\ud83c\uddf5\ud83c\uddf7',
      '\ud83c\uddf6\ud83c\udde6',
      '\ud83c\uddf7\ud83c\uddea',
      '\ud83c\uddf7\ud83c\uddf4',
      '\ud83c\uddf7\ud83c\uddfa',
      '\ud83c\uddf7\ud83c\uddfc',
      '\ud83c\uddfc\ud83c\uddf8',
      '\ud83c\uddf8\ud83c\uddf2',
      '\ud83c\uddf8\ud83c\uddf9',
      '\ud83c\uddf8\ud83c\udde6',
      '\ud83c\uddf8\ud83c\uddf3',
      '\ud83c\uddf7\ud83c\uddf8',
      '\ud83c\uddf8\ud83c\udde8',
      '\ud83c\uddf8\ud83c\uddf1',
      '\ud83c\uddf8\ud83c\uddec',
      '\ud83c\uddf8\ud83c\uddfd',
      '\ud83c\uddf8\ud83c\uddf0',
      '\ud83c\uddf8\ud83c\uddee',
      '\ud83c\uddec\ud83c\uddf8',
      '\ud83c\uddf8\ud83c\udde7',
      '\ud83c\uddf8\ud83c\uddf4',
      '\ud83c\uddff\ud83c\udde6',
      '\ud83c\uddf0\ud83c\uddf7',
      '\ud83c\uddf8\ud83c\uddf8',
      '\ud83c\uddea\ud83c\uddf8',
      '\ud83c\uddf1\ud83c\uddf0',
      '\ud83c\udde7\ud83c\uddf1',
      '\ud83c\uddf8\ud83c\udded',
      '\ud83c\uddf0\ud83c\uddf3',
      '\ud83c\uddf1\ud83c\udde8',
      '\ud83c\uddf5\ud83c\uddf2',
      '\ud83c\uddfb\ud83c\udde8',
      '\ud83c\uddf8\ud83c\udde9',
      '\ud83c\uddf8\ud83c\uddf7',
      '\ud83c\uddf8\ud83c\uddff',
      '\ud83c\uddf8\ud83c\uddea',
      '\ud83c\udde8\ud83c\udded',
      '\ud83c\uddf8\ud83c\uddfe',
      '\ud83c\uddf9\ud83c\uddfc',
      '\ud83c\uddf9\ud83c\uddef',
      '\ud83c\uddf9\ud83c\uddff',
      '\ud83c\uddf9\ud83c\udded',
      '\ud83c\uddf9\ud83c\uddf1',
      '\ud83c\uddf9\ud83c\uddec',
      '\ud83c\uddf9\ud83c\uddf0',
      '\ud83c\uddf9\ud83c\uddf4',
      '\ud83c\uddf9\ud83c\uddf9',
      '\ud83c\uddf9\ud83c\uddf3',
      '\ud83c\uddf9\ud83c\uddf7',
      '\ud83c\uddf9\ud83c\uddf2',
      '\ud83c\uddf9\ud83c\udde8',
      '\ud83c\uddf9\ud83c\uddfb',
      '\ud83c\uddfb\ud83c\uddee',
      '\ud83c\uddfa\ud83c\uddec',
      '\ud83c\uddfa\ud83c\udde6',
      '\ud83c\udde6\ud83c\uddea',
      '\ud83c\uddec\ud83c\udde7'
    ];
    var div = document.createElement('div');
    allIosEmoji.forEach(function (emoji) {
      div.innerHTML = emoji;
      twemoji.parse(div);
      wru.assert('' + emoji + 'recognized as graphical',
          div.firstChild.className === 'emoji' &&
          div.firstChild.getAttribute('draggable') === 'false' &&
          div.firstChild.getAttribute('alt') === emoji
      );
    });
  }
}]);
