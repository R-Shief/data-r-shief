class SearchDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.dropdownId = props.id + "Dropdown";
    this.inputId = props.id + "Text";

    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  handleValueChange(e) {
    this.setState({value: e.target.value});
  }

  handleClickItem(e) {
    console.log(e.target.id);
    this.setState({value: e.target.id});
  }

  handleInputFocus(e) {
    if(!$(this.dropdownId).hasClass("show")) $(this.dropdownId).dropdown('toggle');
  }

  handleInputBlur(e) {
    if($(this.dropdownId).hasClass("show")) $(this.dropdownId).dropdown('toggle');
  }

  render() {
    return [
      <input key="input" className="form-control" id={this.inputId} type="search" placeholder={this.props.placeholder} size="20" onChange={this.handleValueChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} value={this.state.value} />,
      <div key="dropdown" className="input-group-prepend input-group-append">
        <button className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split rounded-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
    ]
  }
}

module.exports = SearchDropdown;
