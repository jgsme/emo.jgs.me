const original = require('./original.json')
const emoji = require('emojilib')

const converted = emoji.ordered.reduce((prev, key) => ({
  ...prev,
  [key]: original[key] === undefined ? [] : original[key]
}), {})

console.log(JSON.stringify(converted))
