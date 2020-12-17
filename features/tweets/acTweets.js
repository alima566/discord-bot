const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  var stream = T.stream("statuses/filter", {
    follow: ["517358431", "1377451009"],
  });

  stream.on("tweet", (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "760894234973831188"; // #ac-news channel
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
            "./features/tweets/acTweets.js",
            `An error has occurred: ${e.message}`
          );
        });
    } catch (e) {
      log(
        "ERROR",
        "./features/tweets/acTweets.js",
        `An error has occurred: ${e.message}`
      );
    }
  });
};

module.exports.config = {
  displayName: "AC Tweets",
  dbName: "AC_TWEETS",
  loadDBFirst: false,
};
