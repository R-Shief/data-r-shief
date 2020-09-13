let FilterManager = require('./filterManager.js');
let Streamgraph = require('./streamgraph.js');
let Rankings = require('./rankings.js');

module.exports = function Dash(options) {
  this.vizClasses = [Streamgraph, Rankings];
  this.options = options;
  let bounds = {width: 947, height: 440};

  let vizGets = () => this.vizs.map(viz => viz.refresh());

  this.populate = function() {
    return new Promise((resolve, reject) =>
      Promise.resolve()
      .then(_ => {
        console.log(this.filterManager.getURLWithFilters());
        return fetch(this.filterManager.getURLWithFilters(), {method: 'PUT'})
      })
      .then(_ => Promise.all(vizGets()))
      .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
        this.filterManager.dataPage++;
        resolve(this.populate());
      })
      .catch(failure => reject(failure))
    ).catch(failure => console.log(failure));
  }.bind(this)


  return new Promise((resolve, reject) => {
    Promise.resolve()
    .then(_ => this.filterManager = new FilterManager(this, this.options))
    .then(_ => {
      console.log(this.filterManager.getURLWithFilters());
      return fetch(this.filterManager.getURLWithFilters(), {method: 'PUT'})
    })
    .then(_ => Promise.all(
      this.vizClasses.map(vizClass => new Promise((resolve, reject) => {
        Promise.resolve()
        .then(_ => new vizClass({width: bounds.width, height: bounds.height, filterManager: this.filterManager}))
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
