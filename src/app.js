import { h, render, createRef } from '/web_modules/preact.js'
import { useEffect, useState } from '/web_modules/preact/hooks.js'
import htm from '/web_modules/htm.js'
import emoji from '/web_modules/emojilib.js'

const html = htm.bind(h)

const getJson = async url => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}

const select = event => event.target.select()

const App = () => {
  const [emojis, setEmojis] = useState([])
  const [filteredEmojis, setFilteredEmojis] = useState(emoji.ordered)
  const [word, setWord] = useState('')
  const [selected, setSelected] = useState('')
  const ref = createRef()
  const onInput = event => {
    const word = event.target.value
    setWord(word)
    setFilteredEmojis(
      emoji.ordered.filter(key => {
        const e = emojis[key]
        return e.forSearch.indexOf(word) > -1
      })
    )
  }
  const onClick = key => () => setSelected(key)
  useEffect(async () => {
    const [ja, custom] = await Promise.all([
      getJson('/assets/emojis.ja.json'),
      getJson('/assets/emojis.custom.ja.json')
    ])
    setEmojis(
      Object.keys(emoji.lib).reduce((prev, key) => {
        const e = emoji.lib[key]
        const j = ja[key]
        const c = custom[key]
        const keywords = e.keywords
          .concat(j)
          .concat(c)
          .concat([key])
        return {
          ...prev,
          [key]: {
            ...e,
            keywords,
            forSearch: keywords.join(',')
          }
        }
      }, {})
    )
    ref.current.focus()
  }, [])
  return html`
    <div>
      <input
        class="search"
        type="text"
        value=${word}
        onInput=${onInput}
        placeholder="Search..."
        ref=${ref}
      />
      <a
        href="https://github.com/kbystk/emo/edit/master/assets/emojis.custom.ja.json"
      >
        📝
      </a>
      ${selected.length > 0
        ? html`
            <div class="selected">
              <input
                type="text"
                value=${`:${selected}:`}
                size=${selected.length + 2}
                onClick=${select}
              />
              <input
                type="text"
                value=${emojis[selected].char}
                size="1"
                onClick=${select}
              />
              ${emojis[selected].keywords.map(
                keyword => html`
                  <span class="label">${keyword}</span>
                `
              )}
            </div>
          `
        : ''}
      <div class="container">
        ${filteredEmojis.map(
          key => html`
            <div class="emoji" onClick=${onClick(key)}>
              <span>${emoji.lib[key].char}</span>
            </div>
          `
        )}
      </div>
    </div>
  `
}

render(
  html`
    <${App} />
  `,
  document.getElementById('app')
)
