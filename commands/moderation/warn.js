const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");

module.exports = {
  category: "🔨 Moderation",
  minArgs: 2,
  description: "Warns a member from the server",
  expectedArgs: "<The target's @ OR ID number> <Reason>",
  requiredPermissions: ["MANAGE_GUILD"],
  callback: async ({ message, args, client }) => {
    const { guild, author, channel } = message;
    const target =
      message.mentions.members.first() || guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!target) {
      return message.reply("Please specify someone to warn.");
    }

    if (target.id === author.id) {
      return message.reply("Nice try, but you can't warn yourself.");
    }

    if (target.user.bot) {
      return message.reply("You can't warn bots.");
    }

    if (
      message.member.roles.highest.comparePositionTo(target.roles.highest) < 0 // Can't warn members with a higher role
    ) {
      return message.reply(
        "You can't warn a member with a higher role than you."
      );
    }

    if (target.id === guild.ownerID) {
      return message.reply("You can't warn the server owner.");
    }

    const warning = {
      executor: author.id,
      timestamp: new Date().getTime(),
      reason,
      messageLink: message.url,
    };

    await memberInfoSchema.findOneAndUpdate(
      {
        guildID: guild.id,
        userID: target.id,
      },
      {
        guildID: guild.id,
        userID: target.id,
        $push: {
          warnings: warning,
        },
      },
      { upsert: true }
    );

    channel.send(`You have warned **${target.user.tag}** for ${reason}.`);
    const msgEmbed = new MessageEmbed()
      .setColor("#DFBE01")
      .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Member:** ${target.user.tag}\n**Action:** Warn\n**Reason:** ${reason}`
      )
      .setTimestamp()
      .setFooter(`ID: ${target.id}`);

    sendMessageToBotLog(client, guild, msgEmbed);
  },
};
