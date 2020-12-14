const { MessageEmbed, Message } = require("discord.js");
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
    const msgEmbed = new MessageEmbed();
    const input = args.join(" ");
    weather.find({ search: input, degreeType: "C" }, (err, result) => {
      console.log(result);
      if (err) {
        return console.log(err);
      }

      if (!result) {
        return msg.channel.send(`No results were found.`);
      }

      const localArr = result[0];
      if (localArr === undefined) {
        return msg.channel.send(
          `I have failed to find weather data for ${input}.`
        );
      }

      if (localArr.length == 0) {
        return msg.channel.send(`No results were found.`);
      }

      const location = localArr.location;
      const current = localArr.current;
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
    });
  },
};

const convertToFahrenheit = (temp) => {
  return convert(temp).from("celsius").to("fahrenheit").toFixed(1);
};
