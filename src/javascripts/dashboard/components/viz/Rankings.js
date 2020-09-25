let Viz = require('./Viz.js');
let {OptionButton, VizOptionBar} = require('./VizOptions.js');

class Rankings extends Viz {
  constructor(props) {
    super(props);

    this.fetchExtension = props.fetcher;

    this.strategyFamilies = {
      hashtag: {
        uriExtension: 'htRanking',
        headers: ["#", "Hashtag", "Count"],
        rowFn: (cols, idx) => {
          let ret = [...cols];
          ret.unshift(idx + 1);
          return ret;
        }
      },
      url: {
        uriExtension: 'urlRanking',
        headers: ["#", "URL", "Count"],
        rowFn: (cols, idx) => {
          let ret = [...cols];
          ret.unshift(idx + 1);
          ret[1] = (ret[1].toString().substring(0, 4) == "http") ? (<a href={ret[1]} target="_blank">{ret[1]}</a>) : ret[1];
          return ret;
        }
      },
      tweets: {
        uriExtension: 'tweetList',
        headers: ["Username", "Tweet", "Origin", "Time Created"],
        rowFn: (cols, idx) => {
          let ret = [...cols];
          if (ret[2] && ret[3]) {
            ret[2] = ret[2].match(/&gt.*&lt/g)[0].substr(4).slice(0, -3);
            ret[3] = new Date(ret[3]).toLocaleString();
          }
          return ret;
        }
      }
    };

    this.state = {
      strategyFamily: "hashtag",
      dataObj: []
    };

    this.strategy = () => this.strategyFamilies[this.state.strategyFamily];

    this.handleOptionClick = this.handleOptionClick.bind(this);

  }

  componentDidMount() {
    this.live();
  }

  live() {
    setTimeout(() => {
        if (this.props.isActive) {
          this.refresh()
            .then(() => this.live());
        } else {
          this.live();
        }
    }, 1000);
  }

  handleOptionClick({name, val}, e) {
    console.log("clicked");
    this.setState({[name]: val});
    this.props.onLoadChange({id: "rankings", isLoading: true});
    this.refresh();
  }

  refresh() {
    return this.fetchExtension(this.strategy().uriExtension, {method: 'GET'})
      .then(dataObj => {
        this.setState({dataObj: dataObj});
      })
      .then(_ => {
        this.props.onLoadChange({id: "rankings", isLoading: false});
      });
  }

  render() {
    const strategy = this.strategy();
    return (
      <div id="rankings" className="d-flex flex-column" style={{height:"100%"}}>
        <VizOptionBar id="rankings-options">
          <OptionButton isActive={this.state.strategyFamily=="hashtag"} name="strategyFamily" val="hashtag" onClick={this.handleOptionClick} label="Top Hashtags" />
          <OptionButton isActive={this.state.strategyFamily=="url"} name="strategyFamily" val="url" onClick={this.handleOptionClick} label="Top URLs" />
          <OptionButton isActive={this.state.strategyFamily=="tweets"} name="strategyFamily" val="tweets" onClick={this.handleOptionClick} label="Tweets" />
        </VizOptionBar>
        <div className="table-responsive-sm flex-grow-1" id="rankingsTableWrapper">
          <table className="table table-striped table-hover mb-0" id="rankingsTable" style={{height: "100%"}}>
            <thead style={{tableLayout: "fixed", width: "100%", display: "table"}}>
              <tr>
                {strategy.headers.map((col, idx) => (<th key={idx} scope="col">{col}</th>))}
              </tr>
            </thead>
            <tbody style={{display: "block", height: "95%", overflowY: "scroll", tableLayout: "fixed", width: "100%"}}>
              {this.state.dataObj.map((cols, idx) => {
                const newCols = strategy.rowFn(cols, idx);
                return (
                  <tr key={cols.reduce((ac, cv) => ac + cv)} style={{display: "table", tableLayout: "fixed", width:"100%"}}>
                    <th scope="row">{newCols[0]}</th>
                    {newCols.filter((_, idx) => idx != 0).map((col, idx) => (
                      <td key={idx}>{col}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Rankings.optionComponents = [
  <a className="nav-link active" id="hashtagRankings">Top Hashtags</a>,
  <a className="nav-link" id="urlRankings">Top URLs</a>
]

Rankings.info = {
  id: "rankings",
  name: "Lists"
}

module.exports = Rankings;
