const raffleWinsSchema = require("@schemas/raffle-wins-schema");
const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["raffles"],
  category: "Bot Owner",
  description: "Shows how many raffles a member has won.",
  ownerOnly: true,
  callback: async ({ message }) => {
    const guildID = message.guild.id;
    let text = `The members with the most raffle wins for ${new Date().getFullYear()} are:\n\n`;

    const results = await raffleWinsSchema
      .find({
        guildID,
      })
      .sort({
        raffleWins: -1,
      });

    if (results.length == 0) {
      text = `There are no raffle winners yet for this year.`;
    } else {
      for (let count = 0; count < results.length; count++) {
        const { userID, raffleWins = 0 } = results[count];
        text += `${count + 1}. <@${userID}> has ${raffleWins} raffle win${
          raffleWins !== 1 ? "s" : ""
        }.\n`;
      }
      text += `\n`;
    }

    const msgEmbed = new MessageEmbed()
      .setTitle(`Top Raffle Wins for ${new Date().getFullYear()}`)
      .setColor("#85bb65")
      .setDescription(text);

    message.channel.send(msgEmbed);
  },
};
