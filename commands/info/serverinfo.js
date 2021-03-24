const { MessageEmbed } = require("discord.js");
const { utcToZonedTime, format } = require("date-fns-tz");
const { formatDistance } = require("date-fns");
const { timezone } = require("@root/config.json");
const { guildIcon } = require("@utils/functions");

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
  category: "❗ Info",
  cooldown: "15s",
  description: "Gives information about the server.",
  callback: ({ message }) => {
    const { guild, channel } = message;
    const {
      name,
      region,
      owner,
      createdAt,
      premiumSubscriptionCount,
      premiumTier,
    } = guild;

    const members = guild.members.cache.filter((member) => !member.user.bot)
      .size;
    const onlineMembers = guild.members.cache
      .filter((member) => !member.user.bot)
      .filter((member) => member.presence.status !== "offline").size;
    const bots = guild.members.cache.filter((member) => member.user.bot).size;
    const onlineBots = guild.members.cache
      .filter((member) => member.user.bot)
      .filter((member) => member.presence.status !== "offline").size;
    const categories = guild.channels.cache.filter(
      (channel) => channel.type === "category"
    ).size;
    const textChannels = guild.channels.cache.filter((c) => c.type === "text")
      .size;
    const voiceChannels = guild.channels.cache.filter((c) => c.type === "voice")
      .size;
    const roleCount = guild.roles.cache.size - 1;

    const timeFormat = "EEE, MMM d, yyyy h:mm a zzz";
    const createdAtEasternDate = utcToZonedTime(createdAt, timezone);

    const msgEmbed = new MessageEmbed()
      .setColor("#DFBCF5")
      .setAuthor(name, guildIcon(guild))
      .setThumbnail(guildIcon(guild))
      .addFields(
        {
          name: "**Created**",
          value: `${format(createdAtEasternDate, timeFormat, {
            timeZone: timezone,
          })} (${formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })})`,
          inline: false,
        },
        {
          name: "**Server Owner**",
          value: owner.user.tag,
          inline: true,
        },
        {
          name: "**Region**",
          value: regionFlags[region],
          inline: true,
        },
        {
          name: "**Total Members + Bots**",
          value: `${guild.members.cache.size} Members + Bots`,
          inline: true,
        },
        {
          name: "**Members**",
          value: `${members} Member${
            members !== 1 ? "s" : ""
          } (${onlineMembers} Online)`,
          inline: true,
        },
        {
          name: "**Bots**",
          value: `${bots} Bot${bots !== 1 ? "s" : ""} (${onlineBots} Online)`,
          inline: true,
        },
        {
          name: "**Boosts**",
          value: `${premiumSubscriptionCount} Boost${
            premiumSubscriptionCount !== 1 ? "s" : ""
          } (Tier ${premiumTier})`,
          inline: true,
        },
        {
          name: "**Categories**",
          value: categories,
          inline: true,
        },
        {
          name: "**Text Channels**",
          value: textChannels,
          inline: true,
        },
        {
          name: "**Voice Channels**",
          value: voiceChannels,
          inline: true,
        },
        {
          name: "**Roles**",
          value: roleCount,
          inline: true,
        },
        {
          name: "**Emotes**",
          value: guild.emojis.cache.size,
          inline: true,
        },
        {
          name: "**Server ID**",
          value: guild.id,
          inline: true,
        }
      )
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
