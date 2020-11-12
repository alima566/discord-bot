const T = require("@utils/twitterConfig");
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
          channel.send(url);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  });
};
