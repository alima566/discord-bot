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
  callback: (msg, args) => {
    const input = args.join(" ");
    weather.find({ search: input, degreeType: "C" }, (err, result) => {
      console.log(result);
      if (err) {
        return console.log(err);
      }

      if (!result || result.length === 0) {
        return msg.channel.send(`No results were found.`);
      }

      if (result.length > 1) {
        showAllCities(input, result, msg);
      } else {
        showWeatherResult(result[0], msg, input);
      }
    });
  },
};

const convertToFahrenheit = (temp) => {
  return convert(temp).from("celsius").to("fahrenheit").toFixed(1);
};

const showAllCities = (query, results, msg) => {
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

  const collector = msg.channel.createMessageCollector(
    (m) => m.author.id === msg.author.id,
    {
      time: 1000 * 10,
      errors: ["time"],
    }
  );

  collector.on("collect", ({ content }) => {
    if (
      !isNaN(content) &&
      parseInt(content) >= 1 &&
      parseInt(content) <= results.length
    ) {
      const index = parseInt(content, 10);
      const city = results[index - 1];
      collector.stop();
      showWeatherResult(city, msg, query);
    } else {
      return msg.channel.send(
        `Invalid selection. Please select a number from 1 to ${results.length}.`
      );
    }
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time") {
      return msg.channel.send(`You did not choose a city in time.`);
    }
  });

  msg.channel.send(menuEmbed);
};

const showWeatherResult = (city, msg, input) => {
  const msgEmbed = new MessageEmbed();
  if (city === undefined || !city) {
    return msg.channel.send(`No weather results were found for ${input}.`);
  }

  const location = city.location;
  const current = city.current;
  const miles = convert(current.windspeed.split(" ")[0])
    .from("kilometers")
    .to("miles")
    .toFixed(1);

  msgEmbed
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

  msg.channel.send(msgEmbed);
};
