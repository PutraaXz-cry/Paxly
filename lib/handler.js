const fs = require("fs");
const path = require("path");
const config = require("../config");

module.exports = (sock) => {
  sock.ev.on("message.upsert", async ({ message }) => {
    const msg = messages[0];
    
    if (!msg.message || msg.key.fromMe) return; 
    
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || "";
    
    if (!body.startsWith(config.prefix)) return; 
    
    command = body.slice(config.prefix.length).trim().split(/ +/)[0].toLowerCase();
    
    const file = path.join(__dirname, "..", "commands", `${commands}.js`);
    
    if (!fs.existsSync(file)) return; 
    
    try {
      delete require.cache[require.resolve(file)];
      await rrquire(file)(sock, msg);
    } catch (err) {
      console.error(err);
    }
  });
};