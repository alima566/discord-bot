const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog } = require("@utils/functions");
const memberInfoSchema = require("@schemas/member-info-schema");

module.exports = {
  category: "Moderation",
  minArgs: 2,
  description: "Warns a member from the server",
  expectedArgs: "<The target's @ OR ID number> <Reason>",
  requiredPermissions: ["MANAGE_GUILD"],
  callback: async ({ message, args, client }) => {
    const { guild, member } = message;

    const target = message.mentions.users.first();
    if (!target) {
      return message.reply("Please specify someone to warn.");
    }

    args.shift();

    const guildID = guild.id;
    const userID = target.id;
    const reason = args.join(" ");

    if (!reason) {
      return message.reply(
        "Please provide a reason on why this member is being warned."
      );
    }

    const warning = {
      warnedBy: member.user.id,
      timestamp: new Date().getTime(),
      reason,
      messageLink: message.url,
    };

    await memberInfoSchema.findOneAndUpdate(
      {
        guildID,
        userID,
      },
      {
        guildID,
        userID,
        $push: {
          warnings: warning,
        },
      },
      { upsert: true }
    );

    message.channel.send(`You have warned **${target.tag}** for ${reason}.`);
    const msgEmbed = new MessageEmbed()
      .setColor("#DFBE01")
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Member:** ${target.tag}\n**Action:** Warn${
          reason !== "" ? `\n**Reason:** ${reason}` : ""
        }`
      )
      .setTimestamp()
      .setFooter(`ID: ${target.id}`);

    sendMessageToBotLog(client, message.guild, msgEmbed);
  },
};
