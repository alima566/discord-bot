const T = require("@utils/twitterLiteConfig");

const followedChannels = [
  "517358431", // @ACWorldBlog
  "1377451009", // @AnimalCrossing
  "1072404907230060544", // @GenshinImpact
  "96879107", // @Pokemon
  "1114253221269245952", // @SerebiiOTD
  "287885794", // @Tetris_Official
];

startTwitterFeed = (client) => {
  T.stream("statuses/filter", {
    follow: followedChannels.join(","),
  })
    .on("start", () => {
      console.log("Started Twitter Feed Stream");
    })
    .on("data", async (tweet) => {
      if (!tweet.user) return;

      const url = `http://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
      let channelID;
      switch (tweet.user.id_str) {
        case "517358431":
        case "1377451009":
          channelID = "760894234973831188";
          break;

        case "1072404907230060544":
          channelID = "775809627589312532";
          break;

        case "96879107":
        case "1114253221269245952":
          channelID = "754196970813390878";
          break;

        case "287885794":
          channelID = "754196992254804048";
          break;

        default:
      }

      const channel = await client.channels.fetch(channelID).catch(() => {});
      if (channel) {
        channel.send(url);
      }
    })
    .on("error", (e) => console.log(e))
    .on("end", () => {
      console.log("Ended Twitter Feed Stream");
      // Wait 10 seconds, then restart the twitter feed
      setTimeout(() => {
        startTwitterFeed(client);
      }, 1000 * 10);
    });
};

module.exports = (client) => {
  startTwitterFeed(client);
};

module.exports.config = {
  displayName: "Tweets",
  dbName: "TWEETS",
  loadDBFirst: false,
};
