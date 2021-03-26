const { MessageEmbed, MessageCollector } = require("discord.js");
const weather = require("weather-js");
const { convert } = require("convert");
const geoTz = require("geo-tz");
const { utcToZonedTime, format } = require("date-fns-tz");
const { log } = require("@utils/functions");

module.exports = {
  category: "💡 Misc",
  cooldown: "15s",
  minArgs: 1,
  maxArgs: -1,
  expectedArgs: "<city>",
  description: "Gives you the current weather of the specified location.",
  callback: ({ message, args, client }) => {
    const input = args.join(" ");
    weather.find({ search: input, degreeType: "C" }, (err, result) => {
      if (err) {
        log(
          "ERROR",
          "./commands/misc/weather.js",
          `An error occurred: ${err.message}`
        );
        return message.channel.send(
          "An error occurred while trying to fetch weather data. Please try again."
        );
      }

      if (!result || result.length === 0) {
        return message.channel.send(`No results were found for "${input}".`);
      }

      if (result[0] === undefined || !result[0]) {
        return message.channel.send(
          `No weather results were found for "${input}".`
        );
      }

      if (result.length > 1) {
        showAllCities(input, result, message, client);
      } else {
        message.channel.send(showWeatherResult(result[0]));
      }
    });
  },
};

const convertToFahrenheit = (temp) => {
  return convert(temp).from("celsius").to("fahrenheit").toFixed(1);
};

const showAllCities = (query, results, message, client) => {
  let menuItems = "";
  for (let i = 0; i < results.length; i++) {
    menuItems += `${i + 1}. ${results[i].location.name}\n`;
  }

  const menuEmbed = new MessageEmbed()
    .setTitle(`Here are the search results for ${query}`)
    .setColor("0xFFC334")
    .setDescription(menuItems)
    .setFooter(
      "Type the number of the city you want to show weather results for."
    );

  message.channel.send(menuEmbed).then((msg) => {
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
        const city = results[index - 1];
        collector.stop();
        msg.edit(showWeatherResult(city));
      } else {
        m.delete();
        return message.channel
          .send(
            `Invalid selection. Please select a number from 1 to ${results.length}.`
          )
          .then((m) => {
            client.setTimeout(() => m.delete(), 1000 * 3);
          });
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        return message.channel.send(`You did not choose a city in time.`);
      }
    });
  });
};

const showWeatherResult = (city) => {
  const location = city.location;
  const current = city.current;
  const miles = convert(current.windspeed.split(" ")[0])
    .from("kilometers")
    .to("miles")
    .toFixed(1);
  const timezone = getTimezone(current, location);
  const lastUpdatedAt = current.observationtime.substring(
    0,
    current.observationtime.length - 3 // Remove ":00" from time
  );

  const msgEmbed = new MessageEmbed()
    .setTitle(`Current Weather for ${location.name}`)
    .setThumbnail(current.imageUrl)
    .setColor("0xFFC334")
    .addFields(
      {
        name: "**Local Time**",
        value: getTimezone(current, location, true),
        inline: false,
      },
      {
        name: "**Location**",
        value: location.name,
        inline: true,
      },
      {
        name: "**Current Weather**",
        value: current.skytext,
        inline: true,
      },
      {
        name: "**Wind Speed**",
        value: `${current.windspeed} (${miles} m/h)`,
        inline: true,
      },
      {
        name: "**Temperature**",
        value: `${current.temperature}°C (${convertToFahrenheit(
          current.temperature
        )}°F)`,
        inline: true,
      },
      {
        name: "**Feels Like**",
        value: `${current.feelslike}°C (${convertToFahrenheit(
          current.feelslike
        )}°F)`,
        inline: true,
      },
      {
        name: "**Humidity**",
        value: `${current.humidity}%`,
        inline: true,
      }
    )
    .setFooter(`Forecast last updated at ${lastUpdatedAt} ${timezone}`);
  return msgEmbed;
};

const getTimezone = (current, location, showTime) => {
  const lat = location.lat;
  const long = location.long;

  const timeFormat = showTime ? "EEE, MMM d, yyyy h:mm a zzz" : "zzz";
  const date = current.date;
  const time = current.observationtime;
  const timeZone = geoTz(+lat, +long)[0];
  const lastUpdated = utcToZonedTime(`${date} ${time}`, timeZone);
  const localTime = utcToZonedTime(new Date(), timeZone);

  return showTime
    ? format(localTime, timeFormat, { timeZone })
    : format(lastUpdated, timeFormat, { timeZone });
};
