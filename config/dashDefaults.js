module.exports = {
  filters: [
    {id: "#language", type: "checkbox", fkey: "langList", default: ["en"]},
    {id: "#country", type: "checkbox", fkey: "countries", default: ["af", "be", "mz"]},
    {id: "#source", type: "checkbox", fkey: "sources", default: ["023", "622", "131"]},
    {id: "#from", type: "datebox", fkey: "startDate", default: "2009-04-12"},
    {id: "#to", type: "datebox", fkey: "endDate", default: "2014-12-12"},
    {id: "#hashtagsText", type: "textbox", fkey: "hashtags", default: "*"},
    {id: "#usernamesText", type: "textbox", fkey: "usernames", default: "*"},
    {id: "#keywordsText", type: "textbox", fkey: "keywords", default: "*"}
  ],
  filterBar: {
    id: "#filterBar",
    goButton: {id: "#filterGoButton", default: "disabled"},
    clippable: {id: "#sharelink", default: ""}
  },
  vizs: [
    {id: "#streamgraph", classKey: "Streamgraph", uriExtension: 'htStreamgraph', name: 'Streamgraph'}
    // {id: "#userPacking", classKey: "UserPacking", uriExtension: 'uCirclePacking', name: 'User Packing'}
  ]
};
