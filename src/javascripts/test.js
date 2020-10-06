let Dash = require('./dashboard/components/Dash.js');

let filterDefaults = {
  langList: ["en", "ar"],
  startDate: "2009-04-12",
  endDate: "2014-12-12",
  hashtags: "*",
  usernames: "*"
};

class EmbedTest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <iframe frameBorder="0" width="100%" height="100%" scrolling="no" src="http://localhost:3000/dashboard/en,ar/2009-04-12/2014-12-12/*/*?embed=true"></iframe>
    );
  }
}

ReactDOM.render(<EmbedTest />, document.getElementById("root"));

// Promise.all([
//   fetch('/data/hashTags.json').then(response => response.json()).then(data => data.map(hashtag => hashtag)),
//   fetch('/data/usernames.json').then(response => response.json()).then(data => data.map(username => "@" + username)),
//   fetch('/data/languages.json').then(response => response.json()).then(data => data.map(language => {return { val: language["639-1"], label: language["ISO language name"]} }))
// ])
// .then(datum => ReactDOM.render(<Dash hashtagData={datum[0]} usernameData={datum[1]} languagesData={datum[2]} filterDefaults={filterDefaults} />, document.getElementById("root")));
