const fetch = require("node-fetch");
const { log } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Misc",
  minArgs: 1,
  expectedArgs: "<Country Name>",
  cooldown: "15s",
  description: "Gives you information about a country.",
  callback: async ({ message, text }) => {
    const { channel } = message;
    fetch(`https://restcountries.eu/rest/v2/name/${text}?fullText=true`)
      .then((resp) => resp.json())
      .then((data) => {
        const countryName = data[0].name;
        const countryPop = data[0].population;
        const countryRegion = data[0].subregion;
        const countryCapital = data[0].capital;
        const countryDemonym = data[0].demonym;
        const countryAreaKM = data[0].area;
        const countryAreaM = parseInt(countryAreaKM * 0.62137).toLocaleString();
        const countryNativeName = data[0].nativeName;
        const countryCurrencyName = data[0].currencies[0].name;
        const countryCurrencyCode = data[0].currencies[0].code;
        const countryCurrencySymbol = data[0].currencies[0].symbol;
        const countryCode = data[0].alpha3Code;
        const countryFlag = `http://www.countryflags.io/${data[0].alpha2Code}/flat/64.png`;
        const countryLanguages = data[0].languages
          .map((l) => l.name)
          .join(", ");

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
              value: `${countryAreaKM.toLocaleString()}km (${countryAreaM}m)`,
              inline: true,
            }
          )
          .setFooter("Country data provided by restcountries.eu");

        channel.send(msgEmbed);
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
