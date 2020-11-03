const { MessageEmbed } = require("discord.js");
const firstMessage = require("@utils/firstMessage");

module.exports = (client) => {
  const channelID = "732786545169399838";
  const getEmoji = (emojiName) =>
    client.emojis.cache.find((emoji) => emoji.name === emojiName);

  const emojis = {
    "✨": {
      role: "EE",
      description: "**For access to the Discord, please react with**",
    },
    "🧐": {
      role: "Live",
      description:
        "**If you want to get notified for when Kéllee goes `Live`, react with**",
    },
    kellee1HeartEyes: {
      role: "ACNH",
      description:
        "**For access to the `Animal Crossing` channel, react with**",
    },
    "🍚": {
      role: "POKE",
      description: "**For access to the `Pokemon` channel, react with**",
    },
    "🇹": {
      role: "TET",
      description: "**For access to the `Tetris` channel, react with**",
    },
    "🍜": {
      role: "Anime",
      description: "**For access to the `Anime` channel, react with**",
    },
    "⏰": {
      role: "Schedule",
      description:
        "**If you want to get notified for when Kéllee posts her stream `Schedule`, react with**",
    },
    "🎬": {
      role: "Movie Nights",
      description:
        "**If you want to get notified for `Movie Nights`, react with**",
    },
    kellee4Star: {
      role: "He/Him",
    },
    kellee3Star: {
      role: "She/Her",
    },
    kellee2Star: {
      role: "They/Them",
    },
  };

  const reactions = [];
  let emojiText = `:waning_crescent_moon: Hi Welcome to the Lunar Circle! (づ｡◕‿‿◕｡)づ :waxing_crescent_moon:

**Some House Rules:**

:heartpulse: No Spam :heartpulse:

:heartpulse: Be Kind :heartpulse:

:heartpulse: Include Others :heartpulse:

:heartpulse: Listen to the Moderators :heartpulse:

:heartpulse: No Bullying, Sexism, Racism, Homophobia or Other Hate-Based Chat :heartpulse:

:heartpulse: Nothing Which Violates the Discord TOS: https://discordapp.com/tos :heartpulse:\n\n`;
  for (const key in emojis) {
    const emoji = getEmoji(key) || key;
    //const emoji = typeof getEmoji(key) !== "undefined" ? getEmoji(key) : key;
    reactions.push(emoji);
    const role = emojis[key].role;
    if (emoji === "✨" || emoji === "🎬") {
      emojiText += `${emoji} ${emojis[key].description} ${emoji}
-----------------------------------------------------------------------------------------------\n`;
    } else if (
      emoji.name === "kellee4Star" ||
      emoji.name === "kellee3Star" ||
      emoji.name === "kellee2Star"
    ) {
      emojiText += `**React with ${emoji} for \`${emojis[key].role}\`**\n`;
    } else {
      emojiText += `${emoji} ${emojis[key].description} ${emoji}\n`;
    }
  }
  let msgEmbed = new MessageEmbed()
    .setColor("#34B1EB")
    .setDescription(emojiText);

  firstMessage(client, channelID, emojiText, reactions);

  const handleReaction = (reaction, user, add) => {
    if (user.id === "754033907267010560") {
      return;
    }

    const emoji = reaction._emoji.name;
    const { guild } = reaction.message;
    const roleName = emojis[emoji].role;

    if (!roleName) return;

    const role = guild.roles.cache.find((role) => role.name === roleName);
    const member = guild.members.cache.find((member) => member.id === user.id);

    if (add) {
      member.roles.add(role);
    } else {
      member.roles.remove(role);
    }
  };

  client.on("messageReactionAdd", (reaction, user) => {
    if (reaction.message.channel.id === channelID) {
      handleReaction(reaction, user, true);
    }
  });

  client.on("messageReactionRemove", (reaction, user) => {
    if (reaction.message.channel.id === channelID) {
      handleReaction(reaction, user, false);
    }
  });
};
