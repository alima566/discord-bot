const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  description: "Kicks a member from the server",
  expectedArgs: "<The target's @ OR ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const member =
      message.mentions.members.first() || guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!member) {
      return message.reply("Please specify a member to kick.");
    }

    if (
      !guild.me.hasPermission("KICK_MEMBERS") ||
      !guild.me.hasPermission("BAN_MEMBERS")
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    member
      .kick(reason)
      .then((mem) => {
        channel.send(`Successfully kicked ${mem.user.tag} from the server.`);

        const msgEmbed = new MessageEmbed()
          .setColor("PURPLE")
          .setAuthor(author.tag, author.displayAvatarURL())
          .setThumbnail(mem.user.displayAvatarURL())
          .setDescription(
            `**Member:** ${mem.user.tag}\n**Action:** Kick${
              reason !== "" ? `\n**Reason:** ${reason}` : ""
            }`
          )
          .setTimestamp()
          .setFooter(`ID: ${mem.id}`);
        sendMessageToBotLog(client, guild, msgEmbed);
      })
      .catch((e) => {
        if (!member.kickable) {
          message.reply(`I do not have the permissions to kick that member.`);
        }
        return console.log(e.message);
      });
  },
};
