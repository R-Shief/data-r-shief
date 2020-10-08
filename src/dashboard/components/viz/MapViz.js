let Viz = require('./Viz.js');
let d3 = require('d3');
let {OptionButton, VizOptionBar} = require('./VizOptions.js');
// let PHPUnserialize = require('php-unserialize');
let {unserialize} = require('php-serialize');

class MapViz extends Viz {

  constructor(props) {
    super(props);

    this.strategyFamilies = {
      choropleth: {
        uriExtension: 'choropleth'
      },
      hashtag: {
        uriExtension: 'htMap'
      }
    };

    this.state = {
      strategyFamily: "choropleth",
      strategy: this.strategyFamilies["choropleth"],
      width: props.bounds.width,
      height: props.bounds.height
    };

    this.refreshStrategy = this.refreshStrategy.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.build = this.build.bind(this);
    this.live = this.live.bind(this);

    this.svgRef = React.createRef();
    this.wrapperRef = React.createRef();
    this.tooltipRef = React.createRef();

    this.svg = d3.select(this.svgRef.current);
  }

  componentDidMount() {
    this.build();
    this.live();
    this.setState({
      width: this.wrapperRef.current.offsetWidth,
      height: this.wrapperRef.current.offsetHeight
    });
    window.addEventListener('resize', () => {
      this.setState({
        width: this.wrapperRef.current.offsetWidth,
        height: this.wrapperRef.current.offsetHeight
      });
    })
  }

  live() {
    setTimeout(() => {
        if (this.props.isActive) {
          this.updateSVG()
            .then(() => {this.props.onLoadChange({id: "mapViz", isLoading: false})})
            .then(() => this.live());
        } else {
          this.live();
        }
    }, 1000);
  }

  refreshStrategy() {
    this.setState({strategy: this.strategyFamilies[this.state.strategyFamily]});
  }

  build() {
    return fetch('/data/world.geojson')
      .then(data => data.json())
      .then(topo => this.topo = topo)
      .then(() => this.updateSVG(true))
  }

