import React from 'react'
import Item from './components/Item'
import Loading from './components/Loading'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      info: [],
      search: '',
      isLoading: true,
      actived: false,
      error: false,
    }
    this.handleLoad = this.handleLoad.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    ;(() => {
      return new Promise((resolve, reject) => {
        fetch('https://www.reddit.com/r/memes.json').then(res => {
          if (res.ok) {
            resolve(res.json())
          } else {
            reject(res.status)
          }
        })
      })
        .then(data => {
          this.setState({
            info: data,
            isLoading: false,
            error: false,
          })
        })
        .catch(message => {
          this.setState({
            isLoading: false,
            error: true,
          })
        })
    })()
  }

  handleChange(event) {
    this.setState({
      search: event.target.value,
    })
  }

  handleLoad(event) {
    ;(() => {
      this.setState({
        isLoading: true,
      })
      var newUrl = 'https://www.reddit.com/r/' + this.state.search + '.json'
      return new Promise((resolve, reject) => {
        fetch(newUrl).then(res => {
          if (res.ok) {
            resolve(res.json())
          } else {
            reject(res.status)
          }
        })
      })
        .then(data => {
          this.setState({
            info: data,
            isLoading: false,
            error: false,
          })
        })
        .catch(message => {
          this.setState({
            isLoading: false,
            error: true,
          })
        })
    })()
  }

  render() {
    if (this.state.error) {
      return <h2>Error</h2>
    }
    if (this.state.actived) {
      return <Item activated={this.state.actived} />
    }
    if (this.state.isLoading) {
      return (
        <div>
          <Loading />
          <Loading />
          <Loading />
        </div>
      )
    } else {
      const newData = this.state.info.data.children.map(item => {
        return (
          <Item
            activated={this.state.actived}
            author={item.data.author}
            key={Math.random()}
            title={item.data.title}
            img={item.data.url}
            subreddit={item.data.subreddit}
            likes={item.data.ups}
            comments={item.data.num_comments}
            url={item.data.permalink}
            whitelist={item.data.whitelist_status}
          />
        )
      })
      return (
        <div className="main">
          <div className="newSubField">
            <form onSubmit={this.handleLoad}>
              <input
                onChange={this.handleChange}
                placeholder="subreddit"
                name="search"
                className="inputField"
                type="text"
                value={this.state.search}
              />
              <button>Load</button>
            </form>
          </div>
          {newData}
        </div>
      )
    }
  }
}

export default App
