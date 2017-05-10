Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

require('ts-helpers');

require('zone.js/dist/zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

__karma__.loaded = function () {};

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

var testContext = require.context('SOURCE_DIR', true, /\.spec\.ts/);
var testedContext = require.context('SOURCE_DIR', true, /(component|service|directive|pipe|guard|api|effects|reducer)\.ts/);

function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
requireAll(testedContext);
requireAll(testContext);

__karma__.start();