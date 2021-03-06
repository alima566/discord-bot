const moment = require("moment");
const { pointsToGive } = require("@root/config.json");
const dailyRewardsSchema = require("@schemas/daily-rewards-schema");
const { getGamblingChannel, addPoints } = require("@dbHelpers/gambling");

// Array of member IDs who have claimed their daily rewards in the last 24 hours
// Resets every 10 mins
let claimedCache = [];

const clearCache = () => {
  claimedCache = [];
  setTimeout(clearCache, 1000 * 60 * 10); // 10 minutes
};
clearCache();

module.exports = {
  category: "🎰 Gambling",
  description: `Gives users their daily reward of ${pointsToGive.toLocaleString()} points.`,
  callback: async ({ message, instance, client }) => {
    const { guild, member, channel } = message;
    const { id } = member;
    const gamblingChannel = await getGamblingChannel(guild.id);

    if (gamblingChannel) {
      if (channel.id !== gamblingChannel) {
        message
          .reply(`Daily can only be redeemed in <#${gamblingChannel}>!`)
          .then((msg) => {
            client.setTimeout(() => msg.delete(), 1000 * 3);
          });
        message.delete();
        return;
      }
    } else {
      message
        .reply(
          `A gambling channel needs to be set first in order for this command to be used.`
        )
        .then((msg) => client.setTimeout(() => msg.delete(), 1000 * 3));
      message.delete();
      return;
    }

    const inCache = claimedCache.find((cache) => {
      return cache.userID === id && cache.guildID === guild.id;
    });
    const index = claimedCache.findIndex((cache) => {
      return cache.userID === id && cache.guildID === guild.id;
    });
    if (inCache) {
      if (getHours(claimedCache[index].updatedAt) == 24) {
        claimedCache.splice(index, 1); // Remove from cache if time expires before the cache can be cleared
      } else {
        console.log("Returning from cache");
        const remaining = getTimeRemaining(claimedCache[index].updatedAt);
        message.channel.send(
          instance.messageHandler.get(guild, "ALREADY_CLAIMED", {
            USER: `<@${id}>`,
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
        claimedCache.push({
          guildID: guild.id,
          userID: id,
          updatedAt: updatedAt,
        });
        message.channel.send(
          instance.messageHandler.get(guild, "ALREADY_CLAIMED", {
            USER: `<@${id}>`,
            REMAINING: `${remaining}`,
          })
        );
        return;
      }
    }

    await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
      upsert: true,
    });

    claimedCache.push({
      guildID: guild.id,
      userID: id,
      updatedAt: moment.utc(),
    });
    const newPoints = await addPoints(guild.id, id, pointsToGive);
    message.channel.send(
      instance.messageHandler.get(guild, "DAILY_REWARDS_CLAIMED", {
        USER: `<@${id}>`,
        POINTS: `${pointsToGive.toLocaleString()}`,
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
    return `**${secsDuration} ${secsText}**.`;
  } else if (hoursDuration === 0) {
    return `**${minsDuration} ${minsText} and ${secsDuration} ${secsText}**.`;
  } else {
    return `**${hoursDuration} ${hoursText}, ${minsDuration} ${minsText}, and ${secsDuration} ${secsText}**.`;
  }
};

const getHours = (updatedAt) => {
  const thenUTC = moment.utc(updatedAt);
  const nowUTC = moment.utc();
  return nowUTC.diff(thenUTC, "hours");
};
