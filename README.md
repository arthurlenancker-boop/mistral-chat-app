# mistral-chat-app

App web minimale : interface de chat qui appelle l'API Mistral via le SDK TypeScript officiel (`@mistralai/mistralai`), avec le modèle `mistral-small-latest`. La clé `MISTRAL_API_KEY` reste côté serveur (jamais exposée au navigateur).

## Prérequis

- Node.js >= 20
- Une clé API Mistral (console.mistral.ai)

## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
# puis éditer .env et renseigner MISTRAL_API_KEY=...
```

## Lancer en local

Mode développement (rechargement à chaud) :

```bash
npm run dev
```

Mode production :

```bash
npm run build
npm start
```

Puis ouvrir http://localhost:3000

## Architecture

- `src/server.ts` : serveur Express + endpoint `POST /api/chat` qui appelle `client.chat.complete({ model: "mistral-small-latest", ... })`. La clé API n'est lue que dans `process.env` côté serveur.
- `public/index.html` : interface de chat statique (HTML/JS vanilla) qui envoie l'historique à `/api/chat`.
