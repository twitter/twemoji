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
module.exports.fromCodePoint = fromCodePoint;

function toJSON(codePoints) {
  return codePoints.split('-').map(function (point) {
    return UTF162JSON(fromCodePoint(point));
  }).join('');
}
module.exports.toJSON = toJSON;

function UTF162JSON(text) {
  for (var i = 0, r = []; i < text.length; i++) {
    r.push('\\u' + ('000' + text.charCodeAt(i).toString(16)).slice(-4));
  }
  return r.join('');
}
module.exports.UTF162JSON = UTF162JSON;
