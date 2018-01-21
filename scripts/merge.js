const {readFileSync} = require('fs')
const {resolve} = require('path')

const read = filename =>
  readFileSync(
    resolve(__dirname, filename)
  ).toString().replace(/\{/g, '').replace(/\}/g, '').split('\n').map(row => row.split(': ')).filter(row => row.length > 1).map(row => ([
    row[0].trim(), row[1].length > 1 ? JSON.parse(row[1].replace(/'/g, '"').replace(/,$/g, '')) : []
  ]))

const keywords = read(
  './emojis.ja.0_500.json'
).concat(read(
  './emojis.ja.500_700.json'
)).concat(read(
  './emojis.ja.700_900.json'
)).concat(read(
  './emojis.ja.900_1100.json'
)).concat(read(
  './emojis.ja.1100_1300.json'
)).concat(read(
  './emojis.ja.1300_1400.json'
)).concat(read(
  './emojis.ja.1400.json'
)).reduce((prev, curr) => ({
  ...prev,
  [curr[0]]: curr[1]
}))

console.log(JSON.stringify(keywords))
