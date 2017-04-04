# Tests for jhipster-db-helper

## Command line debugging

```shell
# Debug the generator:

$ DEBUG=yeoman:generator     #osx/linux
$ set DEBUG=yeoman:generator #windows

#find path of the yo binary
$ where yo                                        #windows cmd.exe
$ get-command yo                                  #windows powershell
$ node --debug `which yo` <generator> [arguments] #osx/linux
```

## Node.js assert functions

`assert.ok` : test if a value is truthy - equivalent to `assert.equal(!!x, true)`

`assert.fail` : test if a value is falsy, throws an `AssertionError`

`assert.equal` : test with `==`

`assert.notEqual` : test with `!=`

`assert.deepEqual` : test primitives with `==`, include enumerable properties, but not prototype

`assert.notDeepEqual` : negative `deepEqual`

`assert.strictEqual` : test with `===`

`assert.notStrictEqual` : test with `!==`

`assert.deepStrictEqual` : like deep equal, but test primitives with `===`, and test object prototype

`assert.notDeepStrictEqual` : negative `deepStrictEqual`

`assert.throws` : test that a function throws an error

`assert.doestNotThrow` : test that a function does not throw an error

`assert.ifError` : throws its parameter if the parameter is truthy

## Unit test with Yeoman

Test a generator : mock a run context, with directory, prompt, arguments, etc.

The object returned act like a promise, so return it to wait until the process is done.

```js
beforeEach(function () {
	return helpers.run(path.join(__dirname, '../app'))
		// Mock options passed in
		.withOptions({ foo: 'bar' })
		// Mock the arguments   
		.withArguments(['name-x'])
		// Mock the prompt answers   
		.withPrompts({ coffee: false }); 
});
```

Test a scenario (run the generator with existing contents in the target directory).

```js
var path = require('path');
var fs = require('fs-extra');

helpers.run(path.join(__dirname, '../app'))
	.inTmpDir(function (dir) {
		// `dir` is the path to the new temporary directory
		fs.copySync(path.join(__dirname, '../templates/common'), dir)
	})
	.withPrompts({ coffee: false })
	.then(function () {
		assert.file('common/file.txt');
	})
;
```

Test a scenario with asynchronous tasks in callback

```js
var path = require('path');
var fs = require('fs-extra');

helpers.run(path.join(__dirname, '../app'))
	.inTmpDir(function (dir) {
		var done = this.async(); // `this` is the RunContext object.
		fs.copy(path.join(__dirname, '../templates/common'), dir, done);
	})
	.withPrompts({ coffee: false })
;
```

Note : `helpers.run` return a promise. It resolves with the directory that the generator was run in. This can be useful if you want to use a temporary directory that the generator was run in.

```js
helpers.run(path.join(__dirname, '../app'))
	.inTmpDir(function (dir) {
		var done = this.async(); // `this` is the RunContext object.
		fs.copy(path.join(__dirname, '../templates/common'), dir, done);
	})
	.withPrompts({ coffee: false })
	.then(function (dir) {
		// assert something about the stuff in `dir`
	})
;
```

Test a generator that runs with other dependent generators (using `composeWith`).

`withGenerators()` pass an array of arrays that use `createDummyGenerator()` as the first item and a namespace for the mocked generator as a second item.

```js
var deps = [
	[helpers.createDummyGenerator(), 'karma:app']
];
return helpers.run(path.join(__dirname, '../app')).withGenerators(deps);
```

Avoid promises with testing : use `ready`, `error` and `end` events emitted by promises.

```js
helpers.run(path.join(__dirname, '../app'))
	.on('error', function (error) {
		console.log('Oh Noes!', error);
	})
	.on('ready', function (generator) {
		// This is called right before `generator.run()` is called
	})
	.on('end', done)
;
```


## yeoman-assert module

```js
var assert = require('yeoman-assert');

//return true if file exists
assert.file('path/to/file');
assert.file(['file1', 'file2', 'file3']);

//return true if file doesn't exist
assert.noFile('path');

//return true if file has content or regex
assert.fileContent('file', 'content');
assert.fileContent('file', /regex/);

//works with array of files too
assert.fileContent(['file1', 'content'], ['file2', 'content']);

//return true if file doesn't match content or regex
assert.noFileContent('file', 'content');

//assert that 2 strings are equal after standardization of newlines (??)
assert.textEqual('some string', 'expected string');
assert.textEqual(value, expectedValue);

//assert an object implements an interface 
assert.implement(subject, method);
assert.implement(fs, ['readFile']);

//assert an object doesn't implement an interface
assert.notImplement(fs, ['foo']);

//assert an object contains at least a set of keys
var obj = {a: 1};
assert.objectContent(obj, {a: 2});

//assert an object doesn't contains a set of keys
var obj = {a: 1};
assert.noObjectContent(obj, {a: 2});

//assert a JSON file contains at least a set of keys
assert.jsonFileContent('path/to/file.json', {a: 2});

//assert a JSON file does not contain at least a set of keys
assert.noJsonFileContent('path/to/file.json', {a: 1});
```
