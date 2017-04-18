# TODO LIST
Here is a list of things we will do but not just right now, so we're writing it down here.

## Misfeatures
This is about functionalities that don't do their job correctly
* entity generator and its hooks's outputs collide, both happen at the same time, rendering it unreadable
	* opened a [generator-jhipster issue][https://github.com/jhipster/generator-jhipster/issues/5548]

## Features reliability
This is about working functionalities which we need to make sure they're reliable for more complex cases

* Prompting
	* Depending on user configuration (database type, options, ...), we must offer different defaults, use others flags, use different validation, ...

## Unit Tests

* Naming strategies - WIP
	* Test existence of files with wrong naming strategies
	* Test if their current naming strategies is the wrong one
	* Test if their naming strategies was correctly modified

## Possible bug

* EXTREMELY unwanted behavior of rest client, creating entries with the search button... Unable to reproduce happend as of commit 2965205 2017-04-11

