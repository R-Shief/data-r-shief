let SearchDropdown = require("./SearchDropdown.js");

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.fromEntries(props.dropdownData.map(({val, label}) => [val, props.defaultChecked.includes(val)]));

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.checked
    });
  }

  componentDidUpdate() {
    this.props.onFilterChange({fkey: this.props.fkey, val: Object.entries(this.state).filter(([key, val]) => (val)).map(([key, val]) => key)});
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.state = {value: `${months[props.def.getMonth()]}, ${props.def.getDate()} ${props.def.getFullYear()}`};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
    this.props.onFilterChange({fkey: this.props.fkey, val: e.target.value});
  }

  render() {
    return <input key="input" id={this.props.id} className="form-control" type="text" onChange={this.handleChange} value={this.state.value} size="20" />;
  }
}

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const scope = this;
    $(ReactDOM.findDOMNode(this)).datepicker()
      .on('changeDate', function(e) {
        scope.props.onFilterChange({fkey: 'from', val: $(this).find('#from').val()});
        scope.props.onFilterChange({fkey: 'to', val: $(this).find('#to').val()});
      });
  }

  render() {

    return (
      <div className="input-group input-group-sm input-daterange" data-date-format="M d, yyyy">
        <div key="from" className="input-group-prepend input-group-append">
          <span className="input-group-text">from</span>
        </div>
        <DatePicker id="from" def={new Date(this.props.fromDefault)} fkey="startDate" onFilterChange={this.props.onFilterChange} />
        <div key="to" className="input-group-prepend input-group-append">
          <span className="input-group-text">to</span>
        </div>
        <DatePicker id="to" def={new Date(this.props.toDefault)} fkey="endDate" onFilterChange={this.props.onFilterChange} />
      </div>
    );
  }
}

class FilterBar extends React.Component {
  constructor(props) {
    super(props)
    this.filters = {};

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(e) {
    // console.log(e.fkey + " changed to " + e.val);
    this.filters[e.fkey] = e.val;
    console.log(this.filters);
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
              <SearchDropdown id="hashtags" placeholder="Hashtags" dropdownData={this.props.hashtagData} fkey="hashtags" onFilterChange={this.handleFilterChange} />
              <SearchDropdown id="usernames" placeholder="Usernames" dropdownData={this.props.usernameData} fkey="usernames" onFilterChange={this.handleFilterChange} />
              <DateRangePicker fromDefault={this.props.fromDefault} toDefault={this.props.toDefault} onFilterChange={this.handleFilterChange} />
              <Dropdown buttonLabel="languages" dropdownData={this.props.languagesData} defaultChecked={this.props.defaultLanguages} fkey="langList" onFilterChange={this.handleFilterChange} />
              <div className="input-group-append">
                <button id="filterGoButton" className="btn btn-secondary" type="button" disabled>
                  <img src="/icons/bootstrap-icons-1.0.0-alpha5/search.svg" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}

module.exports = FilterBar;
