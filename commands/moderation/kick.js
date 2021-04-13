const { MessageEmbed, Permissions } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");
const muteSchema = require("@schemas/mute-schema");

module.exports = {
  category: "🔨 Moderation",
  minArgs: 1,
  description: "Kicks a member from the server",
  expectedArgs: "<The target's @ OR ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: async ({ message, args, client }) => {
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
      message.member.roles.highest.comparePositionTo(member.roles.highest) < 0 // Can't warn members with a higher role
    ) {
      return message.reply(
        "You can't kick a member with a higher role than you."
      );
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
    const mutes = await muteSchema.find({
      guildID: guild.id,
      userID: member.id,
    });
    const memberInfoEmbed = new MessageEmbed()
      .setColor("#CC0202")
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      );
    if (memberInfo) {
      const { bans, warnings, kicks, unbans, softbans } = memberInfo;
      memberInfoEmbed.setDescription(
        `• Warns: ${warnings.length}\n• Mutes: ${mutes.length}\n• Kicks: ${kicks.length}\n• Bans: ${bans.length}\n• Soft Bans: ${softbans.length}\n• Unbans: ${unbans.length}\n`
      );
    } else {
      memberInfoEmbed.setDescription(
        `• Warns: 0\n• Mutes: ${mutes.length}\n• Kicks: 0\n• Bans: 0\n• Soft Bans: 0\n• Unbans: 0\n`
      );
    }

    channel
      .send(
        `Are you sure you want to kick **${member.user.tag}**${
          reason ? ` for ${reason}` : ""
        }? (Y/N)`,
        {
          embed: memberInfoEmbed,
        }
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
                .then((m) => {
                  client.setTimeout(() => m.delete(), 1000 * 3);
                });
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
    .then(async (mem) => {
      const memberObj = {
        guildID: message.guild.id,
        userID: mem.user.id,
      };

      const kick = {
        executor: message.author.id,
        timestamp: new Date().getTime(),
        reason,
        messageLink: message.url,
      };

      await memberInfoSchema.findOneAndUpdate(
        memberObj,
        {
          ...memberObj,
          $push: {
            kicks: kick,
          },
        },
        {
          upsert: true,
        }
      );

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

const fetchMemberInfo = async (guild, member) => {
  const result = await memberInfoSchema.findOne({
    guildID: guild.id,
    userID: member.id,
  });
  return result ? result : null;
};
