let ClipboardJS = require('clipboard');
let d3 = require('d3');
let userPacking = require('./userPacking.js');
let Streamgraph = require('./streamgraph.js');
let drag = require('./drag.js');
let resizer = require('./resize.js');

$( document ).ready(() => {
  $('.input-daterange').datepicker();
  let clipboard = new ClipboardJS('.clippable');
});

// Default filters values
let filters = {
  langList: ["ar","en","fr"],
  startDate: "2011-12-12",
  endDate: "2013-12-12",
  keywords: "*",
  page: 0,
  getURLWithFilters: function() {
    return `${window.location.href}/${this.langList}/${this.startDate}/${this.endDate}/${this.keywords}/${this.page}`;
  },
  populateSession: function() {
    let url = this.getURLWithFilters();
    // window.history.pushState({}, "", url);
    return fetch(url, {method: 'PUT'});
  },
  populateNext: function() {
    this.page++;
    return this.populateSession();
  },
  populateRest: function() {
    this.populateNext()
      .then(result => {
        filters.getHtStreamgraphData()
          .then(data => streamgraph.refreshStreamgraph(sg.selectAll("svg"), data))
          .then(_ => this.populateRest());
      })
      .catch(failure => console.log(failure));
  },
  getHtStreamgraphData: function() {
    return fetch(`${filters.getURLWithFilters()}/htStreamgraph`, {method: 'GET'}).then(response => response.json());
  }
};

let sg = d3.select('#streamgraph');
let streamgraph;

// Load with default values
fetch('/data/flare-2.json')
  .then(response => response.json())
  .then(data => {
    var packingDiv = document.getElementById("userPacking");
    var boundingClientRect = packingDiv.getBoundingClientRect();
    packingDiv.innerHTML = '';
    packingDiv.appendChild(userPacking(data, boundingClientRect.width, boundingClientRect.height));
  });

filters.populateSession()
  .then(response => {

    return filters.getHtStreamgraphData()
      .then(data => {
        //data = Object.assign(d3.csvParse(data, d3.autoType), {y: "Unemployment"});
        let bounds = sg.node().getBoundingClientRect();
        streamgraph = new Streamgraph(data, bounds.width, bounds.height);
        sg.node().appendChild(streamgraph.svg.node());
      })

  })
  .then(response => { // Now we gradually update
    filters.populateRest();
  });

d3.selectAll('.draggable')
  .each(function(d) {
    d3.select(this).call( drag() )
  });

resizer.getResizeHandle().addEventListener("mousedown", function(evt) {
  resizer.startResize(evt);
  document.body.addEventListener("mousemove", resizer.resize);
  document.body.addEventListener("mouseup", function() {
    resizer.getResizeHandle().body.removeEventListener("mousemove", resizer.resize);
  });
});

function p(whatever) {
  console.log(whatever);
}
