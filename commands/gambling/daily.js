const moment = require("moment");

const { pointsToGive } = require("@root/config.json");
const dailyRewardsSchema = require("@schemas/daily-rewards-schema");
const gambling = require("@utils/gambling");
const mongo = require("@utils/mongo");

// Array of member IDs who have claimed their daily rewards in the last 24 hours
// Resets every 10 mins
let claimedCache = [];

const clearCache = () => {
  claimedCache = [];
  setTimeout(clearCache, 1000 * 60 * 10); // 10 minutes
};
clearCache();

const alreadyClaimed = "You have already claimed your daily reward.";

module.exports = {
  commands: "daily",
  cooldown: 15,
  description: "Gives users their daily reward of 1000 points.",
  requiredChannel: "gambling",
  callback: async (msg, args) => {
    const gamblingChannelID = "770695220220264448";
    const { guild, member, channel } = msg;
    const { id } = member;

    if (channel.id !== `${gamblingChannelID}`) {
      msg
        .reply(`Daily can only be redeemed in <#${gamblingChannelID}>!`)
        .then((message) => {
          message.delete({ timeout: 5000 });
        });
      msg.delete();
      return;
    }

    const inCache = claimedCache.find((cache) => {
      return cache.id === id;
    });
    const index = claimedCache.findIndex((cache) => {
      return cache.id === id;
    });
    if (inCache) {
      console.log("Returning from cache");
      const remaining = getTimeRemaining(claimedCache[index].updatedAt);
      msg.reply(`${alreadyClaimed} Please try again in ${remaining}`);
      return;
    }

    console.log("Fetching from mongo");

    const obj = {
      guildID: guild.id,
      userID: id,
    };

    await mongo().then(async (mongoose) => {
      try {
        const results = await dailyRewardsSchema.findOne(obj);
        const updatedAt = results.updatedAt;

        console.log("RESULTS: ", results);
        if (results) {
          const remaining = getTimeRemaining(updatedAt);
          if (getHours(updatedAt) < 24) {
            claimedCache.push({ id: id, updatedAt: updatedAt });
            msg.reply(`${alreadyClaimed} Please try again in ${remaining}`);
            return;
          }
        }

        await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
          upsert: true,
        });

        console.log(updatedAt);
        claimedCache.push({ id: id, updatedAt: updatedAt });
        const newPoints = await gambling.addPoints(guild.id, id, pointsToGive);
        msg.reply(
          `You have claimed your daily reward of ${pointsToGive} points!`
        );
      } finally {
        mongoose.connection.close();
      }
    });
  },
};

const getTimeRemaining = (updatedAt) => {
  const thenUTC = moment.utc(updatedAt);
  const nowUTC = moment.utc();

  const oneDay = thenUTC.add(1, "days");
  const timeRemaining = oneDay.diff(nowUTC);
  const duration = moment.duration(timeRemaining);
  return `${duration.hours()} hours, ${duration.minutes()} minutes, and ${duration.seconds()} seconds.`;
};

const getHours = (updatedAt) => {
  const thenUTC = moment.utc(updatedAt);
  const nowUTC = moment.utc();
  return nowUTC.diff(thenUTC, "hours");
};
