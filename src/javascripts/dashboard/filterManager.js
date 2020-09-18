let SearchDropdown = require('./components/SearchDropdown.js');

module.exports = function FilterManager(dash, options) {
  let scope = this;
  this.filters = {};
  this.dataPage = 0;
  this.dash = dash;
  this.options = options;

  this.getURLWithFilters = function() {
    // return `${window.location.href}/${this.filters.langList}/${this.filters.startDate}/${this.filters.endDate}/${this.filters.hashtags}/${this.filters.usernames}/${this.filters.keywords}/${this.dataPage}`;
    return [window.location.href, ...Object.values(this.filters), this.dataPage].join("/");
  }

  // add event listeners for filter options
  this.options.filterBar.filters.forEach(pair => {
    scope.filters[pair.fkey] = pair.default;

    switch (pair.type) {
      case "checkbox":
        $(pair.id).find("input").filter( function() {return pair.default.includes($(this).val())} ).each(function(idx) { $(this).val(pair.default[idx]) });
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

  // set default for share fields
  this.options.share.forEach(field => {
    $(field.id).val(field.wrapper.replace(/val/g, scope.getURLWithFilters(scope.filters)));
  })

  // add event listener to restart data populating (and reset share fields) upon clicking the enabled button
  $(this.options.filterBar.goButton.id).click(function () {
    if (!$(this).prop("disabled")) {
      scope.dataPage = 0;
      scope.dash.info.sampleCount = 0;
      scope.dash.populate();
      $(this).attr("disabled", true);

      // set share fields
      scope.options.share.forEach(field => {
        $(field.id).val(field.wrapper.replace(/val/g, scope.getURLWithFilters(scope.filters)));
      })
    }
  })

  // add event listeners for per viz options
  this.options.vizBar.vizs.forEach(viz => {
    viz.options.forEach(vizOption => {
      $(document.getElementById(vizOption.id)).click(function() {
        viz.options.map(vizOption => vizOption.id).forEach(voi => {
          document.getElementById(voi).classList.remove("active");
        });
        $(this).addClass("active");

        let LoadingOverlay = (props) => {
          let style = {position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "white", opacity: 0.8};
          return (
            <div id={props.id + "-spinner"} className="d-flex justify-content-center align-items-center" style={style}>
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          );
        };

        vizElem = document.getElementById(viz.id.substring(1));
        let rootElem = document.createElement("div");
        vizElem.parentNode.insertBefore(rootElem, vizElem);
        ReactDOM.render(<LoadingOverlay id={viz.id.substring(1)} />, rootElem);
        dash.vizs.find(targetViz => targetViz.id == viz.id).setOption("strategyFamily", vizOption.strategyFamily)
        .then(() => document.getElementById(viz.id.substring(1) + "-spinner").remove());

      })
    })
  })

  // add dropdown component to the hashtag field
  let hashtagsTextWrapperElem = document.getElementById("hashtagsTextWrapper");
  fetch('/data/hashTags.json', {method: 'GET'})
    .then(response => response.json())
    .then(data => ReactDOM.render(<SearchDropdown id="hashtags" placeholder="Hashtags" dropdownData={data} fkey="hashtags" onFilterChange={({fkey, val}) => scope.filters[fkey] = val} />, hashtagsTextWrapperElem))

}
