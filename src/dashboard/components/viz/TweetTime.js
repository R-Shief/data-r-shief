let Viz = require('./Viz.js');

class TweetTime extends Viz {
  constructor(props) {
    super(props);

    this.strategyFamilies = {
      twitter: {}
    };

    this.state = {
      strategyFamily: "twitter",
      width: props.bounds.width,
      height: props.bounds.height
    };

    this.fetchExtension = props.fetcher;
    this.margin = {top: 0, right: 20, bottom: 70, left: 20};

    this.props.onLoadChange({id: "tweettime", isLoading: false});

    this.wrapperRef = React.createRef();

    // this.getGraphDataSets = this.getGraphDataSets.bind(this);
  }

  componentDidMount() {


    window.addEventListener('resize', () => {
      this.setState({
        width: this.wrapperRef.current.offsetWidth,
        height: this.wrapperRef.current.offsetHeight
      })
    })
  }


  render() {
    return (
      <div ref={this.wrapperRef} id="tweettime" className="d-flex flex-column" style={{height: "100%"}}>
        <iframe style={{height: "100%", border: "none"}} src="https://data.r-shief.org/tweet-time" title="Tweets Displayed Over Time"></iframe>
      </div>
    );
  }
}

// viewBox={`0 0 ${this.state.width} ${this.state.height}`}

TweetTime.info = {
  id: "tweettime",
  name: "Tweets Over Time"
};

module.exports = TweetTime;
