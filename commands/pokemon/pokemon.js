const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: "pokemon",
  category: "Pokemon",
  expectedArgs: "<pokemon_name> OR <pokedex_number>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific Pokémon. Command works with either the Pokémon name or its Pokédex number.",
  cooldown: "15s",
  callback: ({ message, args }) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${args[0].toLowerCase()}/`)
      .then((response) => response.json())
      .then((data) => {
        const pokeName = `${capFirstLetter(data.name)}`;
        const image = `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`;
        const pokedexLink = `https://www.pokemon.com/us/pokedex/${data.id}`;
        const bulbapedia = `https://bulbapedia.bulbagarden.net/wiki/${pokeName}_(Pokémon)`;
        const weight = data.weight / 10;
        //console.log(data);
        const msgEmbed = new MessageEmbed()
          .setColor("DARK_AQUA")
          .setURL(`${pokedexLink}`)
          .setAuthor(`#${data.id} - ${pokeName}`, `${image}`, `${pokedexLink}`)
          .setDescription(
            `More info about ${pokeName} can be found here:
               [Pokédex](${pokedexLink})
               [Bulbapedia](${bulbapedia})`
          )
          .setThumbnail(`${image}`)
          .addFields(
            {
              name: `**Type**`,
              value:
                getPokemonType(data.types).length > 0
                  ? getPokemonType(data.types).join(", ")
                  : "-",
              inline: true,
            },
            {
              name: `**Ability**`,
              value:
                getPokemonAbilites(data.abilities).length > 0
                  ? getPokemonAbilites(data.abilities).join(", ")
                  : "-",
              inline: true,
            },
            {
              name: `**Height**`,
              value: `${data.height / 10} m`,
              inline: true,
            },
            {
              name: `**Weight**`,
              value: `${weight.toFixed(1)} kg`,
              inline: true,
            }
          );
        message.channel.send(msgEmbed);
      })
      .catch((e) => {
        message.channel.send(`I couldn't find that Pokémon :sob:`);
        log(
          "ERROR",
          "./commands/pokemon/pokemon.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

const capFirstLetter = (string) => {
  var words = string.split(/(\s|-)+/),
    output = [];

  for (var i = 0, len = words.length; i < len; i += 1) {
    output.push(words[i][0].toUpperCase() + words[i].toLowerCase().substr(1));
  }

  return output.join("");
  //return string.charAt(0).toUpperCase() + string.slice(1);
};

const getPokemonType = (pokeType) => {
  let pokeTypeDesc = [];
  pokeType.forEach((type) => {
    pokeTypeDesc.push(capFirstLetter(type["type"]["name"]));
  });
  return pokeTypeDesc;
};

const getPokemonAbilites = (pokeAbilities) => {
  let pokeAbilitiesDesc = [];
  pokeAbilities.forEach((ability) => {
    pokeAbilitiesDesc.push(capFirstLetter(ability["ability"]["name"]));
  });
  return pokeAbilitiesDesc;
};