  updateSVG(build=false) {
    return this.props.fetcher(this.state.strategy.uriExtension)
      .then(rawData => {
        if (build) {
          this.svg = d3.select(this.svgRef.current);
          if (this.g) this.g.remove();
          this.g = this.svg.append("g");

          this.projection = d3.geoMercator()
            .scale(110)
            .center([-200, 50])
            // .translate([this.state.width/2, this.state.height/2]);

          this.tooltipDiv = d3.select(this.tooltipRef.current)
            .style("opacity", 0);

          const zoomed = () => {
            this.g
              .selectAll('path')
              .attr('transform', d3.event.transform);

            const mapRange = (val, in_min, in_max, out_min, out_max) => (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            var val = mapRange(d3.event.transform.k, 1.0, 9.0, 0.0, 1.0);
            var powval = Math.pow(val, 1/20);
            const fontScale = mapRange(powval, 0.0, 1.0, 0.8, 0.1) + "rem";
            // console.log([d3.event.transform.k, val, powval, fontScale].join(", "));

            this.g
              .selectAll("text.legend")
              .attr('transform', d3.event.transform)
              .style('font-size', fontScale);

            this.showIDs = this.IDs.slice(0, Math.floor(mapRange(Math.pow(mapRange(d3.event.transform.k, 1.0, 9.0, 0.0, 1.0), 1/10), 0.0, 1.0, 40.0, this.IDs.length))).map(d => d.id);
            this.g.selectAll("text.legend")
              .style("visibility", d => this.showIDs.includes(d.id) ? "visible" : "hidden");

          }

          this.zoom = d3.zoom()
            .scaleExtent([1, 9])
            .on('zoom', zoomed);

          const polyProject = (obj) => {
            if (obj.length != 2) {
              return obj.map(polyProject);
            } else {
              // console.log(obj);
              return this.projection(obj);
            }
          }

          const polyArea = (obj) => {
            let ret, which;
            if (obj.some(child => child.length != 2)) {
              ret = obj.reduce((acc, curr) => acc + polyArea(curr), 0);
              which = "a"
            } else {
              ret = d3.polygonArea(obj);
              which = "b"
            }
            // console.log(which + ": " + ret);
            return ret;
          }

          this.topo.projectedFeatures = this.topo.features.map(feature => ({poly: feature.geometry.coordinates.map(polyProject), id: feature.id, area: feature.geometry.coordinates.map(polyArea)}));
          this.IDs = this.topo.projectedFeatures.map(feature => ({id: feature.id, area: feature.area[0]}));
          // console.log(this.IDs);
          this.IDs.sort((a, b) => b.area-a.area);
          this.showIDs = this.IDs.slice(0, 20).map(d => d.id);
          // console.log(this.IDs);

          this.t = this.svg.transition()
            .duration(2000);
        }

        this.svg.call(this.zoom);

        this.projection = d3.geoMercator()
          .scale(110)
          .center([-200, 50])
          // .translate([this.state.width/2, this.state.height/2]);

        const unserialized = rawData.map(d => unserialize(d[0], {}).coordinates.map(c => Math.abs(c)));

        let data = d3.map();
        const doesContain = (poly, coord) => {
          if (poly.some(child => child.length != 2)) {
            return poly.some(child => doesContain(child, coord));
          } else {
            // console.log(poly, coord);
            return d3.polygonContains(poly, coord);
          }
        }
        this.topo.projectedFeatures.forEach(feature => {
          const poly = feature.poly;
          const count = unserialized.filter(coord => {
            const dc = doesContain(poly, this.projection(coord));
            // if (dc) console.log([feature.id, coord, dc].join(", "));
            return dc;
          }).length;
          // console.log(count);
          data.set(feature.id, {count: count, area: feature.area})
        });

        // console.log(this.topo);

        // console.log(data);

        const numBins = 7;

        const extent = d3.extent(data.values().map(d => d.count));
        const extentRange = extent[1] - extent[0];
        const step = extentRange / numBins;
        const range = d3.range(...extent, step).map((i) => i == 0 ? 0 : Math.log(i));
        // console.log([extent, extentRange, step, range].join(" : "));
        const colorScale = d3.scaleThreshold()
          .domain(range)
          .range(d3.schemeBlues[numBins]);

        const mapPath = d3.geoPath()
          .projection(this.projection);

        this.g.selectAll("path")
          .data(this.topo.features)
          .join(
            enter => {
              enter.append("path")
                .attr("d", mapPath)
                .attr("fill", function(d) {
                  d.total = data.get(d.id).count || 0;
                  return colorScale(d.total);
                })
                .on("mouseover", (d) => {
                  this.tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                  this.tooltipDiv.html(`${d.properties.name}: ${d.total || 0}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 200) + "px")
                })
                .on("mouseout", (d) => {
                  this.tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 0);
                })
              enter.append("text")
                .classed("legend", true)
                .attr("text-anchor", "middle")
                .attr("x", d => mapPath.centroid(d)[0])
                .attr("y", d => mapPath.centroid(d)[1])
                .text(d => d.properties.name)
                .style("font-size", ".5rem");
            },
            update => {
              update.transition(this.t)
              .attr("fill", function(d) {
                d.total = data.get(d.id).count || 0;
                return colorScale(d.total);
              });
            }
          );

        // console.log(this.showIDs);

      this.g.selectAll("text.legend")
        .classed("legend", true)
        .attr("x", d => mapPath.centroid(d)[0])
        .attr("y", d => mapPath.centroid(d)[1])
        .text(d => {
          return d.properties.name;
        })

    })
  }

  setOption(option, value) {
    super.setOption(option, value);
    this.refreshStrategy();
  }

  handleOptionClick(pair, e) {
    console.log("clicked");
    this.setState({[pair.name]: pair.val});
    this.refreshStrategy();
    this.props.onLoadChange({id: "mapViz", isLoading: true});
    this.updateSVG(true);
  }

  render() {
    const tooltipStyle = {
      backgroundColor: "#414141",
      color: "#E1E2E1"
    };
    return (
      <div id="mapViz" ref={this.wrapperRef} className="d-flex flex-column" style={{height: "100%"}}>
        <svg ref={this.svgRef} className="flex-grow-1" style={{width: "100%"}}></svg>
        <div className="tooltip px-1 rounded border" ref={this.tooltipRef} style={tooltipStyle}></div>
      </div>
    );
  }
  // viewBox={`0 0 ${this.state.width} ${this.state.height}`}

  // style={{flexGrow: 1, width: "100%", height: "100%"}}

  // <VizOptionBar id="mapViz-options">
  //   <OptionButton isActive={this.state.strategyFamily=="choropleth"} name="strategyFamily" val="choropleth" onClick={this.handleOptionClick} label="Country Choropleth" />
  //   <OptionButton isActive={this.state.strategyFamily=="hashtag"} name="strategyFamily" val="hashtag" onClick={this.handleOptionClick} label="Hashtag Bubbles" />
  // </VizOptionBar>

}

MapViz.info = {
  id: "mapViz",
  name: "Map"
};

module.exports = MapViz;
