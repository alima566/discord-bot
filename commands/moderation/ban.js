const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  description: "Bans a member from the server",
  expectedArgs: "<The target's @ OR ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const member =
      message.mentions.members.first() || guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!member) {
      return message.reply("Please specify a member to ban.");
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
      .ban({ days: 7, reason })
      .then((mem) => {
        channel.send(`Successfully banned ${mem.user.tag} from the server.`);

        const msgEmbed = new MessageEmbed()
          .setColor("#CC0202")
          .setAuthor(author.tag, author.displayAvatarURL())
          .setThumbnail(mem.user.displayAvatarURL())
          .setDescription(
            `**Member:** ${mem.user.tag}\n**Action:** Ban${
              reason !== "" ? `\n**Reason:** ${reason}` : ""
            }`
          )
          .setTimestamp()
          .setFooter(`ID: ${mem.id}`);
        sendMessageToBotLog(client, guild, msgEmbed);
      })
      .catch((e) => {
        if (!member.bannable) {
          message.reply(`I do not have the permissions to ban that member.`);
        }
        return console.log(e.message);
      });
  },
};
