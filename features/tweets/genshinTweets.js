const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  var stream = T.stream("statuses/filter", {
    follow: ["1072404907230060544"],
  });

  stream.on("tweet", (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "775809627589312532"; // #genshin-impact channel
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
            "./features/tweets/genshinTweets.js",
            `An error has occurred: ${e.message}`
          );
        });
    } catch (e) {
      log(
        "ERROR",
        "./features/tweets/genshinTweets.js",
        `An error has occurred: ${e.message}`
      );
    }
  });
};

module.exports.config = {
  displayName: "Genshin Tweets",
  dbName: "GENSHIN_TWEETS",
  loadDBFirst: false,
};
