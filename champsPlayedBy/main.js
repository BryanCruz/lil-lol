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

const name = process.env["LOL_NAME"];
const accountId = process.env["LOL_ACCOUNT_ID"];
const apiKey = process.env["LOL_API_KEY"];
main(name, accountId, apiKey);

module.exports = main;
