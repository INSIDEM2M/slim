<a name="0.2.2"></a>
## [0.2.2](https://github.com/INSIDEM2M/slim/compare/0.2.1...0.2.2) (2017-01-26)



<a name="0.2.1"></a>
## ~~[0.2.1](https://github.com/INSIDEM2M/slim/compare/0.2.0...0.2.1) (2017-01-26)~~


### Bug Fixes

* **new:** show when no user config is found in debug ([5ab2fa0](https://github.com/INSIDEM2M/slim/commit/5ab2fa0))
* **slim-config:** correct typings of webpack.ignoreSourceMaps ([60e6bb6](https://github.com/INSIDEM2M/slim/commit/60e6bb6))
* **strip-sass-imports-loader:** only strip imports during test ([1860064](https://github.com/INSIDEM2M/slim/commit/1860064))
* **utils:** show message in default color ([09b0a33](https://github.com/INSIDEM2M/slim/commit/09b0a33))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/INSIDEM2M/slim/compare/0.1.4...0.2.0) (2017-01-26)


### Bug Fixes

* **aot:** several fixes needed for AOT compilation ([e9c0b84](https://github.com/INSIDEM2M/slim/commit/e9c0b84))
* **build:** delete targetDir before build ([adaed74](https://github.com/INSIDEM2M/slim/commit/adaed74))
* **cli-helpers:** add check if the cwd is a git repo ([918cf89](https://github.com/INSIDEM2M/slim/commit/918cf89))
* **common:** add missing extension to resolveLoader ([08c18d6](https://github.com/INSIDEM2M/slim/commit/08c18d6))
* **e2e:** several fixes to make e2e work again ([84b2279](https://github.com/INSIDEM2M/slim/commit/84b2279))
* **newCommand:** add file existing checks ([22ba22d](https://github.com/INSIDEM2M/slim/commit/22ba22d))
* **newCommand:** change underscore to lodash ([05d1940](https://github.com/INSIDEM2M/slim/commit/05d1940))
* **package:** update compodoc to version 0.0.34 ([91feee4](https://github.com/INSIDEM2M/slim/commit/91feee4))
* **package:** update compodoc to version 0.0.35 ([efde626](https://github.com/INSIDEM2M/slim/commit/efde626))
* **package:** update compodoc to version 0.0.37 ([#95](https://github.com/INSIDEM2M/slim/issues/95)) ([2138585](https://github.com/INSIDEM2M/slim/commit/2138585))
* **postcss:** put postcss config in postcss.config.js ([484b608](https://github.com/INSIDEM2M/slim/commit/484b608))
* **webpack:** exclude ionic from source map loader ([a9d195a](https://github.com/INSIDEM2M/slim/commit/a9d195a))
* **webpack:** exclude moment locales from build ([#82](https://github.com/INSIDEM2M/slim/issues/82)) ([6f90a7e](https://github.com/INSIDEM2M/slim/commit/6f90a7e))


### Features

* **new:** pull repo if exists ([465b5a9](https://github.com/INSIDEM2M/slim/commit/465b5a9))
* **newCommand:** add new command structure. ([e17a3f8](https://github.com/INSIDEM2M/slim/commit/e17a3f8))
* **newCommand:** create directories if missing. ([beefc01](https://github.com/INSIDEM2M/slim/commit/beefc01))
* **newCommand:** replace nodegit by simplegit ([57fae28](https://github.com/INSIDEM2M/slim/commit/57fae28))
* **newCommand:** use underscore template to replace placeholders in template. ([d19e963](https://github.com/INSIDEM2M/slim/commit/d19e963))
* **slim-config:** add option to ignore source maps of specific modules ([28926fb](https://github.com/INSIDEM2M/slim/commit/28926fb))
* **test:** ignore specific missing sass files ([b620290](https://github.com/INSIDEM2M/slim/commit/b620290))
* **webpack:** use plain filenames ([a78736c](https://github.com/INSIDEM2M/slim/commit/a78736c))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/INSIDEM2M/slim/compare/0.1.3...0.1.4) (2017-01-18)


### Bug Fixes

* **webpack:** fix several issues that arised when using a component project ([bb42ad5](https://github.com/INSIDEM2M/slim/commit/bb42ad5))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/INSIDEM2M/slim/compare/0.1.2...0.1.3) (2017-01-18)


### Bug Fixes

* **test:** do not try to copy index.html during the test ([5a05bdc](https://github.com/INSIDEM2M/slim/commit/5a05bdc))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/INSIDEM2M/slim/compare/0.1.1...0.1.2) (2017-01-18)


### Bug Fixes

* **build:** add .npmignore ([e74042d](https://github.com/INSIDEM2M/slim/commit/e74042d))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/INSIDEM2M/slim/compare/0.1.0...0.1.1) (2017-01-18)


### Bug Fixes

* **build:** transpile slim-cli before publish ([ae3c689](https://github.com/INSIDEM2M/slim/commit/ae3c689))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/INSIDEM2M/slim/compare/a14b05a...0.1.0) (2017-01-18)


### Bug Fixes

* **build:** do not run e2e tests for now ([61b7fcf](https://github.com/INSIDEM2M/slim/commit/61b7fcf))
* **build:** do not run tsc as a postinstall step ([c6b8dc3](https://github.com/INSIDEM2M/slim/commit/c6b8dc3))
* **build:** rebuild node-sass ([d5a996c](https://github.com/INSIDEM2M/slim/commit/d5a996c))
* **build:** update yarn lock file ([20282ff](https://github.com/INSIDEM2M/slim/commit/20282ff))
* **build:** update yarn lock file ([bbd2fc8](https://github.com/INSIDEM2M/slim/commit/bbd2fc8))
* **build:** use xvfb to run e2e test ([606f584](https://github.com/INSIDEM2M/slim/commit/606f584))
* **common:** module resolve should fallback to node_modules of slim (resolve [#74](https://github.com/INSIDEM2M/slim/issues/74)) ([5788350](https://github.com/INSIDEM2M/slim/commit/5788350))
* **config:** rename im2m.config to slim.config ([ab231bf](https://github.com/INSIDEM2M/slim/commit/ab231bf))
* **doc:** adapt to im2m.config -> slim.config refactoring ([7ff629e](https://github.com/INSIDEM2M/slim/commit/7ff629e))
* **e2e:** adapt to API changes in protractor[@5](https://github.com/5).0.0 ([a2774f6](https://github.com/INSIDEM2M/slim/commit/a2774f6))
* **e2e:** use correct path for protractor.config.js ([09f7e03](https://github.com/INSIDEM2M/slim/commit/09f7e03))
* **package:** update awesome-typescript-loader to version 3.0.0-beta.13 ([21c1580](https://github.com/INSIDEM2M/slim/commit/21c1580)), closes [#14](https://github.com/INSIDEM2M/slim/issues/14)
* **package:** update awesome-typescript-loader to version 3.0.0-beta.14 ([c87bcc1](https://github.com/INSIDEM2M/slim/commit/c87bcc1))
* **package:** update awesome-typescript-loader to version 3.0.0-beta.15 ([6bffcad](https://github.com/INSIDEM2M/slim/commit/6bffcad))
* **package:** update istanbul-instrumenter-loader to version 1.2.0 ([#49](https://github.com/INSIDEM2M/slim/issues/49)) ([5b17c07](https://github.com/INSIDEM2M/slim/commit/5b17c07))
* **package:** update jasmine-spec-reporter to version 3.0.0 ([f0dcae3](https://github.com/INSIDEM2M/slim/commit/f0dcae3))
* **package:** update node-sass to version 4.1.0 ([13a0682](https://github.com/INSIDEM2M/slim/commit/13a0682))
* **package:** update protractor to version 5.0.0 ([b6a3dcb](https://github.com/INSIDEM2M/slim/commit/b6a3dcb))
* **package:** update webpack-merge to version 2.0.0 ([#47](https://github.com/INSIDEM2M/slim/issues/47)) ([4a80d72](https://github.com/INSIDEM2M/slim/commit/4a80d72))
* **package.json:** add missing [@angularclass](https://github.com/angularclass)/hmr dependency ([567a54d](https://github.com/INSIDEM2M/slim/commit/567a54d))
* **package.json:** correct path to binary ([ac9d8f4](https://github.com/INSIDEM2M/slim/commit/ac9d8f4))
* **protractor.conf.js:** adapt to API changes in jasmine-spec-reporter[@3](https://github.com/3).0.0 ([0a2f0e2](https://github.com/INSIDEM2M/slim/commit/0a2f0e2))
* **slim.config:** add description and fix typings ([6f865d7](https://github.com/INSIDEM2M/slim/commit/6f865d7))
* **test:** fix coverage report ([fddd36b](https://github.com/INSIDEM2M/slim/commit/fddd36b))
* **test:** run e2e tests in sequence ([9fdcc42](https://github.com/INSIDEM2M/slim/commit/9fdcc42))
* **typings:** align cli typings ([990ac48](https://github.com/INSIDEM2M/slim/commit/990ac48))
* **webpack:** should resolve plugins installed in slim project ([f26a899](https://github.com/INSIDEM2M/slim/commit/f26a899))


### Features

* automatically update DLLs ([24c8655](https://github.com/INSIDEM2M/slim/commit/24c8655))
* initial commit ([a14b05a](https://github.com/INSIDEM2M/slim/commit/a14b05a))
* initial implementation of basic features ([e42cfbd](https://github.com/INSIDEM2M/slim/commit/e42cfbd))
* remove need for separate index.dev.html ([7ed2068](https://github.com/INSIDEM2M/slim/commit/7ed2068))
* **build:** add app example ([024e41d](https://github.com/INSIDEM2M/slim/commit/024e41d))
* **build:** add basic travis config ([e6be88a](https://github.com/INSIDEM2M/slim/commit/e6be88a))
* **build:** add example-app to CI e2e test ([3dfdc0d](https://github.com/INSIDEM2M/slim/commit/3dfdc0d))
* **build:** enable real e2e test on travis ([#26](https://github.com/INSIDEM2M/slim/issues/26)) ([6c0c25b](https://github.com/INSIDEM2M/slim/commit/6c0c25b))
* **build:** implement basic e2e test ([56cd0d7](https://github.com/INSIDEM2M/slim/commit/56cd0d7))
* **dev:** add hot module reloading ([bf375fc](https://github.com/INSIDEM2M/slim/commit/bf375fc))
* **doc:** add doc command ([4c82176](https://github.com/INSIDEM2M/slim/commit/4c82176))
* **e2e:** implement e2e command ([aa79e36](https://github.com/INSIDEM2M/slim/commit/aa79e36))
* **slim.config:** move config into own directory ([5b8b887](https://github.com/INSIDEM2M/slim/commit/5b8b887))
* **test:** add --xml-report flag ([cbe5226](https://github.com/INSIDEM2M/slim/commit/cbe5226))
* **test:** use karma-webpack ([3574160](https://github.com/INSIDEM2M/slim/commit/3574160))


