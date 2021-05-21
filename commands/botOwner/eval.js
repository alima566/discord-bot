const { MessageEmbed } = require("discord.js");
const { guildIcon } = require("@utils/functions");

module.exports = {
  category: "Bot Owner",
  description: "Evaluates some JS code.",
  minArgs: 1,
  expectedArgs: "<The code to evaluate>",
  ownerOnly: true,
  callback: ({ message, text }) => {
    if (text.toLowerCase().includes("process.env.")) {
      return message.channel.send(
        "Those are super secret variables that I cannot show you."
      );
    }

    const msgEmbed = new MessageEmbed()
      .setColor("#DFBCF5")
      .setAuthor("Eval", guildIcon(message.guild));
    try {
      let output = eval(text.trim());
      if (typeof output !== "string") {
        output = require("util").inspect(output, { depth: 0 });
      }

      msgEmbed.addFields(
        {
          name: "**Input**",
          value: `\`\`\`JS\n${
            text.length > 1024 ? "Too large to display." : text
          }\`\`\``,
        },
        {
          name: "**Output**",
          value: `\`\`\`JS\n${
            output.length > 1024 ? "Too large to display." : output
          }\`\`\``,
        }
      );
    } catch (e) {
      msgEmbed.addFields(
        {
          name: "**Input**",
          value: `\`\`\`JS\n${
            text.length > 1024 ? "Too large to display." : text
          }\`\`\``,
        },
        {
          name: "**Output**",
          value: `\`\`\`JS\n${
            e.length > 1024 ? "Too large to display." : e
          }\`\`\``,
        }
      );
    }
    return message.channel.send(msgEmbed);
  },
};
