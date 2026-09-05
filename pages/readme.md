# Why is this folder here?

This project uses the Next.js **App Router** (`/app` directory) combined with the **Feature-Sliced Design (FSD)** architecture.

In FSD, the `src/pages` directory is meant to store the UI composition of our pages. However, Next.js has a legacy routing system called the **Pages Router**. If Next.js detects a `src/pages` folder, it may mistakenly try to compile it using the old Pages Router, which causes build errors and conflicts with our App Router.

By creating this empty `pages` folder at the root of the project, we force Next.js to assign it as the legacy Pages Router directory (which we intentionally leave empty). This allows Next.js to safely ignore our FSD `src/pages` directory.

https://feature-sliced.design/docs/guides/tech/with-nextjs
