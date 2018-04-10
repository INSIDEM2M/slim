# slim-cli

[![Build Status](https://travis-ci.org/INSIDEM2M/slim.svg?branch=develop)](https://travis-ci.org/INSIDEM2M/slim)
[![npm version](https://badge.fury.io/js/slim-cli.svg)](https://badge.fury.io/js/slim-cli)

An opinionated workflow CLI for [Angular](https://angular.io/) projects that uses [Webpack](https://webpack.js.org/), [TypeScript](https://www.typescriptlang.org/)
and [Sass](http://sass-lang.com/).

## Installation

```bash
npm i -g slim-cli
```

## Usage

The CLI has several commands that take different options, like the Git CLI.
The commands have the following form `slim <command> [options]`.

### Examples
```bash
slim dev # Start the development build with hot reloading

slim -h # Show help
```

## Why don't we use the [Angular CLI](https://cli.angular.io/)?

The Angular CLI tries to adhere to many possible workflows that use different tools, like Sass vs.
Less vs. Stylus. This makes it sometimes hard to implement a feature that is not universally available.

Another reason is the limited extensibility of the CLI's blueprints, which is needed for a sufficiently
powerful template definition. This is for example needed to generate Redux Actions and Reducers.

## What does `slim` mean?

Our old workflow was based on [Slush](https://slushjs.github.io/) and the generator package was called `slush-im2m`. So all our commands had the form
`slush im2m:<command> [options]`. And because it is easier to write one word than to write two, this was reduced to `slim`.

## Continuous Integration (CI)

Slim can be used in CI systems. To run Unit-Tests and E2E-Tests on Debian on a Server, perform the following steps:

```bash
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" | tee -a /etc/apt/sources.list
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
apt-get update
apt-get install libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4
apt-get install google-chrome-stable
apt-get install xvfb gtk2-engines-pixbuf
apt-get install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
apt-get install imagemagick x11-apps
```

## License

MIT

## Docker

To publish the `slim-cli:latest` image to the IM2M registry use the following steps:

```
docker login nexus.inside-m2m.de:5001
docker-compose build
docker-compose push
```