// This code is directly copied from Mike Bostock's https://observablehq.com/@d3/streamgraph

d3 = require('d3');

class Streamgraph {

  constructor(d, w, h) {
    this.width = w;
    this.height = h;

    this.uniqueHashtags;
    this.dateExtent;
    this.margin = {top: 0, right: 20, bottom: 30, left: 20};

    this.series;
    this.setSeriesWith(d);

    this.xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove())

    this.color = d3.scaleOrdinal()
      .domain(this.uniqueHashtags)
      .range(d3.schemeCategory10)

    this.y = d3.scaleLinear()
        .domain([d3.min(this.series, d => d3.min(d, d => d[0])), d3.max(this.series, d => d3.max(d, d => d[1]))])
        .range([this.height - this.margin.bottom, this.margin.top])

    this.x = d3.scaleUtc()
        .domain(this.dateExtent)
        .range([this.margin.left, this.width - this.margin.right])

    this.area = d3.area()
        .x(d => this.x(d.data.date))
        .y0(d => this.y(d[0]))
        .y1(d => this.y(d[1]))

    this.svg = this.buildSVG();

  }

  setSeriesWith(data) {
    // parse JSON and throw away metadata
    data = JSON.parse(data)[0];

    // parse MYSQL DATETIMEs as javascript date objects.
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

    data.forEach(entry => {
      entry.occurrence = parseDate(entry.occurrence);
    });

    this.uniqueHashtags = [...new Set(data.map(entry => entry.hashtag))];

    this.dateExtent = d3.extent(data, d => d.occurrence );

    const ticks = d3.ticks(this.dateExtent[0], this.dateExtent[1], 20);

    const ticksAsDates = ticks.map(d => new Date(d));

    const binned = d3.histogram()
      .value(d => d.occurrence)
      .thresholds(ticks)
      (data);

    data = binned.map((bin, idx) => {
      let ret = {date: ticksAsDates[idx]};
      this.uniqueHashtags.map( ht => ({[ht]: bin.filter(occurrence => occurrence.hashtag === ht).length}) ).forEach(d => Object.assign(ret, d));
      return ret;
    });

    this.series = d3.stack()
    .keys(this.uniqueHashtags)
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderNone)
    (data);
  }

  buildSVG() {
    svg = d3.create("svg")
        .attr("viewBox", [0, 0, this.width, this.height]);

    svg.append("g")
      .selectAll("path")
      .data(this.series)
      .join("path")
        .attr("fill", ({key}) => this.color(key))
        .attr("d", this.area)
      .append("title")
        .text(({key}) => key);

    svg.append("g")
        .call(this.xAxis);

    return svg;
  }

  refreshStreamgraph(svgToChange, data) {
    console.log("Trying to refresh streamgraph.");

    this.setSeriesWith(data);
    // console.log(data);
    svgToChange.selectAll('path')
      .data(this.series)
      .transition()
        .delay(1000)
        .duration(1500)
        .attr("d", this.area);
  }
};

module.exports = Streamgraph;
