d3 = require('d3');
userPacking = require('./userPacking.js');
streamgraph = require('./streamgraph.js');
drag = require('./drag.js');

fetch('/data/flare-2.json')
  .then(response => response.json())
  .then(data => {
    var packingDiv = document.getElementById("userPacking");
    var boundingClientRect = packingDiv.getBoundingClientRect();
    packingDiv.appendChild(userPacking(data, boundingClientRect.width, boundingClientRect.height));
  });

fetch('/data/unemployment-2.csv')
  .then(response => response.text())
  .then(data => {
    data = Object.assign(d3.csvParse(data, d3.autoType), {y: "Unemployment"});
    var sg = d3.select('#streamgraph');
    var bounds = sg.node().getBoundingClientRect();
    sg.node().appendChild(streamgraph(data, bounds.width, bounds.height));
  })

d3.selectAll('.draggable')
  .each(function(d) {
    d3.select(this).call( drag() )
  });
