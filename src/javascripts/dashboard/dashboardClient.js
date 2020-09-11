let ClipboardJS = require('clipboard');
let Dash = require('./dash.js');

$( document ).ready(() => {
  // activate the datepicker
  $('.input-daterange').datepicker();

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  (new Dash(dashOptions))
  .then(dash => dash.populate());
});
