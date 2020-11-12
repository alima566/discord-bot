const T = require("@utils/twitterConfig");
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
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  });
};
