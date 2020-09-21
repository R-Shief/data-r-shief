let Dash = require('./components/Dash.js');

$( document ).ready(() => {
  ReactDOM.render(<Dash filterDefaults={filterDefaults} />, document.getElementById("root"));
});
