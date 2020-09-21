let Viz = require('./Viz.js');
let VizOptionBar = require('./VizOptionBar.js');

class Rankings extends Viz {
  constructor(props) {
    super(props);

    this.fetchExtension = props.fetcher;

    this.strategyFamilies = {
      hashtag: {
        uriExtension: 'htRanking',
        headerRowFn: (col) => ["#","Hashtag","Count"][col],
        rowFn: (val) => val
      },
      url: {
        uriExtension: 'urlRanking',
        headerRowFn: (col) => ["#","URL","Count"][col],
        rowFn: (val) => {
          return (val.toString().substring(0, 4) == "http") ? (<a href={val} target="_blank">{val}</a>) : val;
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
      .then(dataObj => this.setState({dataObj: dataObj}))
      .then(_ => {
        this.props.onLoadChange({id: "rankings", isLoading: false});
      });
  }

  render() {
    const strategy = this.strategy();
    const OptionButton = (props) => (
      <a className={"nav-link" + ((props.isActive) ? " active" : "")} id="hashtagStreamgraph" onClick={this.handleOptionClick.bind(this, {name: props.name, val: props.val})}>{props.label}</a>
    );
    return (
      <div id="rankings">
        <VizOptionBar id="rankings-options">
          <OptionButton isActive={this.state.strategyFamily=="hashtag"} name="strategyFamily" val="hashtag" onClick={this.handleOptionClick} label="Top Hashtags" />
          <OptionButton isActive={this.state.strategyFamily=="url"} name="strategyFamily" val="url" onClick={this.handleOptionClick} label="Top URLs" />
        </VizOptionBar>
        <div className="table-responsive-sm" id="rankingsTableWrapper" style={{height: "440px", overflowY: "scroll"}}>
          <table className="table-sm table-striped" style={{height: "450px"}} id="rankingsTable">
            <thead>
              <tr>
                <th scope="col">{strategy.headerRowFn(0)}</th>
                <th scope="col">{strategy.headerRowFn(1)}</th>
                <th scope="col">{strategy.headerRowFn(2)}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataObj.map(([hashtag, count], idx) => (
                <tr key={hashtag}>
                  <th scope="row">{strategy.rowFn(idx + 1)}</th>
                  <td>{strategy.rowFn(hashtag)}</td>
                  <td>{strategy.rowFn(count)}</td>
                </tr>
              ))}
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
  name: "Rankings"
}

module.exports = Rankings;
