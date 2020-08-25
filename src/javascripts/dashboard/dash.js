let dash = {
  filters: {
    langList: ["ar","en","fr"],
    startDate: "2011-12-12",
    endDate: "2013-12-12",
    keywords: "*",
    page: 0
  },

  vizs: [], // filled with objects of type { elem: {some elem}, class: Streamgraph }

  populate: function(build=true) {
    // update the session data with more entries
    new Promise(_ => {
      let url = dash.getURLWithFilters();
      // window.history.pushState({}, "", url);
      fetch(url, {method: 'PUT'});
    })
    .then(_ => dash.vizs.foreach(pair =>
      new Promise(_ => {
        // get element bounds
        let bounds = pair.elem.getBoundingClientRect();
        // get the data from the server
        let data = fetch(`${dash.getURLWithFilters()}/${pair.uriExtension}`, {method: 'GET'}).then(response => response.json());
        // and associate these to this dash object's representation of the viz
        Object.assign(pair, {bounds: bounds, data: data})
      })
      .then(_ => Object.assign(pair, {viz: new pair.class(pair.bounds.width, pair.bounds.height)})) // get a viz object of the class provided
      .then(_ => pair.viz.setData(pair.data)) // set the viz object's data, which implicitly refreshes the view
      .then(_ => {if (build) { // if this is our first time doing this, then clear the div and put in the view instead
        pair.elem.innerHTML = '';
        pair.elem.appendChild(viz.getView())};
      })
    ))
    .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
      this.filters.page++;
      this.populate(false);
    })
    .catch(failure => console.log(failure));
  },

  getURLWithFilters: function() {
    return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.keywords}/${this.filters.page}`;
  }
};

module.exports = dash;
