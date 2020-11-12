const T = require("@utils/twitterConfig");
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
          channel.send(url);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  });
};
