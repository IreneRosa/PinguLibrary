# Pingu Library Client

Frontend vanilla per il contratto `pinguLibrary/openAPI.yaml`, senza framework UI.
Il client attuale funziona in modalità demo locale e non richiede il backend.

## Struttura

- `index.html`: shell dell'applicazione e viste Catalogo/Prestiti.
- `css/style.css`: stile responsive e componenti condivisi.
- `ts/types.ts`: modelli del contratto API.
- `ts/api.ts`: client HTTP centralizzato, disponibile se in futuro si riattiva l'integrazione API.
- `ts/app.ts`: stato, rendering e interazioni.
- `js/`: output generato dal compilatore TypeScript.

## Avvio

1. Dalla cartella `pinguLibraryClient` esegui `npm install`.
2. Esegui `npm run build`.
3. Avvia l'anteprima con `npx serve .` e apri l'URL indicato.

Il catalogo demo viene caricato direttamente dal browser. Libri e prestiti aggiunti restano in memoria finché la pagina è aperta.