const { Permissions } = require("discord.js");
const messageRolesSchema = require("@schemas/message-roles-schema");
const cache = {}; // { guildID: [message, { Emoji: roleID }]}

const fetchCache = (guildID) => cache[guildID] || [];

const addToCache = async (guildID, message, emoji, roleID) => {
  const array = cache[guildID] || [message, {}];

  if (emoji && roleID) {
    array[1][emoji] = roleID;
  }

  await message.channel.messages.fetch(message.id, true, true);

  cache[guildID] = array;
};

const handleReaction = (reaction, user, adding) => {
  if (user.bot) {
    return;
  }

  const { message } = reaction;
  const { guild } = message;

  const [fetchedMessage, roles] = fetchCache(guild.id);
  if (!fetchedMessage) {
    return;
  }

  if (
    fetchedMessage.id === message.id &&
    guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)
  ) {
    const toCompare = reaction.emoji.id || reaction.emoji.name;

    for (const key of Object.keys(roles)) {
      if (key === toCompare) {
        const role = guild.roles.cache.get(roles[key]);
        if (role) {
          const member = guild.members.cache.get(user.id);
          if (adding) {
            member.roles.add(role);
          } else {
            member.roles.remove(role);
          }
        }
        return;
      }
    }
  }
};

module.exports = async (client) => {
  client.on("messageReactionAdd", (reaction, user) => {
    handleReaction(reaction, user, true);
  });

  client.on("messageReactionRemove", (reaction, user) => {
    handleReaction(reaction, user, false);
  });

  const results = await messageRolesSchema.find();
  for (const result of results) {
    const { guildID, channelID, messageID, roles } = result;

    const guild = await client.guilds.cache.get(guildID);
    if (!guild) {
      console.log(`Removing guild ID "${guildID}" from the database.`);
      await messageRolesSchema.deleteOne({ guildID });
      return;
    }

    const channel = await guild.channels.cache.get(channelID);
    if (!channel) {
      console.log(`Removing channel ID "${channelID}" from the database.`);
      await messageRolesSchema.deleteOne({ channelID });
      return;
    }

    try {
      const cacheMessage = true;
      const skipCache = true;
      const fetchedMessage = await channel.messages.fetch(
        messageID,
        cacheMessage,
        skipCache
      );

      if (fetchedMessage) {
        const newRoles = {};
        for (const role of roles) {
          const { emoji, roleID } = role;
          newRoles[emoji] = roleID;
        }
        cache[guildID] = [fetchedMessage, newRoles];
      }
    } catch (e) {
      console.log(`Removing message ID "${messageID}" from the database.`);
      await messageRolesSchema.deleteOne({ messageID });
    }
  }
};

module.exports.fetchCache = fetchCache;

module.exports.addToCache = addToCache;
