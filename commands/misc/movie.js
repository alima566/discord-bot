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
    const { channel } = message;
    movieDB.searchMovie(
      {
        query: text.toLowerCase(),
        page: 1,
        include_adult: false,
      },
      (err, res) => {
        if (err) {
          log(
            "ERROR",
            "./commands/misc/movie.js",
            `An error has occurred: ${err}`
          );
          return channel.send(
            `An error has occurred. Unable to fetch movie information.`
          );
        }

        if (!res || res.length === 0) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (res.results[0] === undefined || !res.results[0]) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (res.results.length > 1) {
          showAllMovies(text, res.results, message);
        } else {
          channel.send(showMovieInfo(res.results[0]));
        }
      }
    );
  },
};

const showAllMovies = (query, results, message) => {
  let menuItems = "";
  for (let i = 0; i < results.length; i++) {
    let title = results[i].original_title;
    let releaseYear =
      results[i].release_date !== undefined
        ? results[i].release_date.substr(0, 4)
        : "";
    menuItems += `${i + 1}. ${title} ${
      releaseYear !== "" ? `(${releaseYear})` : ""
    }\n`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Here are the search results for "${query}":`)
    .setColor(0x337fd5)
    .setDescription(menuItems)
    .setFooter(
      "Type the number of the movie you want to show information for."
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
        const movie = results[index - 1];
        collector.stop();
        msg.edit(showMovieInfo(movie));
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
        return message.channel.send(`You did not choose a movie in time.`);
      }
    });
  });
};

const showMovieInfo = (movie) => {
  const movieID = movie.id;
  const movieName = movie.original_title;
  const movieLang = movie.original_language;
  const movieTitle = movie.title;
  const moviePoster = movie.poster_path;
  const movieReleaseDate =
    movie.release_date !== undefined
      ? new Date(movie.release_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";
  const movieVoteAverage = movie.vote_average;
  const movieDescription = movie.overview;
  const msgEmbed = new MessageEmbed()
    .setAuthor(
      `${movieName} ${movieLang !== "en" ? `(${movieTitle})` : ""}`,
      "https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg",
      `https://www.themoviedb.org/movie/${movieID}`
    )
    .setColor(0x337fd5)
    .setThumbnail(
      moviePoster ? `https://image.tmdb.org/t/p/w500/${moviePoster}` : null
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
  return msgEmbed;
};
