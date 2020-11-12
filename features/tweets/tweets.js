//const T = require("@utils/twitterConfig");

const Twit = require("twit");

const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = (client) => {
  var stream = T.stream("statuses/filter", {
    follow: ["2899773086"], //["517358431", "1377451009"],
  });

  stream.on("tweet", (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "740349602800205844"; //"760894234973831188"; // #ac-news channel
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
