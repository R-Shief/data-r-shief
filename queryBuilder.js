module.exports = {
  buildQuery: function(filters) {
    var select = "SELECT from_user, text FROM mainTable"

    var [usernames, hashtags, alikes] = this.processKeywords(filters.keywords);

    var usernameQueries = [];
    usernames.forEach(username => usernameQueries.push("from_user = '" + username + "'"));
    usernameQueries = usernameQueries.join(" OR ");

    var hashtagQueries = [];
    hashtags.forEach(hashtag => hashtagQueries.push("hashtag = '" + hashtag + "'"));
    hashtagQueries = hashtagQueries.join(" OR ");

    var alikeQueries = [];
    alikes.forEach(alike => alikeQueries.push("text like '%" + alike + "%'"));
    alikeQueries = alikeQueries.join(" OR ");

    var languageQueries = [];
    filters.langList.forEach(language => languageQueries.push("language = '" + language + "'"));
    languageQueries = languageQueries.join(" OR ");

    var dateQueries = "day > date('" + filters.between[0] + "') AND day <= date('" + filters.between[1] + "')";

    var whereQueries = [usernameQueries, hashtagQueries, alikeQueries, languageQueries, dateQueries].join(" AND ");

    var limit = "limit 50 offset " + filters.limitOffset

    var query = [select, whereQueries.length > 0 ? "where" : "", whereQueries, limit].join(" ");
  },
  processKeywords: function(keywords) {
    var usernames = [], hashtags = [], alikes = [];
    keywords.forEach(keyword => {
      switch(keyword.substring(0,1)) {
        case "#":
          hashtags.push(keyword);
          break;
        case "@":
          usernames.push(keyword);
        default:
          alikes.push(keyword);
      }
    });
    return [usernames, hashtags, alikes];
  }
}
