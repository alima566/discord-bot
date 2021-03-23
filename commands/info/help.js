const { MessageEmbed } = require("discord.js");

module.exports = {
  description: "Lists out all the commands that KelleeBot has.",
  category: "❗ Info",
  minArgs: 0,
  maxArgs: 1,
  syntax: "[command_name]",
  callback: ({ message, instance, client, prefix, args }) => {
    const helpMenu = new MessageEmbed()
      .setAuthor(
        `KelleeBot - Help Menu`,
        message.guild.iconURL({ dynamic: true })
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setColor("#ecc5ff")
      .addField(
        "**Info**",
        `To see more information on a specific command, use \`${prefix}help [Command Name]\`.`,
        false
      )
      .addField(
        "**Prefix**",
        `My default prefix for this server is \`${prefix}\`. Server admins can easily change this by executing the command \`${prefix}prefix <New Prefix>\`.
        
        **Note:** \`<>\` means required arguments. \`[]\` means optional arguments.`,
        false
      );

    const categories = groupBy(
      instance.commandHandler.commands,
      (command) => command.category
    );
    for (const [key, value] of categories.entries()) {
      helpMenu.addFields({
        name: `**${key}**`,
        value: value.map((n) => `\`${n.names[0]}\``).join(", "),
        inline: true,
      });
    }

    if (!args.length) {
      return message.channel.send(helpMenu);
    }

    const commandName = args[0].toLowerCase();
    const commands = groupBy(
      instance.commandHandler.commands,
      (command) => command.names[0]
    );

    if (commands.has(commandName)) {
      const { names, description, syntax } = commands.get(commandName)[0];

      const cmdSyntax =
        syntax !== ""
          ? `\n**Syntax:** \`${prefix}${names[0]} ${syntax}\``
          : "\n";
      const aliases =
        names.length > 1 ? `\n\n**Aliases:** ${names.join(", ")}` : "";

      const commandEmbed = new MessageEmbed()
        .setAuthor(commandName, message.guild.iconURL({ dynamic: true }))
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setColor("#ecc5ff")
        .setDescription(`${description}${aliases}${cmdSyntax}`)
        .setTimestamp();
      return message.channel.send(commandEmbed);
    } else {
      return message.channel.send(
        `I do not have a command by the name of \`${args[0]}\``
      );
    }
  },
};

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      //Don't show commands from these categories in the help menu
      if (
        key !== "" &&
        key !== "Admin" &&
        key !== "Configuration" &&
        key !== "Giveaways" &&
        key !== "Testing" &&
        key !== "Utils"
      )
        map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  return map;
};
