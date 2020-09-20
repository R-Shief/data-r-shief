let Dash = require('./dashboard/components/Dash.js');

let filterDefaults = {
  langList: ["en", "ar"],
  startDate: "2009-04-12",
  endDate: "2014-12-12",
  hashtags: "*",
  usernames: "*"
};

Promise.all([
  fetch('/data/hashTags.json').then(response => response.json()).then(data => data.map(hashtag => hashtag)),
  fetch('/data/usernames.json').then(response => response.json()).then(data => data.map(username => "@" + username)),
  fetch('/data/languages.json').then(response => response.json()).then(data => data.map(language => {return { val: language["639-1"], label: language["ISO language name"]} }))
])
.then(datum => ReactDOM.render(<Dash hashtagData={datum[0]} usernameData={datum[1]} languagesData={datum[2]} filterDefaults={filterDefaults} />, document.getElementById("root")));
