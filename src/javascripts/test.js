let FilterBar = require('./dashboard/components/FilterBar.js');

Promise.all([
  fetch('/data/hashTags.json').then(response => response.json()).then(data => data.map(hashtag => hashtag)),
  fetch('/data/usernames.json').then(response => response.json()).then(data => data.map(username => "@" + username)),
  fetch('/data/languages.json').then(response => response.json()).then(data => data.map(language => {return { val: language["639-1"], label: language["ISO language name"]} }))
])
.then(datum => ReactDOM.render(<FilterBar hashtagData={datum[0]} usernameData={datum[1]} languagesData={datum[2]} fromDefault="2009-04-12" toDefault="2014-12-12" defaultLanguages={["en", "ar"]} />, document.getElementById("root")))
.then(() => $('.input-daterange').datepicker());
