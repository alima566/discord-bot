const { MessageEmbed } = require("discord.js");
const constants = require("@utils/constants");
const msgEmbed = new MessageEmbed().setColor("GREEN");
module.exports = (client) => {
  client.on("channelCreate", async (channel) => {
    if (channel.type.toLowerCase() === "dm") return;
    msgEmbed
      .setDescription(`**Channel Created: #${channel.name}**`)
      .setAuthor(`${channel.guild.name}`, channel.guild.iconURL())
      .setTimestamp();
    constants.sendMessageToBotThings(client, msgEmbed);
  });

  client.on("channelDelete", async (channel) => {
    msgEmbed
      .setDescription(`**Channel Deleted: #${channel.name}**`)
      .setAuthor(`${channel.guild.name}`, channel.guild.iconURL())
      .setTimestamp();
    constants.sendMessageToBotThings(client, msgEmbed);
  });

  client.on("channelUpdate", async (oldChan, newChan) => {
    if (oldChan.name !== newChan.name) {
      msgEmbed
        .setDescription(`**Channel Name Changed**`)
        .addFields(
          { name: `**Before**`, value: `${oldChan.name}`, inline: true },
          { name: `**After**`, value: `${newChan.name}`, inline: true }
        )
        .setAuthor(`${channel.guild.name}`, channel.guild.iconURL())
        .setTimestamp();
      constants.sendMessageToBotThings(client, msgEmbed);
    }
  });
};
