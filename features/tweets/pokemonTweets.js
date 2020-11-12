const T = require("@utils/twitterConfig");
module.exports = (client) => {
  var stream = T.stream("statuses/filter", {
    follow: ["96879107", "1114253221269245952"],
  });

  stream.on("tweet", (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "754196970813390878"; // #pokemon channel
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
