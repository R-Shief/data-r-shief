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
      <div key="dropdown" className="input-group-prepend input-group-append flex-grow-1">
        <input key="input" className="form-control form-control-sm rounded-0 flex-grow-1" data-toggle="dropdown" autoComplete="off" id={this.inputId} type="search" placeholder={this.props.placeholder} size="20" onChange={this.handleValueChange} value={this.state.value} />
        <button className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split ml-auto rounded-0" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false">
          <span className="sr-only">Toggle Dropdown</span>
        </button>
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

module.exports = SearchDropdown;
