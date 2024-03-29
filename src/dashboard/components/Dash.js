// import React from 'react';
// import { isMobile, withOrientationChange } from 'react-device-detect';

let HeaderBar = require('./HeaderBar.js');
let SiteFooter = require('./SiteFooter.js');

let FilterBar = require('./FilterBar.js');
let VizViewer = require('./VizViewer.js');
let InfoBar = require('./InfoBar.js');

let Streamgraph = require('./viz/Streamgraph.js');
let Rankings = require('./viz/rankings.js');
let MapViz = require('./viz/MapViz.js');
let UserViz = require('./viz/UserViz.js');
let TweetTime = require('./viz/TweetTime.js');

let rdd = require("react-device-detect");

class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filterDefaults,
      dataPage: 0,
      vizClasses: [TweetTime, UserViz, Streamgraph], //, Rankings, MapViz
      sampleCount: 0,
      sampleMethod: 'randomly',
      totalCount: 87707630,
      maxLimit: 50000,
      noticeActive: true,
      height: 900
    };

    this.populate = this.populate.bind(this);
    this.getURLWithFilters = this.getURLWithFilters.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({height: window.innerHeight});
    $(window).on("resize", () => {
      this.setState({height: window.innerHeight});
    });
    this.populate();
  }

  updateInfoBar() {
      this.options.infoBar.forEach(field => {
        let val = this.info[field.infoKey];
        val = typeof val == "number" ? Number(val).toLocaleString() : val;
        $(field.id).text(val);
      })
  }

  populate() {
    return new Promise((resolve, reject) =>
      fetch(this.getURLWithFilters(this.state.filters), {method: 'PUT'})
      .then(response => response.json())
      .then(obj => { // now up the page count once and do it all again
        let newCount;
        this.setState((state, props) => {
          newCount = state.sampleCount + obj.rowsAffected;
          return {dataPage: state.dataPage + 1, sampleCount: newCount};
        });
        resolve(newCount < this.state.maxLimit && this.populate());
      })
      .catch(failure => reject(failure))
    ).catch(failure => console.log(failure));
  }

  getURLWithFilters() {
    // console.log(this.state.filters, this.state.dataPage);
    return [window.location.href, ...Object.values(this.state.filters), this.state.dataPage].join("/");
  }

  componentDidUpdate() {
    if (this.shouldPopulate) {this.populate(); this.shouldPopulate=false;}
  }

  handleFilterChange(e) {
    this.setState((state, props) => {
      const newFilters = Object.assign({}, state.filters, {[e.fkey]: e.val != "" ? e.val : "*"});
      return {filters: newFilters};
    });
  }

  handleFilterSubmit(e) {
    this.setState({dataPage: 0, sampleCount: 0});
    this.shouldPopulate = true;
  }

  // componentDidUpdate() {
  //   console.log(this.state);
  // }

  render() {

    return [
      <div key="main" className="d-flex flex-column" style={{height: this.state.height + "px"}}>
        <div key="landscapeHint" className={"alert alert-warning alert-dismissible position-fixed" + ((this.props.isPortrait && this.state.noticeActive) ? " fade show" : " d-none")} style={{zIndex: 999, top: "50px", left: "50%", width: "75%", marginLeft: "-37.5%"}} role="alert">
          <strong>Hint:</strong> Try in landscape!
          <button type="button" className="close" onClick={() => this.setState({noticeActive: false})} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        {this.props.includeWix && <HeaderBar key="headerBar" />}
        <VizViewer key="vizViewer" vizClasses={this.state.vizClasses} getUrl={this.getURLWithFilters} />
        <div className="container-fluid mt-1 mb-3">
          <InfoBar sampleCount={this.state.sampleCount} sampleMethod={this.state.sampleMethod} totalCount={this.state.totalCount} getUrl={this.getURLWithFilters} overviewUpOnStartup={this.props.overviewUpOnStartup} />
        </div>
      </div>,
      <footer key="footer">
        {this.props.includeWix && <SiteFooter />}
      </footer>
    ];
  }
}

// <FilterBar key="filterBar" filterDefaults={this.props.filterDefaults} onFilterChange={this.handleFilterChange} onFilterSubmit={this.handleFilterSubmit} />

// <div>{this.props.isPortrait && <OrientationNotice />}</div>,

module.exports = rdd.withOrientationChange(Dash);
