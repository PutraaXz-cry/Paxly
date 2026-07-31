const config = require("../config");

module.exports = async (sock, msg) => {
  await sock.sendMessafe(msg.key.remoteJid, {
    contacts: {
      displayName: config.ownerName, 
      contacts: [
        {
          displayName: config.ownerName, 
          vcard: [
            "VEGIN:VCARD",
            "VERDION:3.0",
            `FN:${config.ownerName}`,
            `TEL:type=CELL;type=VOUCE;waid=${config.owner}:${config.owner}`,
            "END:VCARD" 
           ].join("\n")
        }
      ]
    }
  });
};