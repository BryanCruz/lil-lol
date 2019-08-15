const superagent = require("superagent");
const fs = require("fs");

const main = async (initialAccountId, apiKey, matchesByPlayer, maxMatches) => {
  const baseUrl = "https://br1.api.riotgames.com/lol/match/v4";

  const relationships = [];

  let matchesIds = [];
  let matchesIdsIndex = 0;

  let accountIds = [initialAccountId];
  let accountIdsIndex = 0;

  while (
    matchesIds.length < maxMatches &&
    accountIdsIndex < accountIds.length
  ) {
    let currAccountId = accountIds[accountIdsIndex];
    accountIdsIndex += 1;

    const tmpMatchesIds = await superagent
      .get(
        `${baseUrl}/matchlists/by-account/${currAccountId}?beginIndex=0&endIndex=${matchesByPlayer}&api_key=${apiKey}`
      )
      .then(r => r.body.matches.map(m => m.gameId))
      .catch(console.error);

    matchesIds = matchesIds.concat(
      tmpMatchesIds.filter(id => matchesIds.indexOf(id) === -1)
    );

    while (
      matchesIdsIndex < matchesIds.length &&
      matchesIdsIndex < maxMatches
    ) {
      const matchId = matchesIds[matchesIdsIndex];
      matchesIdsIndex += 1;

      const matchParticipants = await superagent
        .get(`${baseUrl}/matches/${matchId}?api_key=${apiKey}`)
        .then(r => r.body.participantIdentities)
        .catch(console.error);

      for (i = 0; i < matchParticipants.length; i++) {
        const player1 = matchParticipants[i].player;

        if (accountIds.indexOf(player1.accountId) === -1) {
          accountIds.push(player1.accountId);
        }

        for (j = i + 1; j < matchParticipants.length; j++) {
          const player2 = matchParticipants[j].player;
          relationships.push({
            "1": player1.summonerName,
            "2": player2.summonerName
          });
        }
      }
    }
  }

  fs.writeFile(
    `./${name}.csv`,
    relationships.map(t => `${t["1"]},${t["2"]}`).join("\n"),
    err => {
      if (err) {
        console.log(err);
      }
      console.log("Finished report.");
    }
  );

  return relationships;
};

const name = process.env["LOL_NAME"];
const initialAccountId = process.env["LOL_ACCOUNT_ID"];
const apiKey = process.env["LOL_API_KEY"];
main(initialAccountId, apiKey, 5, 50);
module.exports = main;
