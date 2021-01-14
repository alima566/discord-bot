const movieDB = require("moviedb")(process.env.MOVIEDB_API_KEY);
const { log } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["show", "tvshow"],
  category: "Misc",
  minArgs: 1,
  expectedArgs: "<TV Show Title>",
  cooldown: "15s",
  description: "Gives you information about a tv show.",
  callback: async ({ message, text }) => {
    const { channel } = message;
    movieDB.searchTv(
      {
        query: text.toLowerCase(),
        page: 1,
        include_adult: false,
      },
      (err, res) => {
        if (err) {
          log(
            "ERROR",
            "./commands/misc/tv.js",
            `An error has occurred: ${err}`
          );
          return channel.send(
            `An error has occurred. Unable to fetch TV show information.`
          );
        }

        if (!res || res.length === 0) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (res.results[0] === undefined || !res.results[0]) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (res.results.length > 1) {
          showAllShows(text, res.results, message);
        } else {
          channel.send(showTVInfo(res.results[0]));
        }
      }
    );
  },
};

const showAllShows = (query, results, message) => {
  let menuItems = "";
  for (let i = 0; i < results.length; i++) {
    let title = results[i].name;
    let firstAirDate =
      results[i].first_air_date !== undefined
        ? results[i].first_air_date.substr(0, 4)
        : "";
    menuItems += `${i + 1}. ${title} ${
      firstAirDate !== "" ? `(${firstAirDate})` : ""
    }\n`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Here are the search results for "${query}":`)
    .setColor(0x337fd5)
    .setDescription(menuItems)
    .setFooter(
      "Type the number of the TV show you want to show information for."
    );

  message.channel.send(embed).then((msg) => {
    const collector = msg.channel.createMessageCollector(
      (m) => m.author.id === message.author.id,
      {
        time: 1000 * 10,
        errors: ["time"],
      }
    );

    collector.on("collect", (m) => {
      if (
        !isNaN(m.content) &&
        parseInt(m.content) >= 1 &&
        parseInt(m.content) <= results.length
      ) {
        m.delete();
        const index = parseInt(m.content, 10);
        const show = results[index - 1];
        collector.stop();
        msg.edit(showTVInfo(show));
      } else {
        m.delete();
        return message.channel
          .send(
            `Invalid selection. Please select a number from 1 to ${results.length}.`
          )
          .then((m) => m.delete({ timeout: 1000 * 2 }));
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        return message.channel.send(`You did not choose a TV show in time.`);
      }
    });
  });
};

const showTVInfo = (show) => {
  const showID = show.id;
  const showName = show.name;
  const showLang = show.original_language;
  const showOrigName = show.original_name;
  const showPoster = show.poster_path;
  const showFirstAirDate =
    show.first_air_date !== "" || show.first_air_date !== undefined
      ? new Date(show.first_air_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";
  const showVoteAverage = show.vote_average;
  const showDescription = show.overview;
  const msgEmbed = new MessageEmbed()
    .setAuthor(
      `${showName} ${showLang !== "en" ? `(${showOrigName})` : ""}`,
      "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg",
      `https://www.themoviedb.org/tv/${showID}`
    )
    .setColor(0x337fd5)
    .setThumbnail(
      showPoster ? `https://image.tmdb.org/t/p/w500/${showPoster}` : null
    )
    .setDescription(
      `${showDescription}\n\nMore info: https://www.themoviedb.org/tv/${showID}`
    )
    .addFields(
      {
        name: "**First Air Date**",
        value: showFirstAirDate,
        inline: true,
      },
      {
        name: "**Rating (out of 10)**",
        value: showVoteAverage,
        inline: true,
      }
    )
    .setFooter(
      `Powered by TMDB`,
      "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
    );
  return msgEmbed;
};
