# Editions Card Builder

_A fork of https://github.com/guardian/embeds/tree/master/embeds/card-builder_

A little tool to create images for the Editions app with a text overlay at a mobile and tablet ratio. 
Images originate from [Grid](https://github.com/guardian/grid).

👀 See it in action [here](https://editions-card-builder.gutools.co.uk/).

## Running locally
💻 Clone repo `git clone git@github.com:guardian/editions-card-builder.git`

🔌 Run `./script/setup`

🌍 Run `./script/start` and open https://editions-card-builder.local.dev-gutools.co.uk/ in your browser

## Deploying
CI and CD not currently setup, meaning it's a push button deploy 😢.

🚀 Run `./script/deploy`

This app runs on GitHub Pages - deploying will update the `gh-pages` branch with the contents from [`src`](src).
