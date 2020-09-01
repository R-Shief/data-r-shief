let ClipboardJS = require('clipboard');
let UserPacking = require('./userPacking.js');
let Streamgraph = require('./streamgraph.js');
let Dash = require('./dash.js');


$( document ).ready(() => {
  // activate the datepicker
  $('.input-daterange').datepicker();

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  p(dashOptions);

  Promise.resolve()
  .then(_ => new Dash(dashOptions, {UserPacking: UserPacking, Streamgraph: Streamgraph}))
  .then(dash => dash.populate());
});

function p(whatever) {
  console.log(whatever);
}
