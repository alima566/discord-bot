const { MessageEmbed } = require("discord.js");

module.exports = {
  slash: true,
  description: "Displays the user's avatar.",
  minArgs: 0,
  expectedArgs: "[target]",
  callback: ({ interaction, client, args }) => {
    const { member, guild_id } = interaction;
    const guild = client.guilds.cache.get(guild_id);
    const guildMember = args.length
      ? guild.members.cache.get(args[0].user.id)
      : guild.members.cache.get(member.user.id);

    const embed = new MessageEmbed()
      .setColor(guildMember.displayHexColor)
      .setAuthor(
        guildMember.user.tag,
        guildMember.user.displayAvatarURL({ dynamic: true })
      )
      .setTitle("Avatar")
      .setImage(
        guildMember.user.displayAvatarURL({ dynamic: true, size: 256 })
      );
    return embed;
  },
};
