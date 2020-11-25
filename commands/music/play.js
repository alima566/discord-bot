const ytdl = require("ytdl-core");
module.exports = {
  commands: "play",
  category: "Music",
  expectedArgs: "<YouTube URL>",
  minArgs: 1,
  maxArgs: 1,
  description: "Plays a song from the specified YouTube URL.",
  callback: async (msg, args) => {
    try {
      const queue = msg.client.queue;
      const serverQueue = msg.client.queue.get(msg.guild.id);

      const voiceChannel = msg.member.voice.channel;
      if (!voiceChannel) {
        return msg.channel.send(
          `You need to be in a voice channel in order to play music!`
        );
      }
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send(
          `I need the permissions to join and speak in your voice channel.`
        );
      }
      const songInfo = await ytdl.getInfo(args[0]);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };
      if (!serverQueue) {
        const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        queue.set(msg.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(msg, queueConstruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(msg.guild.id);
          return msg.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return msg.channel.send(
          `**${song.title}** has been added to the queue!`
        );
      }
    } catch (err) {
      console.log(err);
      msg.channel.send(err.message);
    }
  },
};

function play(msg, song) {
  const queue = msg.client.queue;
  const guild = msg.guild;
  const serverQueue = queue.get(msg.guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), { filter: "audioonly" })
    .on("finish", () => {
      serverQueue.songs.shift();
      play(msg, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}
