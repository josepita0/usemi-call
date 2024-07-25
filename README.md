This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## About USEMI 🌐

Usemi app was developed for the university santa maria, for the presentation of the special work of degree, in order to provide both students and teachers the ability to have their own application.

It has a date management, attendance pass to the video calls generating a pdf file with the data of each student, and together with an integration to be able to send Whatsapp messages.

This project obtained the maximum grade, together with the publication of this degree work. 

## Technologies 💻

In this app, were used:

Nextjs as framework

Prisma as orm

Shadcn as component library

Clerk as authentication service

LiveKit as video call service

UploadThing as storage

Were use a database cloud on supabase and the whole project was deployed in Vercel

## Getting Started 🏃🏻‍♂️‍➡️

First, install packages:

```bash
pnpm install
```
second, create a .env file and set the next variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

DATABASE_URL=''

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

and finally, run the local server with:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


