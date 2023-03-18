# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Error 

If you are facing this error : 500 Cannot read properties of null (reading 'id').

Comment the component Chat like this : ```<!-- <Chat :receiver_id="null" /> --> ```

And then refresh tha web page or reload project. If you don't have the error anymore you can uncomment Chat like this : ```<Chat :receiver_id="null" />```

It should work now !

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
