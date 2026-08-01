# Bug Fixes

## lib/handler.js
- Event was destructured as `{ message }`, should be `{ messages }`. This caused a crash before any command could run.
- `command` was never declared, and the file path used `commands` (typo) instead of `command`.

## index.js
- Pairing code check used `sock.authState.creds.registered`, which doesn't exist on the socket object. Changed to `state.creds.registered`, using the `state` from `useMultiFileAuthState`.

## commands/owner.js
- `sock.sendMessafe` typo, fixed to `sock.sendMessage`.
- VCard fields had typos: `VEGIN` to `BEGIN`, `VERDION` to `VERSION`, `VOUCE` to `VOICE`.
