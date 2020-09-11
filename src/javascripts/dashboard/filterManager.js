module.exports = function FilterManager(dash, options) {
  let scope = this;
  this.filters = {};
  this.dataPage = 0;
  this.dash = dash;
  this.options = options;

  // add event listeners for filter options
  this.options.filterBar.filters.forEach(pair => {
    scope.filters[pair.fkey] = pair.default;

    switch (pair.type) {
      case "checkbox":
        $(pair.id).change(function() {
          scope.filters[pair.fkey] = $(this).find("input:checked").toArray().map(elem => elem.value);
          if(scope.filters[pair.fkey].length < 1) { scope.filters[pair.fkey] = ["*"] }
        });
        break;
      case "textbox":
        $(pair.id).val(pair.default == "*" ? "" : pair.default);
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
      scope.dash.populate();
      $(this).attr("disabled", true);

      if (scope.options.filterBar.hasOwnProperty('clippable')) {
        $(scope.options.filterBar.clippable.id).val(scope.getURLWithFilters(scope.filters));
      }
    }
  })

  this.getURLWithFilters = function() {
    // return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.hashtags}/${this.filters.usernames}/${this.filters.keywords}/${this.dataPage}`;
    return [window.location.href, ...Object.values(this.filters), this.dataPage].join("/");
  }
}
