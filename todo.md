# TODO LIST
Here is a list of things we will do but not just right now, so we're writing it down here.

## Misfeatures
This is about functionalities that don't do their job correctly
* entity generator and its hooks's outputs collide, both happen at the same time, rendering it unreadable
* fix-entity generator doesn't use user input for fields - NEXT

## Features reliability
This is about working functionalities which we need to make sure they're reliable for more complex cases

* Naming Strategies
	* We should print current strategy for each file
	* We should try to modify a file only if it hasn't the correct strategy
	* We should print a message about if we modify the file or not
* Prompting
	* Depending on user configuration (database type, options, ...), we must offer different defaults, use others flags, use different validation, ...
	* We should print what is the current value for each file while asking for a (new) value

## Unit Tests

* Naming strategies - WIP
	* Test existence of files with wrong naming strategies
	* Test if their current naming strategies is the wrong one
	* Test if their naming strategies was correctly modified
* Updating files
	* Test existence
	* Test current value
	* Test updated value
