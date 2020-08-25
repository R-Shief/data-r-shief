// Functions here largely copied from Mike Bostock's https://observablehq.com/@d3/zoomable-circle-packing

d3 = require('d3');
Viz = require('./viz.js');

class UserPacking extends Viz {

  constructor(w, h) {
    super(w, h);

    this.color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl)

    this.format = d3.format(",d")
  }

  setData(data) {
    let scope = this;

    let pack = data => d3.pack()
        .size([scope.width, scope.height])
        .padding(3)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a,b) => b.value - a.value))

    this.root = pack(data);
    this.focus = root;
    this.view;

    this.svg = d3.create("svg")
        .attr("viewBox", `-${scope.width / 2} -${scope.height / 2} ${scope.width} ${scope.height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", color(0))
        .style("cursor", "pointer")
        .on("click", () => scope.zoom(scope.root));

    this.node = this.svg.append("g")
      .selectAll("circle")
      .call(drag)
      .data(scope.root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? scope.color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", d => scope.focus !== d && (scope.zoom(d), d3.event.stopPropagation()));

    this.label = this.svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(scope.root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === scope.root ? 1 : 0)
        .style("display", d => d.parent === scope.root ? "inline" : "none")
        .text(d => d.data.name);

    this.zoomTo([scope.root.x, scope.root.y, scope.root.r * 2]);
  }

  zoomTo(v) {
    const k = this.width / v[2];

    view = v;

    this.label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    this.node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    this.node.attr("r", d => d.r * k);
  }

  zoom(d) {
    let scope = this;
    const focus0 = scope.focus;

    scope.focus = d;

    const transition = this.svg.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(scope.view, [scope.focus.x, scope.focus.y, scope.focus.r * 2]);
          return t => zoomTo(i(t));
        });

    this.label
      .filter(function(d) { return d.parent === scope.focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === scope.focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === scope.focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== scope.focus) this.style.display = "none"; });
  }
};

module.exports = UserPacking;
