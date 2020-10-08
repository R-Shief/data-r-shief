class Viz extends React.Component {
  constructor(props) {
    super(props)
  }

  static getOptionComponents() {
    return this.optionComponents;
  }

  static getInfo() {
    return this.info;
  }

  render() {
    return null;
  }
}

Viz.optionComponents =  [
  // components
];

Viz.info = {
  id: "",
  name: ""
};

module.exports = Viz;
