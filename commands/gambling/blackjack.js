const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["blackjack"],
  category: "Gambling",
  minArgs: 1,
  maxArgs: 1,
  description: "Users can gamble away the amount of points that they have.",
  expectedArgs: "<The amount you want to gamble>",
  //cooldown: 60 * 2.5,
  requiredChannel: "gambling",
  callback: async (msg, args) => {
    const gamblingChannelID = "770695220220264448";

    const target = msg.author;
    const guildID = msg.guild.id;
    const userID = target.id;

    const pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guildID, userID);

    if (actualPoints === 0) {
      msg.channel.send(`You don't have any points to gamble.`);
      return;
    }

    const a = 11;
    const card = [a, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const c1 = card[Math.floor(Math.random() * card.length)];
    const c2 = card[Math.floor(Math.random() * card.length)];
    const cardTotal = c1 + c2;

    msg.channel
      .send(
        `Here are your cards: ${c1} and ${c2}. Your total is ${cardTotal}. Would you like to hit (👍) or stand (👎)?`
      )
      .then((message) => {
        message.react("👍").then(() => {
          message.react("👎");
        });
      });

    const filter = (reaction, user) => {
      return (
        ["👍", "👎"].includes(reaction.emoji.name) && user.id === msg.author.id
      );
    };
  },
};

/*
        case 'blackjack':
            var a = 11;
            var card = [2, 3, 4, 5, 6, 7, 8, 9, 10, a];
            var c1 = card[Math.floor(Math.random() * card.length)];
            var c2 = card[Math.floor(Math.random() * card.length)];
            var cardtotal = c1 + c2;
            var c3 = card[Math.floor(Math.random() * card.length)];
            var finaltotal = cardtotal + c3;
            message.channel.send('Your cards are a ' + c1 + ' and a ' + c2 + ', with a total of ' + cardtotal + '. Do you want to hit (:thumbsup:) or stand (:thumbsdown:)?').then(sentMessage => {
                message.react('👍');
                message.react('👎');
            });
            const filter = (reaction, user) => {
                return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '👍') {
                        message.reply('You decided to hit, you drew ' + c3 + ', which gave you ' + finaltotal + '');
                        if(finaltotal >= '22') {
                            message.channel.send('You busted!')
                        }
                    } else if (reaction.emoji.name === '👎') {
                        message.reply('You decided to stand');
                    }
                })
                .catch(collected => {
                    message.reply('You didn\'t do anything, so now the game\'s over.');
                });
                break;
*/
