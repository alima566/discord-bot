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

    if (member.id === author.id) {
      return message.reply(`Nice try, but you can't kick yourself.`);
    }

    if (!member.kickable) {
      return message.reply(
        `I do not have the permissions to kick that member.`
      );
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
        `Are you sure you want to kick **${member.user.tag}**${
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
              kick(member, message, client, reason);
              break;
            case "N":
              collector.stop();
              channel.send(`**${member.user.tag}** was not kicked.`);
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
              `You did not choose a response in time. **${member.user.tag}** was not kicked.`
            );
          }
        });
      });
  },
};

const kick = (member, message, client, reason) => {
  member
    .kick(reason)
    .then((mem) => {
      message.channel.send(
        `Successfully kicked **${mem.user.tag}** from the server.`
      );

      const msgEmbed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(mem.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `**Member:** ${mem.user.tag}\n**Action:** Kick${
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
