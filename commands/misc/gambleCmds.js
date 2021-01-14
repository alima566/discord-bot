const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["gambleCmd"],
  description: "List out all the gambling commands",
  ownerOnly: true,
  permissionError: "You must be the bot owner to execute this command.",
  callback: ({ message, prefix, instance }) => {
    let description = "";
    const embed = new MessageEmbed()
      .setTitle(`Gambling Commands`)
      .setColor("#7289da");
    instance.commandHandler.commands.forEach((command) => {
      if (command.category === "Gambling") {
        description += `Command: ${prefix}${command.names[0]}\n`;
        if (command.names.length > 1) {
          for (const alias of command.names) {
            description += `Alias: ${alias}`;
          }
        }
        console.log(command);
      }
    });
    embed.setDescription(description);
    message.channel.send(embed);
  },
};
