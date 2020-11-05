const ms = require("ms");
const cron = require("cron");
const { rafflePoints, giveawayReactEmoji } = require("@root/config.json");
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
  const channel = client.channels.cache.find(
    (c) => c.id === "770695220220264448"
  );
  const giveawayChannel = client.channels.cache.find(
    (c) => c.id === "771608859352891392"
  );

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
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
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
};
