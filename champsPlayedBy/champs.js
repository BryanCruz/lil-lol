const groupBy = require("group-by");
const fs = require("fs");

const champs = require("./champs.json");

const reportChamps = matches => {
  const champsMapping = {};
  champs.forEach(c => {
    champsMapping[c.key] = c.id;
  });

  const groupedMatches = groupBy(matches, "champion");

  const playedMatches = Object.keys(groupedMatches).map(k => {
    return {
      champion: champsMapping[k],
      length: groupedMatches[k].length
    };
  });

  return playedMatches.sort((a, b) => {
    return b.length - a.length;
  });
};

module.exports = reportChamps;
