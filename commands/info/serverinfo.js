const { MessageEmbed } = require("discord.js");
const { utcToZonedTime, format } = require("date-fns-tz");
const { formatDistance } = require("date-fns");

const regionFlags = {
  brazil: "🇧🇷 Brazil",
  europe: "🇪🇺 Europe",
  hongkong: "🇭🇰 Hong Kong",
  india: "🇮🇳 India",
  japan: "🇯🇵 Japan",
  russia: "🇷🇺 Russia",
  singapore: "🇸🇬 Singapore",
  southafrica: "🇿🇦 South Africa",
  sydney: "🇦🇺 Sydney",
  "us-central": "🇺🇸 US Central",
  "us-east": "🇺🇸 US East",
  "us-south": "🇺🇸 US South",
  "us-west": "🇺🇸 US West",
};

module.exports = {
  category: "Info",
  cooldown: "15s",
  description: "Gives information about the server.",
  callback: ({ message }) => {
    const { guild, channel } = message;
    const { name, region, owner, memberCount, createdAt } = guild;
    const categoryChannels = guild.channels.cache.filter(
      (channel) => channel.type === "category"
    );
    const totalTextChannels = guild.channels.cache.filter(
      (c) => c.type === "text"
    ).size;
    const totalVoiceChannels = guild.channels.cache.filter(
      (c) => c.type === "voice"
    ).size;

    const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
    const timeZone = "America/New_York";
    const createdAtEasternDate = utcToZonedTime(createdAt, timeZone);

    const msgEmbed = new MessageEmbed()
      .setColor("#DFBCF5")
      .setAuthor(name, guild.iconURL())
      .setThumbnail(guild.iconURL())
      .addFields(
        {
          name: "**Owner**",
          value: owner.user.tag,
          inline: true,
        },
        {
          name: "**Region**",
          value: regionFlags[region],
          inline: true,
        },
        {
          name: "**Server Created**",
          value: `${format(createdAtEasternDate, timeFormat, {
            timeZone,
          })} (${formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })})`,
          inline: true,
        },
        {
          name: "**Channel Categories**",
          value: categoryChannels.size,
          inline: true,
        },
        {
          name: "**Text Channels**",
          value: totalTextChannels,
          inline: true,
        },
        {
          name: "**Voice Channels**",
          value: totalVoiceChannels,
          inline: true,
        },
        {
          name: "**Members**",
          value: memberCount,
          inline: true,
        },
        {
          name: "**Roles**",
          value: guild.roles.cache.size,
          inline: true,
        },
        {
          name: "**Role List**",
          value: getRoleList(guild),
          inline: false,
        }
      )
      .setFooter(`ID: ${guild.id}`)
      .setTimestamp();
    channel.send(msgEmbed);
  },
};

const getRoleList = (guild) => {
  let roles = "";
  guild.roles.cache.forEach((role) => {
    roles += `${role.name}, `;
  });
  roles = roles.substr(0, roles.length - 2);
  return roles;
};
