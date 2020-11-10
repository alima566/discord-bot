module.exports = async (client, id, msg, reactions = []) => {
  const channel = await client.channels.fetch(id);

  channel.messages.fetch().then((messages) => {
    if (messages.size === 0) {
      channel.send(msg).then((message) => {
        addReactions(message, reactions);
      });
    } else {
      for (const msg of messages) {
        msg[1].edit(msg);
        addReactions(msg[1], reactions);
      }
    }
  });
};

const addReactions = (message, reactions) => {
  message.react(reactions[0]);
  reactions.shift();
  if (reactions.length > 0) {
    setTimeout(() => addReactions(message, reactions), 750);
  }
};
