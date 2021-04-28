const { MessageEmbed } = require("discord.js");
const memberInfoSchema = require("@schemas/member-info-schema");
const muteSchema = require("@schemas/mute-schema");
const { log } = require("@utils/functions");
const { utcToZonedTime, format } = require("date-fns-tz");
const { timezone } = require("@root/config.json");
const ms = require("ms");

module.exports = {
  category: "🔨 Moderation",
  minArgs: 1,
  maxArgs: 1,
  description: "Shows moderation history of a user.",
  expectedArgs: "<The target's @ OR ID number>",
  requiredPermissions: ["MANAGE_GUILD"],
  callback: async ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const user =
      message.mentions.users.first() ||
      (await client.users.fetch(args[0], false, true).catch((e) => {
        log(
          "ERROR",
          "./commands/moderation/history.js",
          `An error has occurred: ${e.message}`
        );
      }));

    if (!user) {
      return message.reply(
        "Please specify someone to see moderation history for."
      );
    }

    const msgEmbed = new MessageEmbed()
      .setColor(0x337fd5)
      .setAuthor(
        `Moderation history for ${user.tag}`,
        user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter(
        `Requested by ${author.tag}`,
        author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

    const results = await memberInfoSchema.findOne({
      guildID: guild.id,
      userID: user.id,
    });
    const mutes = await muteSchema.find({
      guildID: guild.id,
      userID: user.id,
    });

    if (!results && !mutes.length) {
      msgEmbed.setDescription(
        "This user does not have any moderation history."
      );
      return channel.send(msgEmbed);
    }

    let description = "";
    if (results) {
      const { warnings, kicks, bans, unbans, softbans } = results;
      if (warnings.length) {
        description += `**❯ Warnings [${warnings.length}]**`;
        description += loopThroughInfo({ warnings });
      }

      if (kicks.length) {
        description +=
          mutes.length || warnings.length
            ? `\n**❯ Kicks [${kicks.length}]**`
            : `**❯ Kicks [${kicks.length}]**`;
        description += loopThroughInfo({ kicks });
      }

      if (bans.length) {
        description += kicks.length
          ? `\n**❯ Bans [${bans.length}]**`
          : `**❯ Bans [${bans.length}]**`;
        description += loopThroughInfo({ bans });
      }

      if (unbans.length) {
        description += bans.length
          ? `\n**❯ Unbans [${unbans.length}]**`
          : `**❯ Unbans [${unbans.length}]**`;
        description += loopThroughInfo({ unbans });
      }

      if (softbans.length) {
        description += unbans.length
          ? `\n**❯ Soft-Bans [${softbans.length}]**`
          : `**❯ Soft-Bans [${softbans.length}]**`;
        description += loopThroughInfo({ softbans });
      }
    }

    if (mutes.length) {
      description += `\n**❯ Mutes [${mutes.length}]**`;
      description += loopThroughInfo({ mutes });
    }

    msgEmbed.setDescription(description);

    channel.send(msgEmbed);
  },
};

const loopThroughInfo = (infoType) => {
  let description = "";
  let type;
  let executedType;
  const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
  if (infoType.warnings) {
    type = infoType.warnings;
    executedType = "\nWarned By: ";
  } else if (infoType.mutes) {
    type = infoType.mutes;
    executedType = "\nMuted By: ";
  } else if (infoType.kicks) {
    type = infoType.kicks;
    executedType = "\nKicked By: ";
  } else if (infoType.bans) {
    type = infoType.bans;
    executedType = "\nBanned By: ";
  } else if (infoType.unbans) {
    type = infoType.unbans;
    executedType = "\nUnbanned By: ";
  } else if (infoType.softbans) {
    type = infoType.softbans;
    executedType = "\nSoft-Banned By: ";
  }

  for (const info of type) {
    const { executor, timestamp, reason, messageLink } = info;
    const time = utcToZonedTime(new Date(timestamp), timezone);

    description += `${executedType}<@${executor}>\nWhen: ${format(
      time,
      timeFormat,
      { timeZone: timezone }
    )}${reason ? `\nReason: ${reason}` : ""}${
      infoType.mutes ? `\nDuration: ${ms(info.duration, { long: true })}` : ""
    }\nContext: [Show Me KelleeBot](${messageLink})\n`;
  }
  return description;
};
