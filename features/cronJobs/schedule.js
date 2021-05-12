const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");
const cron = require("cron");
const { timezone } = require("@root/config.json");

const schedule = {
  Monday: "OFF",
  Tuesday: "Taco Tuesday (Stream with <@274641094484951040>)! [2:30PM]",
  Wednesday: "OFF",
  Thursday: "Teyvat Thursday! (Genshin Impact) [7:00PM]",
  Friday: "OFF",
  Saturday: "OFF",
  Sunday: "OFF",
};

module.exports = (client) => {
  new cron.CronJob(
    "00 00 00 * * *",
    () => {
      execute(client);
    },
    null,
    true,
    timezone
  );
};

const execute = async (client) => {
  const channelID = "815426698555949056"; //schedule
  const timezoneFormat = moment.tz(timezone).format("z");
  const today = moment.tz(timezone).format("dddd"); //Get what day of the week today is in eastern time

  let text = `Below, you will find Kéllee's weekly streaming schedule. All times listed below are in ${timezoneFormat} and are subject to change without notice.\n\n`;
  for (const key in schedule) {
    text +=
      key.toLowerCase() === today.toLowerCase()
        ? `**${key}: ${schedule[key]}**\n`
        : `${key}: ${schedule[key]}\n`;
  }
  text += `\nThere could be occassional surprise streams too! Pay attention to the <#724484131643457650> channel for updates and don't forget to assign yourself the <@&732780296986034287> role in the <#732786545169399838> channel to get notified for whenever Kéllee goes live!`;

  const msgEmbed = new MessageEmbed()
    .setTitle("Weekly Schedule")
    .setThumbnail("https://i.imgur.com/rJQgRC3.png")
    .setColor("#ecc5ff")
    .setDescription(text);

  const channel = client.channels.cache.get(channelID);
  if (channel) {
    const messages = await channel.messages.fetch();
    const firstMessage = messages.first();
    if (firstMessage) {
      firstMessage.edit(msgEmbed);
    } else {
      await channel.send(msgEmbed);
    }
  }
};
