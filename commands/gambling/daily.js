const moment = require("moment");
const numeral = require("numeral");

const { pointsToGive } = require("@root/config.json");
const dailyRewardsSchema = require("@schemas/daily-rewards-schema");
const { getGamblingChannel, addPoints } = require("@utils/gambling");

// Array of member IDs who have claimed their daily rewards in the last 24 hours
// Resets every 10 mins
let claimedCache = [];

const clearCache = () => {
  claimedCache = [];
  setTimeout(clearCache, 1000 * 60 * 10); // 10 minutes
};
clearCache();

module.exports = {
  commands: "daily",
  category: "Gambling",
  description: "Gives users their daily reward of 1000 points.",
  requiredChannel: "gambling",
  callback: async ({ message, instance }) => {
    const { guild, member, channel } = message;
    const { id } = member;
    const gamblingChannel = await getGamblingChannel(guild.id);

    if (gamblingChannel !== null) {
      if (channel.id !== gamblingChannel) {
        message
          .reply(`Daily can only be redeemed in <#${gamblingChannel}>!`)
          .then((msg) => {
            msg.delete({ timeout: 5000 });
          });
        message.delete();
        return;
      }
    } else {
      message.reply(
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
      if (getHours(claimedCache[index].updatedAt) == 24) {
        claimedCache.splice(index, 1); // Remove from cache if time expires before the cache can be cleared
      } else {
        console.log("Returning from cache");
        const remaining = getTimeRemaining(claimedCache[index].updatedAt);
        message.reply(
          instance.messageHandler.get(guild, "ALREADY_CLAIMED", {
            REMAINING: `${remaining}`,
          })
        );
        return;
      }
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
        message.reply(
          instance.messageHandler.get(guild, "ALREADY_CLAIMED", {
            REMAINING: `${remaining}`,
          })
        );
        return;
      }
    }

    await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    });

    claimedCache.push({ id: id, updatedAt: moment.utc() });
    const newPoints = await addPoints(guild.id, id, pointsToGive);
    message.reply(
      instance.messageHandler.get(guild, "DAILY_REWARDS_CLAIMED", {
        POINTS: `${numeral(pointsToGive).format("0,0")}`,
      })
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
