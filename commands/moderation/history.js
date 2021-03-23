const { MessageEmbed } = require("discord.js");
const memberInfoSchema = require("@schemas/member-info-schema");
const muteSchema = require("@schemas/mute-schema");
const { utcToZonedTime, format } = require("date-fns-tz");
const { timezone } = require("@root/config.json");
const ms = require("ms");

module.exports = {
  category: "Moderation",
  minArgs: 1,
  maxArgs: 1,
  description: "Shows moderation history of a member.",
  expectedArgs: "<The target's @ OR ID number>",
  requiredPermissions: ["MANAGE_GUILD"],
  callback: async ({ message, args }) => {
    const { guild, author, channel } = message;
    const member =
      message.mentions.members.first() || guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply(
        "Please specify a member to see moderation history for."
      );
    }

    const msgEmbed = new MessageEmbed()
      .setColor(0x337fd5)
      .setAuthor(
        `Moderation history for ${member.user.tag}`,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(
        `Requested by ${author.tag}`,
        author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

    const results = await memberInfoSchema.findOne({
      guildID: guild.id,
      userID: member.id,
    });
    const mutes = await muteSchema.find({
      guildID: guild.id,
      userID: member.id,
    });

    if (!results && !mutes && !mutes.length) {
      msgEmbed.setDescription(
        "This member does not have any moderation history."
      );
      return channel.send(msgEmbed);
    }

    let description = "";
    const { warnings, kicks, bans, unbans } = results;
    if (warnings.length) {
      description += `**❯ Warnings [${warnings.length}]**`;
      description += loopThroughInfo({ warnings });
    }

    if (mutes && mutes.length) {
      description += warnings.length
        ? `\n**❯ Mutes [${mutes.length}]**`
        : `**❯ Mutes [${mutes.length}]**`;
      description += loopThroughInfo({ mutes });
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
        : `**❯ Unans [${unbans.length}]**`;
      description += loopThroughInfo({ unbans });
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
  }

  for (const info of type) {
    const { executor, timestamp, reason, messageLink } = info;
    const time = utcToZonedTime(new Date(timestamp), timezone);

    description += `${executedType}<@${executor}>\nWhen: ${format(
      time,
      timeFormat,
      { timeZone: timezone }
    )}\nReason: ${reason}${
      infoType.mutes ? `\nDuration: ${ms(info.duration)}` : ""
    }\nContext: [Beam Me Up](${messageLink})\n`;
  }
  return description;
};
