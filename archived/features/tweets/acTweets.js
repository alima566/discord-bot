const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  const stream = T.stream("statuses/filter", {
    follow: ["517358431", "1377451009"],
  });

  stream.on("tweet", async (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "760894234973831188"; // #ac-news channel
    const channel = await client.channels.fetch(channelID).catch((e) => {
      log(
        "ERROR",
        "./features/tweets/acTweets.js",
        `An error has occurred: ${e.message}`
      );
    });

    if (channel) {
      if (!T.isReply(tweet)) {
        channel.send(url);
      }
    }
  });
};

module.exports.config = {
  displayName: "AC Tweets",
  dbName: "AC_TWEETS",
  loadDBFirst: false,
};
