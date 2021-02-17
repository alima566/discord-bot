const { MessageEmbed } = require("discord.js");

const pollOptions = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

module.exports = {
  category: "Admin",
  expectedArgs: '<"Poll title"> <"Options">',
  minArgs: 3,
  description: "Creates a poll.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, text }) => {
    message.delete();
    const regex = text.match(/"[^"]+"|[\\S]+"[^"]+/g);

    if (!regex) {
      return message
        .reply(
          `In order for polls to work correctly, please surround your text with double quotes (i.e.) !poll "Poll Question" "Poll Option 1" "Poll Option 2" etc...`
        )
        .then((msg) => {
          msg.delete({ timeout: 1000 * 3 });
        });
    }

    const pollQuestion = regex.shift().replace(/"/g, "");

    if (regex.length < 2) {
      return message.reply(`Please provide at least 2 poll options.`);
    }

    if (regex.length > pollOptions.length) {
      return message.reply(
        `You can only have a maximum of ${pollOptions.length} poll options.`
      );
    }

    let str = "";
    let i = 0;
    for (let poll of regex) {
      poll = poll.replace(/"/g, "");
      str += `${pollOptions[i]} ${capFirstLetter(poll)}\n`;
      i++;
    }

    const msgEmbed = new MessageEmbed()
      .setColor(0x337fd5)
      .setAuthor(
        `Poll started by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setDescription(str)
      .setTimestamp();

    const msg = await message.channel.send(
      `📊 ${capFirstLetter(pollQuestion)}`,
      {
        embed: msgEmbed,
      }
    );

    for (let i = 0; i < regex.length; i++) {
      await msg.react(pollOptions[i]);
    }
  },
};

const capFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
