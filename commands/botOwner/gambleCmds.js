const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Bot Owner",
  description: "List out all the gambling commands",
  ownerOnly: true,
  permissionError: "You must be the bot owner to execute this command.",
  callback: ({ message, prefix, instance }) => {
    message.delete();
    let description = ">>> "; // Put description in multi-line block quote
    const embed = new MessageEmbed()
      .setTitle(`Gambling Commands`)
      .setColor("#85bb65");
    instance.commandHandler.commands.forEach((command) => {
      if (command.category === "Gambling") {
        description += `**Command:** ${prefix}${command.names[0]}\n`;
        if (command.names.length > 1) {
          description += `**Aliases:** ${command.names
            .slice(1)
            .map((t) => `${prefix}${t}`)
            .join(", ")}\n`;
        }
        description +=
          command.syntax !== ""
            ? `**Syntax:** \`${prefix}${command.names[0]} ${command.syntax}\`\n`
            : "";

        description += `**Description:** ${command.description}\n\n`;
      }
    });
    embed.setDescription(
      `Below is a list of gambling commands that you can use:\n\n ${description}`
    );
    message.channel.send(embed).then((msg) => msg.pin());
  },
};
