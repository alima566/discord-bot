const { MessageEmbed } = require("discord.js");
const { sendMessageToBotThings } = require("@utils/constants");
module.exports = (client) => {
  client.on("guildMemberUpdate", async (oldMem, newMem) => {
    if (oldMem.nickname !== newMem.nickname) {
      let oldNick = oldMem.nickname === null ? "None" : oldMem.nickname;
      let newNick = newMem.nickname === null ? "None" : newMem.nickname;
      let msgEmbed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor(`${newMem.guild.name}`, newMem.guild.iconURL())
        .setDescription(`**${newMem.user} nickname changed**`)
        .addFields(
          { name: `**Before**`, value: `${oldNick}`, inline: true },
          { name: `**After**`, value: `${newNick}`, inline: true }
        )
        .setTimestamp()
        .setFooter(`ID: ${newMem.id}`);
      sendMessageToBotThings(client, newMem.guild, msgEmbed);
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
        for (var i = 0; i < roleID.length; i++) {
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
        for (var i = 0; i < roleID.length; i++) {
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
};

const roleUpdatedLog = (client, role, user, type) => {
  let description = `**${user} was ${type}`;
  if (type === "given") {
    description += ` the `;
  } else if (type === "removed") {
    description += ` from the `;
  }
  description += `\`${role.name}\` role**`;
  let msgEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setAuthor(`${user.tag}`, user.displayAvatarURL())
    .setDescription(description)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);

  sendMessageToBotThings(client, role.guild, msgEmbed);
  //sendDMToUser(client, role, user, type);
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
