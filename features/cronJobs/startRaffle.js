const ms = require("ms");
const cron = require("cron");
module.exports = async (client) => {
  // const startRaffle = new cron.CronJob(
  //   "00 39 14 * * *",
  //   () => {
  //     execute(client);
  //   },
  //   null,
  //   true,
  //   "America/Denver"
  // );
};

const execute = async (client) => {
  const channel = client.channels.cache.find(
    (c) => c.id === "770695220220264448"
  );
  const giveawayChannel = client.channels.cache.find(
    (c) => c.id === "771608859352891392"
  );

  if (!giveawayChannel) return;

  const giveawayDuration = "30m";
  const giveawayNumberWinners = "1";
  const giveawayPrize = "500 Points";

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
      giveaway: `🎉🎉 **RAFFLE** 🎉🎉`,
      giveawayEnded: "🎉🎉 **RAFFLE ENDED** 🎉🎉",
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: "React with 🎉 to participate!",
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
      embedFooter: "Giveaways",
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

  //channel.send(`Giveaway started in ${giveawayChannel}!`);
};
