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
  if (this.options.filterBar.hasOwnProperty('clippable')) { $(this.options.filterBar.clippable.id).val(window.location.hostname + "/dashboard" + this.options.filterBar.clippable.default); }
  $(this.options.filterBar.goButton.id).click(function () {
    if (!$(this).prop("disabled")) {
      scope.dataPage = 0;
      scope.populate(false);
      $(this).attr("disabled", true);

      if (scope.options.filterBar.hasOwnProperty('clippable')) {
        $(scope.options.filterBar.clippable.id).val(scope.getURLWithFilters());
      }
    }
  })

  this.populate = function(build=true) {

    let vizGets = () => this.vizs.map(pair => new Promise(_ => {
      // let bounds = $(pair.id)[0].getBoundingClientRect();
      let bounds = {width: 947, height: 450};
      console.log(bounds);
      Promise.resolve()
      .then(_ => {
        return fetch(`${this.getURLWithFilters()}/${pair.uriExtension}`, {method: 'GET'});
      }) // get the data from the server
      .then(response => response.json())
      .then(data => {
        return Object.assign(pair, {bounds: bounds, data: data});
      })
      .then(_ => Object.assign(pair, {viz: new this.vizClasses[pair.classKey](pair.bounds.width, pair.bounds.height)})) // get a viz object of the class provided
      .then(_ => pair.viz.setData(pair.data)) // set the viz object's data, which implicitly refreshes the view
      .then(_ => {if (build) { // if this is our first time doing this, then clear the div and put in the view instead
        $(pair.id)[0].innerHTML = '';
        $(pair.id)[0].appendChild(pair.viz.getView().node())};
      })
      .catch(err => console.log(err))

    }));

    Promise.resolve()
    .then(_ => this.getURLWithFilters())
    .then(url => {console.log(url); return url})
    .then(url => fetch(url, {method: 'PUT'}))
    .then(_ => Promise.all(vizGets()))
    .then(_ => { // now up the page count once and do it all again, this time with 'build' set to false
      this.dataPage++;
      this.populate(false);
    })
    .catch(failure => console.log(failure));
  }.bind(this)

  this.getURLWithFilters = function() {
    // return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.hashtags}/${this.filters.usernames}/${this.filters.keywords}/${this.dataPage}`;
    return [window.location.hostname, "dashboard", ...Object.values(this.filters), this.dataPage].join("/");
  }.bind(this)
};
