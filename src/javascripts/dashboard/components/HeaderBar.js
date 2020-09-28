class HeaderBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hovering: {
        "Home": false,
        "Dashboard": false,
        "The Good Glitch": false,
        "Legacy": false
      }
    }
  }

  render() {
    let navList = [
      {
        url: "https://r-shief.org",
        name: "Home"
      },
      {
        url: "https://data.r-shief.org/dashboard",
        name: "Dashboard"
      },
      {
        url: "https://r-shief.org/goodglitch",
        name: "The Good Glitch"
      },
      {
        url: "https://r-shief.org/legacy",
        name: "Legacy"
      }
    ];
    let activeItem = "Dashboard";
    return [
      <nav className="navbar navbar-expand-md fixed-top" style={{backgroundColor: "#414141"}} id="headerBar">
        <div className="container-fluid" style={{width: "980px"}}>
          <a href="https://r-shief.org" className="navbar-header">
            <img src="icons/r-shief-logo-1-color-smaller.png" />
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerSupportedContent" aria-controls="headerSupportedContent" aria-expanded="false" aria-label="Toggle Header Navigation">
            <span className="navbar-toggler-icon" style={{backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E")`}}></span>
          </button>
          <div id="#headerSupportedContent" className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {navList.map(item => (
                <li className="nav-item" key={item.name}>
                  <div width="100%" style={{backgroundColor: (this.state.hovering[item.name] || item.name==activeItem) ? "white" : "#414141", height: "5px"}}></div>
                  <a className={"nav-link" + (item.name==activeItem ? " active" : "")} onMouseEnter={() => this.setState((state, props) => ({hovering: Object.assign(state.hovering, {[item.name]: true})}))} onMouseOut={() => this.setState((state, props) => ({hovering: Object.assign(state.hovering, {[item.name]: false})}))} href={item.url}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>,
      <div style={{height:"61px"}}></div>
    ];
  }
}

module.exports = HeaderBar;

// <li className="nav-item">
//   <a className="nav-link" href="https://r-shief.org">Home</a>
// </li>
// <li className="nav-item">
//   <a className="nav-link active" href="https://data.r-shief.org/dashboard">Dashboard</a>
// </li>
// <li className="nav-item">
//   <a className="nav-link" href="https://r-shief.org/goodglitch">The Good Glitch</a>
// </li>
// <li className="nav-item">
//   <a className="nav-link" href="https://r-shief.org/legacy">Legacy</a>
// </li>
