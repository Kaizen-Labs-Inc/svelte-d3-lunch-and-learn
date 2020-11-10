# Svelte + D3.js

Starter [Svelte](https://svelte.dev) app with [D3.js](https://d3js.org/).

## Installation

From either `/start` or `/end`:

Install the dependencies...

```bash
npm install
```

...and start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

The app will run with hot reloading on [localhost:5000](http://localhost:5000).

## Building and running in production

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).