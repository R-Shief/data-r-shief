d3 = require('d3');
Viz = require('./viz.js');

class Rankings extends Viz {
  constructor(options) {
    super(options);

    this.filterManager = options.filterManager;
    this.id = "#rankings";

    this.strategyFamilies = {
      hashtag: {
        uriExtension: 'htRanking',
        headerRowFn: (col) => ["#","Hashtag","Count"].map(h => document.createTextNode(h))[col],
        rowFn: (val) => document.createTextNode(val)
      },
      url: {
        uriExtension: 'urlRanking',
        headerRowFn: (col) => ["#","URL","Count"].map(h => document.createTextNode(h))[col],
        rowFn: (val) => {
          let elem;
          if (val.toString().substring(0, 4) == "http") {
            elem = document.createElement("a");
            elem.setAttribute("href", val);
            elem.setAttribute("target", "_blank");
            elem.appendChild(document.createTextNode(val));
          } else {
            elem = document.createTextNode(val);
          }
          return elem;
        }
      }
    };

    let defaultOptions = {
      strategyFamily: "hashtag"
    };

    this.options = Object.assign(defaultOptions, options);

    this.strategy = this.strategyFamilies[this.options.strategyFamily];

    this.view;

  }

  refresh() {
    return new Promise((resolve, reject) => {
        fetch(`${this.filterManager.getURLWithFilters()}/${this.strategy.uriExtension}`, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
          dataObj = JSON.parse(data);

          // rebuild the table wrapper
          let tableResponsiveDiv = document.createElement("div");
          tableResponsiveDiv.className = "table-responsive-sm";
          tableResponsiveDiv.id = "rankingsTableWrapper";
            let table = document.createElement("table");
            table.className = "table-sm table-striped";
            table.style.height = "450px";
            table.id = "rankingsTable";

              // rebuild the table header
              let thead = document.createElement("thead");
              let headerRow = document.createElement("tr");
              let headerRowFn = this.strategy.headerRowFn;
                var head0 = document.createElement("th");
                head0.setAttribute("scope", "col");
                head0.appendChild(headerRowFn(0));
                headerRow.appendChild(head0);

                var head1 = document.createElement("th");
                head1.setAttribute("scope", "col");
                head1.appendChild(headerRowFn(1));
                headerRow.appendChild(head1);

                var head2 = document.createElement("th");
                head2.setAttribute("scope", "col");
                head2.appendChild(headerRowFn(2));
                headerRow.appendChild(head2);
              thead.appendChild(headerRow);
            table.appendChild(thead);

              // rebuild the table body
              let tbody = document.createElement("tbody");
              let rowFn = this.strategy.rowFn;
              dataObj.forEach(([hashtag, count], idx) => {
                let row = document.createElement("tr");
                  let head = document.createElement("th");
                  head.setAttribute("scope", "row");
                  head.appendChild(rowFn(idx + 1));
                  row.appendChild(head);

                  let col0 = document.createElement("td");
                  col0.appendChild(rowFn(hashtag));
                  row.appendChild(col0);

                  let col1 = document.createElement("td");
                  col1.appendChild(rowFn(count));
                  row.appendChild(col1);
                tbody.appendChild(row);
              })
            table.appendChild(tbody);
          tableResponsiveDiv.appendChild(table);

          if (typeof this.view == "undefined") {
            this.view = document.createElement("div");
            this.view.style.height = "440px";
            this.view.style.overflowY = "scroll";
          } else {
            document.getElementById("rankingsTableWrapper").remove();
          }

          this.view.appendChild(tableResponsiveDiv);

          resolve(this);
        })
        .catch(err => reject(err))
    })
  }

  setOption(option, value) {
    super.setOption(option, value);
    if(option == "strategyFamily") this.strategy = this.strategyFamilies[this.options.strategyFamily];
    return this.refresh();
  }

  getView() {
    return this.view;
  }
}

module.exports = Rankings;
