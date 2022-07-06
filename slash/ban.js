//import { punishmentSchema } from '../models/tempban-schema'
punishmentSchema = require('../models/tempban-schema')

exports.run = async (client, interaction) => {


  if (IDs.role.void) {
    let userId = args.shift();
    const duration = args.shift();
    const reason = args.join(' ');

    if (message) {
      user = message.mentions.users?.first();
    } else {
      user = interaction.options.getuser('user');
    }

    if (!user) {
      userId = userId.replace(/[<@!>]/g, '');
      user = await client.users.fetch(userId);

      if (!user) {
        return `Could not find a user with the ID "${userId}"`;
      }
    }

    userId = user.id;

    let time;
    let type;
    try {
      const split = duration.match(/\d+|\D+/g);
      time = parseInt(split[0]);
      type = split[1]?.toLowerCase();
    } catch (e) {
      return "Invalid time format, Example format: \"10d\" where 'd' = days, 'h' = hours and 'm' = minutes.";
    }

    if (type === 'h') {
      time *= 60;
    } else if (type === 'd') {
      time *= 60 * 24;
    } else if (type !== 'm') {
      return 'Please use "m", "h" or "d" for minutes, hours, days respectively.';
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + time);

    const resault = await punishmentSchema.findOne({
      guildId: guild.id,
      userId,
      type: 'ban',
    });
    if (resault) {
      return `<@${userId}> is already banned on this server.`;
    }
    try {
      await guild.members.ban(userId, { days: 1, reason });

      await new punishmentSchema({
        userId,
        guildId: guild.id,
        staffId: staff.id,
        reason,
        expires,
        type: 'ban',
      }).save();
    } catch (err) {
      return 'error';
    }

    return `<@${userId}> has been banned for "${duration}"`;
  }
};

exports.commandData = {
  name: 'ban',
  description: 'Bans a user.',
  options: [user, duration, reason],
  usage: `${client.config.prefix}ban [user] [duration] [reason]`,
  defaultPermission: true,
};

exports.conf = {
  permLevel: 'Bot Admin',
  guildOnly: false,
};



