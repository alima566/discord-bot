const { MessageEmbed, Permissions } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  description: "Bans a member from the server",
  expectedArgs: "<The target's @ OR ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: async ({ message, args, client }) => {
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
      return message.reply(`I do not have the permissions to ban that member.`);
    }

    if (
      !guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ||
      !guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    const memberInfo = await fetchMemberInfo(guild, member);
    const memberInfoEmbed = new MessageEmbed()
      .setColor("#CC0202")
      .setAuthor(member.user.tag, member.user.displayAvatarURL());
    if (memberInfo !== null) {
      const { bans, warnings, kicks, unbans } = memberInfo;
      memberInfoEmbed.setFooter(
        `Bans: ${bans.length} | Warns: ${warnings.length} | Kicks: ${kicks.length} | Unbans: ${unbans.length}`
      );
    } else {
      memberInfoEmbed.setFooter(`Bans: 0 | Warns: 0 | Kicks: 0 | Unbans: 0`);
    }

    channel
      .send(
        `Are you sure you want to ban **${member.user.tag}**${
          reason ? ` for ${reason}` : ""
        }? (Y/N)`,
        { embed: memberInfoEmbed }
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
                .then((m) => {
                  client.setTimeout(() => m.delete(), 1000 * 3);
                });
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

const fetchMemberInfo = async (guild, member) => {
  const result = await memberInfoSchema.findOne({
    guildID: guild.id,
    userID: member.id,
  });
  return result ? result : null;
};

const ban = (member, message, client, reason) => {
  member
    .ban({ days: 7, reason })
    .then(async (mem) => {
      const memberObj = {
        guildID: message.guild.id,
        userID: mem.user.id,
      };

      const ban = {
        executor: message.author.id,
        timestamp: new Date().getTime(),
        reason,
        messageLink: message.url,
      };

      const kick = {
        executor: message.author.id,
        timestamp: new Date().getTime(),
        reason: "Kicked due to being banned from server.",
        messageLink: message.url,
      };

      await memberInfoSchema.findOneAndUpdate(
        memberObj,
        {
          ...memberObj,
          $push: {
            bans: ban,
            kicks: kick,
          },
        },
        {
          upsert: true,
        }
      );

      message.channel.send(`Successfully banned **${mem.user.tag}**`);
      const msgEmbed = new MessageEmbed()
        .setColor("#CC0202")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(mem.user.displayAvatarURL({ dynamic: true }))
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
