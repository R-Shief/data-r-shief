d3 = require('d3');
Viz = require('./viz.js');

class Rankings extends Viz {
  constructor(options) {
    super(options);

    this.fetchExtension = options.fetcher;
    this.id = "#rankings";

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

          let elem;
          if (val.toString().substring(0, 4) == "http") {
            elem = (<a href={val} target="_blank">{val}</a>);
          } else {
            elem = val;
          }
          return elem;
        }
      }
    };

    let defaultOptions = {
      strategyFamily: "hashtag"
    };

    this.options = Object.assign(defaultOptions, options);

    this.strategy = this.strategyFamilies[this.options.strategyFamily];

    this.view;

    this.live();

  }

  live() {
    setTimeout(() => {
      this.refresh();
      this.live();
    }, 1000);
  }

  refresh() {
    return new Promise((resolve, reject) => {
        this.fetchExtension(this.strategy.uriExtension, {method: 'GET'})
        .then(dataObj => {

          let RankingsTable = (props) => {
            const strategy = props.strategy;
            const dataObj = props.dataObj;
            return (
              <div className="table-responsive-sm" id="rankingsTableWrapper">
                <table className="table-sm table-striped" style={{height: "450px"}} id="rankingsTable">
                  <thead>
                    <tr>
                      <th scope="col">{strategy.headerRowFn(0)}</th>
                      <th scope="col">{strategy.headerRowFn(1)}</th>
                      <th scope="col">{strategy.headerRowFn(2)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataObj.map(([hashtag, count], idx) => (
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

          if (typeof this.view == "undefined") {
            this.view = document.createElement("div");
            this.view.style.height = "440px";
            this.view.style.overflowY = "scroll";
          } else {
            document.getElementById("rankingsTableWrapper").remove();
          }

          let root = document.createElement("div");
          this.view.appendChild(root);
          let scope = this;
          ReactDOM.render(<RankingsTable strategy={scope.strategy} dataObj={dataObj}/>, root);

          resolve(this);
        })
        .catch(err => reject(err))
    })
  }

  setOption(option, value) {
    super.setOption(option, value);
    if(option == "strategyFamily") this.strategy = this.strategyFamilies[this.options.strategyFamily];
    return this.refresh();
  }

  getView() {
    return this.view;
  }
}

module.exports = Rankings;
