const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  description: "Unbans a member from the server",
  expectedArgs: "<The target's ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const userID = args[0];
    const reason = args.slice(1).join(" ");

    if (!userID) {
      return message.reply("Please specify a member to unban.");
    }

    if (
      !guild.me.hasPermission("KICK_MEMBERS") ||
      !guild.me.hasPermission("BAN_MEMBERS")
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    guild.fetchBans().then((bans) => {
      if (bans.size == 0) {
        return message.reply(`This server doesn't have any banned members.`);
      }

      const bannedUser = bans.find((b) => b.user.id === userID);
      if (!bannedUser) {
        return message.reply(`I could not find that member.`);
      }

      guild.members
        .unban(bannedUser.user, reason)
        .then((user) => {
          channel.send(`Successfully unbanned ${user.tag} from the server.`);
          const msgEmbed = new MessageEmbed()
            .setColor("#33a532")
            .setAuthor(author.tag, author.displayAvatarURL())
            .setThumbnail(user.displayAvatarURL())
            .setDescription(
              `**Member:** ${user.tag}\n**Action:** Unban${
                reason !== "" ? `\n**Reason:** ${reason}` : ""
              }`
            )
            .setTimestamp()
            .setFooter(`ID: ${user.id}`);
          sendMessageToBotLog(client, guild, msgEmbed);
        })
        .catch((e) => {
          message.reply(
            "An error occurred. Could not unban user. Please try again."
          );
          return console.log(e.message);
        });
    });
  },
};
