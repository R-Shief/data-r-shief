d3 = require('d3');
userPacking = require('./userPacking.js');
streamgraph = require('./streamgraph.js');
drag = require('./drag.js');

let df = {
  langList: ["ar","en","fr"],
  startDate: "2011-12-12",
  endDate: "2012-12-12",
  keywords: "foo",
  page: 0
}

fetch(`${window.location.href}/${df.langList}/${df.startDate}/${df.endDate}/${df.keywords}/${df.page}`)
  .then(response => {
    fetch('/data/flare-2.json')
      .then(response => response.json())
      .then(data => {
        var packingDiv = document.getElementById("userPacking");
        var boundingClientRect = packingDiv.getBoundingClientRect();
        packingDiv.appendChild(userPacking(data, boundingClientRect.width, boundingClientRect.height));
      });

    //fetch('/data/unemployment-2.csv')
    fetch(`${window.location.href}/${df.langList}/${df.startDate}/${df.endDate}/${df.keywords}/${df.page}/htStreamgraph`)
      .then(response => {console.log(response); response.json()})
      .then(data => {
        //data = Object.assign(d3.csvParse(data, d3.autoType), {y: "Unemployment"});
        var sg = d3.select('#streamgraph');
        var bounds = sg.node().getBoundingClientRect();
        sg.node().appendChild(streamgraph(data, bounds.width, bounds.height));
      })

    d3.selectAll('.draggable')
      .each(function(d) {
        d3.select(this).call( drag() )
      });
  })
