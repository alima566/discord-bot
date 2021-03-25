const { MessageEmbed, Permissions } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");
const muteSchema = require("@schemas/mute-schema");

module.exports = {
  category: "🔨 Moderation",
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
      !guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS) ||
      !guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
    ) {
      return message.reply(
        "I do not have `Kick Members` or `Ban Members` permission."
      );
    }

    guild.fetchBans().then(async (bans) => {
      if (bans.size == 0) {
        return message.reply(`This server doesn't have any banned members.`);
      }

      const bannedUser = bans.find((b) => b.user.id === userID);
      if (!bannedUser) {
        return message.reply(`I could not find that member.`);
      }

      const memberInfo = await fetchMemberInfo(guild, bannedUser.user);
      const mutes = await muteSchema.find({
        guildID: guild.id,
        userID: bannedUser.user.id,
      });
      const memberInfoEmbed = new MessageEmbed()
        .setColor("#33a532")
        .setAuthor(bannedUser.user.tag, bannedUser.user.displayAvatarURL());
      if (memberInfo !== null) {
        const { bans, warnings, kicks, unbans } = memberInfo;
        memberInfoEmbed.setDescription(
          `• Warns: ${warnings.length}\n• Mutes: ${mutes.length}\n• Kicks: ${kicks.length}\n• Bans: ${bans.length}\n• Unbans: ${unbans.length}\n`
        );
      } else {
        memberInfoEmbed.setDescription(
          `• Warns: 0\n• Mutes: ${mutes.length}\n• Kicks: 0\n• Bans: 0\n• Unbans: 0\n`
        );
      }

      channel
        .send(
          `Are you sure you want to unban **${bannedUser.user.tag}**? (Y/N)`,
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
                unban(bannedUser, guild, message, client, reason);
                break;
              case "N":
                collector.stop();
                channel.send(`**${bannedUser.user.tag}** was not unbanned.`);
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

const unban = (bannedUser, guild, message, client, reason) => {
  guild.members
    .unban(bannedUser.user, reason)
    .then(async (user) => {
      const memberObj = {
        guildID: guild.id,
        userID: user.id,
      };

      const unban = {
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
            unbans: unban,
          },
        },
        {
          upsert: true,
        }
      );

      message.channel.send(
        `Successfully unbanned **${user.tag}** from the server.`
      );
      const msgEmbed = new MessageEmbed()
        .setColor("#33a532")
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
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
};
