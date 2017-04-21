# TODO LIST
Here is a list of things we will do but not just right now, so we're writing it down here.

## Misfeatures
This is about functionalities that don't do their job correctly
* entity generator and its hooks's outputs collide, both happen at the same time, rendering it unreadable
	* opened an issue : jhipster/generator-jhipster#5548

## Features reliability
This is about working functionalities which we need to make sure they're reliable for more complex cases

* Prompting
	* Depending on user configuration (database type, options, ...), we must offer different defaults, use others flags, use different validation, ...

## Unit tests

* Naming strategies - WIP
	* Test existence of files with wrong naming strategies
	* Test if their current naming strategies is the wrong one
	* Test if their naming strategies was correctly modified

## Integration tests

We must ensure that our module doesn't break JHipster generated application.
You can find all tests [here](integration.md).
**If you want to contribute to this project, this is the single most important task at the moment.**

