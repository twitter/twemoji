
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
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '36x36/2764.png"> emoji!'
    );
    // with "as image" variant
    wru.assert(
      'default \uFE0F variant parsing works',
      twemoji.parse('I \u2764\uFE0F emoji!') ===
      'I <img class="emoji" draggable="false" alt="\u2764\uFE0F" src="' + base + '36x36/2764.png"> emoji!'
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
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + '72x72/2764.png"> emoji!'
    );
    wru.assert(
      'string is preserved',
      twemoji.parse('I \u2764 emoji!', {size: 'any-size'}) ===
      'I <img class="emoji" draggable="false" alt="\u2764" src="' + base + 'any-size/2764.png"> emoji!'
    );
  }
},{
  name: 'string parsing + callback',
  test: function () {
    var result = false;
    twemoji.parse('I \u2764 emoji!', function (icon, options, variant) {
      result = icon === '2764' && options.size === '36x36' && !variant;
    });
    wru.assert('works OK without variant', result);
    result = false;
    twemoji.parse('I \u2764\uFE0F emoji!', function (icon, options, variant) {
      result = icon === '2764' && options.size === '36x36' && variant === '\uFE0F';
    });
    wru.assert('works OK with variant', result);
    result = true;
    twemoji.parse('I \u2764\uFE0E emoji!', function (icon, options, variant) {
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
      'I <img class="emoji" draggable="false" alt="\u2764" src="72x72/2764.png"> emoji!' ===
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
    var result = false;
    var str = twemoji.replace('I \u2764\uFE0E emoji!', function (match, emoji, variant) {
      result =  match === '\u2764\uFE0E' &&
                emoji === '\u2764\uFE0E' &&
                variant === '\uFE0E';
      return '<3';
    });
    wru.assert('all exepected values are passed through', result);
    wru.assert('returned value is the expected', str === 'I <3 emoji!');
  }
},{
  name: 'twemoji.test(str)',
  test: function () {
    wru.assert(
      twemoji.test('I \u2764 emoji!') &&
      twemoji.test('I \u2764\uFE0F emoji!') &&
      twemoji.test('I \u2764\uFE0E emoji!') &&
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
      img.src === base + '36x36/2764.png' &&
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
      img.src === base + '36x36/2764.png' &&
      img.alt === '\u2764\uFE0F' &&
      img.onerror === twemoji.onerror
    );
    wru.assert('last child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji!');
    // with "as text" variant
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0E emoji!'));
    twemoji.parse(div);
    wru.assert('default parsing created 3 nodes anyway', div.childNodes.length === 3);
    wru.assert('first child is the expected one', div.removeChild(div.firstChild).nodeValue === 'I ');
    wru.assert('emoji child is unchanged', div.removeChild(div.firstChild).nodeValue === '\u2764\uFE0E');
    wru.assert('last child is the expected one', div.removeChild(div.firstChild).nodeValue === ' emoji!');
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
    twemoji.parse(div, function (icon, options, variant) {
      result = icon === '2764' && options.size === '36x36' && !variant;
    });
    wru.assert('works OK without variant', result);
    result = false;
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0F emoji!'));
    twemoji.parse(div, function (icon, options, variant) {
      result = icon === '2764' && options.size === '36x36' && variant === '\uFE0F';
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
      callback: function (icon, options, variant) {
        result = icon === '2764' && options.size === '16x16' && !variant;
      }
    });
    wru.assert('works OK without variant', result);
    result = false;
    div = document.createElement('div');
    div.appendChild(document.createTextNode('I \u2764\uFE0F emoji!'));
    twemoji.parse(div, {
      size: 72,
      callback: function (icon, options, variant) {
        result = icon === '2764' && options.size === '72x72' && !!variant;
      }
    });
    wru.assert('works OK with variant', result);
  }
},{
  name: 'nested nodes',
  test: function () {
    var str = '<img class="emoji" draggable="false" alt="\u2764" src="https://abs.twimg.com/emoji/v1/36x36/2764.png">',
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
}]);