const { MessageEmbed } = require("discord.js");
const { sendMessageToBotThings } = require("@utils/constants");
let embed = null;
module.exports = (client) => {
  client.on("channelCreate", async (channel) => {
    if (channel.type.toLowerCase() === "dm") return;
    if (channel.type.toLowerCase() === "category") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Category Created: ${channel.name}**`
      );
    } else if (channel.type.toLowerCase() === "text") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Channel Created: <#${channel.id}>**`
      );
    } else if (channel.type.toLowerCase() === "voice") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Voice Channel Created: #${channel.name}**`
      );
    }
    sendMessageToBotThings(client, channel.guild, embed);
  });

  client.on("channelDelete", async (channel) => {
    if (channel.type.toLowerCase() === "category") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Category Deleted: ${channel.name}**`
      );
    } else if (channel.type.toLowerCase() === "text") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Channel Deleted: #${channel.name}**`
      );
    } else if (channel.type.toLowerCase() === "voice") {
      embed = createChannelEmbed(
        channel,
        null,
        `**Voice Channel Deleted: ${channel.name}**`
      );
    }
    sendMessageToBotThings(client, channel.guild, embed);
  });

  client.on("channelUpdate", async (oldChan, newChan) => {
    if (oldChan.name !== newChan.name) {
      if (newChan.type.toLowerCase() === "category") {
        embed = createChannelEmbed(
          oldChan,
          newChan,
          `**Category Name Changed**`
        );
      } else if (newChan.type.toLowerCase() === "text") {
        embed = createChannelEmbed(
          oldChan,
          newChan,
          `**Channel Name Changed**`
        );
      } else if (newChan.type.toLowerCase() === "voice") {
        embed = createChannelEmbed(
          oldChan,
          newChan,
          `**Voice Category Name Changed**`
        );
      }
      sendMessageToBotThings(client, newChan.guild, embed);
    }
  });
};

const createChannelEmbed = (oldChan, newChan, description) => {
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(description)
    .setAuthor(`${oldChan.guild.name}`, oldChan.guild.iconURL())
    .setTimestamp();
  if (newChan !== null) {
    embed.addFields(
      {
        name: `**Before**`,
        value: `${oldChan.name}`,
        inline: true,
      },
      { name: `**After**`, value: `${newChan.name}`, inline: true }
    );
  }
  return embed;
};
