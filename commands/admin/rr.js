const { fetchCache, addToCache } = require("@features/features/reactionRoles");
const messageRolesSchema = require("@schemas/message-roles-schema");

module.exports = {
  minArgs: 3,
  expectedArgs: "<Emoji> <Role name, tag, or ID> <Role display name>",
  category: "Admin",
  description: "Adds reaction roles to a reaction message.",
  requiredPermission: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    const { guild } = message;
    if (!guild.me.hasPermission("MANAGE_ROLES")) {
      return message.reply("I do not have the `Manage Roles` permission.");
    }

    let emoji = args.shift();
    let role = args.shift();
    const displayName = args.join(" ");

    if (role.startsWith("<@&")) {
      role = role.substring(3, role.length - 1);
    }

    const newRole =
      guild.roles.cache.find((r) => {
        return r.name === role || r.id === role;
      }) || null;

    if (!newRole) {
      return message.reply(`I could not find a role for \`${role}\``);
    }

    role = newRole;

    if (emoji.includes(":")) {
      const emojiName = emoji.split(":")[1];
      emoji = guild.emojis.cache.find((e) => {
        return e.name === emojiName;
      });
    }

    const [fetchedMessage] = fetchCache(guild.id);
    if (!fetchedMessage) {
      return message.reply("An error occurred. Please try again.");
    }

    const newLine = `${emoji} ${displayName}`;
    let { content } = fetchedMessage;

    if (content.includes(emoji)) {
      const split = content.split("\n");
      for (let i = 0; i < split.length; i++) {
        if (split[i].includes(emoji)) {
          split[i] = newLine;
        }
      }

      content = split.join("\n");
    } else {
      content += `\n${newLine}`;
      fetchedMessage.react(emoji);
    }

    fetchedMessage.edit(content);

    const obj = {
      guildID: guild.id,
      channelID: fetchedMessage.channel.id,
      messageID: fetchedMessage.id,
    };

    await messageRolesSchema.findOneAndUpdate(
      obj,
      {
        ...obj,
        $addToSet: {
          roles: {
            emoji,
            roleID: role.id,
          },
        },
      },
      {
        upsert: true,
      }
    );
    addToCache(guild.id, fetchedMessage, emoji, role.id);
    message.delete();
  },
};
