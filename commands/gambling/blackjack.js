const {
  getGamblingChannel,
  getPoints,
  addPoints,
} = require("@dbHelpers/gambling");
const { getRandomNumber } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

const suits = ["♥", "♠", "♦", "♣"];
const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "Q", "J"];
const hit = "👍";
const stand = "👎";

let deck = [],
  playerCards = [],
  playerPoints = 0,
  playerCardString = "",
  dealerCards = [],
  dealerCardString = "",
  dealerPoints = 0,
  gameOver,
  playerWon;

module.exports = {
  category: "🎰 Gambling",
  minArgs: 1,
  maxArgs: 1,
  globalCooldown: "1m",
  description: "Play blackjack with the bot.",
  expectedArgs: "<The amount you want to gamble>",
  callback: async ({ message, args, instance, client }) => {
    gameOver = false; //Reset game status back to false each time command is ran
    playerWon = false; //Reset playerWon status back to false each time command is ran

    const { guild, author, channel } = message;
    const userID = author.id;
    const guildID = guild.id;
    const channelID = channel.id;
    const gamblingChannel = await getGamblingChannel(guildID);

    if (gamblingChannel) {
      if (channelID !== gamblingChannel) {
        message
          .reply(`Blackjack can only be played in <#${gamblingChannel}>!`)
          .then((msg) => {
            client.setTimeout(() => msg.delete(), 1000 * 3);
          });
        message.delete();
        return;
      }
    } else {
      message
        .reply(
          `A gambling channel needs to be set first in order for this command to be used.`
        )
        .then((msg) => client.setTimeout(() => msg.delete(), 1000 * 3));
      message.delete();
      return;
    }

    let pointsToGamble = args[0].trim();
    const actualPoints = await getPoints(guild.id, userID);

    if (actualPoints === 0) {
      return message.reply(
        instance.messageHandler.get(message.guild, "NO_POINTS")
      );
    }

    if (pointsToGamble.toLowerCase() === "all") {
      pointsToGamble = actualPoints;
    }

    if (isNaN(pointsToGamble)) {
      return message.reply(instance.messageHandler.get(guild, "VALID_POINTS"));
    }

    if (pointsToGamble < 1) {
      return message.reply(instance.messageHandler.get(guild, "ONE_POINT"));
    }

    if (pointsToGamble > actualPoints) {
      return message.reply(
        `You don't have enough points! You only have ${actualPoints.toLocaleString()} point${
          actualPoints !== 1 ? "s" : ""
        }.`
      );
    }

    playGame(message, pointsToGamble, guildID, userID, args[0]);
  },
};

const playGame = (message, pointsToGamble, guildID, userID, args) => {
  deck = createDeck();
  shuffleDeck(deck);
  playerCards = [getNextCard(), getNextCard()];
  dealerCards = [getNextCard(), getNextCard()];
  showStatus();

  const msgEmbed = createEmbed(pointsToGamble);
  message.channel.send(msgEmbed).then((m) => {
    m.react(hit).then(() => {
      m.react(stand);
    });

    const filter = (reaction, user) => {
      return (
        (reaction.emoji.name === hit || reaction.emoji.name === stand) &&
        user.id === userID
      );
    };

    const collector = m.createReactionCollector(filter, {
      time: 1000 * 20,
      errors: ["time"],
    });
    collector.on("collect", (reaction, user) => {
      if (reaction.emoji.name === hit) {
        playerCards.push(getNextCard());
        checkForEndOfGame(guildID, userID, pointsToGamble);
        showStatus();
        m.edit(editEmbed(msgEmbed, pointsToGamble, args));
        m.reactions.resolve(hit).users.remove(user);
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

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        gameOver = true;
        m.reactions.removeAll();
        await addPoints(guildID, userID, pointsToGamble * -1);
        return m.channel.send(
          `<@${userID}>, you did not react in time and have forfeited ${pointsToGamble} point${
            pointsToGamble != 1 ? "s" : ""
          }.`
        );
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
  return `\`${card.value} ${card.suit}\``;
};

const updateScores = () => {
  playerPoints = getScore(playerCards);
  dealerPoints = getScore(dealerCards);
};

const showStatus = () => {
  dealerCardString = "";
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += `${getCardString(dealerCards[i])} `;
  }

  playerCardString = "";
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += `${getCardString(playerCards[i])} `;
  }

  updateScores();
};

const getWinMsg = (pointsGambled, args) => {
  return playerWon
    ? `You won ${parseInt(pointsGambled).toLocaleString()} point${
        pointsGambled != 1 ? "s" : ""
      }!`
    : `The dealer won and you lost ${
        args.toLowerCase() === "all"
          ? "all your"
          : parseInt(pointsGambled).toLocaleString()
      } point${pointsGambled != 1 ? "s" : ""}!`;
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
    return await addPoints(
      guildID,
      userID,
      playerWon ? pointsToGamble : pointsToGamble * -1
    );
  }
};

const createEmbed = (points) => {
  const msgEmbed = new MessageEmbed()
    .setTitle(
      `Playing Blackjack for ${parseInt(points).toLocaleString()} Point${
        points != 1 ? "s" : ""
      }`
    )
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
    .setFooter(`${hit} to Hit, ${stand} to Stand`);
  return msgEmbed;
};

const editEmbed = (oldEmbed, pointsGambled, args) => {
  const embed = new MessageEmbed()
    .setTitle(gameOver ? `Game Over` : `${oldEmbed.title}`)
    .setDescription(gameOver ? getWinMsg(pointsGambled, args) : "")
    .setFooter(gameOver ? "" : `${oldEmbed.footer.text}`)
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
