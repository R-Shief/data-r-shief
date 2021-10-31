let Dash = require('./components/Dash.js');

$( document ).ready(() => {

  if ((new URLSearchParams(window.location.search)).get("nowix")) {
    includeWix = false;
  }

  window.history.replaceState({}, null, "/dashboard");


  ReactDOM.render(<Dash filterDefaults={filterDefaults} includeWix={includeWix} overviewUpOnStartup={overviewUpOnStartup} />, document.getElementById("root"));
});
