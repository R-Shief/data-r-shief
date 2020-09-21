class VizTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <ul id="pills-tab" className="nav nav-tabs nav-fill py-0" role="tablist">
          {this.props.vizInfos.map((vizInfo, idx) => (
            <li className="nav-item">
              <a className={"nav-link" + (idx == 0 ? " active" : "")} href={"#" + vizInfo.id + "-tab"} data-toggle="pill">
                {vizInfo.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

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

class VizSpinner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let style = {position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "white", opacity: 0.8};
    return (
      <div id={props.id + "-spinner"} className="d-flex justify-content-center align-items-center" style={style}>
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

  render() {
    return [
      <VizTabs vizInfos={this.props.vizClasses.map(vizClass => vizClass.getInfo())} />,
      <main id="dash" className="container-fluid tab-content" role="main">
        {this.props.vizClasses.map((VizClass, idx) => {
          const vizInfos = VizClass.getInfo();
          return (
            <div className={"viz tab-pane fade border border-top-0 rounded-bottom" + (idx == 0 ? " show active" : "")} id={vizInfos.id + "-tab"} role="tabpanel" aria-labelledby={vizInfos.id + "-tab"}>
              <VizOptionBar id={vizInfos.id + "-options"}>
                {VizClass.getOptionComponents()}
              </VizOptionBar>
              <div id={vizInfos.id}>
                <VizClass fetcher={this.fetchExtension} bounds={this.bounds} />
              </div>
            </div>
          );
        })}
      </main>
    ];
  }
}

module.exports = VizViewer;
