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
            .scale(70)
            .center([0, 20])
            // .translate([this.state.width/2, this.state.height/2]);

          const zoomed = () => this.g
            .selectAll('path')
            .attr('transform', d3.event.transform);

          this.zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', zoomed);

          const polyProject = (obj) => {
            if (obj.length != 2) {
              return obj.map(polyProject);
            } else {
              // console.log(obj);
              return this.projection(obj);
            }
          }
          this.topo.projectedFeatures = this.topo.features.map(feature => ({poly: feature.geometry.coordinates.map(polyProject), id: feature.id}));

          this.t = this.svg.transition()
            .duration(2000);
        }

        this.svg.call(this.zoom);

        this.projection = d3.geoMercator()
          .scale(70)
          .center([0, 20])
          // .translate([this.state.width/2, this.state.height/2]);

        const unserialized = rawData.map(d => unserialize(d[0], {}).coordinates.map(c => Math.abs(c)));

        let data = d3.map();
        const doesContain = (poly, coord) => {
          if (poly.some(child => child.length != 2)) {
            return poly.some(child => doesContain(child, coord));
          } else {
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
          data.set(feature.id, count)
        });

        // console.log(this.topo);

        // console.log(data);

        const numBins = 7;

        const extent = d3.extent(data.values());
        const extentRange = extent[1] - extent[0];
        const step = extentRange / numBins;
        const range = d3.range(...extent, step).map((i) => i == 0 ? 0 : Math.log(i));
        // console.log([extent, extentRange, step, range].join(" : "));
        const colorScale = d3.scaleThreshold()
          .domain(range)
          .range(d3.schemeBlues[numBins]);

        this.g.selectAll("path")
          .data(this.topo.features)
          .join(
            enter => enter.append("path")
              .attr("d", d3.geoPath()
                .projection(this.projection)
              )
              .attr("fill", function(d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
              })
              .append("title")
                .text(d => `${d.properties.name}: ${data.get(d.id) || 0}`),
            update => {
              update.transition(this.t)
              .attr("fill", function(d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
              });
              update.select("title")
              .transition(this.t)
                .text(d => `${d.properties.name}: ${data.get(d.id) || 0}`)
            }
          );
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
    return (
      <div id="mapViz" ref={this.wrapperRef} className="d-flex flex-column" style={{height: "100%"}}>
        <svg ref={this.svgRef} className="flex-grow-1" style={{width: "100%"}}></svg>
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
