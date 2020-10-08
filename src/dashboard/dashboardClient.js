let Dash = require('./components/Dash.js');

$( document ).ready(() => {
  window.history.replaceState({}, null, "/dashboard");
  ReactDOM.render(<Dash filterDefaults={filterDefaults} includeWix={includeWix} overviewUpOnStartup={overviewUpOnStartup} />, document.getElementById("root"));
});

console.log("Hi there.");
