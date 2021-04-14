const { MessageEmbed, Permissions } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");
const muteSchema = require("@schemas/mute-schema");
const { log } = require("@utils/functions");

module.exports = {
  category: "🔨 Moderation",
  minArgs: 1,
  description: "Bans a user/member from the server.",
  expectedArgs: "<The target's @ OR ID number> [Reason]",
  requiredPermissions: ["KICK_MEMBERS", "BAN_MEMBERS"],
  callback: async ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const user =
      message.mentions.users.first() ||
      (await client.users.fetch(args[0], false, true).catch((e) => {
        log(
          "ERROR",
          "./commands/moderation/ban.js",
          `An error has occurred: ${e.message}`
        );
      }));

    if (!user) {
      return message.reply("Please specify someone to ban.");
    }

    const member = guild.members.cache.get(user.id); //Convert the user to a member
    const reason = args.slice(1).join(" ");

    if (user.id === author.id) {
      return message.reply(`Nice try, but you can't ban yourself.`);
    }

    //If the user is a member of the guild that we are trying to ban from
    if (member) {
      if (!member.bannable) {
        return message.reply(
          `I do not have the permissions to ban that member.`
        );
      }

      if (
        message.member.roles.highest.comparePositionTo(member.roles.highest) < 0 // Can't ban members with a higher role
      ) {
        return message.reply(
          "You can't ban a member with a higher role than you."
        );
      }
    }

    //Check bot's permissions
    if (
      !guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ||
      !guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    const userInfo = await fetchMemberInfo(guild, user);
    const mutes = await muteSchema.find({
      guildID: guild.id,
      userID: user.id,
    });
    const userInfoEmbed = new MessageEmbed()
      .setColor("#CC0202")
      .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }));
    if (userInfo) {
      const { bans, warnings, kicks, unbans, softbans } = userInfo;
      userInfoEmbed.setDescription(
        `• Warns: ${warnings.length}\n• Mutes: ${mutes.length}\n• Kicks: ${kicks.length}\n• Bans: ${bans.length}\n• Soft Bans: ${softbans.length}\n• Unbans: ${unbans.length}\n`
      );
    } else {
      userInfoEmbed.setDescription(
        `• Warns: 0\n• Mutes: ${mutes.length}\n• Kicks: 0\n• Bans: 0\n• Soft Bans: 0\n• Unbans: 0\n`
      );
    }

    channel
      .send(
        `Are you sure you want to ban **${user.tag}**${
          reason ? ` for ${reason}` : ""
        }? (Y/N)`,
        { embed: userInfoEmbed }
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
              ban(user, message, client, reason);
              break;
            case "N":
              collector.stop();
              channel.send(`**${user.tag}** was not banned.`);
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
              `You did not choose a response in time. **${user.tag}** was not banned.`
            );
          }
        });
      });
  },
};

const fetchMemberInfo = async (guild, user) => {
  const result = await memberInfoSchema.findOne({
    guildID: guild.id,
    userID: user.id,
  });
  return result ? result : null;
};

const ban = (user, message, client, reason) => {
  message.guild.members
    .ban(user, { days: 7, reason })
    .then(async (mem) => {
      const memberObj = {
        guildID: message.guild.id,
        userID: mem.id,
      };

      const ban = {
        executor: message.author.id,
        timestamp: new Date().getTime(),
        reason,
        messageLink: message.url,
      };

      // const kick = {
      //   executor: message.author.id,
      //   timestamp: new Date().getTime(),
      //   reason: "Kicked due to being banned from server.",
      //   messageLink: message.url,
      // };

      await memberInfoSchema.findOneAndUpdate(
        memberObj,
        {
          ...memberObj,
          $push: {
            bans: ban,
            //kicks: kick,
          },
        },
        {
          upsert: true,
        }
      );

      message.channel.send(`Successfully banned **${mem.tag}**`);

      const msgEmbed = new MessageEmbed()
        .setColor("#CC0202")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(mem.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `**Member:** ${mem.tag}\n**Action:** Ban${
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
