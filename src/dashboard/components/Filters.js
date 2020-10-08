class Dropdown extends React.Component {
  constructor(props) {
    super(props);
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
      <div className="input-group input-group-sm d-flex flex-grow-1">
        <div className="input-group-append flex-grow-1">
          <button className="btn btn-sm btn-outline-secondary dropdown-toggle flex-grow-1" type="button" id="languageMenuDropdownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{borderColor: "#ced4da"}}>
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
      <div className="input-group-append ml-auto">
        <button id="filterGoButton" className="btn btn-sm btn-secondary" type="button" disabled={this.props.disabled} onClick={this.props.onClick}>
          <img src="/icons/bootstrap-icons-1.0.0-alpha5/search.svg" />
        </button>
      </div>
    )
  }
}

class SearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.dropdownId = props.id + "Dropdown";
    this.inputId = props.id + "Text";

    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
    this.setState({value: e.target.value});
    this.props.onFilterChange({fkey: this.props.fkey, val: e.target.value});
  }

  handleClickItem(e) {
    this.setState({value: e.target.id});
    this.props.onFilterChange({fkey: this.props.fkey, val: e.target.id});
  }

  render() {
    return (
      <div key="dropdown" className="input-group-prepend input-group-append flex-grow-1" style={{position: "relative"}}>
        <input key="input" className="form-control form-control-sm rounded-0 flex-grow-1" data-toggle="dropdown" autoComplete="off" id={this.inputId} type="search" placeholder={this.props.placeholder} size="20" onChange={this.handleValueChange} value={this.state.value} />
        <img src='icons/bootstrap-icons-1.0.0-alpha5/caret-down-fill.svg' style={{position: "absolute", right: "10px", top: "11px", height: "8px"}} />
        <div className="dropdown-menu" id={this.dropdownId} style={{minHeight: "3rem", maxHeight: "22rem", overflowY: "scroll"}}>
          {this.props.dropdownData.filter(item => item.includes(this.state.value)).map((item) => {
            const startIdx = item.indexOf(this.state.value, 1);
            const endIdx = startIdx + this.state.value.length;
            return (
              <a className="dropdown-item" key={item.substring(1)} id={item.substring(1)} onClick={this.handleClickItem}>
                {item.substring(1, startIdx)}
                <strong>{this.state.value}</strong>
                {item.substring(endIdx)}
              </a>
            )
          })}
        </div>
      </div>
    )
  }
}

module.exports = {
  Dropdown: Dropdown,
  DateRangePicker: DateRangePicker,
  FilterGoButton: FilterGoButton,
  SearchDropdown: SearchDropdown
}
