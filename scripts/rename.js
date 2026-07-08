const fs = require('fs');

// https://github.com/iamcal/emoji-data
let emojiList = JSON.parse(fs.readFileSync("./scripts/emoji.json"))

// Flatten and append skin variations as a separate emojis to emojiList.
emojiList.filter(e => e.skin_variations)
  .forEach(e => emojiList = emojiList.concat(Object.values(e.skin_variations)))

function unifiedToNative(unified) {
  const codePoints = unified.split('-').map(u => `0x${u}`);
  return String.fromCodePoint.apply(String, codePoints);
}

// Convert unicode to native represetation.
emojiList.forEach(e => e.native = unifiedToNative(e.unified))

// Parse each native representation into a twemoji entity.
const { parse } = require('twemoji-parser');
emojiList.forEach(e => e.entity = parse(e.native)[0])

function getTwemojiUnicode(url) {
  return url.match(/([^\/]+)(?=\.\w+$)/)[0]
}

// Get the twemoji unicode representation from entity url.
emojiList.forEach(e => e.twemojiUnicode = getTwemojiUnicode(e.entity.url))

// Calculate the list of emojis where twemoji and unified or non_qualified differ.
let diff = emojiList.filter(e => e.twemojiUnicode !== e.unified.toLowerCase())
  .filter(d => d.twemojiUnicode !== "1f441") // BUG: see https://github.com/twitter/twemoji/issues/419

diff.forEach(e => { 
  try {
    fs.renameSync(`./assets/72x72/${e.twemojiUnicode}.png`, `./assets/72x72/${e.unified.toLowerCase()}.png`); 
    fs.renameSync(`./assets/svg/${e.twemojiUnicode}.svg`, `./assets/svg/${e.unified.toLowerCase()}.svg`); 
  } catch (error) {
    console.log("error:", error);
  }
})

// To-do: manually handle 1f441.