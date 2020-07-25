// This code is directly copied from Mike Bostock's https://observablehq.com/@d3/streamgraph

d3 = require('d3');

streamgraph = function(data, width, height) {

  let margin = {top: 0, right: 20, bottom: 30, left: 20};

  series = d3.stack()
      .keys(data.columns.slice(1))
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut)
    (data)

  console.log(series);

  xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

  color = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(d3.schemeCategory10)

  y = d3.scaleLinear()
      .domain([d3.min(series, d => d3.min(d, d => d[0])), d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height - margin.bottom, margin.top])

  x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right])

  area = d3.area()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(key))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);

  svg.append("g")
      .call(xAxis);

  return svg.node();
};

module.exports = streamgraph;
