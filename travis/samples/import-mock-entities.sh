#!/usr/bin/env bash

# ----------------------------------------------------------------------
# import-mock-entities
#
# This script's purpose is to help you generate mocks for a travis test case
# ----------------------------------------------------------------------

VERSION=0.0.0
NAME='import-mock-entities'
USAGE='Usage: import-mock-entities [-i <test-case-id>] [-d <test-case-name>] <jhipster-application>'

# --- arguments --------------------------------------------------------
testCaseId=-1 # the unique identifying number associated with the test case # todo get testCaseId when not provided
testCaseName='' # the test case description used for the directory name containing the mock entities # todo get testCase name when not provided
jhipsterApplication='' # the path to the application containing the mocks
# --- Options processing -----------------------------------------------

while getopts "i:n:h" optname
do
	case "$optname" in
		"h")
			echo "import-mock-entities, a script to help you generate mocks for a travis test case
			Version: $VERSION
			Usage: $USAGE
			# param : <jhipster-application> the path to a jhipster application where you generated the entities you want to add as mocks
			# -h           Print this help message
			# -n <test-case-number>         Set the number to associate with the test case (prefix for directory, suffix for entities)
                                            If not given, counts the directories inside the directory 'entities' relative to this script and add one.
			# -d <test-case-description>    The string that must be used for the directory name containing the mock entities.
			                                If not given, use the basename of the last parameter which is the JHipster application which contains the entities you want to add.
			"
			exit 0;
			;;
		"i")
			testCaseNumber=$OPTARG
			;;
		"n")
			testCaseDescription=$OPTARG
			;;
		":")
			echo "No argument value for option $OPTARG" >&2
			echo "$USAGE"
			exit 1;
			;;
		"?")
			echo "Unknown option $OPTARG"
			echo "$USAGE"
			exit 1;
			;;
		*)
			echo "Unknown error while processing the options" >&2
			echo "$USAGE"
			exit 1;
			;;
	esac
done

shift $(($OPTIND - 1))

# One argument, anything else is an error.
if [ "$#" -eq 1 ]; then
	jhipsterApplication=$1
else
	echo "You must provide one and only one parameter (not counting options) : $USAGE" >&2;
	exit 1;
fi
