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

    if (claimedCache.includes(id)) {
      console.log("Returning from cache");
      msg.reply(alreadyClaimed);
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

        console.log("RESULTS: ", results);
        if (results) {
          const then = new Date(results.updatedAt).getTime();
          const now = new Date().getTime();

          const diffTime = Math.abs(now - then);
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); //24 hours
          getTimeRemaining(diffTime);

          if (diffDays < 1) {
            claimedCache.push(id);
            msg.reply(alreadyClaimed);
            return;
          }
        }

        await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
          upsert: true,
        });

        claimedCache.push(id);
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

const getTimeRemaining = (diffTime) => {
  let days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((diffTime / 1000 / 60) % 60);
  let seconds = Math.floor((diffTime / 1000) % 60);

  console.log("HOURS:", hours);
  console.log("MINS:", minutes);
  /*let hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

  return `You still ${24 -
    hours} hours and ${minutes} remaining before you can claim your next daily reward.`;*/
};
