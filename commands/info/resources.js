const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "❗ Info",
  cooldown: "15s",
  slash: "both",
  description:
    "Links you to important resources to help BIPOC and LGBTQ+ communities.",
  callback: ({ message }) => {
    const msgEmbed = new MessageEmbed()
      .setTitle("Resources to Help BIPOC and LGBTQ+ Communities")
      .setDescription(
        "Below is a list of resources to help BIPOC and LGBTQ+ communities. If you have more resources, please DM Kéllee."
      )
      .addFields(
        {
          name: "**Riot Safety & Black History**",
          value:
            "[Click Here](https://moreblminfo.carrd.co/ 'Riot Safety & Black History')",
          inline: true,
        },
        {
          name: "**Ways to Help**",
          value:
            "[Click Here](https://blacklivesmatters.carrd.co/ 'Ways to Help')",
          inline: true,
        },
        {
          name: "**Anti-Asian Violence Resources**",
          value:
            "[Click Here](https://anti-asianviolenceresources.carrd.co/ 'Anti-Asian Violence Resources')",
          inline: true,
        },
        {
          name: "**Mental Health Resources for BIPOC**",
          value:
            "[Click Here](https://axidbipocmentalhealth.carrd.co/ 'Mental Health Resources for BIPOC')",
          inline: true,
        },
        {
          name: "**LGBTQ+ Carrd Master List**",
          value:
            "[Click Here](https://lgbtqtopics.carrd.co/ 'LGBTQ+ Carrd Master List')",
          inline: true,
        },
        {
          name: "**Be An Activist**",
          value:
            "[Click Here](https://changeforthebetter.carrd.co/ 'Be An Activist')",
          inline: true,
        }
      );
    return message ? message.channel.send(msgEmbed) : msgEmbed;
  },
};
