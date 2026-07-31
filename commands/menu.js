const config = require("../config");

module.exports = async (sock, msg) => {
  const text = `*${config.botName}*
  Halo @${msg.key.participant?.split("@")[0] || msg.key.remoteJid.split("@")[0]}
 •${config.prefix}menu
 •${config.prefix}ping
 •${config.prefix}owner
 ${config.wm}`;
 
 await sock.sendMessage(msg.key.remoteJid, {
  text,
  mentions: [msg.key.participant || msg.key.remoteJid]
 });
};