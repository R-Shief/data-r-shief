let Viz = require('./Viz.js');
let d3 = require('d3');
let {OptionButton, VizOptionBar} = require('./VizOptions.js');

class Streamgraph extends Viz {
  constructor(props) {
    super(props);

    this.strategyFamilies = {
      hashtag: {
        uriExtension: 'htStreamgraph'
      },
      language: {
        uriExtension: 'lgStreamgraph'
      }
    };

    this.state = {
      strategyFamily: "hashtag",
      width: props.bounds.width,
      height: props.bounds.height
    };

    this.svg;
    this.fetchExtension = props.fetcher;

    this.margin = {top: 0, right: 20, bottom: 70, left: 20};

    this.uriExtension = () => this.strategyFamilies[this.state.strategyFamily].uriExtension;

    this.wrapperRef = React.createRef();
    this.svgRef = React.createRef();

    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentDidMount() {
    this.live();
    this.setState({
      width: this.wrapperRef.current.offsetWidth,
      height: this.wrapperRef.current.offsetHeight
    });
    window.addEventListener('resize', () => {
      this.setState({
        width: this.wrapperRef.current.offsetWidth,
        height: this.wrapperRef.current.offsetHeight
      })
    })
  }

  live() {
    setTimeout(() => {
        if (this.props.isActive) {
          this.refresh()
            .then(() => this.live());
        } else {
          this.live();
        }
    }, 1000);
  }

  handleOptionClick(pair, e) {
    console.log("clicked");
    this.setState({[pair.name]: pair.val});
    this.props.onLoadChange({id: "streamgraph", isLoading: true});
    this.series = [];
    this.updateSVG(true)
    .then(() => this.refresh());
  }

  refresh() {
    this.setState({
      width: this.wrapperRef.current.offsetWidth,
      height: this.wrapperRef.current.offsetHeight
    });
    return new Promise((resolve, reject) => {
      this.fetchExtension(this.uriExtension(), {method: 'GET'})
      .then(data => {
        if(data.length < 10) {resolve(this); return data.length;}

        // reformat
        data = data.map(entry => ({occurrence: entry[0], hashtag: entry[1]}));

        // parse MYSQL DATETIMEs as javascript date objects.
        // const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
        data.forEach(entry => {
          entry.occurrence = new Date(entry.occurrence);
          // entry.occurrence = parseDate(entry.occurrence);
        });

        // get a list of unique hashtags
        this.uniqueHashtags = [...new Set(data.map(entry => entry.hashtag))];

        // assign each unique hashtag a color
        this.color = d3.scaleOrdinal()
          .domain(this.uniqueHashtags)
          .range(d3.schemeCategory10)

        // get the date extent of hashtag occurrences in the data
        this.dateExtent = d3.extent(data, d => d.occurrence );

        // get the numbins based on the number of data points
        this.numBins = 10 * Math.log(data.length);

        // create a ticks object to determine the number of bins
        const ticks = d3.ticks(this.dateExtent[0], this.dateExtent[1], this.numBins);

        // convert the ticks into date ticks
        const ticksAsDates = ticks.map(d => new Date(d));
        // console.log(ticksAsDates);


        // make a histogram data structure using hashtag occurrences and the date ticks
        const binned = d3.histogram()
          .value(d => d.occurrence)
          .thresholds(ticks)
          (data);

        // for every bin, add an item to data that has the bin's date and the count of each hashtag at that date. E.g. {egypt: 23, bahrain: 11, date: {some date}}
        data = binned.map((bin, idx) => {
          let ret = {date: typeof ticksAsDates[idx] == "undefined" ? new Date().setTime(ticksAsDates[idx-1].getTime() + (ticksAsDates[idx-1].getTime() - ticksAsDates[idx-2].getTime())) : ticksAsDates[idx]}
          // let ret = {date: ticksAsDates[idx]};
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
            .range([this.margin.left, this.state.width - this.margin.right])

        // create a scale object for the y axis using the min and max of the series data structure
        this.y = d3.scaleLinear()
            .domain([d3.min(this.series, d => d3.min(d, d => d[0])), d3.max(this.series, d => d3.max(d, d => d[1]))])
            .range([this.state.height - this.margin.bottom, this.margin.top])

        // create the bottom axis object and position it appropriately
        this.xAxis = g => g
          .attr("transform", `translate(0,${this.state.height - this.margin.bottom})`)
          .call(d3.axisBottom(this.x).ticks(this.state.width / 80).tickSizeOuter(0))
          // .call(g => g.select(".domain").remove())

        // .tickFormat(x => `${x.getMonth()}/${x.getDate()}/${x.getFullYear()}`)

        // create an area object
        this.area = d3.area()
            .x(d => this.x(d.data.date))
            .y0(d => this.y(d[0]))
            .y1(d => this.y(d[1]))

        this.colors = d3.map();
        this.series.forEach(({key}) => {
          this.colors.set(key, this.color(key));
        });

        // if the svg doesn't exist, create it for the first time, otherwise, just re-build the graph components (x and y scales, x axis and area objects)

        let shouldBuild = typeof this.svg == "undefined";
        this.updateSVG(shouldBuild);

        return data.length;

      })
      .then(dataLength => {
        if (dataLength > 10) this.props.onLoadChange({id: "streamgraph", isLoading: false});
        resolve(this);
      })
      .catch(err => reject(err))
    })
  }

  updateSVG(build=false) {
    return new Promise((resolve, reject) => {
      if (build) {
        this.svg = d3.select(this.svgRef.current);

        if (this.g) this.g.remove();
        this.g = this.svg.append("g");

        this.t = this.svg.transition()
          .duration(2000);

        this.bottomAxis = this.svg.append("g")
          .call(this.xAxis);

        this.line = this.svg.append("line")
          .attr("y1", 30)
          .style("stroke-width", 1)
          .style("stroke", "black")
          .style("fill", "none");

        this.lineDate = this.svg.append("text")
          .attr("y", 20);

        const dtf = new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          year: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZone: 'UTC'
        });

        this.formatDate = (date) => {
          const parts = dtf.formatToParts(date).reduce((acc, curr) => Object({...acc, [curr.type]: curr.value}), {});
          return `${parts.weekday}, ${parts.month} ${parts.day} ${parts.year} ${parts.hour}:${parts.minute} ${parts.dayPeriod}`
        };

        let scope = this;
        this.svg.on('mousemove', function() {
          const [x, y] = d3.mouse(this);

          const idx = Math.floor((x/scope.state.width)*scope.series[0].length);
          // const nonZeroData = scope.series.filter(cat => cat[idx].data[cat.key] != 0);
          const dataSelect = scope.series.sort((a, b) => b[idx].data[b.key] - a[idx].data[a.key]).slice(0, 10);
          // const tenNonZeroOr = nonZeroData.length < 10 ? nonZeroData : nonZeroData.filter(cat => cat[idx].data[cat.key] > 5);

          scope.line
            .attr("x1", x)
            .attr("x2", x)
            .attr("y2", scope.state.height - scope.margin.top - scope.margin.bottom)

          scope.lineDate
            .attr("text-anchor", "middle")
            .attr("x", x)
            .text(d => scope.formatDate(scope.series[0][idx].data.date))

          const circleSpacing = (scope.state.height - scope.margin.top - scope.margin.bottom) / dataSelect.length;
          const marginT = circleSpacing / 2;

          scope.svg.selectAll("circle")
            .data(dataSelect)
            .join(
              enter => enter.append("circle")
                .attr("cx", 10)
                .attr("cy", (d, i) => i * circleSpacing + marginT)
                .attr("r", 10)
                .style("fill", ({key}) => scope.colors.get(key)),
              update => update
                .attr("cy", (d, i) => i * circleSpacing + marginT)
                .style("fill", ({key}) => scope.colors.get(key)),
              exit => exit.remove()
            );

          scope.svg.selectAll("text.legend")
            .data(dataSelect)
            .join(
              enter => enter.append("text")
                .classed('legend', true)
                .attr("x", 25)
                .attr("y", (d, i) => i * circleSpacing + marginT)
                .text(d => `${d.key} ${d[idx].data[d.key]}`),
              update => update
                .attr("y", (d, i) => i * circleSpacing + marginT + 5)
                .text(d => `${d.key} ${d[idx].data[d.key]}`),
              exit => exit.remove()
            );

        })

      }

      this.g.selectAll("path")
        .data(this.series)
        .join(
          enter => enter.append("path")
            .attr("fill", ({key}) => this.colors.get(key))
            .attr("d", (d) => this.area(d))
            .append("title")
              .text(({key}) => key),
          update => update.transition(this.t)
            .attr("fill", ({key}) => this.colors.get(key))
            .attr("d", (d) => this.area(d)),
          exit => exit.remove().selectAll("title").remove()
        );

      this.bottomAxis
        .transition(this.t)
        .call(this.xAxis);

      resolve();
    });
  }

  render() {
    // const OptionButton = (props) => (
    //   <a className={"nav-link" + ((props.isActive) ? " active" : "")} id="hashtagStreamgraph" onClick={this.handleOptionClick.bind(this, {name: props.name, val: props.val})}>{props.label}</a>
    // );

    return (
      <div ref={this.wrapperRef} id="streamgraph" className="d-flex flex-column" style={{height: "100%"}}>
        <VizOptionBar id="streamgraph-options">
          <OptionButton isActive={this.state.strategyFamily=="hashtag"} name="strategyFamily" val="hashtag" onClick={this.handleOptionClick} label="By Hashtag" />
          <OptionButton isActive={this.state.strategyFamily=="language"} name="strategyFamily" val="language" onClick={this.handleOptionClick} label="By Language" />
        </VizOptionBar>
        <svg ref={this.svgRef} className="flex-grow-1" style={{width: "100%"}}></svg>
      </div>
    );
  }
}

// viewBox={`0 0 ${this.state.width} ${this.state.height}`}

Streamgraph.info = {
  id: "streamgraph",
  name: "Streamgraph"
};

module.exports = Streamgraph;
