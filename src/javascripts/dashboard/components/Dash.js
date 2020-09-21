let FilterBar = require('./FilterBar.js');
let VizViewer = require('./VizViewer.js');
let InfoBar = require('./InfoBar.js');

let Streamgraph = require('./Streamgraph.js');
let Rankings = require('./rankings.js');

class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filterDefaults,
      dataPage: 0,
      vizClasses: [Streamgraph, Rankings],
      sampleCount: '0',
      sampleMethod: 'randomly',
      totalCount: '87,707,630'
    };

    // this.vizClasses = [Streamgraph, Rankings];

    this.populate = this.populate.bind(this);
    this.getURLWithFilters = this.getURLWithFilters.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
  }

  componentDidMount() {

    this.populate();
  }

  populate() {
    return new Promise((resolve, reject) =>
      fetch(this.getURLWithFilters(this.state.filters), {method: 'PUT'})
      .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
        this.setState((state, props) => ({dataPage: state.dataPage + 1}));
        resolve(this.populate());
      })
      .catch(failure => reject(failure))
    ).catch(failure => console.log(failure));
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
    this.setState({dataPage: 0});
    this.populate();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <FilterBar filterDefaults={this.props.filterDefaults} onFilterChange={this.handleFilterChange} onFilterSubmit={this.handleFilterSubmit} />
        <VizViewer vizClasses={this.state.vizClasses} getUrl={this.getURLWithFilters} />
        <footer className="container-fluid mt-1">
          <InfoBar sampleCount={this.state.sampleCount} sampleMethod={this.state.sampleMethod} totalCount={this.state.totalCount} getUrl={this.getURLWithFilters} />
        </footer>
      </div>
    );
  }
}

module.exports = Dash;
