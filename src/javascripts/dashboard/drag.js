d3 = require('d3');

var resolution = 20;
var width = 1000;
var height = 1000;
var r = 100;

function round(p, n) {
  return p % n < n / 2 ? p - (p % n) : p + n - (p % n);
}

drag = function() {

  function dragstarted(d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(d) {
    d3.select(this)
      .style("top", ((d3.event.y) - this.offsetHeight/2)+"px")
      .style("left", ((d3.event.x) - this.offsetWidth/2)+"px")
  }

  function dragended(d) {
    gridX = round(Math.max(r, Math.min(width - r, d3.event.x)), resolution),
    gridY = round(Math.max(r, Math.min(height - r, d3.event.y)), resolution);
    console.log(gridX, gridY);
    d3.select(this)
      .attr("stroke", null)
      .style("top", (gridY)+"px")
      .style("left", (gridX)+"px");
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

module.exports = drag;