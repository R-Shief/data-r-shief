module.exports = {
  filterBar: {
    id: "#filterBar",
    goButton: {id: "#filterGoButton", default: "disabled"},
    clippable: {id: "#sharelink", default: ""},
    filters: [
      {id: "#language", type: "checkbox", fkey: "langList", default: ["en", "ar"]},
      {id: "#country", type: "checkbox", fkey: "countries", default: ["af", "be", "mz"]},
      {id: "#source", type: "checkbox", fkey: "sources", default: ["023", "622", "131"]},
      {id: "#from", type: "datebox", fkey: "startDate", default: "2009-04-12"},
      {id: "#to", type: "datebox", fkey: "endDate", default: "2014-12-12"},
      {id: "#hashtagsText", type: "textbox", fkey: "hashtags", default: "*"},
      {id: "#usernamesText", type: "textbox", fkey: "usernames", default: "*"},
      {id: "#keywordsText", type: "textbox", fkey: "keywords", default: "*"}
    ]
  },
  vizBar: {
    id: "#vizBar",
    vizs: [
      {
        id: "#streamgraph",
        name: "Streamgraph",
        options: [
          {id: "#hashtagsStreamgraph", name: "By Hashtag", strategyFamily: "hashtag"},
          {id: "#languagesStreamgraph", name: "By Language", strategyFamily: "language"}
        ]
      },
      {
        id: "#rankings",
        name: "Rankings",
        options: [
          {id: "#hashtagRanking", name: "Top Hashtags", strategyFamily: "hashtag"},
          {id: "#urlRanking", name: "Top URLs", strategyFamily: "url"}
        ]
      },
      {
        id: "#map",
        name: "Map",
        options: [
          {id: "#tweetsMap", name: "Counts", strategyFamily: "choropleth"},
          {id: "#hashtagMap", name: "Hashtags", strategyFamily: "hashtag"}
        ]
      }
    ]
  },
  infoBar: [
    {
      id: "#sampleCount",
      default: 0,
      infoKey: "sampleCount"
    },
    {
      id: "#sampleMethod",
      default: "randomly",
      infoKey: "sampleMethod"
    }
  ],
  share: [
    {
      id: "#sharelink",
      default: "",
      wrapper: `val`
    },
    {
      id: "#shareembed",
      default: "",
      wrapper: `<iframe frameborder="0" src="val"></iframe>`
    }
  ]
};
