const superagent = require("superagent");
const fs = require("fs");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async (initialAccountId, apiKey, matchesByPlayer, maxMatches) => {
  const baseUrl = "https://br1.api.riotgames.com/lol/match/v4";

  const whiteList = [
    "Y SOY REBELDE",
    "CARIIN VOLTA PF",
    "DIHADES",
    "EVANILLYN",
    "Bellini",
    "MENGOGIRL",
    "FASTFANG",
    "UNICÓRNIO ROSA",
    "UMA BUFA",
    "Nome de Jogador",
    "vrax"
  ];

  let matchesIds = [];
  let matchesIdsIndex = 0;

  let accountIds = [initialAccountId];
  let accountIdsIndex = 0;

  let countRequests = 1;
  while (
    matchesIds.length < maxMatches &&
    accountIdsIndex < accountIds.length
  ) {
    let currAccountId = accountIds[accountIdsIndex];
    accountIdsIndex += 1;

    console.log(countRequests);
    if (!countRequests % 50) {
      console.log("waiting");
      await sleep(10000);
      console.log("stop waiting");
    }

    const tmpMatchesIds = await superagent
      .get(
        `${baseUrl}/matchlists/by-account/${currAccountId}?beginIndex=0&endIndex=${matchesByPlayer}&api_key=${apiKey}`
      )
      .then(r => r.body.matches.map(m => m.gameId))
      .catch(console.error);

    if (!tmpMatchesIds) {
      console.log("aaa");
      continue;
    }

    countRequests += 1;

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

      if (!matchParticipants) {
        console.log("bbb");
        continue;
      }

      countRequests += 1;

      for (i = 0; i < matchParticipants.length; i++) {
        const player1 = matchParticipants[i].player;

        if (
          accountIds.indexOf(player1.accountId) === -1 &&
          whiteList.some(
            v => v.toUpperCase() === player1.summonerName.toUpperCase()
          )
        ) {
          console.log(`adding ${player1.summonerName}`);
          accountIds.push(player1.accountId);
        }

        for (j = i + 1; j < matchParticipants.length; j++) {
          const player2 = matchParticipants[j].player;
          if (
            !(
              whiteList.some(
                v => v.toUpperCase() === player1.summonerName.toUpperCase()
              ) &&
              whiteList.some(
                v => v.toUpperCase() === player2.summonerName.toUpperCase()
              )
            )
          )
            continue;

          fs.appendFile(
            `./${name}.csv`,
            `${player1.summonerName},${player2.summonerName}\n`,
            err => {
              if (err) {
                console.log(err);
              }
              console.log(
                `new rs between ${player1.summonerName} && ${
                  player2.summonerName
                }`
              );
            }
          );
        }
      }
    }
  }
};

const name = process.env["LOL_NAME"];
const initialAccountId = process.env["LOL_ACCOUNT_ID"];
const apiKey = process.env["LOL_API_KEY"];
main(initialAccountId, apiKey, 20, 500);
module.exports = main;
