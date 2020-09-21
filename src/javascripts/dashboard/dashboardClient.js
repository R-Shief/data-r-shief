let ClipboardJS = require('clipboard');
let Dash = require('./components/Dash.js');

$( document ).ready(() => {

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  let filterDefaults = {
    langList: ["en", "ar"],
    startDate: "2009-04-12",
    endDate: "2014-12-12",
    hashtags: "*",
    usernames: "*"
  };

  ReactDOM.render(<Dash filterDefaults={filterDefaults} />, document.getElementById("root"));
});
