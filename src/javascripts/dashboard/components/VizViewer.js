class VizTabs extends React.Component {
  constructor(props) {
    super(props);

    this.tabRef = React.createRef();
  }

  componentDidMount() {
    $(this.tabRef.current).find('a').on('shown.bs.tab', (e) => {
      this.props.onTabSwitch(e);
    })
  }

  render() {
    return (
      <div className="container-fluid">
        <ul ref={this.tabRef} id="vizTabs" className="nav nav-tabs nav-fill py-0" role="tablist">
          {this.props.vizInfos.map((vizInfo, idx) => (
            <li key={vizInfo.id} className="nav-item">
              <a className={"nav-link" + (idx == 0 ? " active" : "")} name={vizInfo.id} href={"#" + vizInfo.id + "-tab"} data-toggle="pill">
                {vizInfo.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class VizSpinner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "white", opacity: 0.8};
    return (
      <div id={this.props.id + "-spinner"} className="d-flex justify-content-center align-items-center" style={style}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
}

class VizViewer extends React.Component {
  constructor(props) {
    super(props);

    this.fetchExtension = this.fetchExtension.bind(this);
    this.bounds = {width: 960, height: 350};
    this.state = {
      activeViz: props.vizClasses[0].getInfo().id,
      isLoading: {}
    }

    this.handleTabSwitch = this.handleTabSwitch.bind(this);
    this.handleLoadChange = this.handleLoadChange.bind(this);
  }

  handleTabSwitch(e) {
    const shown = e.target;
    this.setState({activeViz: shown.name});
  }

  fetchExtension(extension, options) {
    const url = `${this.props.getUrl()}/${extension}`;
    // console.log(url);
    return fetch(url, options)
      .then(response => {
        // console.log(response);
        return response.json();
      })
      .then(json => {
        // console.log(json);
        return JSON.parse(json);
      })
      .then(data => {
        return data;
      })
  }

  handleLoadChange({id, isLoading}) {
    this.setState((state, props) => {
      const newIsLoading = Object.assign(state.isLoading, {[id]: isLoading});
      return {isLoading: newIsLoading};
    });
  }

  render() {
    return [
      <VizTabs key="vizTabs" onTabSwitch={this.handleTabSwitch} vizInfos={this.props.vizClasses.map(vizClass => vizClass.getInfo())} />,
      <main key="vizViews" id="dash" className="container-fluid tab-content" role="main">
        {this.props.vizClasses.map((VizClass, idx) => {
          const vizInfos = VizClass.getInfo();
          return (
            <div key={vizInfos.id + "-tab"} className={"viz tab-pane fade border border-top-0 rounded-bottom" + (idx == 0 ? " show active" : "")} id={vizInfos.id + "-tab"} role="tabpanel" aria-labelledby={vizInfos.id + "-tab"}>
              <VizClass isActive={vizInfos.id == this.state.activeViz} fetcher={this.fetchExtension} bounds={this.bounds} onLoadChange={this.handleLoadChange} />
              {(this.state.isLoading[vizInfos.id] || !Object.keys(this.state.isLoading).includes(vizInfos.id)) &&
                <VizSpinner id={vizInfos.id} />
              }
            </div>
          );
        })}
      </main>
    ];
  }
}

module.exports = VizViewer;
