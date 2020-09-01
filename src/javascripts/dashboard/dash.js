module.exports = function Dash(options) {
  this.dataPage = 0;
  this.options = options;
  this.vizs = this.options.vizs; // filled with objects of type { elem: {some elem}, class: Streamgraph }

  // add event listeners for filter options
  let scope = this;
  this.filters = {};
  this.options.filters.forEach(pair => {
    scope.filters[pair.fkey] = pair.default;

    switch (pair.type) {
      case "checkbox":
        $(pair.id).change(function() {
          scope.filters[pair.fkey] = $(this).find("input:checked").toArray().map(elem => elem.value);
          if(scope.filters[pair.fkey].length < 1) { scope.filters[pair.fkey] = ["*"] }
        });
        break;
      case "textbox":
        $(pair.id).change(function() {
          let val = $(this).first("input").val()
          scope.filters[pair.fkey] = val != "" ? val : "*";
        });
        break;
      case "datebox":
        $(pair.id).change(function() {
          scope.filters[pair.fkey] = new Date($(this).first("input").val()).toISOString().substring(0, 10);
        })
    }
  });

  // add event listener to enable button when any change has occurred
  $(this.options.filterBar.id).find("input").change(() => {
    console.log(this.filters);
    $(this.options.filterBar.goButton.id).attr("disabled", false);
  })

  // add event listener to reset data populating upon clicking the enabled button
  $(this.options.filterBar.goButton.id).click(function () {
    if (!$(this).prop("disabled")) {
      scope.dataPage = 0;
      scope.populate(false);
      $(this).attr("disabled", true);
    }
  })

  this.populate = function(build=true) {
    new Promise(_ => {
      let url = this.getURLWithFilters();
      // window.history.pushState({}, "", url);
      fetch(url, {method: 'PUT'});
    })
    .then(_ => this.vizs.foreach(pair => {
      new Promise(_ => {
        // get element bounds
        let bounds = pair.elem.getBoundingClientRect();
        // get the data from the server
        console.log(pair);
        let data = fetch(`${this.getURLWithFilters()}/${pair.uriExtension}`, {method: 'GET'}).then(response => response.json());
        // and associate these to this dash object's representation of the viz
        Object.assign(pair, {bounds: bounds, data: data})
      })
      .then(_ => Object.assign(pair, {viz: new pair.class(pair.bounds.width, pair.bounds.height)})) // get a viz object of the class provided
      .then(_ => pair.viz.setData(pair.data)) // set the viz object's data, which implicitly refreshes the view
      .then(_ => {if (build) { // if this is our first time doing this, then clear the div and put in the view instead
        pair.elem.innerHTML = '';
        pair.elem.appendChild(viz.getView())};
      })
    }))
    .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
      this.dataPage++;
      this.populate(false);
    })
    .catch(failure => console.log(failure));
  }.bind(this)

  this.getURLWithFilters = function() {
    // return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.hashtags}/${this.filters.usernames}/${this.filters.keywords}/${this.dataPage}`;
    return [window.location.href, ...Object.values(this.filters), this.dataPage].join("/");
  }.bind(this)
};
