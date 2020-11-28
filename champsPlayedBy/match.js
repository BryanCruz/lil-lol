const superagent = require("superagent");

const baseUrl = "https://br1.api.riotgames.com";

const getAccountId = async (summonerName, apiKey) => {
  console.warn("hello");

  const { accountId } = await superagent
    .get(
      `${baseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`
    )
    .then((r) => r.body)
    .catch((err) => console.error(err));

  return accountId;
};

const main = async (summonerName, apiKey) => {
  const accountId = await getAccountId(summonerName, apiKey);

  let allMatches = [];
  let tmpMatches = [];

  let i = 0;
  do {
    tmpMatches = await superagent
      .get(
        `${baseUrl}/lol/match/v4/matchlists/by-account/${accountId}?beginIndex=${i}&api_key=${apiKey}`
      )
      .then((r) => r.body.matches)
      .catch((err) => console.error(err.message));

    allMatches = allMatches.concat(tmpMatches);

    i += 100;
  } while (tmpMatches.length > 0);

  return allMatches;
};

module.exports = main;
