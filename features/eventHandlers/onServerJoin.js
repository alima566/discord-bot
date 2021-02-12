const Canvas = require("canvas");
const { pointsToGive, welcomeMessageCache } = require("@root/config.json");
const gambling = require("@utils/gambling");
const welcomeSchema = require("@schemas/welcome-schema");
const gamblingSchema = require("@schemas/gambling-schema");
const { sendMessageToBotLog } = require("@utils/functions");
const { MessageAttachment, MessageEmbed } = require("discord.js");

// Pass the entire Canvas object because you'll need to access its width, as well its context
const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (ctx.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return ctx.font;
};

const createCanvas = async (guild, member) => {
  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    `./img/banner.png`
    //"https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_Screen_Shot_2020-08-06_at_2.17.31_PM.png?v=1604426607480"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = "24px sans-serif";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 8;
  ctx.strokeText(
    `Welcome to the ${guild.name},`,
    canvas.width / 2.5,
    canvas.height / 3.5
  );
  ctx.fillStyle = "#FFFFAF";
  ctx.fillText(
    `Welcome to the ${guild.name},`,
    canvas.width / 2.5,
    canvas.height / 3.5
  );

  // Add an exclamation point here and below
  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 8;
  ctx.strokeText(
    `${member.displayName}!`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );
  ctx.fillStyle = "#FFFFAF";
  ctx.fillText(
    `${member.displayName}!`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  // Wait for Canvas to load the image
  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg" })
  );
  // Draw a shape onto the main canvas
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    `welcome-${member.displayName.toLowerCase()}.png`
  );

  return attachment;
};

const welcomeMessage = async (member) => {
  const { guild } = member;
  let data = welcomeMessageCache[guild.id];

  if (data) {
    console.log("FETCHING FROM CACHE");
    return data;
  }

  console.log("FETCHING FROM DATABASE");
  const result = await welcomeSchema.findOne({ _id: guild.id });
  if (result) {
    welcomeMessageCache[guild.id] = data = [
      result.channelID,
      result.welcomeMessage,
    ];
  }
  return data;
};

module.exports = async (client) => {
  client.on("guildMemberAdd", async (member) => {
    const { guild, user } = member;

    const result = await gamblingSchema.findOne({
      guildID: guild.id,
      userID: user.id,
    });

    // Check to see if user already exists in db, if not, give them 1000 points
    if (!result) {
      await gambling.addPoints(guild.id, user.id, pointsToGive);
    }

    const data = await welcomeMessage(member);
    const channelID = data[0];
    const text = data[1];

    const channel = guild.channels.cache.get(channelID);
    if (!channel) return;

    const attachment = await createCanvas(guild, member);

    channel.send(text.replace(/<@>/g, `<@${member.id}>`));
    channel.send(attachment);

    const msgEmbed = new MessageEmbed()
      .setColor("#FF69B4")
      .setAuthor(
        member.user.tag,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setDescription(`**${member.user} has joined the server**`)
      .setTimestamp()
      .setFooter(`ID: ${member.user.id}`);

    sendMessageToBotLog(client, guild, msgEmbed);
  });
};

module.exports.config = {
  displayName: "Guild Member Join",
  dbName: "GUILD_MEMBER_JOIN",
  loadDBFirst: true,
};
