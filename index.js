const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const Pino = require("pino");
const readline = require("readline");
const config = require("./config");
const handler = require("./lib/handler");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        logger: Pino({ level: "silent" }),
        browser: ["Ubuntu", "Chrome", "22.04.4"]
    });

    sock.ev.on("creds.update", saveCreds);

    let requested = false;

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
            console.log("Connected.");
        }

        if (connection === "connecting" && !sock.authState.creds.registered && !requested) {
            requested = true;

            rl.question("Nomor WhatsApp: ", async (number) => {
                try {
                    const code = await sock.requestPairingCode(number.replace(/\D/g, ""));
                    console.log(`\nPairing Code: ${code}\n`);
                    rl.close();
                } catch (err) {
                    console.log(err.message);
                }
            });
        }

        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error).output.statusCode;

            if (reason !== DisconnectReason.loggedOut) {
                process.exit(1);
            }
        }
    });

    handler(sock);
})();