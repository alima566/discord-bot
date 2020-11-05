const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = {
  commands: "pokemon",
  expectedArgs: "<pokemon_name> OR <pokedex_number>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific Pokémon. Command works with either the Pokémon name or its Pokédex number.",
  cooldown: 15,
  callback: (msg, args, text) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${args[0].toLowerCase()}/`)
      .then((response) => response.json())
      .then((data) => {
        let pokeName = `${capFirstLetter(data.name)}`;
        let image = `https://pokeres.bastionbot.org/images/pokemon/${data.id}.png`;
        let pokedexLink = `https://www.pokemon.com/us/pokedex/${data.id}`;
        let bulbapedia = `https://bulbapedia.bulbagarden.net/wiki/${pokeName}_(Pokémon)`;
        let weight = data.weight / 10;
        //console.log(data);
        let msgEmbed = new MessageEmbed()
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
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that Pokémon :sob:`);
      });
  },
};

function capFirstLetter(string) {
  var words = string.split(/(\s|-)+/),
    output = [];

  for (var i = 0, len = words.length; i < len; i += 1) {
    output.push(words[i][0].toUpperCase() + words[i].toLowerCase().substr(1));
  }

  return output.join("");
  //return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPokemonType(pokeType) {
  let pokeTypeDesc = [];
  pokeType.forEach((type) => {
    pokeTypeDesc.push(capFirstLetter(type["type"]["name"]));
  });
  return pokeTypeDesc;
}

function getPokemonAbilites(pokeAbilities) {
  let pokeAbilitiesDesc = [];
  pokeAbilities.forEach((ability) => {
    pokeAbilitiesDesc.push(capFirstLetter(ability["ability"]["name"]));
  });
  return pokeAbilitiesDesc;
}
