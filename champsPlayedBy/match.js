const superagent = require("superagent");

const baseUrl = "https://br1.api.riotgames.com/lol/match/v4";

const main = async (accountId, apiKey) => {
  let allMatches = [];
  let tmpMatches = [];

  let i = 0;
  do {
    tmpMatches = await superagent
      .get(
        `${baseUrl}/matchlists/by-account/${accountId}?beginIndex=${i}&api_key=${apiKey}`
      )
      .then((r) => r.body.matches)
      .catch(console.error);

    allMatches = allMatches.concat(tmpMatches);

    i += 100;
  } while (tmpMatches.length > 0);

  return allMatches;
};

module.exports = main;
