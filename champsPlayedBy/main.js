const fs = require("fs");
const loadMatches = require("./match.js");
const reportChamps = require("./champs.js");

const main = async (name, accountId, apiKey) => {
  const matchesFileName = `./matches.${name}.json`;

  let allMatches;

  try {
    allMatches = require(matchesFileName);
  } catch {
    allMatches = await loadMatches(accountId, apiKey);

    fs.writeFile(
      `./matches.${name}.json`,
      JSON.stringify(allMatches),
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Finished matches.");
      }
    );
  }

  report = reportChamps(allMatches);

  fs.writeFile(
    `./${name}.txt`,
    report.map((t) => `${t.champion}: ${t.length}`).join("\n"),
    (err) => {
      if (err) {
        console.log(err);
      }
      console.log("Finished report.");
    }
  );
};

const apiKey = process.env["LOL_API_KEY"];
const outputFileName = process.argv[2];
const summonerName = process.argv[3];
main(outputFileName, summonerName, apiKey);

module.exports = main;
