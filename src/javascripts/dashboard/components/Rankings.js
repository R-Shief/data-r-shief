let Viz = require('./Viz.js');

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

    let defaultOptions = {
      strategyFamily: "hashtag"
    };
    this.options = defaultOptions;

    this.state = {
      strategy: this.strategyFamilies[this.options.strategyFamily],
      dataObj: []
    };

    this.live();
  }

  live() {
    setTimeout(() => {
      this.refresh();
      this.live();
    }, 1000);
  }

  refresh() {
    this.fetchExtension(this.state.strategy.uriExtension, {method: 'GET'})
      .then(dataObj => this.setState({dataObj: dataObj}));
  }

  render() {
    const strategy = this.state.strategy;
    return (
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
