class OverviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hashtagData: ["#foo", "#bar", "#fizz", "#buzz"]
    };

    this.dtf = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    });
  }

  componentDidMount() {
    $("#overviewModal").modal({});

    fetch('/data/hashtagDictionary.json')
    .then(result => result.json())
    .then(hashtagData => this.setState({hashtagData: hashtagData}));
  }

  formatDate(dateString) {
    const parsed = typeof dateString == "undefined" ? [] : dateString.split("-");
    // console.log(dateString + " " + parsed + " " + parsed.length);
    if (parsed.length == 3) {
      // console.log(parsed);
      let date = new Date();
      date.setFullYear(parsed[0]);
      date.setDate(parsed[1]);
      date.setMonth(parsed[2]);
      const parts = this.dtf.formatToParts(date).reduce((acc, curr) => Object({...acc, [curr.type]: curr.value}), {});
      return `${parts.month} ${parts.day}, ${parts.year}`
    } else {
      return dateString;
    }
  };

  render() {
    return (
      <div className="modal fade" id="overviewModal" tabIndex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <h2>Getting started</h2>
              <ul id="overviewTabList" className="nav nav-tabs nav-fill py-0" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" href="#overviewInterface" data-toggle="pill">
                    <h4>The Interface</h4>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#overviewData" data-toggle="pill">
                    <h4>The Data</h4>
                  </a>
                </li>
              </ul>
              <div key="overviewTabs" className="tab-content">
                <div className="viz tab-pane fade border border-top-0 rounded-bottom px-2 pt-2 show active" id="overviewInterface" role="tabpanel" aria-labelledby="overviewInterface">
                  <p>The R-Shief Dashboard is a fully interactive collection of data visualization tools.</p>
                  <p>Click the hashtag dropdown to find a complete list of avaiable hashtags. Likewise usernames can be found by typing a few keys into the usernames field, like so:</p>
                  <img className="mt-0 mb-4" src="/images/overview/r-shief-guide-2.png" />
                  <p>If you're unsure which view to use, refer to the table below:</p>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">View</th>
                          <th scope="col">Description</th>
                          <th scope="col">Use When</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Streamgraph</th>
                          <td>The horizontal axis represents <strong>time</strong>, while the vertical width represents <strong>quantity</strong> of tweets at that time.</td>
                          <td>You want the big picture, or to see the rise and fall of individual concepts <strong>over time</strong>.</td>
                        </tr>
                        <tr>
                          <th scope="row">List</th>
                          <td>Elements are listed sequentially, often in a particular order.</td>
                          <td>You want to <strong>compare</strong> concepts, or to <strong>scrutinize</strong> the raw tweets.</td>
                        </tr>
                        <tr>
                          <th scope="row">Map</th>
                          <td>Quantities or concepts are aggregated by country or equal-area patches.</td>
                          <td>You want to compare concepts by <strong>region</strong>.</td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <div className="alert alert-secondary" role="alert">
                      <h4 className="alert-heading">Notes</h4>
                      <p>The filter bar samples tweets for all views concurrently, but some views may impose additional filters. For example, the map only uses tweets that have geo tags.</p>
                      <hr />
                      <p>Only tweets that satsify <strong>all</strong> filters are sampled. The only exception is when a filter has multiple entries.
                      For example a hashtag filter for "#egypt, #superbowl" will give you tweets from either hashtag inclusively.</p>
                    </div>
                  </div>
                </div>
                <div className="viz tab-pane fade border border-top-0 rounded-bottom px-2 pt-2" id="overviewData" role="tabpanel" aria-labelledby="overviewInterface">
                  <p>The data consists of <strong>87,707,630</strong> tweets in <strong>58</strong> languages recorded between <strong>March 2011</strong> and <strong>June 2013</strong> from hashtags relating to the <strong>Occupy Movements</strong> and the <strong>Arab Spring Uprisings</strong>. Samples of <strong>1,239</strong> hashtags were collected in total. Here is a complete table:</p>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover d-block" style={{height: "400px", overflowY: "hidden"}}>
                      <thead style={{tableLayout: "fixed", width: "100%", display: "table"}}>
                        <tr>
                          <th scope="col">Hashtag</th>
                          <th scope="col">Definition</th>
                        </tr>
                      </thead>
                      <tbody style={{display: "block", height: "95%", overflowY: "scroll", tableLayout: "fixed", width: "100%"}}>
                        {this.state.hashtagData.map((hashtag, idx) => (
                          <tr key={hashtag.hashtag + idx.toString()}>
                            <th scope="row">{hashtag.hashtag}</th>
                            <td>{hashtag.definition}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p>This dashboard takes a <strong>pseudorandom sample</strong> of the archive, which ensures sample sizes N &gt; 1000 are representative of the whole with high confidence.</p>
                  <p>Links and embeds (<img style={{height: "12px"}} src="icons/bootstrap-icons-1.0.0-alpha5/share-fill.svg" />) are guaranteed consistent results, as pseudorandom sampling is <strong>deterministic</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// <th scope="col">Started Collecting</th>
// <th scope="col">Stopped Collecting</th>

// <td>{this.formatDate(hashtag.startDate)}</td>
// <td>{this.formatDate(hashtag.endDate)}</td>

// {this.state.hashtagData.reduce((acc, curr) => {
//   if (!acc.hasOwnProperty("arr")) acc = {
//     arr: [[acc]]
//   };
//   if (acc.arr[acc.arr.length-1].length < 3) {
//     acc.arr[acc.arr.length-1].push(curr);
//   } else {
//     acc.arr.push([]);
//   }
//   return acc;
// }).arr.map((subArr, i) => (<tr key={i}>{subArr.map((hashtag, j) => (<td key={j}>{hashtag}</td>))}</tr>))}

module.exports = OverviewModal;
