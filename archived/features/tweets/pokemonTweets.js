const T = require("@utils/twitterConfig");
const { log } = require("@utils/functions");

module.exports = (client) => {
  const stream = T.stream("statuses/filter", {
    follow: ["96879107", "1114253221269245952"],
  });

  stream.on("tweet", async (tweet) => {
    const url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
    const channelID = "754196970813390878"; // #pokemon channel
    const channel = await client.channels.fetch(channelID).catch((e) => {
      log(
        "ERROR",
        "./features/tweets/pokemonTweets.js",
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
  displayName: "Pokemon Tweets",
  dbName: "POKEMON_TWEETS",
  loadDBFirst: false,
};
