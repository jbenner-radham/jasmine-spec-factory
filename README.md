Jasmine Spec Factory
====================
[![npm Version][NPM VERSION BADGE]][NPM PAGE]
[![GitHub License][LICENSE BADGE]][LICENSE PAGE]
[![Build Status][BUILD BADGE]][BUILD PAGE]

An opinionated Jasmine spec generator for AMD modules.

Installation
------------
```sh
$ npm install --global jasmine-spec-factory
```

Usage
-----
```sh
$ jasmine-spec-factory ~/Documents/path/to/an/amd/module.js
```

Testing
-------
```sh
$ npm test
```

Issues
------
- Module name generation requires it to be documented via [JSDoc's](http://usejsdoc.org/) [`@exports`](http://usejsdoc.org/tags-exports.html) tag.
- Does not work on all modules yet.

License
-------
The MIT License (Expat). See the [license file](LICENSE) for details.

[BUILD BADGE]: https://img.shields.io/travis/jbenner-radham/jasmine-spec-factory.svg?style=flat-square
[BUILD PAGE]: https://travis-ci.org/jbenner-radham/jasmine-spec-factory
[LICENSE BADGE]: https://img.shields.io/badge/license-MIT%20License-blue.svg?style=flat-square
[LICENSE PAGE]: https://github.com/jbenner-radham/jasmine-spec-factory/blob/master/LICENSE
[NPM PAGE]: https://www.npmjs.com/package/jasmine-spec-factory
[NPM VERSION BADGE]: https://img.shields.io/npm/v/jasmine-spec-factory.svg?style=flat-square
