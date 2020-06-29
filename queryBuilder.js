module.exports = {
  buildQuery: function(filters) {
    var select = "SELECT from_user, text FROM combined"

    var [usernames, hashtags, alikes] = this.processKeywords(filters.keywords);

    var whereQueries = [];

    if (usernames.length > 0){
      var usernameQueries = [];
      usernames.forEach(username => usernameQueries.push("from_user = '" + username + "'"));
      usernameQueries = usernameQueries.join(" OR ");
      whereQueries.push(usernameQueries);
    }

    if (hashtags.length > 0){
      var hashtagQueries = [];
      hashtags.forEach(hashtag => hashtagQueries.push("hashtag = '" + hashtag + "'"));
      hashtagQueries = hashtagQueries.join(" OR ");
      whereQueries.push(hashtagQueries);
    }

    if (alikes.length > 0){
      var alikeQueries = [];
      alikes.forEach(alike => alikeQueries.push("text like '%" + alike + "%'"));
      alikeQueries = alikeQueries.join(" OR ");
      whereQueries.push(alikeQueries);
    }

    if (filters.langList > 0){
      var languageQueries = [];
      filters.langList.forEach(language => languageQueries.push("language = '" + language + "'"));
      languageQueries = languageQueries.join(" OR ");
      whereQueries.push(languageQueries);
    }

    var dateQueries = "day > date('" + filters.between.start + "') AND day <= date('" + filters.between.end + "')";
    whereQueries.push(dateQueries);

    var whereQueries = whereQueries.join(" AND ");

    var limit = "limit 50 offset " + filters.limitOffset

    var query = [select, whereQueries.length > 0 ? "where" : "", whereQueries, limit].join(" ") + ";";
    return query;
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
