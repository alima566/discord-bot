const movieDB = require("moviedb")(process.env.MOVIEDB_API_KEY);
const { log } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Misc",
  minArgs: 1,
  expectedArgs: "<Movie Title>",
  cooldown: "15s",
  description: "Gives you information about a movie.",
  callback: async ({ message, text }) => {
    movieDB.searchMovie(
      {
        query: text.toLowerCase(),
        page: 1,
        include_adult: false,
      },
      (err, res) => {
        if (!err) {
          const movieID = res.results[0].id;
          const movieName = res.results[0].original_title;
          const movieLang = res.results[0].original_language;
          const movieTitle = res.results[0].title;
          const moviePoster = res.results[0].poster_path;
          const movieReleaseDate = new Date(
            res.results[0].release_date
          ).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const movieVoteAverage = res.results[0].vote_average;
          const movieDescription = res.results[0].overview;

          const msgEmbed = new MessageEmbed()
            .setAuthor(
              `${movieName} ${movieLang !== "en" ? `(${movieTitle})` : ""}`,
              "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg",
              `https://www.themoviedb.org/movie/${movieID}`
            )
            .setColor(0x337fd5)
            .setThumbnail(
              moviePoster
                ? `https://image.tmdb.org/t/p/w500/${moviePoster}`
                : null
            )
            .setDescription(
              `${movieDescription}\n\nMore info: https://www.themoviedb.org/movie/${movieID}`
            )
            .addFields(
              {
                name: "**Release Date**",
                value: movieReleaseDate,
                inline: true,
              },
              {
                name: "**Rating (out of 10)**",
                value: movieVoteAverage,
                inline: true,
              }
            )
            .setFooter(
              `Powered by TMDB`,
              "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
            );
          channel.send(msgEmbed);
        } else {
          log(
            "ERROR",
            "./commands/misc/movie.js",
            `An error has occurred: ${err.message}`
          );
          return channel.send(`I couldn't find the specified movie "${text}".`);
        }
      }
    );
  },
};
