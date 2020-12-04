const { MessageEmbed } = require("discord.js");
const gamblingLeaderboardSchema = require("@schemas/gambling-leaderboard-schema");
const gamblingSchema = require("@schemas/gambling-schema");
const numeral = require("numeral");
const moment = require("moment-timezone");

const seconds = 5;
const startingCounter = 60;
let counter = startingCounter;
let importantData = "";

const fetchData = async (guildID) => {
  const timezone = moment.tz("America/New_York").format("z");
  const nextMonth = moment()
    .tz("America/New_York")
    .add(1, "months")
    .format("MMMM");
  importantData = `Person with the most points at the end of each month gets a free month of *Discord Nitro*. A winner is determined at 12AM ${timezone} on the first of every month.\n\n`;
  const results = await gamblingSchema
    .find({
      guildID,
    })
    .sort({
      points: -1,
    })
    .limit(10);
  for (let count = 0; count < results.length; count++) {
    const { userID, points = 0 } = results[count];
    importantData += `${count + 1}. <@${userID}> has ${numeral(points).format(
      "0,0"
    )} ${points !== 1 ? "points" : "point"}.\n`;
  }
  importantData += `\nPoints will be reset back to 0 at 12AM ${timezone} on ${nextMonth} 1st.\n`;
};

const getText = () => {
  const msgEmbed = new MessageEmbed()
    .setColor("#85bb65")
    .setTitle(`Gambling Leaderboard`)
    // .setThumbnail(
    //   `https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_poker-chip.png?v=1604426732959`
    // )
    .setDescription(importantData)
    .setFooter(`Leaderboard will update in ${counter} seconds...`);
  return msgEmbed;
};

const updateCounter = async (client) => {
  let guildIDs = [];
  const results = await gamblingLeaderboardSchema.find({});
  for (const result of results) {
    const { channelID, _id: guildID } = result;
    guildIDs.push(guildID);
    const guild = client.guilds.cache.get(guildID);
    if (guild) {
      const channel = client.channels.cache.get(channelID);
      if (channel) {
        const messages = await channel.messages.fetch();
        const firstMessage = messages.first();
        if (firstMessage) {
          firstMessage.edit(getText());
        } else {
          await channel.send(getText());
        }
      }
    }
  }
  counter -= seconds;
  if (counter <= 0) {
    counter = startingCounter;
    for (const guildID of guildIDs) {
      await fetchData(guildID);
    }
  }
  setTimeout(() => {
    updateCounter(client);
  }, 1000 * seconds);
};

module.exports = async (client) => {
  const results = await gamblingLeaderboardSchema.find({});
  for (const result of results) {
    const { _id: guildID } = result;
    const guild = client.guilds.cache.get(guildID);
    if (guild) {
      await fetchData(guild.id);
    }
  }
  updateCounter(client);
};
