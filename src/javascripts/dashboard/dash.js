module.exports = function Dash(options, vizClasses) {
  this.dataPage = 0;
  this.options = options;
  this.vizs = this.options.vizs; // filled with objects of type { elem: {some elem}, class: Streamgraph }
  this.vizClasses = vizClasses;

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
          console.log($(this).first("input").val());
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
  if (this.options.filterBar.hasOwnProperty('clippable')) { $(this.options.filterBar.clippable.id).val(document.location.href + this.options.filterBar.clippable.default); } // if there is a clippable, set its default value
  $(this.options.filterBar.goButton.id).click(function () {
    if (!$(this).prop("disabled")) {
      scope.dataPage = 0;
      scope.populate();
      $(this).attr("disabled", true);

      if (scope.options.filterBar.hasOwnProperty('clippable')) {
        $(scope.options.filterBar.clippable.id).val(scope.getURLWithFilters());
      }
    }
  })

  this.getViz = function(pair) {
    let bounds = {width: 947, height: 450};
    if (!pair.viz) {
      return new Promise((resolve, reject) => {
        Promise.resolve()
        .then(_ => Object.assign(pair, {bounds: bounds}))
        .then(_ => Object.assign(pair, {viz: new this.vizClasses[pair.classKey](pair.bounds.width, pair.bounds.height)}))
        .then(_ => pair.viz.setData(pair.data)) // set the viz object's data, which implicitly refreshes the view
        .then(_ => {
          $(pair.id)[0].innerHTML = '';
          $(pair.id)[0].appendChild(pair.viz.getView().node());
        })
        .then(_ => resolve(pair.viz));
      });
    } else {
      return new Promise((resolve, reject) => {
        Promise.resolve()
        .then(_ => pair.viz.setData(pair.data)) // set the viz object's data, which implicitly refreshes the view
        .then(_ => resolve(pair.viz));
      });
    }
  }.bind(this)

  let vizGets = () => this.vizs.map((pair, idx) => new Promise((resolve, reject) => {
    // let bounds = $(pair.id)[0].getBoundingClientRect();
    Promise.resolve()
    .then(_ => {
      return fetch(`${this.getURLWithFilters()}/${pair.uriExtension}`, {method: 'GET'});
    }) // get the data from the server
    .then(response => response.json())
    .then(data => {
      return Object.assign(pair, {data: data});
    })
    .then(_ => resolve(this.getViz(pair)))
    .catch(err => console.log(err))

  }));

  this.populate = function() {
    return new Promise(_ => Promise.resolve()
    .then(_ => this.getURLWithFilters())
    .then(url => {console.log(url); return url})
    .then(url => fetch(url, {method: 'PUT'}))
    .then(_ => Promise.all(vizGets()))
    .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
      this.dataPage++;
      this.populate();
    })
    .catch(failure => console.log(failure)));
  }.bind(this)

  this.getURLWithFilters = function() {
    // return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.hashtags}/${this.filters.usernames}/${this.filters.keywords}/${this.dataPage}`;
    return [window.location.href, ...Object.values(this.filters), this.dataPage].join("/");
  }.bind(this)
};
