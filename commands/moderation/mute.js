const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const { sendMessageToBotLog } = require("@utils/functions");
const muteSchema = require("@schemas/mute-schema");

module.exports = {
  category: "🔨 Moderation",
  minArgs: 3,
  description: "Mutes a member in the server",
  expectedArgs: "<The target's @ OR ID number> <Duration> <Reason>",
  requiredPermissions: ["MANAGE_ROLES"],
  callback: async ({ message, args, client }) => {
    const { guild, author } = message;
    const member =
      message.mentions.members.first() || guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply("Please specify a member to mute.");
    }

    args.shift(); //Remove mention/ID
    const duration = ms(args[0]);
    if (!duration) {
      return message.reply(
        "Please specify a duration on how long this member should be muted for."
      );
    }

    args.shift(); //Remove duration
    const reason = args.join(" ");
    if (!reason) {
      return message.reply(
        "Please provide a reason on why this member is being muted."
      );
    }

    if (member.id === author.id) {
      return message.reply("You can't mute yourself.");
    }

    if (member.user.bot) {
      return message.reply("You can't mute bots.");
    }

    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) < 0
    ) {
      return message.reply(
        "You can't mute a member with a higher role than you."
      );
    }

    if (member.id === guild.ownerID) {
      return message.reply("You can't mute the server owner.");
    }

    const previousMutes = await muteSchema.find({
      guildID: guild.id,
      userID: member.id,
    });
    const currentlyMuted = previousMutes.filter(
      (mute) => mute.current === true
    );

    if (currentlyMuted.length) {
      return message.channel.send(`**${member.user.tag}** is already muted.`);
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + duration);

    const mutedRole = guild.roles.cache.find((r) => r.name === "Muted");
    if (!mutedRole) {
      return message.reply("I could not find a `Muted` role.");
    }

    const targetMember = (await guild.members.fetch()).get(member.id);
    targetMember.roles.add(mutedRole);

    await new muteSchema({
      guildID: guild.id,
      userID: member.id,
      reason,
      executor: author.id,
      timestamp: new Date().getTime(),
      duration,
      expires,
      current: true,
      messageLink: message.url,
    }).save();

    const msgEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `**Member:** ${member.user.tag}\n**Action:** Mute\n**Duration:** ${ms(
          duration,
          {
            long: true,
          }
        )}\n**Reason:** ${reason}\n**Context:** [Show me KelleeBot](${
          message.url
        })`
      )
      .setTimestamp()
      .setFooter(`ID: ${member.id}`);
    sendMessageToBotLog(client, guild, msgEmbed);

    return message.channel.send(
      `**${member.user.tag}** has been muted for ${ms(duration, {
        long: true,
      })}.`
    );
  },
};
