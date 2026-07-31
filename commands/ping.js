module.exports = async (sock, msg) => {
  const start = Date.now();
  
  await sock.sendMessage(msg.key.remoteJid, {
    text: "Sinyal Lu"
  });
  
  const end = Date.now();
  
  await sock.sendMessage(msg.key.remoteJid, {
    text: `Speed: ${end - start} ms`
  });
};