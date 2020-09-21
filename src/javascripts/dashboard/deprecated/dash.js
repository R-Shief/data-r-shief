let FilterManager = require('./filterManager.js');
let Streamgraph = require('./viz/streamgraph.js');
let Rankings = require('./viz/rankings.js');

module.exports = function Dash(options) {
  this.vizClasses = [Streamgraph, Rankings];
  this.options = options;
  let bounds = {width: 960, height: 350};

  this.info = {
    sampleCount: 0,
    sampleMethod: 'randomly'
  }

  // set defaults for info bar
  this.options.infoBar.forEach(field => {
    $(field.id).text(field.default);
  })

  let vizGets = () => this.vizs.map(viz => viz.refresh());

  this.populate = function() {
    return new Promise((resolve, reject) =>
      Promise.all( vizGets().concat(this.put()) )
      .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
        this.filterManager.dataPage++;
        resolve(this.populate());
      })
      .catch(failure => reject(failure))
    ).catch(failure => console.log(failure));
  }.bind(this)

  let updateInfoBar = () => {
      this.options.infoBar.forEach(field => {
        let val = this.info[field.infoKey];
        val = typeof val == "number" ? Number(val).toLocaleString() : val;
        $(field.id).text(val);
      })
  }

  this.fetchExtension = function(extension, options) {
    return fetch(`${this.filterManager.getURLWithFilters()}/${extension}`, options)
      .then(response => response.json())
      .then(json => JSON.parse(json))
      .then(data => {
        this.info.sampleCount += typeof data.length == "number" ? data.length : this.info.sampleCount;
        updateInfoBar();
        return data;
      })
  }

  this.put = () => fetch(this.filterManager.getURLWithFilters(), {method: 'PUT'})

  return new Promise((resolve, reject) => {
    Promise.resolve()
    .then(_ => this.filterManager = new FilterManager(this, this.options))
    .then(_ => this.put())
    .then(_ => Promise.all(
      this.vizClasses.map(vizClass => new Promise((resolve, reject) => {
        Promise.resolve()
        .then(_ => new vizClass({width: bounds.width, height: bounds.height, dash: this}))
        .then(viz => viz.refresh())
        .then(viz => {
          $(viz.id)[0].innerHTML = '';
          $(viz.id)[0].appendChild(viz.getView());
          resolve(viz);
        })
      }))
    ))
    .then(vizs => {
      this.vizs = vizs;
      resolve(this);
    })
  });
};
