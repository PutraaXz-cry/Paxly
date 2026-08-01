const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = (sock) => {
  sock.ev.on("message.upsert", async ({ messages }) => {
    const msg = messages[0];
    
    if (!msg.message || msg.key.fromMe) return; 
    
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || "";
    
    if (!body.startsWith(config.prefix)) return; 
    
    const command = body.slice(config.prefix.length).trim().split(/ +/)[0].toLowerCase();
    
    const file = path.join(__dirname, "..", "commands", `${command}.js`);
    
    if (!fs.existsSync(file)) return; 
    
    try {
      delete require.cache[require.resolve(file)];
      await require(file)(sock, msg);
    } catch (err) {
      console.error(err);
    }
  });
};