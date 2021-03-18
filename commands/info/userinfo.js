const { MessageEmbed, Permissions } = require("discord.js");
const { utcToZonedTime, format } = require("date-fns-tz");
const { formatDistance } = require("date-fns");
const { timezone } = require("@root/config.json");

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
  category: "❗ Info",
  cooldown: "15s",
  description:
    "Gives information about yourself or another member in the server.",
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: "[The member to see information for]",
  callback: ({ message }) => {
    const member = message.mentions.members.first() || message.member;
    const { channel, guild } = message;

    const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
    const joinedAtEasternDate = utcToZonedTime(member.joinedAt, timezone);
    const createdAtEasternDate = utcToZonedTime(
      member.user.createdAt,
      timezone
    );

    const msgEmbed = new MessageEmbed()
      .setDescription(member)
      .setColor(member.displayHexColor)
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: "**Joined**",
          value: `${format(joinedAtEasternDate, timeFormat, {
            timeZone: timezone,
          })} (${formatDistance(member.joinedAt, new Date(), {
            addSuffix: true,
          })})`,
          inline: true,
        },
        {
          name: "**Registered**",
          value: `${format(createdAtEasternDate, timeFormat, {
            timeZone: timezone,
          })} (${formatDistance(member.user.createdAt, new Date(), {
            addSuffix: true,
          })})`,
          inline: true,
        },
        {
          name: `**Roles [${member.roles.cache.size - 1}]**`,
          value: getAllRoles(member) === "" ? "None" : getAllRoles(member),
          inline: false,
        }
      )
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();

    const extraPerms = [];
    if (isServerAdmin(member, guild)) {
      if (member.id === guild.ownerID) {
        extraPerms.push("Server Owner");
      } else if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
      (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
        member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)))
  );
};
