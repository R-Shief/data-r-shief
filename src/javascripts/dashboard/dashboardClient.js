let d3 = require('d3');
let userPacking = require('./userPacking.js');
let streamgraph = require('./streamgraph.js');
let drag = require('./drag.js');

let df = {
  langList: ["ar","en","fr"],
  startDate: "2011-12-12",
  endDate: "2012-12-12",
  keywords: "foo",
  page: 0
}

// Load with default values
fetch(`${window.location.href}/${df.langList}/${df.startDate}/${df.endDate}/${df.keywords}/${df.page}`, {method: 'PUT'})
  .then(response => {
    fetch('/data/flare-2.json')
      .then(response => response.json())
      .then(data => {
        var packingDiv = document.getElementById("userPacking");
        var boundingClientRect = packingDiv.getBoundingClientRect();
        packingDiv.appendChild(userPacking(data, boundingClientRect.width, boundingClientRect.height));
      });

    //fetch('/data/unemployment-2.csv')
    fetch(`${window.location.href}/${df.langList}/${df.startDate}/${df.endDate}/${df.keywords}/${df.page}/htStreamgraph`, {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        processedData = processData(data);
        //data = Object.assign(d3.csvParse(data, d3.autoType), {y: "Unemployment"});
        var sg = d3.select('#streamgraph');
        var bounds = sg.node().getBoundingClientRect();
        sg.node().appendChild(streamgraph(processedData, bounds.width, bounds.height));
      })

    d3.selectAll('.draggable')
      .each(function(d) {
        d3.select(this).call( drag() )
      });
  })

function processData(data) {

  // parse JSON and throw away metadata
  data = JSON.parse(data)[0];

  // parse MYSQL DATETIMEs as javascript date objects.
  const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");

  data.forEach(entry => {
    entry.occurrence = parseDate(entry.occurrence);
  });

  const dateExtent = d3.extent(data, d => d.occurrence );

  const unique = [...new Set(data.map(entry => entry.hashtag))];

  const dayBins = d3.timeDays(dateExtent[0], dateExtent[1]);

  const binByDay = d3.histogram()
    .value(d => d.occurrence)
    .thresholds(dayBins);

  const dataGroupedByHashtag = d3.nest()
    .key(d => d.hashtag)
    .map(data, d3.map);
    // .each((key, val) => {
    //   val = binByDay(val);
    // });

  let histDataByHashtag = [];
  dataGroupedByHashtag.each((value, key) => {
    histDataByHashtag.push({hashtag: key, values: binByDay(value)});
  })

  const stack = d3.stack().value( (d, key) => d[key].values );

  console.log(stack); // WIP figuring out d3.stack . It appears d3.stack().values is not a function.

  const stacked = stack(histDataByHashtag);

  console.log(stacked);

  return data;
}

// let layers = [
//   {
//     date: '2011-12-12',
//
//   }
// ]

// let layers = [
//   {
//     name: '420',
//     values: [
//       {x: date, y: count},
//       {},
//       {}
//     ]
//   },
// ]
