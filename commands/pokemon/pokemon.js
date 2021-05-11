const Pokedex = require("pokedex-promise-v2");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

const embedColor = {
  normal: 0x9b9b6b,
  fire: 0xe5711e,
  water: 0x4c7bed,
  electric: 0xf2c617,
  grass: 0x69b741,
  ice: 0x7fcece,
  fighting: 0xaf2c25,
  poison: 0x8e398e,
  ground: 0xd9b34a,
  flying: 0x9c88da,
  psychic: 0xf7356f,
  bug: 0x9ba91e,
  rock: 0xa48f32,
  ghost: 0x634e86,
  dragon: 0x6124f5,
  dark: 0x5e493c,
  style: 0xa6a6c4,
  fairy: 0xe484e4,
};

module.exports = {
  slash: "both",
  category: "🍚 Pokemon",
  expectedArgs: "<pokemon>",
  minArgs: 1,
  description: "Retrieve information about a specific Pokémon.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    const P = new Pokedex();
    const pokeName = text.toLowerCase().trim();

    try {
      const result = await P.getPokemonByName(pokeName);
      const height = result.height * 10;
      const weight = result.weight / 10;

      const msgEmbed = new MessageEmbed()
        .setAuthor(
          `#${result.id} - ${capFirstLetter(result.species.name)}`,
          "http://pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG12.png"
        )
        .setColor(embedColor[result.types[0].type.name])
        .setThumbnail(result.sprites.front_default)
        .addFields(
          {
            name: "**Height**",
            value: `${toFeet(height)} (${height}cm)`,
            inline: true,
          },
          {
            name: "**Weight**",
            value: `${kgToLbs(weight)} (${weight}kg)`,
            inline: true,
          },
          {
            name: result.types.length > 1 ? "**Types**" : "**Type**",
            value: result.types
              .map((t) => capFirstLetter(t.type.name))
              .join(", "),
            inline: true,
          },
          {
            name: `**Abilities [${result.abilities.length}]**`,
            value: result.abilities
              .map((a) => capFirstLetter(a.ability.name))
              .join(", "),
            inline: true,
          },
          {
            name: `**Stats**`,
            value: result.stats
              .map((s) => `${capFirstLetter(s.stat.name)} [${s.base_stat}]`)
              .join(", "),
            inline: true,
          },
          {
            name: `**Moves [${result.moves.length}]**`,
            value: result.moves
              .map((m) => capFirstLetter(m.move.name))
              .slice(0, 5)
              .join(", "),
            inline: true,
          }
        );
      return message ? message.channel.send(msgEmbed) : msgEmbed;
    } catch (e) {
      const errorMsg = "I couldn't find that Pokémon :sob:";
      log(
        "ERROR",
        "./commands/pokemon/pokemon.js",
        `An error has occurred: ${e.message}`
      );
      return message ? message.channel.send(errorMsg) : errorMsg;
    }
  },
};

const capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const toFeet = (number) => {
  const realFeet = (number * 0.3937) / 12;
  const feet = Math.floor(realFeet);
  const inches = Math.round((realFeet - feet) * 12);
  return `${feet}ft ${inches}in`;
};

const kgToLbs = (pK) => {
  const nearExact = pK / 0.45359237;
  const lbs = Math.floor(nearExact);
  return `${lbs}lbs`;
};
