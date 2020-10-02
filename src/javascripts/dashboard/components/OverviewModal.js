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
    .then(hashtagData => {
      var flags = {};
      var uniqueHashtagsData = hashtagData.filter(entry => {
        if (flags[entry.hashtag]) return false;
        flags[entry.hashtag] = true;
        return true;
      })
      this.setState({hashtagData: uniqueHashtagsData});
    });

    // $('#dataModal').on('shown.bs.modal', function () {
    //   console.log("attempting");
    //    $($.fn.dataTable.tables(true)).DataTable()
    //       .columns.adjust();
    // });

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
    return [
      <div key="overviewModal" className="modal fade" id="overviewModal" tabIndex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="pt-2 pr-3">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body pt-0">
              <ul id="overviewTabList" className="nav nav-tabs nav-fill py-0" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" href="#overviewInterface" data-toggle="pill">
                    <h4>Getting Started</h4>
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
                  <p>The R-Shief Dashboard is a fully interactive collection of data visualization tools. If you're unsure which view to use, refer to the table below.</p>
                  <img className="mt-0 mb-4 d-none" src="/images/overview/r-shief-guide-2.png" />
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
                  </div>
                  <hr />
                  <div className="alert alert-secondary" role="alert">
                    <h4 className="alert-heading">Tips</h4>
                    <p>Click the hashtag dropdown to find a complete list of avaiable hashtags or start typing into the usernames field to see matches.</p>
                    <hr />
                    <p>The filter bar samples tweets for all views concurrently, but some views may impose additional filters. For example, the map only uses tweets that have geo tags.</p>
                    <hr />
                    <p>Only tweets that satsify <strong>all</strong> filters are sampled. The only exception is when a filter has multiple entries.
                    For example a hashtag filter for "#egypt, #superbowl" will give you tweets from either hashtag inclusively.</p>
                  </div>
                </div>
                <div className="viz tab-pane fade border border-top-0 rounded-bottom px-2 pt-2" id="overviewData" role="tabpanel" aria-labelledby="overviewInterface">
                  <p>The data consists of <strong>87,707,630</strong> tweets in <strong>58</strong> languages recorded between <strong>March 2011</strong> and <strong>June 2013</strong> from hashtags relating to the <strong>Occupy Movements</strong> and the <strong>Arab Spring Uprisings</strong>, of which <strong>544,124</strong> are geo-tagged.</p>
                  <p>Samples from <strong>1,239</strong> hashtags were collected in total. Expand (<img src="icons/bootstrap-icons-1.0.0-alpha5/box-arrow-up-right.svg" height="13px" />) the table below for more data on each hashtag.</p>
                  <div className="table-responsive">
                    <button className="btn btn-outline-default float-right" style={{marginBottom: "-42px", paddingTop: "1rem"}} data-toggle="modal" data-target="#dataModal">
                      <img src="icons/bootstrap-icons-1.0.0-alpha5/box-arrow-up-right.svg" />
                    </button>
                    <table className="table table-striped table-hover d-block" style={{height: "360px", overflowY: "hidden"}}>
                      <thead style={{tableLayout: "fixed", width: "100%", display: "table"}}>
                        <tr>
                          <th scope="col">Hashtags</th>
                        </tr>
                      </thead>
                      <tbody style={{display: "block", height: "95%", overflowY: "scroll", tableLayout: "fixed", width: "100%"}}>
                        {this.state.hashtagData.reduce((acc, curr) => {
                          if (!acc.hasOwnProperty("arr")) acc = {
                            arr: [[acc]]
                          };
                          if (acc.arr[acc.arr.length-1].length < 3) {
                            acc.arr[acc.arr.length-1].push(curr);
                          } else {
                            acc.arr.push([]);
                          }
                          return acc;
                        }).arr.map((subArr, i) => (<tr key={i}>{subArr.map((hashtag, j) => (<td key={j}>{hashtag.hashtag}</td>))}</tr>))}
                      </tbody>
                    </table>
                  </div>
                  <div className="alert alert-secondary" role="alert">
                    <h4 className="alert-heading">Notes</h4>
                    <p>This dashboard takes a <strong>pseudorandom sample</strong> of the archive, which ensures sample sizes N &gt; 1000 are representative of the whole with high confidence.</p>
                    <hr />
                    <p>Links and embeds (<img style={{height: "12px"}} src="icons/bootstrap-icons-1.0.0-alpha5/share-fill.svg" />) are guaranteed equivalent results.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      <div key="dataModal" className="modal fade" id="dataModal" tabIndex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document" style={{width: "100%", maxWidth: "none", height: "100%", maxHeight: "none", margin: 0, padding: 0}}>
          <div className="modal-content">
            <div className="modal-body pt-0">
              <div className="table-responsive">
                <button type="button" className="close" style={{marginBottom: "-42px", paddingTop: "1rem"}} data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <table className="table table-striped table-hover d-block" style={{height: "96vh", overflowY: "hidden"}}>
                  <thead style={{tableLayout: "fixed", width: "100%", display: "table"}}>
                    <tr>
                      <th scope="col" style={{width: "15%"}}>Hashtag</th>
                      <th scope="col" style={{width: "48%"}}>Definition</th>
                      <th scope="col" style={{width: "11%"}}>Number Collected</th>
                      <th scope="col" style={{width: "13%"}}>Started Collecting</th>
                      <th scope="col" style={{width: "13%"}}>Stopped Collecting</th>
                    </tr>
                  </thead>
                  <tbody style={{display: "block", height: "95%", overflowY: "scroll", tableLayout: "fixed", width: "100%"}}>
                    {this.state.hashtagData.map((hashtag, idx) => (
                      <tr key={hashtag.hashtag + idx.toString()}>
                        <th scope="row"  style={{width: "15%"}}>{hashtag.hashtag}</th>
                        <td style={{width: "48%"}}>{hashtag.definition}</td>
                        <td style={{width: "11%"}}>{hashtag.numTweet}</td>
                        <td style={{width: "13%"}}>{this.formatDate(hashtag.startDate)}</td>
                        <td style={{width: "13%"}}>{this.formatDate(hashtag.endDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    ];
  }
}

// <th scope="col">Started Collecting</th>
// <th scope="col">Stopped Collecting</th>

// <td>{this.formatDate(hashtag.startDate)}</td>
// <td>{this.formatDate(hashtag.endDate)}</td>

// {this.state.hashtagData.map((hashtag, idx) => (
//   <tr key={hashtag.hashtag + idx.toString()}>
//     <th scope="row">{hashtag.hashtag}</th>
//     <td>{hashtag.definition}</td>
//   </tr>
// ))}



module.exports = OverviewModal;
