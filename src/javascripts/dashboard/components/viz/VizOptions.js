const OptionButton = (props) => (
  <a className={"nav-link px-2" + ((props.isActive) ? " active" : "")} id="hashtagStreamgraph" onClick={props.onClick.bind(this, {name: props.name, val: props.val})}>{props.label}</a>
);

class VizOptionBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar bg-light pl-1" id={this.props.id}>
        <div id="vizToggles" className="ml-1.pl-0">
            <ul id="pills-tab" className="navbar-nav nav nav-pills d-flex flex-row">
              {this.props.children.map((optionComponent, idx) => (
                <li key={idx} className="nav-item mr-2">
                  {optionComponent}
                </li>
              ))}
            </ul>
        </div>
      </nav>
    );
  }
}

module.exports = {
  OptionButton: OptionButton,
  VizOptionBar: VizOptionBar
};
