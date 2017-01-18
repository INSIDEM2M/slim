# slim-angular-cli

[![Build Status](https://travis-ci.org/INSIDEM2M/slim.svg?branch=develop)](https://travis-ci.org/INSIDEM2M/slim)

An opinionated workflow CLI for [Angular](https://angular.io/) projects that uses [Webpack](https://webpack.js.org/), [TypeScript](https://www.typescriptlang.org/)
and [Sass](http://sass-lang.com/).

> The project is currently under active development. Although the API is pretty stable, there will be
changes until version 1.0.0 is released.

## Installation

```bash
yarn global add slim-angular-cli
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

## Development

It is recommended to use [yarn](https://yarnpkg.com/) instead of `npm`, as it produces more
stable builds and is much faster.
Perform the following steps to use the version of `slim` that is currently in develop.

```bash
git clone https://github.com/INSIDEM2M/slim
cd slim
yarn link
```

## License

MIT