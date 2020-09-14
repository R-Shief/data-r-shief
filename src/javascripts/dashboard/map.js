class Choropleth extends Viz {

  constructor() {
    this.id = "#choropleth";

    this.strategyFamilies = {
      choropleth: {
        uriExtension: 'choropleth'
      },
      hashtag: {
        uriExtension: 'htMap'
      }
    };

    let defaultOptions = {
      strategyFamily: "choropleth"
    };

    this.options = Object.assign(defaultOptions, options);

    this.refreshStrategy();

    this.svg;

  }

  refreshStrategy() {
    this.strategy = this.strategyFamilies[this.options.strategyFamily];
  }

  refresh() {

  }

  newView() {
    let g = this.svg.append("g");
    let svg d3.create("svg")
      .attr("viewBox", [0, 0, this.width, this.height]);
    return g, svg;
  }

  updateSVG() {
    return new Promise((resolve, reject) => {
      (this.g, this.svg) = (this.g, this.svg) || newView();
      this.g.selectAll("path")
        .data()
        .join();
    })
  }

  getView() {
    return this.view.node();
  }

  setOption(option, value) {
    super.setOption(option, value);
    this.refreshStrategy();
  }

}

module.exports = Choropleth;
