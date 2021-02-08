const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  description: "Kicks a member from the server",
  expectedArgs: "<The target's @> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: ({ message, args, client }) => {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(" ");
    const { guild, author, channel } = message;

    if (!member) {
      return message.reply("Please specify a member to kick.");
    }

    if (!guild.me.hasPermission("KICK_MEMBERS")) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    member
      .kick(reason)
      .then((mem) => {
        channel.send(`${mem} was successfully kicked from the server.`);

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
