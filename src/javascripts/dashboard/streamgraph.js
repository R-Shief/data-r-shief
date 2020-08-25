// This code is inspired by Mike Bostock's https://observablehq.com/@d3/streamgraph

d3 = require('d3');
Viz = require('./viz.js');

class Streamgraph extends Viz {

  constructor(w, h, b=20) {

    super(w, h);
    this.margin = {top: 0, right: 20, bottom: 30, left: 20};
    this.numBins = b;

  }

  setData(data) {
    // parse JSON and throw away metadata
    data = JSON.parse(data)[0];

    // parse MYSQL DATETIMEs as javascript date objects.
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    data.forEach(entry => {
      entry.occurrence = parseDate(entry.occurrence);
    });

    // get a list of unique hashtags
    this.uniqueHashtags = [...new Set(data.map(entry => entry.hashtag))];

    // assign each unique hashtag a color
    this.color = d3.scaleOrdinal()
      .domain(this.uniqueHashtags)
      .range(d3.schemeCategory10)

    // get the date extent of hashtag occurrences in the data
    this.dateExtent = d3.extent(data, d => d.occurrence );

    // create a ticks object to determine the number of bins
    const ticks = d3.ticks(this.dateExtent[0], this.dateExtent[1], this.numBins);

    // convert the ticks into date ticks
    const ticksAsDates = ticks.map(d => new Date(d));

    // make a histogram data structure using hashtag occurrences and the date ticks
    const binned = d3.histogram()
      .value(d => d.occurrence)
      .thresholds(ticks)
      (data);

    // for every bin, add an item to data that has the bin's date and the count of each hashtag at that date. E.g. {egypt: 23, bahrain: 11, date: {some date}}
    data = binned.map((bin, idx) => {
      let ret = {date: ticksAsDates[idx]};
      this.uniqueHashtags.map( ht => ({[ht]: bin.filter(occurrence => occurrence.hashtag === ht).length}) ).forEach(d => Object.assign(ret, d));
      return ret;
    });

    // create a stacked (streamgraph-y) time series data structure out of the data
    this.series = d3.stack()
    .keys(this.uniqueHashtags)
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderNone)
    (data);

    // create a scale object for x values according to UTC time using dateExtent
    this.x = d3.scaleUtc()
        .domain(this.dateExtent)
        .range([this.margin.left, this.width - this.margin.right])

    // create a scale object for the y axis using the min and max of the series data structure
    this.y = d3.scaleLinear()
        .domain([d3.min(this.series, d => d3.min(d, d => d[0])), d3.max(this.series, d => d3.max(d, d => d[1]))])
        .range([this.height - this.margin.bottom, this.margin.top])

    // create the bottom axis object and position it appropriately
    this.xAxis = g => g
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove())

    // create an area object
    this.area = d3.area()
        .x(d => this.x(d.data.date))
        .y0(d => this.y(d[0]))
        .y1(d => this.y(d[1]))

    // if the svg doesn't exist, create it for the first time, otherwise, just re-build the graph components (x and y scales, x axis and area objects)
    if (typeof this.svg == "undefined") {this.svg = this.buildSVG();} else { this.refresh(); }
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

  refresh() {
    console.log("Trying to refresh streamgraph.");
    this.svg.selectAll('path')
      .data(this.series)
      .transition()
        .delay(1000)
        .duration(1500)
        .attr("fill", ({key}) => this.color(key))
        .attr("d", this.area);
  }
};

module.exports = Streamgraph;
