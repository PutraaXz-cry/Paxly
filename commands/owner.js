const config = require("../config");

module.exports = async (sock, msg) => {
  await sock.sendMessage(msg.key.remoteJid, {
    contacts: {
      displayName: config.ownerName, 
      contacts: [
        {
          displayName: config.ownerName, 
          vcard: [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${config.ownerName}`,
            `TEL:type=CELL;type=VOICE;waid=${config.owner}:${config.owner}`,
            "END:VCARD" 
           ].join("\n")
        }
      ]
    }
  });
};