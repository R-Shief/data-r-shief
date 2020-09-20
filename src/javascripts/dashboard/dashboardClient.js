let ClipboardJS = require('clipboard');
// let Dash = require('./dash.js');
let Dash = require('./components/Dash.js');


$( document ).ready(() => {
  // activate the datepicker

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  // (new Dash(dashOptions))
  // .then(dash => dash.populate());

  let filterDefaults = {
    langList: ["en", "ar"],
    startDate: "2009-04-12",
    endDate: "2014-12-12",
    hashtags: "*",
    usernames: "*"
  };

  ReactDOM.render(<Dash filterDefaults={filterDefaults} />, document.getElementById("root"));
});
