// let SearchDropdown = require("./SearchDropdown.js");
let oboe = require('oboe');

let {Dropdown, DateRangePicker, FilterGoButton, SearchDropdown} = require('./Filters.js');

class FilterBar extends React.Component {
  constructor(props) {
    super(props)
    this.filters = props.filterDefaults;
    this.state = {
      goButtonDisabled: true,
      hashtagData: [],
      usernameData: [],
      languageData: [],
      filterBarActive: false
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleGoButtonClicked = this.handleGoButtonClicked.bind(this);
    this.handleLiveFilterChange = this.handleLiveFilterChange.bind(this);
  }

  componentDidMount() {
    $('.input-daterange').datepicker();

    Promise.all([
      fetch('/data/hashTags.json').then(response => response.json()).then(data => data.map(hashtag => hashtag)),
      fetch('/data/languages.json').then(response => response.json()).then(data => data.map(language => {return { val: language["639-1"], label: language["ISO language name"]} }))
    ])
    .then(datum => this.setState({
      hashtagData: datum[0],
      languageData: datum[1]
    }))
  }

  handleFilterChange(e) {
    this.setState({
      goButtonDisabled: false
    });
    this.props.onFilterChange(e);
  }

  handleLiveFilterChange(e) {
    fetch(window.location.href + '/' + (e.val != "" ? e.val : "*"))
      .then(response => response.json())
      .then(data => {
        let parsed = [...(new Set(JSON.parse(data).map(d => d[0])))];
        this.setState({usernameData: parsed});
      });
    this.handleFilterChange(e);
  }

  handleGoButtonClicked(e) {
    this.setState({
      goButtonDisabled: true
    });
    this.props.onFilterSubmit();
  }

  render() {
    return (
      <nav id="filterBar" className="navbar navbar-expand-md pt-0 pb-1">
        <h1 className="navbar-brand mb-0 d-md-none" href="#">Dashboard</h1>
        <button type="button" className="navbar-toggler d-md-none rounded" style={{backgroundColor: "#FFFFFF"}} onClick={() => this.setState((state, props) => ({filterBarActive: !state.filterBarActive}))} aria-controls="filterBarSupportedContent" aria-expanded="false" aria-label="Toggle Filter Bar">
          <img height="30px" src="icons/bootstrap-icons-1.0.0-alpha5/filter.svg" />
        </button>
        <div className="mx-0 px-0 d-flex w-100" id="filterBarSupportedContent">
          <form className={"form-inline w-100" + (this.state.filterBarActive ? "" : " d-none d-md-block")}>
            <div className="input-group input-group-sm w-100">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <img src="/icons/Twitter-Logos/Twitter_Logo_Rshiefcolor.svg" height="20px" />
                </span>
              </div>
              <SearchDropdown id="hashtags" placeholder="Hashtags" dropdownData={this.state.hashtagData} fkey="hashtags" onFilterChange={this.handleFilterChange} />
              <SearchDropdown id="usernames" placeholder="Usernames" dropdownData={this.state.usernameData} fkey="usernames" onFilterChange={this.handleLiveFilterChange} />
              <DateRangePicker fromDefault={this.props.filterDefaults.startDate} toDefault={this.props.filterDefaults.endDate} fromFkey="startDate" toFkey="endDate" onFilterChange={this.handleFilterChange} />
              <div className="input-group-append flex-grow-1">
                <Dropdown buttonLabel="languages" dropdownData={this.state.languageData} defaultChecked={this.props.filterDefaults.langList} fkey="langList" onFilterChange={this.handleFilterChange} />
                <FilterGoButton disabled={this.state.goButtonDisabled} onClick={this.handleGoButtonClicked} />
              </div>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}

module.exports = FilterBar;
