const { MessageEmbed } = require("discord.js");
const { utcToZonedTime, format } = require("date-fns-tz");

const keyPerms = {
  ADMINISTRATOR: "Administrator",
  MANAGE_GUILD: "Manage Server",
  MANAGE_ROLES_OR_PERMISSIONS: "Manage Roles",
  MANAGE_CHANNELS: "Manage Channels",
  MANAGE_MESSAGES: "Manage Messages",
  MANAGE_WEBHOOKS: "Manage Webhooks",
  MANAGE_NICKNAMES: "Manage Nicknames",
  MANAGE_EMOJIS: "Manage Emojis",
  KICK_MEMBERS: "Kick Members",
  BAN_MEMBERS: "Ban Members",
  MENTION_EVERYONE: "Mention Everyone",
};

module.exports = {
  commands: ["whois"],
  category: "Info",
  cooldown: "15s",
  description: "Gives information about the user.",
  callback: ({ message }) => {
    const member = message.mentions.members.first() || message.member;
    const { channel, guild } = message;

    const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
    const timeZone = "America/New_York";
    const joinedAtEasternDate = utcToZonedTime(member.joinedAt, timeZone);
    const createdAtEasternDate = utcToZonedTime(
      member.user.createdAt,
      timeZone
    );

    const msgEmbed = new MessageEmbed()
      .setDescription(member)
      .setColor(member.displayHexColor)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        {
          name: "**Joined**",
          value: format(joinedAtEasternDate, timeFormat, {
            timeZone,
          }),
          inline: true,
        },
        {
          name: "**Registered**",
          value: format(createdAtEasternDate, timeFormat, { timeZone }),
          inline: true,
        },
        {
          name: `**Roles [${member.roles.cache.size - 1}]**`,
          value: getAllRoles(member),
          inline: false,
        }
      )
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();

    const extraPerms = [];
    if (isServerAdmin(member, guild)) {
      if (member.id === guild.ownerID) {
        extraPerms.push("Server Owner");
      } else if (member.hasPermission("ADMINISTRATOR")) {
        extraPerms.push("Server Admin");
      } else {
        extraPerms.push("Server Manager");
      }
    }

    if (member.permissions) {
      const memberPerms = member.permissions.toArray();
      const infoPerms = [];
      for (let index in memberPerms) {
        if (keyPerms[memberPerms[index]]) {
          infoPerms.push(keyPerms[memberPerms[index]]);
        }
      }

      if (infoPerms.length) {
        msgEmbed.addFields({
          name: "**Key Permissions**",
          value: infoPerms.sort().join(", "),
          inline: false,
        });
      }
    }

    if (extraPerms.length) {
      msgEmbed.addFields({
        name: "**Acknowledgements**",
        value: extraPerms.sort().join(", "),
        inline: false,
      });
    }
    channel.send(msgEmbed);
  },
};

const getAllRoles = (member) => {
  let roles = "";
  member.roles.cache.forEach((role) => {
    if (role.name !== "@everyone") {
      roles += `<@&${role.id}>, `;
    }
  });
  roles = roles.substr(0, roles.length - 2); // Remove trailing comma and space at the end
  return roles;
};

const isServerAdmin = (member, guild) => {
  if (!member || !guild) return false;
  return (
    member.id === guild.ownerID ||
    (member.permissions &&
      (member.hasPermission("ADMINISTRATOR") ||
        member.hasPermission("MANAGE_GUILD")))
  );
};
