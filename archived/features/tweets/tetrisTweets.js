const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  const stream = T.stream("statuses/filter", {
    follow: ["287885794"],
  });

  stream.on("tweet", async (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "754196992254804048"; // #tetris channel
    const channel = await client.channels.fetch(channelID).catch((e) => {
      log(
        "ERROR",
        "./features/tweets/tetrisTweets.js",
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
  displayName: "Tetris Tweets",
  dbName: "TETRIS_TWEETS",
  loadDBFirst: false,
};
