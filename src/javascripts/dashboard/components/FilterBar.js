let SearchDropdown = require("./SearchDropdown.js");

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    // this.state = Object.fromEntries(props.dropdownData.map(({val, label}) => [val, props.defaultChecked.includes(val)]));
    this.state = Object.fromEntries(props.defaultChecked.map(lang => [lang, true]));

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState((state, props) =>{
      const change = {[target.name]: target.checked}
      this.props.onFilterChange({fkey: this.props.fkey, val: Object.entries(Object.assign(state, change)).filter(([key, val]) => (val)).map(([key, val]) => key)});
      return change;
    });
  }

  render() {
    return (
      <div className="input-group input-group-sm">
        <div className="input-group-append">
          <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="languageMenuDropdownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {this.props.buttonLabel}
          </button>
          <div id={this.props.id} className="dropdown-menu" aria-labelledby="languageMenuDropdown" style={{height: "22rem", overflowY: "scroll"}}>
            {this.props.dropdownData.map(({val, label}) => (
              <div key={val} className="custom-control custom-checkbox d-flex justify-content-start align-items-start pl-4">
                <input className="custom-control-input" type="checkbox" id={"chk-" + val} name={val} checked={this.state[val]} onChange={this.handleChange} />
                <label className="custom-control-label" htmlFor={"chk-" + val}>
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: props.value};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onFilterChange(e);
  }

  render() {
    return <input key="input" id={this.props.id} className="form-control" type="text" name={this.props.name} onChange={this.handleChange} value={this.props.value} size="20" />;
  }
}

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const defaultFormat = (d) => `${months[d.getMonth()]}, ${d.getDate()} ${d.getFullYear()}`;

    this.state = {
      from: defaultFormat(new Date(props.fromDefault)),
      to: defaultFormat(new Date(props.toDefault))
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  formatDate(dateString) {
    const parsed = Date.parse(dateString);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return d.toISOString().substring(0, 10);
    } else {
      return "";
    }
  }

  componentDidMount() {
    const scope = this;
    $(ReactDOM.findDOMNode(this)).datepicker()
      .on('changeDate', function(e) {
        scope.setState({
          from: e.date[0],
          to: e.date[1]
        })
        scope.props.onFilterChange({fkey: scope.props.fromFkey, val: scope.formatDate($(this).find('#from').val())});
        scope.props.onFilterChange({fkey: scope.props.toFkey, val: scope.formatDate($(this).find('#to').val())});
      });
  }

  handleFilterChange(e) {
    // this.setState({[e.target.name]: e.target.value.toISOString().substring(0, 10)});
    this.props.onFilterChange({fkey: this.props[e.target.name + "Fkey"], val: this.formatDate(e.target.value)});
  }

  render() {
    return (
      <div className="input-group input-group-sm input-daterange" data-date-format="M d, yyyy">
        <div key="from" className="input-group-prepend input-group-append">
          <span className="input-group-text">from</span>
        </div>
        <DatePicker id="from" def={new Date(this.props.fromDefault)} fkey={this.props.fromFkey} name="from" value={this.state["from"]} onFilterChange={this.handleFilterChange} />
        <div key="to" className="input-group-prepend input-group-append">
          <span className="input-group-text">to</span>
        </div>
        <DatePicker id="to" def={new Date(this.props.toDefault)} fkey={this.props.toFkey} name="to" value={this.state["to"]} onFilterChange={this.handleFilterChange} />
      </div>
    );
  }
}

class FilterGoButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="input-group-append">
        <button id="filterGoButton" className="btn btn-secondary" type="button" disabled={this.props.disabled} onClick={this.props.onClick}>
          <img src="/icons/bootstrap-icons-1.0.0-alpha5/search.svg" />
        </button>
      </div>
    )
  }
}

class FilterBar extends React.Component {
  constructor(props) {
    super(props)
    this.filters = props.filterDefaults;
    this.state = {
      goButtonDisabled: true,
      hashtagData: [],
      usernameData: [],
      languageData: []
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleGoButtonClicked = this.handleGoButtonClicked.bind(this);
  }

  componentDidMount() {
    $('.input-daterange').datepicker();
    Promise.all([
      fetch('/data/hashTags.json').then(response => response.json()).then(data => data.map(hashtag => hashtag)),
      fetch('/data/usernames.json').then(response => response.json()).then(data => data.map(username => "@" + username)),
      fetch('/data/languages.json').then(response => response.json()).then(data => data.map(language => {return { val: language["639-1"], label: language["ISO language name"]} }))
    ])
    .then(datum => this.setState({
      hashtagData: datum[0],
      usernameData: datum[1],
      languageData: datum[2]
    }))
  }

  handleFilterChange(e) {
    this.setState({
      goButtonDisabled: false
    });
    this.props.onFilterChange(e);
  }

  handleGoButtonClicked(e) {
    this.setState({
      goButtonDisabled: true
    });
    this.props.onFilterSubmit();
  }

  render() {
    return (
      <nav id="filterBar" className="navbar pb-1">
        <div className="mx-0 px-0 d-flex w-100">
          <form className="form-inline w-100">
            <div className="input-group input-group-sm w-100">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <img src="/icons/Twitter-Logos/Twitter_Logo_Rshiefcolor.svg" height="20px" />
                </span>
              </div>
              <SearchDropdown id="hashtags" placeholder="Hashtags" dropdownData={this.state.hashtagData} fkey="hashtags" onFilterChange={this.handleFilterChange} />
              <SearchDropdown id="usernames" placeholder="Usernames" dropdownData={this.state.usernameData} fkey="usernames" onFilterChange={this.handleFilterChange} />
              <DateRangePicker fromDefault={this.props.filterDefaults.startDate} toDefault={this.props.filterDefaults.endDate} fromFkey="startDate" toFkey="endDate" onFilterChange={this.handleFilterChange} />
              <Dropdown buttonLabel="languages" dropdownData={this.state.languageData} defaultChecked={this.props.filterDefaults.langList} fkey="langList" onFilterChange={this.handleFilterChange} />
              <FilterGoButton disabled={this.state.goButtonDisabled} onClick={this.handleGoButtonClicked} />
            </div>
          </form>
        </div>
      </nav>
    );
  }
}

module.exports = FilterBar;
