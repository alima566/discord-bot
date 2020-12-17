const ms = require("ms");
const cron = require("cron");
const { rafflePoints, giveawayReactEmoji } = require("@root/config.json");
const gambling = require("@utils/gambling");
const { log } = require("@utils/functions");

module.exports = async (client) => {
  const startRaffle = new cron.CronJob(
    "00 00 9-22/4 * * *",
    () => {
      execute(client);
    },
    null,
    true,
    "America/Denver"
  );
};

const execute = async (client) => {
  const channel = client.channels.cache.get("770695220220264448");
  const giveawayChannel = client.channels.cache.get("771608859352891392");

  if (!channel || !giveawayChannel) return;

  const giveawayDuration = "30m";
  const giveawayNumberWinners = "1";
  const giveawayPrize = `${rafflePoints} Points`;

  client.giveawaysManager.start(giveawayChannel, {
    // The giveaway duration
    time: ms(giveawayDuration),
    // The giveaway prize
    prize: giveawayPrize,
    // The giveaway winner count
    winnerCount: giveawayNumberWinners,
    // Who hosts this giveaway
    hostedBy: `<@754033907267010560>`,
    // Messages
    messages: {
      giveaway: `${giveawayReactEmoji}${giveawayReactEmoji} **RAFFLE** ${giveawayReactEmoji}${giveawayReactEmoji}`,
      giveawayEnded: `${giveawayReactEmoji}${giveawayReactEmoji} **RAFFLE ENDED** ${giveawayReactEmoji}${giveawayReactEmoji}`,
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: `React with ${giveawayReactEmoji} to participate!`,
      winMessage:
        "Congratulations, {winners}! You won **{prize}**! I have automatically added the points to your account. Happy gambling!",
      embedFooter: "Raffles",
      noWinner: "Raffle cancelled, no valid participants.",
      hostedBy: "Hosted by: {user}",
      winners: "winner(s)",
      endedAt: "Ended at",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
      },
    },
  });

  channel.send(`A raffle has started in ${giveawayChannel}!`);

  client.giveawaysManager.on("giveawayEnded", async (giveaway, winners) => {
    winners.forEach(async (w) => {
      const newPoints = await gambling.addPoints(
        w.guild.id,
        w.user.id,
        parseInt(rafflePoints)
      );
      log(
        "SUCCESS",
        "./features/cronJobs/startRaffle.js",
        `${rafflePoints} points have been given to ${w.user.tag} and they now have ${newPoints}.`
      );
    });
  });
};

module.exports.config = {
  displayName: "Start Raffle",
  dbName: "START_RAFFLE",
  loadDBFirst: false,
};
