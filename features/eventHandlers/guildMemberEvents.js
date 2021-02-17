const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");
const gamblingSchema = require("@schemas/gambling-schema");

module.exports = (client) => {
  client.on("guildMemberUpdate", async (oldMem, newMem) => {
    if (oldMem.nickname !== newMem.nickname) {
      let oldNick = oldMem.nickname === null ? "None" : oldMem.nickname;
      let newNick = newMem.nickname === null ? "None" : newMem.nickname;

      const msgEmbed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(`${newMem.guild.name}`, newMem.guild.iconURL())
        .setDescription(`**${newMem.user} nickname changed**`)
        .addFields(
          { name: `**Before**`, value: `${oldNick}`, inline: true },
          { name: `**After**`, value: `${newNick}`, inline: true }
        )
        .setTimestamp()
        .setFooter(`ID: ${newMem.id}`);

      const fetchedLogs = await fetchAuditLog(newMem.guild, "MEMBER_UPDATE");
      if (fetchedLogs) {
        const memberUpdateLog = fetchedLogs.entries.first();
        if (memberUpdateLog) {
          const { executor } = memberUpdateLog;
          if (executor.id !== newMem.id) {
            //Only show "Changed By" field if a mod changes member nickname
            msgEmbed.addFields({
              name: `**Changed By**`,
              value: executor,
              inline: true,
            });
          }
        }
      }
      sendMessageToBotLog(client, newMem.guild, msgEmbed);
    }

    if (oldMem.roles.cache.size !== newMem.roles.cache.size) {
      let removedRoles = oldMem.roles.cache.filter(
        (role) => !newMem.roles.cache.has(role.id)
      );
      let addedRoles = newMem.roles.cache.filter(
        (role) => !oldMem.roles.cache.has(role.id)
      );

      if (removedRoles.size > 0) {
        let roleID = removedRoles.map((r) => r.id);
        for (let i = 0; i < roleID.length; i++) {
          roleUpdatedLog(
            client,
            removedRoles.get(roleID[i]),
            oldMem.user,
            "removed"
          );
        }
      }

      if (addedRoles.size > 0) {
        let roleID = addedRoles.map((r) => r.id);
        for (let i = 0; i < roleID.length; i++) {
          roleUpdatedLog(
            client,
            addedRoles.get(roleID[i]),
            oldMem.user,
            "given"
          );
        }
      }
    }
  });

  client.on("guildMemberRemove", async (member) => {
    const { guild, user } = member;

    await gamblingSchema.deleteOne({
      guildID: guild.id,
      userID: user.id,
    }); // Delete gambling points from database

    const fetchedLogs = await fetchAuditLog(member.guild, "MEMBER_KICK");
    if (!fetchedLogs) {
      const msgEmbed = createEmbed(
        "PURPLE",
        member.user,
        `**${member.user} has left the server**`
      );
      return sendMessageToBotLog(client, member.guild, msgEmbed);
    }

    const kickLog = fetchedLogs.entries.first();
    if (!kickLog) {
      const msgEmbed = createEmbed(
        "PURPLE",
        member.user,
        `**${member.user} has left the server**`
      );
      return sendMessageToBotLog(client, member.guild, msgEmbed);
    }

    const { executor, target } = kickLog;
    const msgEmbed = createEmbed(
      "PURPLE",
      member.user,
      `${
        target.id === member.id
          ? `**${member.user} was kicked from the server by ${executor}**`
          : `**${member.user} has left the server**`
      }`
    );
    sendMessageToBotLog(client, member.guild, msgEmbed);
  });
};

const roleUpdatedLog = async (client, role, user, type) => {
  let description = `**${user} was ${type}`;
  if (type === "given") {
    description += ` the `;
  } else if (type === "removed") {
    description += ` from the `;
  }
  description += `\`${role.name}\` role`;

  const fetchedLogs = await fetchAuditLog(role.guild, "MEMBER_ROLE_UPDATE");
  if (!fetchedLogs) {
    const msgEmbed = createEmbed("BLUE", user, description);
    return sendMessageToBotLog(client, role.guild, msgEmbed);
  }

  const roleUpdateLog = fetchedLogs.entries.first();
  if (!roleUpdateLog) {
    const msgEmbed = createEmbed("BLUE", user, description);
    return sendMessageToBotLog(client, role.guild, msgEmbed);
  }

  if (
    roleUpdateLog &&
    (!role.name.startsWith("Sub ") || role.name !== "Special Babies")
  ) {
    const { executor } = roleUpdateLog;
    description += ` by ${executor}**`;
  } else {
    description += `**`;
  }

  const msgEmbed = createEmbed("BLUE", user, description);

  sendMessageToBotLog(client, role.guild, msgEmbed);
  //sendDMToUser(client, role, user, type);
};

const createEmbed = (color, user, description) => {
  return new MessageEmbed()
    .setColor(color)
    .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
    .setDescription(description)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);
};

const sendDMToUser = (client, role, user, type) => {
  let title = type.toLowerCase() === "given" ? "Added" : "Removed";
  let react = type.toLowerCase() === "given" ? "reacting" : "unreacting";
  let description = `You have been ${type}`;
  if (type === "given") {
    description += ` the `;
  } else if (type === "removed") {
    description += ` from the `;
  }
  description += `\`${role.name}\` role by ${react} in ${role.guild.name}.`;
  let msgEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle(`Role ${title}`)
    .setDescription(description)
    .setTimestamp();

  client.users.cache.get(user.id).send(msgEmbed);
};

module.exports.config = {
  displayName: "Guild Member Events",
  dbName: "GUILD_MEMBER_EVENTS",
  loadDBFirst: false,
};
