userPacking = require('./userPacking.js');
streamgraph = require('./streamgraph.js');

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
    var streamgraphDiv = document.getElementById("streamgraph");
    var boundingClientRect = streamgraphDiv.getBoundingClientRect();
    streamgraphDiv.appendChild(streamgraph(data, boundingClientRect.width, boundingClientRect.height));
  })
