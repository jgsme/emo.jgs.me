import './style'
import {Component} from 'preact'
import emoji from 'emojilib'
import ja from './assets/emojis.ja.json'
import custom from './assets/emojis.custom.ja.json'
import hasAppleColorEmoji from './utils/hasAppleColorEmoji.js'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      hasAppleColorEmoji: true,
      word: '',
      emojis: Object.keys(emoji.lib).reduce((prev, key) => {
        const e = emoji.lib[key]
        const j = ja[key]
        const c = custom[key]
        const keywords = e.keywords.concat(j).concat(c)
        return {
          ...prev,
          [key]: {
            ...e,
            keywords,
            forSearch: keywords.join(','),
          },
        }
      }, {}),
      filteredEmojis: emoji.ordered,
      selected: '',
    }
  }

  componentDidMount() {
    this.searchInput.focus()
    this.setState({
      hasAppleColorEmoji: hasAppleColorEmoji(),
    })
  }

  onInput = event => {
    const word = event.target.value
    this.setState({
      word,
      filteredEmojis: [].concat(
        emoji.ordered.filter(key => {
          const e = this.state.emojis[key.toString()]
          return e.forSearch.indexOf(word) > -1
        })
      ),
    })
    location.hash = word
  }

  onClick = key => event => {
    this.setState({
      selected: key,
    })
  }

  select = event => {
    event.target.select()
  }

  render() {
    return (
      <div>
        <input
          className="search"
          type="text"
          value={this.state.word}
          onInput={this.onInput}
          placeholder="Search..."
          ref={input => (this.searchInput = input)}
        />
        {this.state.selected.length > 0 ? (
          <div className="selected">
            <input
              type="text"
              value={`:${this.state.selected}:`}
              onClick={this.select}
              size={this.state.selected.length + 2}
            />
            <input
              type="text"
              value={this.state.emojis[this.state.selected].char}
              onClick={this.select}
              size="1"
            />
            {this.state.emojis[this.state.selected].keywords.map(keyword => (
              <span className="label">{keyword}</span>
            ))}
          </div>
        ) : null}
        <div className="container">
          {this.state.filteredEmojis.map(key => (
            <div className="emoji" onClick={this.onClick(key)}>
              <span>{emoji.lib[key].char}</span>
            </div>
          ))}
        </div>
        {this.state.hasAppleColorEmoji ? null : (
          <script src="//twemoji.maxcdn.com/2/twemoji.min.js?2.2.3" />
        )}
      </div>
    )
  }
}
