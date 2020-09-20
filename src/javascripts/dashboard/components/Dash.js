let FilterBar = require('./FilterBar.js');

let Streamgraph = require('../viz/streamgraph.js');
let Rankings = require('../viz/rankings.js');

class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filterDefaults,
      dataPage: 0
    };

    this.vizClasses = [Streamgraph, Rankings];

    this.populate = this.populate.bind(this);
    this.getURLWithFilters = this.getURLWithFilters.bind(this);
    this.fetchExtension = this.fetchExtension.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
  }

  populate() {
    return new Promise((resolve, reject) =>
      fetch(this.getURLWithFilters(), {method: 'PUT'})
      .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
        this.setState((state, props) => ({dataPage: state.dataPage + 1}));
        resolve(this.populate());
      })
      .catch(failure => reject(failure))
    ).catch(failure => console.log(failure));
  }

  fetchExtension(extension, options) {
    const url = `${this.getURLWithFilters()}/${extension}`;
    // console.log(url);
    return fetch(url, options)
      .then(response => {
        // console.log(response);
        return response.json();
      })
      .then(json => {
        // console.log(json);
        return JSON.parse(json);
      })
      .then(data => {
        // this.info.sampleCount += typeof data.length == "number" ? data.length : this.info.sampleCount;
        // updateInfoBar();
        return data;
      })
  }

  getURLWithFilters() {
    return [window.location.href, ...Object.values(this.state.filters), this.state.dataPage].join("/");
  }

  handleFilterChange(e) {
    this.setState((state, props) => {
      const newFilters = Object.assign({}, state.filters, {[e.fkey]: e.val});
      return {filters: newFilters};
    });
  }

  handleFilterSubmit(e) {
    this.populate();
  }

  componentDidMount() {
    const bounds = {width: 960, height: 350};
    fetch(this.getURLWithFilters(), {method: 'PUT'})
    .then(() => {
      Promise.all(
        this.vizClasses.map((vizClass) => new Promise((resolve, reject) => {
          Promise.resolve()
          .then(_ => new vizClass({width: bounds.width, height: bounds.height, fetcher: this.fetchExtension}))
          .then(viz => viz.refresh())
          .then(viz => {
            $(viz.id)[0].innerHTML = '';
            $(viz.id)[0].appendChild(viz.getView());
            resolve(viz);
          })
        }))
      )
    })
    .then(vizs => {
      this.vizs = vizs;
      this.populate();
    });
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
    return (
      <FilterBar filterDefaults={this.props.filterDefaults} onFilterChange={this.handleFilterChange} onFilterSubmit={this.handleFilterSubmit} />
    );
  }
}

module.exports = Dash;
