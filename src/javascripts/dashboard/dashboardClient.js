let ClipboardJS = require('clipboard');
let UserPacking = require('./userPacking.js');
let Streamgraph = require('./streamgraph.js');
let resizer = require('./resize.js');
let dash = require('./dash.js');


$( document ).ready(() => {
  // activate the datepicker
  $('.input-daterange').datepicker();

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  // // activate the resizer
  // resizer.getResizeHandle().addEventListener("mousedown", function(evt) {
  //   resizer.startResize(evt);
  //   document.body.addEventListener("mousemove", resizer.resize);
  //   document.body.addEventListener("mouseup", function() {
  //     resizer.getResizeHandle().body.removeEventListener("mousemove", resizer.resize);
  //   });
  // });

  // push vizs to dash and populate
  dash.vizs.push({elem: document.getElementById("userPacking"), class: UserPacking, uriExtension: 'uCirclePacking'});
  dash.vizs.push({elem: document.getElementById('streamgraph'), class: Streamgraph, uriExtension: 'htStreamgraph'});
  dash.populate();
});

function p(whatever) {
  console.log(whatever);
}
