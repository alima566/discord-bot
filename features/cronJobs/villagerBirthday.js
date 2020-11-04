const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const cron = require("cron");

module.exports = (client) => {
  const villagerBirthday = new cron.CronJob(
    "00 00 08 * * *",
    () => {
      execute(client);
    },
    null,
    true,
    "America/Denver"
  );
};

const execute = (client) => {
  let month = parseInt(moment().format("M"));
  let day = moment().date();
  let channel = client.channels.cache.find(
    (c) => c.id === "754196934985646171"
  );
  fetch(
    `https://api.nookipedia.com/villagers?birthmonth=${month}&birthday=${day}&nhdetails=true`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return;
      channel.send(`Happy birthday to ${getVillagerNames(data)}! 🎉`);
      for (let i = 0; i < data.length; i++) {
        let msgEmbed = new MessageEmbed()
          .setColor("ORANGE")
          .setURL(`${data[i].url}`)
          .setAuthor(
            `${data[i].name}`,
            data[i].nh_details === null
              ? `${data[i].image_url}`
              : `${data[i].nh_details.icon_url}`,
            `${data[i].url}`
          )
          .setDescription(
            `More info about ${data[i].name} can be found here:\n${data[i].url}`
          )
          .setThumbnail(`${data[i].image_url}`)
          .addFields(
            {
              name: `**Species**`,
              value: `${data[i].species}`,
              inline: true,
            },
            {
              name: `**Personality**`,
              value: `${data[i].personality}`,
              inline: true,
            },
            {
              name: `**Gender**`,
              value: `${data[i].gender}`,
              inline: true,
            },
            {
              name: `**Catchphrase**`,
              value: `${data[i].phrase}`,
              inline: true,
            },
            {
              name: `**Birthday**`,
              value: `${data[i].birthday_month} ${moment
                .localeData()
                .ordinal(data[i].birthday_day)}`,
              inline: true,
            },
            {
              name: `**Sign**`,
              value: `${data[i].sign}`,
              inline: true,
            }
          );
        channel.send(msgEmbed);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const getVillagerNames = (data) => {
  let villagerNames = [];
  for (let i = 0; i < data.length; i++) {
    villagerNames.push(data[i].name);
  }
  return villagerNames.join(" and ");
};
