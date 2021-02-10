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

    if (member.id === author.id) {
      return message.reply(`Nice try, but you can't ban yourself.`);
    }

    if (!member.bannable) {
      message.reply(`I do not have the permissions to ban that member.`);
    }

    if (
      !guild.me.hasPermission("KICK_MEMBERS") ||
      !guild.me.hasPermission("BAN_MEMBERS")
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    channel
      .send(
        `Are you sure you want to ban **${member.user.tag}**${
          reason ? ` for ${reason}` : ""
        }? (Y/N)`
      )
      .then((msg) => {
        const collector = msg.channel.createMessageCollector(
          (m) => m.author.id === author.id,
          {
            time: 1000 * 10,
            errors: ["time"],
          }
        );

        collector.on("collect", (m) => {
          switch (m.content.charAt(0).toUpperCase()) {
            case "Y":
              collector.stop();
              ban(member, message, client, reason);
              channel.send(`Successfully banned **${member.user.tag}**`);
              break;
            case "N":
              collector.stop();
              channel.send(`**${member.user.tag}** was not banned.`);
              break;
            default:
              m.delete();
              channel
                .send(
                  `Invalid selection. Please type either Y (Yes) or N (No).`
                )
                .then((m) => m.delete({ timeout: 1000 * 2 }));
              break;
          }
        });

        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            return channel.send(
              `You did not choose a response in time. **${member.user.tag}** was not banned.`
            );
          }
        });
      });
  },
};

const ban = (member, message, client, reason) => {
  member
    .ban({ days: 7, reason })
    .then((mem) => {
      message.channel.send(`Successfully banned **${member.user.tag}**`);

      const msgEmbed = new MessageEmbed()
        .setColor("#CC0202")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(mem.user.displayAvatarURL())
        .setDescription(
          `**Member:** ${mem.user.tag}\n**Action:** Ban${
            reason !== "" ? `\n**Reason:** ${reason}` : ""
          }`
        )
        .setTimestamp()
        .setFooter(`ID: ${mem.id}`);

      sendMessageToBotLog(client, message.guild, msgEmbed);
    })
    .catch((e) => {
      return console.log(e.message);
    });
};
