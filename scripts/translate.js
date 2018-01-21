const {writeFileSync} = require('fs')
const google = require('google-translate')(process.env.GCP_KEY)
const emoji = require('emojilib')

const main = async () => {
  const ja = await Promise.all(emoji.ordered.map(key => new Promise(async resolve => {
    const e = emoji.lib[key]
    const keywords = await Promise.all(e.keywords.map(keyword => new Promise(async res =>
      google.translate(keyword, 'ja', (err, r) => res(r.translatedText))
    )))
    return resolve([key, keywords])
  })))
  const json = ja.reduce((prev, curr) => ({
    ...prev,
    [curr[0]]: curr[1]
  }), {})
  console.log(json)
}

main()
