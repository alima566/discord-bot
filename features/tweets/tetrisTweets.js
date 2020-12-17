const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  var stream = T.stream("statuses/filter", {
    follow: ["287885794"],
  });

  stream.on("tweet", (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "754196992254804048"; // #tetris channel
    try {
      let channel = client.channels
        .fetch(channelID)
        .then((channel) => {
          if (!T.isReply(tweet)) {
            channel.send(url);
          }
        })
        .catch((e) => {
          log(
            "ERROR",
            "./features/tweets/tetrisTweets.js",
            `An error has occurred: ${e.message}`
          );
        });
    } catch (e) {
      log(
        "ERROR",
        "./features/tweets/tetrisTweets.js",
        `An error has occurred: ${e.message}`
      );
    }
  });
};

module.exports.config = {
  displayName: "Tetris Tweets",
  dbName: "TETRIS_TWEETS",
  loadDBFirst: false,
};
