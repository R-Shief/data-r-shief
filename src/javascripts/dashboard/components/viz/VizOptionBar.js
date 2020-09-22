const OptionButton = (props) => (
  <a className={"nav-link" + ((props.isActive) ? " active" : "")} id="hashtagStreamgraph" onClick={props.onClick.bind(this, {name: props.name, val: props.val})}>{props.label}</a>
);

class VizOptionBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md bg-light pl-1" id={this.props.id}>
        <div className="ml-1.pl-0">
          <div id="vizToggles" className="collapse navbar-collapse show">
            <ul id="pills-tab" className="navbar-nav nav nav-pills">
              {this.props.children.map((optionComponent, idx) => (
                <li className="nav-item">
                  {optionComponent}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

module.exports = {
  OptionButton: OptionButton,
  VizOptionBar: VizOptionBar
};
