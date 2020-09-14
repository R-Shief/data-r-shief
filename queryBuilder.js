module.exports = {
  buildQuery: function(sessionID, filters, options) {

    let randomStrategy = (sessionID, filters, options) => {
      return `
        INSERT INTO sessionTweet (session_id, twitter_id)
          SELECT '${sessionID}', t.twitter_id
          FROM (
            SELECT twitter_id
            FROM randomKey
            order by rkid
            LIMIT ${filters.page*options.populateStride}, ${options.populateStride}
          ) AS rk
          INNER JOIN tweet AS t ON t.twitter_id = rk.twitter_id
          WHERE
            t.lang_code IN ( ${filters.langList.split(",").map(l => `'${l}'`)} )
          AND t.created_at BETWEEN '${filters.startDate}' AND '${filters.endDate}'
        ON DUPLICATE KEY UPDATE sessionTweet.session_id=sessionTweet.session_id;
      `;
    };

    let scrambleStrategy = (sessionID, filters, options) => {
      let conditionals = [];
      if (filters.hashtags != "*") { conditionals.push(`MATCH(h.hashtag_name) AGAINST ('${filters.hashtags}' IN BOOLEAN MODE)`) };
      if (filters.usernames != "*") { conditionals.push(`u.username LIKE '${filters.usernames}%'`) };
      if (conditionals.length > 0) conditionals = conditionals.length > 1 ? "AND " + conditionals.join(" OR ") : "AND " + conditionals[0];

      return `
        INSERT INTO sessionTweet (session_id, twitter_id)
          SELECT '${sessionID}', tt.twitter_id
          FROM (
            SELECT t.twitter_id
            FROM tweet AS t
            INNER JOIN tweetHashtag as th ON th.twitter_id = t.twitter_id
            INNER JOIN hashtag as h ON th.hashtag_id = h.hashtag_id
            INNER JOIN user as u ON t.from_user_id = u.user_id
            WHERE t.lang_code IN ( ${filters.langList.split(",").map(l => `'${l}'`)} )
            AND t.created_at BETWEEN '${filters.startDate}' AND '${filters.endDate}'
            ${conditionals}
            LIMIT ${filters.page*options.populateStride*10}, ${options.populateStride*10}
          ) AS tt
          INNER JOIN randomKey AS rk ON rk.twitter_id = tt.twitter_id
          ORDER BY rk.rkid
        ON DUPLICATE KEY UPDATE sessionTweet.session_id=sessionTweet.session_id;
      `;
    };

    let dateDiff = (date1, date2) => Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    let buildStrategy;
    if ( [filters.hashtags, filters.usernames].some(x => x != "*") || dateDiff(new Date(filters.startDate), new Date(filters.endDate)) < 21) { // if any of the conditions that require joins are required, then use this strategy
      buildStrategy = scrambleStrategy;
    }
    else {
      buildStrategy = randomStrategy;
    }
    
    let ret = buildStrategy(sessionID, filters, options);
    return ret;
  }
}
