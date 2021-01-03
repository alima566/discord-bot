const { MessageEmbed, MessageCollector } = require("discord.js");
const weather = require("weather-js");
const { convert } = require("convert");

module.exports = {
  commands: "weather",
  category: "Misc",
  cooldown: "15s",
  minArgs: 1,
  maxArgs: -1,
  expectedArgs: "<city>",
  description: "Gives you the current weather of the specified location.",
  callback: ({ message, args }) => {
    const input = args.join(" ");
    weather.find({ search: input, degreeType: "C" }, (err, result) => {
      if (err) {
        return console.log(err);
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
        showAllCities(input, result, message);
      } else {
        message.channel.send(showWeatherResult(result[0]));
      }
    });
  },
};

const convertToFahrenheit = (temp) => {
  return convert(temp).from("celsius").to("fahrenheit").toFixed(1);
};

const showAllCities = (query, results, message) => {
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

  message.channel.send(menuEmbed).then((message) => {
    const collector = message.channel.createMessageCollector(
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
        message.edit(showWeatherResult(city));
      } else {
        m.delete();
        return message.channel
          .send(
            `Invalid selection. Please select a number from 1 to ${results.length}.`
          )
          .then((m) => m.delete({ timeout: 2000 }));
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

  const msgEmbed = new MessageEmbed()
    .setTitle(`Current Weather for ${location.name}`)
    .setThumbnail(current.imageUrl)
    .setColor("0xFFC334")
    .addFields(
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
    .setFooter(`Forecast last updated at ${current.observationtime}`);
  return msgEmbed;
};
