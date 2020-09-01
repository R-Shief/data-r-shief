let ClipboardJS = require('clipboard');
let UserPacking = require('./userPacking.js');
let Streamgraph = require('./streamgraph.js');
let Dash = require('./dash.js');


$( document ).ready(() => {
  // activate the datepicker
  $('.input-daterange').datepicker();

  // activate the clipboard utility
  let clipboard = new ClipboardJS('.clippable');

  // push vizs to dash and populate
  let dash = new Dash({
    filters: [
      {id: "#language", type: "checkbox", fkey: "langList", default: ["ar", "en", "fr"]},
      {id: "#country", type: "checkbox", fkey: "countries", default: ["af", "be", "mz"]},
      {id: "#source", type: "checkbox", fkey: "sources", default: ["023", "622", "131"]},
      {id: "#from", type: "datebox", fkey: "startDate", default: "2011-12-12"},
      {id: "#to", type: "textbox", fkey: "endDate", default: "2013-12-12"},
      {id: "#hashtagsText", type: "textbox", fkey: "hashtags", default: "egypt"},
      {id: "#usernamesText", type: "textbox", fkey: "usernames", default: "*"},
      {id: "#keywordsText", type: "textbox", fkey: "keywords", default: "*"}
    ],
    filterBar: {
      id: "#filterBar",
      goButton: {id: "#filterGoButton", default: "disabled"}
    },
    vizs: [
      {elem: document.getElementById("userPacking"), class: UserPacking, uriExtension: 'uCirclePacking'},
      {elem: document.getElementById('streamgraph'), class: Streamgraph, uriExtension: 'htStreamgraph'}
    ]
  });

  dash.populate();
});

function p(whatever) {
  console.log(whatever);
}
