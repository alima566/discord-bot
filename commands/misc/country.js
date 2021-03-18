const fetch = require("node-fetch");
const { log } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "💡 Misc",
  minArgs: 1,
  expectedArgs: "<Country Name>",
  cooldown: "15s",
  description: "Gives you information about a country.",
  callback: async ({ message, text, client }) => {
    const { channel } = message;
    fetch(`https://restcountries.eu/rest/v2/name/${text}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (!data || data.length === 0) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (data[0] === undefined || !data[0]) {
          return channel.send(`No results were found for "${text}".`);
        }

        if (data.length > 1) {
          showAllResults(text, data, message, client);
        } else {
          channel.send(showCountryInfo(data[0]));
        }
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/misc/country.js",
          `An error has occurred: ${e.message}`
        );
        return channel.send(
          `An error has occurred. Unable to fetch country information.`
        );
      });
  },
};

const showAllResults = (query, results, message, client) => {
  let menuItems = "";
  for (let i = 0; i < results.length; i++) {
    menuItems += `${i + 1}. ${results[i].name}\n`;
  }

  const embed = new MessageEmbed()
    .setTitle(`Here's what I found for "${query}":`)
    .setColor(0x337fd5)
    .setDescription(menuItems)
    .setFooter(
      "Type the number of the country you want to show information for."
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
        const country = results[index - 1];
        collector.stop();
        msg.edit(showCountryInfo(country));
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
        return message.channel.send(`You did not choose a country in time.`);
      }
    });
  });
};

const showCountryInfo = (data) => {
  const countryName = data.name;
  const countryPop = data.population;
  const countryRegion = data.subregion;
  const countryCapital = data.capital;
  const countryDemonym = data.demonym;
  const countryAreaKM = data.area || "-";
  const countryAreaM =
    countryAreaKM !== "-"
      ? parseInt(countryAreaKM * 0.62137).toLocaleString()
      : "-";
  const countryNativeName = data.nativeName;
  const countryCurrencyName = data.currencies[0].name;
  const countryCurrencyCode = data.currencies[0].code;
  const countryCurrencySymbol = data.currencies[0].symbol;
  const countryCode = data.alpha3Code;
  const countryFlag = `http://www.countryflags.io/${data.alpha2Code}/flat/64.png`;
  const countryLanguages = data.languages.map((l) => l.name).join(", ");

  const msgEmbed = new MessageEmbed()
    .setColor(0x337fd5)
    .setAuthor(`Country Information - ${countryCode}`, countryFlag)
    .setThumbnail(countryFlag)
    .setTitle(countryName)
    .addFields(
      {
        name: "**Population**",
        value: countryPop.toLocaleString(),
        inline: true,
      },
      {
        name: "**Capital City**",
        value: countryCapital === "" ? "-" : countryCapital,
        inline: true,
      },
      {
        name: "**Main Currency**",
        value: `${countryCurrencyName} (${countryCurrencySymbol} ${countryCurrencyCode})`,
        inline: true,
      },
      {
        name: "**Located In**",
        value: countryRegion,
        inline: true,
      },
      {
        name: "**Demonym**",
        value: countryDemonym,
        inline: true,
      },
      {
        name: "**Native Name**",
        value: countryNativeName,
        inline: true,
      },
      {
        name: "**Languages**",
        value: countryLanguages,
        inline: true,
      },
      {
        name: "**Area**",
        value:
          countryAreaKM === "-"
            ? "-"
            : `${countryAreaKM.toLocaleString()}km (${countryAreaM}m)`,
        inline: true,
      }
    )
    .setFooter("Country data provided by restcountries.eu");
  return msgEmbed;
};
