const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const readline = require("readline");
const config = require("./config");
const handler = require("./lib/handler");

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        browser: [config.botName, "Chrome", "1.0.0"],
        printQRInTerminal: false
    });

    sock.ev.on("creds.update", saveCreds);

    let asked = false;

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        if (connection === "open") {
            console.clear();
            console.log("✓ Bot Connected");
        }

        if (
            connection === "connecting" &&
            !sock.authState.creds.registered &&
            config.pairing &&
            !asked
        ) {
            asked = true;

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question("Nomor WhatsApp: ", async (number) => {
                try {
                    const code = await sock.requestPairingCode(
                        number.replace(/\D/g, "")
                    );

                    console.clear();
                    console.log("╭─ Pairing Code");
                    console.log(`│ ${code}`);
                    console.log("╰────────────");
                } catch (e) {
                    console.log("Gagal mendapatkan pairing code.");
                    console.log(e.message);
                } finally {
                    rl.close();
                }
            });
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;

            if (reason !== DisconnectReason.loggedOut) {
                start();
            } else {
                console.log("Session logout.");
            }
        }
    });

    handler(sock);
}

start();