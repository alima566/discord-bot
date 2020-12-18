const gambling = require("@utils/gambling");
const { getRandomNumber } = require("@utils/functions");

const { MessageEmbed, ReactionCollector } = require("discord.js");
const numeral = require("numeral");

const suits = ["♥️", "♠️", "♦️", "♣️"];
const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "Q", "J"];
let deck = [],
  playerCards = [],
  playerPoints = 0,
  playerCardString = "",
  dealerCards = [],
  dealerCardString = "",
  dealerPoints = 0,
  gameOver,
  playerWon,
  winLoseMsg = "",
  newPoints = 0;

module.exports = {
  commands: "blackjack",
  category: "Gambling",
  minArgs: 1,
  maxArgs: 1,
  globalCooldown: "15s",
  description: "Play blackjack with the bot.",
  requiredChannel: "gambling",
  callback: async (msg, args, text, client, prefix, instance) => {
    gameOver = false; //Reset game status back to false each time command is ran
    playerWon = false; //Reset playerWon status back to false each time command is ran

    const { guild, author, channel } = msg;
    const userID = author.id;
    const guildID = guild.id;
    const channelID = channel.id;
    const gamblingChannel = await gambling.getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        msg
          .reply(`Blackjack can only be played in <#${gamblingChannel}>!`)
          .then((m) => {
            m.delete({ timeout: 3000 });
          });
        msg.delete();
        return;
      }
    } else {
      return msg.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
    }

    let pointsToGamble = args[0];
    const actualPoints = await gambling.getPoints(guild.id, userID);

    if (actualPoints === 0) {
      return msg.channel.send(
        instance.messageHandler.get(msg.guild, "NO_POINTS")
      );
    }

    if (pointsToGamble.toLowerCase() === "all") {
      pointsToGamble = actualPoints;
    }

    if (isNaN(pointsToGamble)) {
      return msg.channel.send(
        instance.messageHandler.get(guild, "VALID_POINTS")
      );
    }

    if (pointsToGamble < 1) {
      return msg.channel.send(instance.messageHandler.get(guild, "ONE_POINT"));
    }

    if (pointsToGamble > actualPoints) {
      return msg.reply(
        `You don't have enough points! You only have ${numeral(
          actualPoints
        ).format(",")} point${actualPoints !== 1 ? "s" : ""}.`
      );
    }

    playGame(msg, pointsToGamble, guildID, userID, args[0]);
  },
};

const playGame = (msg, pointsToGamble, guildID, userID, args) => {
  deck = createDeck();
  shuffleDeck(deck);
  playerCards = [getNextCard(), getNextCard()];
  dealerCards = [getNextCard(), getNextCard()];
  showStatus();

  const msgEmbed = createEmbed(pointsToGamble);
  msg.channel.send(msgEmbed).then((m) => {
    m.react("👍").then(() => {
      m.react("👎");
    });

    const filter = (reaction, user) => {
      return (
        (reaction.emoji.name === "👍" || reaction.emoji.name === "👎") &&
        user.id === userID
      );
    };

    const collector = new ReactionCollector(m, filter);
    collector.on("collect", (reaction, user) => {
      if (reaction.emoji.name === "👍") {
        playerCards.push(getNextCard());
        checkForEndOfGame(guildID, userID, pointsToGamble);
        showStatus();
        m.edit(editEmbed(msgEmbed, pointsToGamble, args));
        m.reactions.resolve("👍").users.remove(user);
        if (gameOver) {
          collector.stop();
          m.reactions.removeAll();
        }
      } else {
        gameOver = true;
        checkForEndOfGame(guildID, userID, pointsToGamble);
        showStatus();
        m.edit(editEmbed(msgEmbed, pointsToGamble, args));
        collector.stop();
        m.reactions.removeAll();
      }
    });
  });
};

const createDeck = () => {
  let deck = [];
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      let weight = parseInt(values[i]);
      if (values[i] === "K" || values[i] === "Q" || values[i] === "J") {
        weight = 10;
      }
      if (values[i] === "A") {
        weight = 1;
      }
      let card = { value: values[i], suit: suits[j], weight: weight };
      deck.push(card);
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = 0; i < deck.length; i++) {
    let swapIndex = getRandomNumber(deck);
    let tmp = deck[swapIndex];

    deck[swapIndex] = deck[i];
    deck[i] = tmp;
  }
};

const getNextCard = () => {
  return deck.shift();
};

const getScore = (cardArray) => {
  let score = 0;

  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += card.weight;
  }
  return score;
};

const getCardString = (card) => {
  return `${card.value} ${card.suit}`;
};

const updateScores = () => {
  playerPoints = getScore(playerCards);
  dealerPoints = getScore(dealerCards);
};

const showStatus = () => {
  dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += `${getCardString(dealerCards[i])}\n`;
  }

  playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += `${getCardString(playerCards[i])}\n`;
  }

  updateScores();
};

const getWinMsg = (pointsGambled, args) => {
  return playerWon
    ? `You won ${
        args.toLowerCase() === "all" ? pointsGambled * 2 : pointsGambled
      } point${pointsGambled != 1 ? "s" : ""}!`
    : `The dealer won and you lost ${pointsGambled} point${
        pointsGambled != 1 ? "s" : ""
      }!`;
};

const checkForEndOfGame = (guildID, userID, pointsGambled) => {
  updateScores();
  if (gameOver) {
    while (
      dealerPoints < playerPoints &&
      playerPoints <= 21 &&
      dealerPoints <= 21
    ) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerPoints > 21) {
    playerWon = false;
    gameOver = true;
  } else if (dealerPoints > 21) {
    playerWon = true;
    gameOver = true;
  } else if (gameOver) {
    playerWon = playerPoints > dealerPoints ? true : false;
  }

  addRemovePoints(guildID, userID, parseInt(pointsGambled));
};

const addRemovePoints = async (guildID, userID, pointsToGamble) => {
  if (gameOver) {
    return (newPoints = await gambling.addPoints(
      guildID,
      userID,
      playerWon ? pointsToGamble : pointsToGamble * -1
    ));
  }
};

const createEmbed = (points) => {
  const msgEmbed = new MessageEmbed()
    .setTitle(`Playing Blackjack for ${points} Point${points != 1 ? "s" : ""}`)
    .addFields(
      {
        name: `**Your Hand**`,
        value: `${playerCardString}\nScore: ${playerPoints}`,
        inline: true,
      },
      {
        name: `**Dealer's Hand**`,
        value: `${dealerCardString}\nScore: ${dealerPoints}`,
        inline: true,
      }
    )
    .setFooter(`👍 to Hit, 👎 to Stand`);
  return msgEmbed;
};

const editEmbed = (oldEmbed, pointsGambled, args) => {
  const embed = new MessageEmbed()
    .setTitle(gameOver ? `Game Over` : `${oldEmbed.title}`)
    .setDescription(gameOver ? getWinMsg(pointsGambled, args) : "")
    .setFooter(oldEmbed.footer.text)
    .addFields(
      {
        name: `**Your Hand**`,
        value: `${playerCardString}\nScore: ${playerPoints}`,
        inline: true,
      },
      {
        name: `**Dealer's Hand**`,
        value: `${dealerCardString}\nScore: ${dealerPoints}`,
        inline: true,
      }
    );
  return embed;
};
