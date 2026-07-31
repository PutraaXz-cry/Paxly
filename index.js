const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const config = require("./config");
const handler = require("./lib/handler");

(async () => {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        browser: [config.botName, "Chrome", "1.0.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered && config.pairing) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Nomor WhatsApp: ", async (number) => {
            try {
                const code = await sock.requestPairingCode(number.replace(/\D/g, ""));

                console.clear();
                console.log("╭─ Pairing Code");
                console.log(`│ ${code}`);
                console.log("╰────────────");

                rl.close();
            } catch (err) {
                console.error(err);
            }
        });
    }

    handler(sock);
})();