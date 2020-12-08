const moment = require("moment");
const numeral = require("numeral");

const { pointsToGive } = require("@root/config.json");
const dailyRewardsSchema = require("@schemas/daily-rewards-schema");
const gambling = require("@utils/gambling");

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
  category: "Gambling",
  //cooldown: 15,
  description: "Gives users their daily reward of 1000 points.",
  requiredChannel: "gambling",
  callback: async (msg) => {
    const { guild, member, channel } = msg;
    const { id } = member;
    const gamblingChannel = await gambling.getGamblingChannel(guild.id);

    if (gamblingChannel !== null) {
      if (channel.id !== gamblingChannel) {
        msg
          .reply(`Daily can only be redeemed in <#${gamblingChannel}>!`)
          .then((message) => {
            message.delete({ timeout: 5000 });
          });
        msg.delete();
        return;
      }
    } else {
      msg.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
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

    const results = await dailyRewardsSchema.findOne(obj);
    let updatedAt = results ? results.updatedAt : moment.utc();

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

    claimedCache.push({ id: id, updatedAt: moment.utc() });
    const newPoints = await gambling.addPoints(guild.id, id, pointsToGive);
    msg.reply(
      `You have claimed your daily reward of ${numeral(pointsToGive).format(
        "0,0"
      )} points!`
    );
  },
};

const getTimeRemaining = (updatedAt) => {
  const thenUTC = moment.utc(updatedAt);
  const nowUTC = moment.utc();

  const oneDay = thenUTC.add(1, "days");
  const timeRemaining = oneDay.diff(nowUTC);
  const duration = moment.duration(timeRemaining);

  const hoursDuration = duration.hours();
  const minsDuration = duration.minutes();
  const secsDuration = duration.seconds();

  let hoursText = hoursDuration !== 1 ? "hours" : "hour";
  let minsText = minsDuration !== 1 ? "minutes" : "minute";
  let secsText = secsDuration !== 1 ? "seconds" : "second";

  if (hoursDuration === 0 && minsDuration === 0) {
    return `${secsDuration} ${secsText}.`;
  } else if (hoursDuration === 0) {
    return `${minsDuration} ${minsText} and ${secsDuration} ${secsText}.`;
  } else {
    return `${hoursDuration} ${hoursText}, ${minsDuration} ${minsText}, and ${secsDuration} ${secsText}.`;
  }
};

const getHours = (updatedAt) => {
  const thenUTC = moment.utc(updatedAt);
  const nowUTC = moment.utc();
  return nowUTC.diff(thenUTC, "hours");
};
